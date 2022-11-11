const mongoose = require("mongoose");

const connectdb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("connect to ", conn.connection.name);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectdb