const { User, Ticket, Event, sequelize } = require("../models");
const { Op } = require("sequelize");

/**
 * General Dashboard Statistics (Widgets)
 * @route GET /api/reports/stats
 */
exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Total Users
    const totalUsers = await User.count({ where: { role: "user" } });

    // 2. Total Events (All time)
    const totalEvents = await Event.count();

    // 3. Active Events (Count events happening in the future)
    const activeEvents = await Event.count({
      where: {
        date: {
          [Op.gte]: new Date(), // "Greater than or equal to" NOW
        },
      },
    });

    // 4. Revenue
    const revenueResult = await Ticket.sum("totalPrice");
    const totalRevenue = revenueResult || 0;

    // 5. Tickets Sold
    const ticketsResult = await Ticket.sum("quantity");
    const totalTicketsSold = ticketsResult || 0;

    // 6. Recent Sales
    const recentSales = await Ticket.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
      include: [
        { model: User, attributes: ["firstName", "lastName"] },
        { model: Event, attributes: ["title"] },
      ],
    });

    res.json({
      totalUsers,
      totalEvents, // Total historical events
      activeEvents, // Currently active/future events
      totalRevenue,
      totalTickets: totalTicketsSold,
      recentSales,
    });
  } catch (error) {
    console.error("Error in getDashboardStats:", error);
    res.status(500).json({ message: "Error loading dashboard stats" });
  }
};

/**
 * Sales Report with Pagination
 * @route GET /api/reports/sales?page=1&limit=10&startDate=...&endDate=...
 */
exports.getSalesReport = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Optional Date Filters
    const { startDate, endDate } = req.query;
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const { count, rows } = await Ticket.findAndCountAll({
      where: dateFilter,
      include: [
        { model: User, attributes: ["firstName", "lastName", "email"] },
        { model: Event, attributes: ["title"] },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    res.json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      sales: rows,
    });
  } catch (error) {
    console.error("Error in getSalesReport:", error);
    res.status(500).json({ message: "Error generating sales report" });
  }
};

/**
 * Attendees List with Pagination
 * @route GET /api/reports/attendees/:eventId?page=1&limit=10
 */
exports.getEventAttendees = async (req, res) => {
  try {
    const { eventId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Ticket.findAndCountAll({
      where: { eventId },
      include: [
        { model: User, attributes: ["firstName", "lastName", "email"] },
      ],
      order: [["createdAt", "DESC"]], // Most recent first
      limit,
      offset,
    });

    res.json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      attendees: rows,
    });
  } catch (error) {
    console.error("Error in getEventAttendees:", error);
    res.status(500).json({ message: "Error fetching attendees" });
  }
};
