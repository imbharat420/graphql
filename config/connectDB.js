import mongoose from "mongoose"

const connectDB = ()=>{
    mongoose.connect('mongodb+srv://tech:tech@cluster0.zgytvp0.mongodb.net/?retryWrites=true&w=majority');
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log('DB connected');
    });
}

export default connectDB