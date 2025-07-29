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
    const id = req.params.userId;

    // Step 1: Find the teacher
    const teacher = await Teacher.findById(id).lean();
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Step 2: Get the list of course codes assigned to the teacher
    const allowedCourseCodes = Object.keys(teacher.courses || {});

    // Step 3: Get all students
    const allStudents = await Student.find().lean();

    // Step 4: Filter student marks to only include matching courses
    const filteredStudents = allStudents.map((student) => {
      const filteredMarks = {};

      for (const code of allowedCourseCodes) {
        if (student.marks && student.marks[code] !== undefined) {
          filteredMarks[code] = student.marks[code];
        }
      }

      return {
        ...student,
        marks: filteredMarks,
      };
    });

    // ✅ Step 5: Keep only those students who have at least one relevant mark
    const finalStudents = filteredStudents.filter(
      (student) => Object.keys(student.marks).length > 0
    );

    res.json(finalStudents);

  } catch (err) {
    console.error("Error in getAllStudents:", err.message);
    res.status(500).json({ error: err.message });
  }
};


// Get Single Student by Id
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).lean();
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const studentMarks = student.marks || {};
    console.log("typeof student.marks =>", typeof student.marks);

    const courseCodes = Object.keys(studentMarks);
    console.log("type of courseCodes", typeof courseCodes)
    console.log("courseCodes", courseCodes)
    
    if (courseCodes.length === 0) {
      return res.json(student);
    }
    
    const courses = await Course.find({ code: { $in: courseCodes } }).lean(); // 👈 magic line
    console.log("courses", courses)

    const marksWithTitles = {};
    courses.forEach(course => {
      if (studentMarks[course.code] != null) {
        marksWithTitles[course.title] = studentMarks[course.code];
      }
    });

    res.json({
      ...student,
      marks: marksWithTitles,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Single Student by rollNo
const getStudentByRoll = async (req, res) => {
  try {
    const teacherId = req.params.userId;

    // Step 1: Get the teacher
    const teacher = await Teacher.findById(teacherId).lean();
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const allowedCourseCodes = Object.keys(teacher.courses || {});
    console.log("Teacher Courses:", teacher.courses);
    console.log("Allowed Course Codes:", allowedCourseCodes);

    // Step 2: Get the student by roll number
    const student = await Student.findOne({ rollNo: req.params.roll }).lean();
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    console.log("Student Data:", student);
    console.log("Student Marks:", student.marks);

    // Step 3: Filter only matching marks
    const filteredMarks = {};
    for (const code of allowedCourseCodes) {
      if (student.marks && student.marks[code] !== undefined) {
        filteredMarks[code] = student.marks[code];
      }
    }

    // Step 4: Send response in same format
    res.json({
      ...student,
      marks: filteredMarks
    });

  } catch (err) {
    console.error("Error in getStudentByRoll:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Update Student (Admin only)
const updateStudent = async (req, res) => {
  const { marks: incomingMarks } = req.body;

  try {
    const student = await Student.findById(req.params.id).lean(false); // Make sure we get full Mongoose document

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Use plain JS object, no internal Mongoose fields
    const existingMarks = student.marks ? JSON.parse(JSON.stringify(student.marks)) : {};

    // Update only the matched/incoming subjects
    for (const subject in incomingMarks) {
      existingMarks[subject] = incomingMarks[subject];
    }

    // Recalculate GPA & Grade
    const { gpa, grade } = calculateGpaAndGrade(existingMarks);

    // Assign updated values
    student.marks = existingMarks;
    student.gpa = gpa;
    student.grade = grade;

    await student.save();

    res.json(student);
  } catch (err) {
    console.error("Update error:", err);
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

const total = async (req, res) => {
  try {
    const students = await Student.find();
    const totalStudents = students.length;
    const totalTeachers = await Teacher.countDocuments();
    const classSet = new Set(students.map(s => s.class));
    res.json({
      students: totalStudents,
      teachers: totalTeachers,
      totalClasses: classSet.size,
      systemStatus: "Operational"
    })
  }
  catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

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
  addTeacher,
  total
};