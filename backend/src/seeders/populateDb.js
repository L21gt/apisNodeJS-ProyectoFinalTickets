require("dotenv").config();
const { faker } = require("@faker-js/faker");
const db = require("../models");

// CONFIGURACIÓN
const NUM_USERS = 100;
const NUM_EVENTS = 60;
const NUM_MESSAGES = 30;

async function populate() {
  try {
    console.log("🌱 Iniciando carga de datos GARANTIZADA...");

    // 1. Limpieza
    await db.sequelize.sync({ force: true });

    // 2. Admin
    const admin = await db.User.create({
      firstName: "Super",
      lastName: "Admin",
      email: process.env.ADMIN_EMAIL || "admin@events4u.com",
      password: process.env.ADMIN_PASSWORD || "admin123",
      role: "admin",
      status: "active",
    });

    // 3. Usuarios
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

    // 4. Categorías
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

    // 5. Crear Eventos
    const events = [];
    for (let i = 0; i < NUM_EVENTS; i++) {
      const isPast = i % 2 === 0;
      const date = isPast
        ? faker.date.past({ years: 1 })
        : faker.date.future({ years: 1 });

      let titlePrefix = "";
      if (i === 0) titlePrefix = "🔥 [SOLD OUT] ";
      if (i === 1) titlePrefix = "🔙 [HISTORIC] ";

      const event = await db.Event.create({
        title:
          titlePrefix +
          faker.commerce.productAdjective() +
          " " +
          faker.music.genre() +
          " Fest",
        description: faker.lorem.paragraph(),
        date: date,
        location: faker.location.city(),
        categoryId:
          categories[Math.floor(Math.random() * categories.length)].id,
        imageUrl: `https://picsum.photos/seed/${i + 500}/800/400`,
        ticketType: "General Entry",
        price: faker.commerce.price({ min: 20, max: 200 }),
        totalTickets: 300,
        availableTickets: 300,
      });
      events.push(event);
    }

    // 6. GENERAR ASISTENTES (Tickets)
    console.log("💎 Generando asistentes para TODOS los eventos...");

    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      let audienceSize = 0;
      let audience = [];

      // Si son los primeros 2 eventos, llenamos masivamente (80 personas)
      if (i === 0 || i === 1) {
        audienceSize = 80;
        audience = createdUsers.slice(0, 80);
      } else {
        // Para el resto, garantizamos entre 5 y 15 asistentes
        audienceSize = faker.number.int({ min: 5, max: 15 });
        // Seleccionamos usuarios al azar
        audience = faker.helpers.arrayElements(createdUsers, audienceSize);
      }

      for (const user of audience) {
        // Lógica de fecha (Compra antes del evento)
        let purchaseDate =
          event.date < new Date()
            ? faker.date.recent({ days: 60, refDate: event.date })
            : faker.date.recent({ days: 10 });

        await db.Ticket.create({
          userId: user.id,
          eventId: event.id,
          orderId: faker.string.uuid(),
          quantity: 1, // 1 boleto por persona para la lista
          totalPrice: event.price,
          status: "valid",
          createdAt: purchaseDate,
          updatedAt: purchaseDate,
        });
        event.availableTickets -= 1;
      }
      await event.save();
    }

    // 7. My Tickets para Admin
    for (const event of events) {
      if (Math.random() > 0.7) {
        await db.Ticket.create({
          userId: admin.id,
          eventId: event.id,
          orderId: faker.string.uuid(),
          quantity: 2,
          totalPrice: event.price * 2,
          status: "valid",
          createdAt: new Date(),
        });
      }
    }

    // 8. Mensajes
    const messagesData = Array.from({ length: NUM_MESSAGES }).map(() => ({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      subject: faker.lorem.sentence(),
      message: faker.lorem.paragraph(),
      status: Math.random() > 0.5 ? "read" : "new",
      createdAt: faker.date.recent({ days: 30 }),
    }));
    await db.Message.bulkCreate(messagesData);

    console.log(
      "🚀 ¡DB LISTA! Ahora CUALQUIER evento que elijas tendrá asistentes."
    );
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

populate();
