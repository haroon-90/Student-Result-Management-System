import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role : {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student'
  },
});
const user = mongoose.model('User', userSchema);

export default user;