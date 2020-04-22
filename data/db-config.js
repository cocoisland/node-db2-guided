const knew = require("knex");

const config = require("../knexfile.js");

const db = knew(config.development);

module.exports = db;