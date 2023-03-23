import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      match: [/^[a-zA-Z]{1,}(?: [a-zA-Z]+){0,2}$/, 'Enter a valid name.'],
    },
    username: {
      type: String,
      required: [true, "Username is required."],
      unique: [true, "Username is already taken."],
      lowercase: true,
      match: [/^[a-z0-9]+$/, 'Enter a valid username.'],
    },
    email: {
        type: String,
        required: [true, "Email is required."],
        unique: [true, "Email is already taken."],
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Enter a valid email.'],
    },
    avatar: {
      type: String,
      match: [/^https?:\/\//, 'Please enter a valid image url'],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minLength: 6,
    },
});



const User = mongoose.model('user', userSchema);

export default User;
