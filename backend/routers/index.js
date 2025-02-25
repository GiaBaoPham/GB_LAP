const category = require("./category.router");
const product = require("./products.router");
const user = require("./user.router");
const site = require("./site.router");
const order = require("./order.router");
const cart = require("./cart.router");
const checkAuth = require("./check-authentication.router");
const chat = require("./chat.router"); // Import route chatbot

const { checkAuthenticated } = require("../middleware/authentication");
require("dotenv/config");

const api = process.env.API_URL;

const route = (app) => {
    app.use(`${api}/category`, category);
    app.use(`${api}/product`, product);
    app.use(`${api}/user`, user);
    app.use(`${api}/order`, order);
    app.use(`${api}/cart`, checkAuthenticated, cart);
    app.use(`${api}/check-authenticated`, checkAuth);
    app.use("/", site);
};

module.exports = route;
