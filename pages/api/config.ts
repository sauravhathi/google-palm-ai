import mongoose from 'mongoose';

const connectDB = async () => {
    if (mongoose.connections[0].readyState) {
        console.log('Already connected.');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI || '');
        console.log('Connected to MongoDB.');
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }

}

export default connectDB;