
##Knex Cli
> To use migrations (and to make Knex setup easier), we need to use knex cli. 
>Install knex globally with npm install -g knex.
> This allows you to use Knex commands within any repo that has knex as a local dependency. 
> If you have any issues with this global install, you can use the npx knex command instead.

Initializing Knex
> To start, add the knex and sqlite3 libraries to your repository.

npm install knex sqlite3

We’ve seen how to use manually create a config object to get started with Knex, but the best practice is to use the following command:

Copy
knex init
Or, if Knex isn’t globally installed:

Copy
npx knex init
This command will generate a file in your root folder called knexfile.js. It will be auto populated with three config objects, based on different environments. We can delete all except for the development object.

Copy
module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3'
    }
  }

};
We’ll need to update the location (or desired location) of the database as well as add the useNullAsDefault option. The latter option prevents crashes when working with sqlite3.

Copy
module.exports = {

  development: {
    // our DBMS driver
    client: 'sqlite3',
    // the location of our db
    connection: {
      filename: './data/database_file.db3',
    },
    // necessary when using sqlite3
    useNullAsDefault: true
  }

};
Now, wherever we configure our database, we may use the following syntax instead of hardcoding in a config object.

Copy
const knex = require('knex');

const config = require('../knexfile.js');

// we must select the development object from our knexfile
const db = knex(config.development);

// export for use in codebase
module.exports = db;
Knex Migrations
Once our knexfile is set up, we can begin creating migrations. Though it’s not required, we are going to add an addition option to the config object to specify a directory for the migration files.

Copy
development: {
    client: 'sqlite3',
    connection: {
      filename: './data/produce.db3',
    },
    useNullAsDefault: true,
    // generates migration files in a data/migrations/ folder
    migrations: {
      directory: './data/migrations'
    }
  }
We can generate a new migration with the following command:

knex migrate:make [migration-name]

If we needed to create an accounts table, we might run:

knex migrate:make create-accounts

Note that inside data/migrations/ a new file has appeared. Migrations have a timestamp in their filenames automatically. Wither you like this or not, do not edit migration names.

The migration file should have both an up and a down function. Within the up function, we write the ended database changes. Within the down function, we write the code to undo the up functions. This allows us to undo any changes made to the schema if necessary.

Copy
exports.up = function(knex, Promise) {
  // don't forget the return statement
  return knex.schema.createTable('accounts', tbl => {
    // creates a primary key called id
    tbl.increments();
    // creates a text field called name which is both required and unique
    tbl.text('name', 128).unique().notNullable();
    // creates a numeric field called budget which is required
    tbl.decimal('budget').notNullable();
  });
};

exports.down = function(knex, Promise) {
  // drops the entire table
  return knex.schema.dropTableIfExists('accounts');
};
References for these methods are found in the schema builder section of the Knex docs.

At this point, the table is not yet created. To run this (and any other) migrations, use the command:

knex migrate:latest

Note if the database does not exist, this command will auto-generate one. We can use SQLite Studio to confirm that the accounts table has been created.

Changes and Rollbacks
If later down the road, we realize you need to update your schema, you shouldn’t edit the migration file. Instead, you will want to create a new migration with the command:

knex migrate:make accounts-schema-update

Once we’ve written our updates into this file we save and close with:

knex migrate:latest

If we migrate our database and then quickly realize something isn’t right, we can edit the migration file. However, first, we need to rolllback (or undo) our last migration with:

knex migrate:rollback

Finally, we are free to rerun that file with knex migrate latest.

NOTE: A rollback should not be used to edit an old migration file once that file has accepted into a master branch. However, an entire team may use a rollback to return to a previous version of a database.


Use Knex migrations to create a products table with the following columns:

id: make this the primary key.
name: should be a string that is unique.
price: should be a number.
Learn to create and use knex seeds
In this module we’ll learn how to create and run knex seeds.

Overview
Often we want to pre-populate our database with sample data for testing. Seeds allow us to add and reset sample data easily.

Follow Along
The Knex command-line tool offers a way to seed our database; in other words, pre-populate our tables.

Similarly to migrations, we want to customize where our seed files are generated using our knexfile

Copy
development: {
    client: 'sqlite3',
    connection: {
      filename: './data/produce.db3',
    },
    useNullAsDefault: true,
    // generates migration files in a data/migrations/ folder
    migrations: {
      directory: './data/migrations'
    },
    seeds: {
      directory: './data/seeds'
    }
  }
To create a seed run: knex seed:make 001-seedName

Numbering is a good idea because Knex doesn’t attach a timestamp to the name like migrate does. Adding numbers to the file name, we can control the order in which they run.

We want to create seeds for our accounts table:

knex seed:make 001-accounts

A file will appear in the designated seed folder.

Copy
exports.seed = function(knex, Promise) {
  // we want to remove all data before seeding
  // truncate will reset the primary key each time
  return knex('accounts').truncate()
    .then(function () {
      // add data into insert
      return knex('accounts').insert([
        { name: 'Stephenson', budget: 10000 },
        { name: 'Gordon & Gale', budget: 40400 },
      ]);
    });
};
Run the seed files by typing:

knex seed:run

You can now use SQLite Studio to confirm that the accounts table has two entries.
