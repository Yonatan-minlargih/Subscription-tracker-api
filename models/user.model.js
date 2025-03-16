import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'User Name is required'],
        trim: true,
        minlength: 2,
        maxlength: 50,
    },
    email: {
        type: String,
        required: [true, 'User Email is required'],
        trim: true,
        unique: true,
        lowerCase: true,
        match: [/\S+@\S+\.\S+/, 'Please fill a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'User Password is required'],
        minlength: 8,
    }
},{ timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
