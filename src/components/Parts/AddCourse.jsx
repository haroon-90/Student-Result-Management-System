import axios from "axios";
import { useState } from "react";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const AddCourseForm = () => {
    const [courseCode, setCourseCode] = useState("");
    const [courseTitle, setCourseTitle] = useState("");
    const [Credits, setCredits] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault();

        const newCourse = {
            code: courseCode.toUpperCase(),
            title: courseTitle.trim(),
            credit: parseInt(Credits)
        };

        console.log("New Course Added:", newCourse);
        axios.post("http://localhost:3000/api/courses", newCourse)
            .then(response => {
                Toastify({
                    text: "Course added successfully!",
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    backgroundColor: "#4CAF50",
                    close: true,
                    stopOnFocus: true,
                }).showToast();
            })
            .catch(error => {
                console.error("There was an error adding the course:", error);
                Toastify({
                    text: "Error adding Course.",
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    backgroundColor: "#ff4d4f",
                    close: true,
                    stopOnFocus: true,
                }).showToast();
            });

        setCourseCode("");
        setCourseTitle("");
        setCredits("");
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-xl border border-gray-200 space-y-6">
            <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
                <span>➕</span> Add New Course
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
                    <input
                        type="text"
                        name="courseCode"
                        value={courseCode}
                        onChange={(e) => setCourseCode(e.target.value)}
                        placeholder="e.g., CS-101"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                    <input
                        type="text"
                        name="courseTitle"
                        value={courseTitle}
                        onChange={(e) => setCourseTitle(e.target.value)}
                        placeholder="e.g., Introduction to Programming"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Credit hours</label>
                    <input
                        type="number"
                        name="credits"
                        value={Credits}
                        onChange={(e) => setCredits(e.target.value)}
                        placeholder="e.g., 3"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                        Add Course
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddCourseForm;
