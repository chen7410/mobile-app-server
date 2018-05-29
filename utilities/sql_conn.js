const pgp = require('pg-promise')();
//We have to set ssl usage to true for Heroku to accept our connection
pgp.pg.defaults.ssl = true;

//Create connection to Heroku Database
const db = pgp('postgres://qxgapceaxlelou:0bd94f61398086795cfe617f26913574bf18d212b7e211dad437b9f58a1a5080@ec2-54-235-193-34.compute-1.amazonaws.com:5432/df1fe30k28aeco');
// const db = pgp(process.env.DATABASE_URL);

if(!db) {
   console.log("SHAME! Follow the intructions and set your DATABASE_URL correctly");
   process.exit(1);
}

module.exports = db;
