import mongoose from 'mongoose';

let connectedInstance: typeof mongoose | null = null;

const connectDB = async () => {
    if (connectedInstance) {
        return connectedInstance;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || '', {});
        console.log('MongoDB connected');
        connectedInstance = conn;
        return conn;
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;