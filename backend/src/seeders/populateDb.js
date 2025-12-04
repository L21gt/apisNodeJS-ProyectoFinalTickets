require("dotenv").config();
const { faker } = require("@faker-js/faker");
const db = require("../models");

const NUM_USERS = 100;
const NUM_EVENTS = 80; // 80 Eventos total
const NUM_MESSAGES = 30;

async function populate() {
  try {
    console.log("🌱 Iniciando carga masiva de datos...");
    await db.sequelize.sync({ force: true });

    // 1. Admin
    await db.User.create({
      firstName: "Super",
      lastName: "Admin",
      email: process.env.ADMIN_EMAIL || "admin@events4u.com",
      password: process.env.ADMIN_PASSWORD || "admin123",
      role: "admin",
      status: "active",
    });

    // 2. Usuarios
    const usersData = [];
    for (let i = 0; i < NUM_USERS; i++) {
      usersData.push({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: "password123",
        role: "user",
        status: "active",
      });
    }
    const createdUsers = await db.User.bulkCreate(usersData, {
      individualHooks: true,
    });

    // 3. Categorías
    const catNames = [
      "Concerts",
      "Theater",
      "Sports",
      "Tech",
      "Arts",
      "Food",
      "Festivals",
    ];
    const categories = [];
    for (const name of catNames) {
      categories.push(await db.Category.create({ name }));
    }

    // 4. Eventos (50% Pasados, 50% Futuros)
    console.log(`... Creando ${NUM_EVENTS} eventos equilibrados ...`);
    const events = [];
    for (let i = 0; i < NUM_EVENTS; i++) {
      const isPast = i % 2 === 0; // Pares pasados, impares futuros

      // Fechas: Pasados (hace 1 año a ayer), Futuros (mañana a 1 año)
      const date = isPast
        ? faker.date.past({ years: 1 })
        : faker.date.future({ years: 1 });

      const event = await db.Event.create({
        title:
          faker.commerce.productAdjective() +
          " " +
          faker.music.genre() +
          " Show",
        description: faker.lorem.paragraph(),
        date: date,
        location: faker.location.city(),
        categoryId:
          categories[Math.floor(Math.random() * categories.length)].id,
        imageUrl: `https://picsum.photos/seed/${i + 999}/800/400`,
        ticketType: "General Entry",
        price: faker.commerce.price({ min: 20, max: 150 }),
        totalTickets: 500,
        availableTickets: 500,
      });
      events.push(event);
    }

    // 5. Ventas (Tickets) - GARANTIZAR DATOS PARA EL ADMIN
    console.log("... Generando historial de tickets para el Admin ...");

    const adminUser = await db.User.findOne({
      where: { email: process.env.ADMIN_EMAIL || "admin@events4u.com" },
    });

    // Hacemos que el admin compre boletos de TODOS los eventos creados
    for (const event of events) {
      const qty = faker.number.int({ min: 1, max: 2 });

      // Definir fecha de compra
      // Si el evento ya pasó, la compra fue antes. Si es futuro, la compra fue reciente.
      let purchaseDate;
      if (event.date < new Date()) {
        purchaseDate = faker.date.recent({ days: 30, refDate: event.date });
      } else {
        purchaseDate = faker.date.recent({ days: 5 });
      }

      await db.Ticket.create({
        userId: adminUser.id,
        eventId: event.id,
        orderId: faker.string.uuid(),
        quantity: qty,
        totalPrice: event.price * qty,
        status: "valid",
        createdAt: purchaseDate,
        updatedAt: purchaseDate,
      });

      event.availableTickets -= qty;
      await event.save();
    }
    console.log(
      "✅ Tickets generados: El Admin ahora tiene boletos activos y pasados."
    );

    // 6. Mensajes
    const messagesData = Array.from({ length: 30 }).map(() => ({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      subject: faker.lorem.sentence(3),
      message: faker.lorem.sentence(10),
      status: Math.random() > 0.5 ? "read" : "new",
      createdAt: faker.date.recent({ days: 15 }),
    }));
    await db.Message.bulkCreate(messagesData);

    console.log("🚀 ¡DB POBLADA EXITOSAMENTE!");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
populate();
