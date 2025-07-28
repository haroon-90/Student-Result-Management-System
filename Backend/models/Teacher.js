import mongoose from 'mongoose';

const teacher = new mongoose.Schema({
  name: String,
  ID: {
    type : String,
    minlength : 6,
    maxlength : 6,
    required : true,
    unique : true
  },
  email: String,
  password: String,
  courses: {
    type: Map,
    of: Number
  },
});

const Teacher = mongoose.model("teacher", teacher)

export default Teacher;