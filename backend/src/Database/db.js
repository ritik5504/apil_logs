const mongoose = require("mongoose");
const { MONGO_URI } = require("../../example.env")
const connectdb = async () => {
    try { 

        if (!MONGO_URI) {
            throw new Error("MONGO_URI environment variable is not defined.");
        }
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected successfully.");
    } catch (error) {
        console.error("Problem in connection to database:", error);
        process.exit(1);
    }
};

module.exports = {
    connectdb
};