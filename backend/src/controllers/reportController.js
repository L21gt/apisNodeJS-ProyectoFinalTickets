const { User, Ticket, Event, sequelize } = require("../models");
const { Op } = require("sequelize");

/**
 * Get general dashboard statistics
 * @route GET /api/reports/stats
 */
exports.getDashboardStats = async (req, res) => {
  try {
    // Run 4 queries in parallel for performance
    const [totalUsers, totalEvents, ticketStats, recentSales] =
      await Promise.all([
        // 1. Count users (excluding admins if needed, here we count all 'user' role)
        User.count({ where: { role: "user" } }),

        // 2. Count active events (Date >= Now)
        Event.count({
          where: { date: { [Op.gte]: new Date() } },
        }),

        // 3. Sum total revenue and tickets sold
        Ticket.findAll({
          attributes: [
            [sequelize.fn("SUM", sequelize.col("totalPrice")), "totalRevenue"],
            [sequelize.fn("SUM", sequelize.col("quantity")), "totalTickets"],
          ],
        }),

        // 4. Get last 5 sales for the quick view table
        Ticket.findAll({
          limit: 5,
          order: [["createdAt", "DESC"]],
          include: [
            { model: User, attributes: ["firstName", "lastName"] },
            { model: Event, attributes: ["title"] },
          ],
        }),
      ]);

    // Process results (Sequelize might return strings for sums)
    const revenue = ticketStats[0].dataValues.totalRevenue || 0;
    const tickets = ticketStats[0].dataValues.totalTickets || 0;

    res.status(200).json({
      totalUsers,
      activeEvents: totalEvents,
      totalRevenue: parseFloat(revenue),
      totalTickets: parseInt(tickets),
      recentSales,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving dashboard stats" });
  }
};

/**
 * Get sales report by date range
 * @route GET /api/reports/sales
 */
exports.getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Start date and end date are required" });
    }

    // Validation: End date cannot be before start date
    if (new Date(endDate) < new Date(startDate)) {
      return res
        .status(400)
        .json({ message: "End date cannot be before start date" });
    }

    // Adjust times to cover the full day
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const sales = await Ticket.findAll({
      where: {
        createdAt: {
          [Op.between]: [start, end],
        },
        status: "valid", // Only valid sales
      },
      include: [
        { model: User, attributes: ["firstName", "lastName", "email"] },
        { model: Event, attributes: ["title"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(sales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating sales report" });
  }
};

/**
 * Get attendee list by event
 * @route GET /api/reports/attendees/:eventId
 */
exports.getEventAttendees = async (req, res) => {
  try {
    const { eventId } = req.params;

    const tickets = await Ticket.findAll({
      where: {
        eventId,
        status: "valid",
      },
      include: [
        {
          model: User,
          attributes: ["firstName", "lastName", "email"], // Only necessary data
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving attendees list" });
  }
};
