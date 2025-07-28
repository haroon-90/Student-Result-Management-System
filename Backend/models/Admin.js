import mongoose from 'mongoose';

const admin = new mongoose.Schema({
  name: String,
  ID: String,
  email: String,
  password: String,
  a_role: String
});

const Admin = mongoose.model("admin", admin)

export default Admin;