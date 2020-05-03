const routes = require("next-routes")();

//routes.add()
// : symbolizes wildcard
routes.add("/campaigns/:address", "/campaigns/show");

module.exports = routes;
