import mongoose from 'mongoose';

const student = new mongoose.Schema({
  name: String,
  rollNo: {
    type : String,
    minlength : 12,
    maxlength : 12,
    required : true,
    unique : true
  },
  class: String,
  password: String,
  email: String,
  marks: {
    type: Map,
    of: Number
  },
  gpa: Number,
  grade: String
});

const Student = mongoose.model("student", student)

export default Student;