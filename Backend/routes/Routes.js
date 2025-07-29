import express from 'express';
import {
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
} from '../controllers/studentController.js';
import { 
  addCourse,
  getAllCourses,
  CoursesStats
 } from '../controllers/coursesController.js';

const router = express.Router();

router.get('/', (req, res)=>{
  res.send("Hello API!")
})

// Login route
router.post('/login', loginUser);

// Student routes
router.get('/students/:userId', getAllStudents); // Admin only
router.post('/students', addStudent);    // Admin only
router.get('/student/:id', getStudentById); // Admin/Student
router.put('/student/:id/password', updatePassword)
router.get('/student/roll/:roll/:userId', getStudentByRoll); // Admin/Student/teacher
router.put('/student/:id', updateStudent); // Admin/teacher
router.delete('/student/:id', deleteStudent); // Admin only
router.post('/teacher', addTeacher)
router.get('/stats', total);

// Profile routes
router.get('/admin/:id', getAdminProfile)
router.get('/teacher/:id', getTeacherProfile)

router.post('/courses', addCourse)
router.get('/courses', getAllCourses)
router.get('/coursesStats/:id', CoursesStats)

export default router;