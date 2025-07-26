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
  getTeacherProfile
} from '../controllers/studentController.js';

const router = express.Router();

router.get('/', (req, res)=>{
  res.send("Hello API!")
})

// Login route
router.post('/login', loginUser);

// Student routes
router.get('/students', getAllStudents); // Admin only
router.post('/students', addStudent);    // Admin only
router.get('/student/:id', getStudentById); // Admin/Student
router.put('/student/:id/password', updatePassword)
router.get('/student/roll/:roll', getStudentByRoll); // Admin/Student/teacher
router.put('/student/:id', updateStudent); // Admin/teacher
router.delete('/student/:id', deleteStudent); // Admin only

router.get('/admin/:id', getAdminProfile)
router.get('/teacher/:id', getTeacherProfile)

export default router;