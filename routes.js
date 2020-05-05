const routes = require("next-routes")();

//routes.add()
// : symbolizes wildcard
routes
  .add("/campaigns/new", "/campaigns/new")
  .add("/campaigns/:address", "/campaigns/show")
  .add("/campaigns/:address/requests", "/campaigns/requests/listRequests")
  .add("/campaigns/:address/requests/new", "/campaigns/requests/newRequest");

module.exports = routes;
