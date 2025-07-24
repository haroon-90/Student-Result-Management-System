import Student from '../models/Student.js';
import User from '../models/User.js';
import calculateGpaAndGrade from '../utils/gpaCalculator.js';

// Login Controller
const loginUser = async (req, res) => {
  console.log("Request body:", req.body);
  const { rollNo, password } = req.body;
  try {
    const student = await Student.findOne({ rollNo: rollNo });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const user = await User.findOne({ password: password });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    res.status(200).json({ role: user.role, Id: student._id });
    console.log({ role: user.role, studentId: student._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add Student (Admin/Teacher)
const addStudent = async (req, res) => {
  const { name, rollNo, class: studentClass, marks } = req.body;
  const { gpa, grade } = calculateGpaAndGrade(marks);
  try {
    const newStudent = new Student({ name, rollNo, class: studentClass, marks, gpa, grade });
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Single Student by Id
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" })
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Single Student bu rollNo
const getStudentByRoll = async (req, res) => {
  try {
    const student = await Student.find({rollNo : req.params.roll});
    if (!student) {
      return res.status(404).json({ message: "Student not found" })
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Student (Admin only)
const updateStudent = async (req, res) => {
  const { marks } = req.body;
  const { gpa, grade } = calculateGpaAndGrade(marks);
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { marks, gpa, grade },
      { new: true }
    );
    res.json(updatedStudent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Student (Admin only)
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  loginUser,
  addStudent,
  getAllStudents,
  getStudentById,
  getStudentByRoll,
  updateStudent,
  deleteStudent
};