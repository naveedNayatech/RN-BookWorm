import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Database connected ${conn.connection.host}`);
    } catch (error) {
        console.log("Error connecting to database", error);
        process.exit(1); //exit with failure
    }
}

// import mongoose from "mongoose";

// export const connectDB = async () => {
//     try {
//         const conn = await mongoose.connect(process.env.MONGO_URI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//             useCreateIndex: true,
//         });
//         console.log(`MongoDB Connected: ${conn.connection.host}`);
//     } catch (error) {
//         console.error(`Error connecting to MongoDB: ${error.message}`);
//         process.exit(1);
//     }
// };
