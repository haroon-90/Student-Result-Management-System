import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Admin from '../models/Admin.js';
import Course from '../models/Courses.js';
import calculateGpaAndGrade from '../utils/gpaCalculator.js';

// Login Controller
const loginUser = async (req, res) => {
  console.log("Request body:", req.body);
  const { UserId, password } = req.body;
  try {
    let user;
    let role;
    if (UserId.length == 5) {
      console.log("ADMIN checking...")
      user = await Admin.findOne({ ID: UserId, password: password });
      role = 'admin';
    }
    if (UserId.length == 6) {
      console.log("TEACHER checking...")
      user = await Teacher.findOne({ ID: UserId, password: password });
      role = 'teacher';
    }
    if (UserId.length == 12) {
      console.log("STUDENT checking...")
      user = await Student.findOne({ rollNo: UserId, password: password });
      role = 'student';
    }
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    res.status(200).json({ role: role, Id: user._id });
    console.log({ role: role, Id: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { password, role } = req.body;
    let Model;

    if (role === "admin") Model = Admin;
    else if (role === "teacher") Model = Teacher;
    else if (role === "student") Model = Student;
    else return res.status(400).json({ message: "Invalid role" });

    const user = await Model.findByIdAndUpdate(
      req.params.id,
      { password },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "Password updated successfully" });
  }
  catch (error) {
    res.status(500).json({ message: "Error updating password", error });
  }
}

// Add Student (Admin/Teacher)
const addStudent = async (req, res) => {
  const { name, rollNo, class: studentClass, marks } = req.body;
  const { gpa, grade } = calculateGpaAndGrade(marks);
  try {
    const newStudent = new Student({ name, rollNo, password: rollNo, class: studentClass, marks, gpa, grade });
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
    const student = await Student.find({ rollNo: req.params.roll });
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

const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: "Not found" });
    res.status(200).json(admin);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error!" })
  }
}

const getTeacherProfile = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    const courseCodes = Array.from(teacher.courses.keys());

    const matchedCourses = await Course.find({ code: { $in: courseCodes } });

    res.status(200).json({
        name: teacher.name,
        ID: teacher.ID,
        email: teacher.email,
        courses: matchedCourses
    });

  } catch (err) {
    console.error("getTeacherProfile Error:", err);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};


const addTeacher = async (req, res) => {
  try {
    const { name, ID, email, password, courses } = req.body;
    const coursesMap = new Map(Object.entries(courses));
    const NewTeacher = new Teacher({
      name,
      ID,
      email,
      password,
      courses: coursesMap
    });
    await NewTeacher.save();
    res.status(201).json({ message: "Teacher added successfully", teacher: NewTeacher });
  } catch (err) {
    console.error("Teacher Add Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export {
  loginUser,
  addStudent,
  getAllStudents,
  getStudentById,
  getStudentByRoll,
  updateStudent,
  deleteStudent,
  getAdminProfile,
  updatePassword,
  getTeacherProfile,
  addTeacher
};