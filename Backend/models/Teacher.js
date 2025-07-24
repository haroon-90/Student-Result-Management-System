import mongoose from 'mongoose';

const teacher = new mongoose.Schema({
  name: String,
  ID: String,
  email: String,
  password: String,
  courses: {
    type: Map,
    of: Number
  },
});

const Teacher = mongoose.model("teacher", teacher)

export default Teacher;