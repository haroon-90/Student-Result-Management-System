import Course from '../models/Courses.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';

const addCourse = async (req, res) => {
  try {
    const { code, title, credit } = req.body;
    const newCourse = new Course({ code, title, credit });
    await newCourse.save();
    res.status(201).json({ message: "Course added successfully", course: newCourse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses)
  } catch (error) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
}

const CoursesStats = async (req, res) => {
  try {
    const id = req.params.id;

    // Step 1: Find the teacher by ID
    const teacher = await Teacher.findById(id).lean();
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Step 2: Get only the course codes that the teacher has assigned
    const teacherCourseCodes = Object.keys(teacher.courses || {});
    if (teacherCourseCodes.length === 0) {
      return res.status(200).json([]);
    }

    // Step 3: Find only those courses whose codes match teacher's courses
    const filteredCourses = await Course.find({ code: { $in: teacherCourseCodes } }).lean();

    const stats = [];

    // Step 4: Loop through each course and find enrolled students
    for (const course of filteredCourses) {
      const students = await Student.find({ [`marks.${course.code}`]: { $exists: true } }).lean();

      if (students.length === 0) continue;

      stats.push({
        code: course.code,
        enrolled: students.length,
        status: "Active"
      });
    }

    console.log("CourseStats running and stats are:", stats);
    res.status(200).json(stats);

  } catch (err) {
    console.error("Error in CoursesStats:", err);
    if (!res.headersSent) {
      res.status(500).json({ message: "Server Error" });
    }
  }
};


export {
  addCourse,
  getAllCourses,
  CoursesStats
};