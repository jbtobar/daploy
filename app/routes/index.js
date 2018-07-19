// routes/index.js
const contractRoutes = require('./contract_routes');

module.exports = function(app, db) {
    contractRoutes(app, db);
    // Other route groups could go here, in the future
};
