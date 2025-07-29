import mongoose from 'mongoose';

const courses = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    credit : {
        type : Number,
        required: true
    }
});

const Course = mongoose.model("courses", courses)

export default Course;