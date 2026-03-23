const mongoose = require('mongoose');
const MONGO_URI="mongodb+srv://sharmavanshikasharma9_db_user:Vanshika_9518@cluster0.eu572fs.mongodb.net/GigConnect"

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB; 