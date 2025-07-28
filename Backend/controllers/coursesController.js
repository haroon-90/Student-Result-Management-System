import Course from '../models/Courses.js';

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

export {
  addCourse,
};