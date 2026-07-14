
import mongoose from "mongoose";


const DBCon = async () => {
    try {
        // Establishes a secure connection handshake to your local or cloud MongoDB cluster
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MONGODB IS CONNECTED SUCCESSFULLY');
    } catch (error) {
        
        console.error('MongoDB Connection Error:', error.message);
        
        
        process.exit(1); 
    }
}

export default DBCon;

