import axios from "axios";
import { useState } from "react";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const AddTeacherForm = () => {
    const [courses, setCourses] = useState([{ courseCode: "", creditHours: "" }]);

    const handleCourseChange = (index, field, value) => {
        const updatedCourses = [...courses];
        updatedCourses[index][field] = value;
        setCourses(updatedCourses);
    };

    const addCourseField = () => {
        setCourses([...courses, { courseCode: "", creditHours: "" }]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = {
            name: e.target.name.value,
            ID: e.target.ID.value,
            email: e.target.email.value,
            password: e.target.password.value,
            courses: {}
        };

        courses.forEach(course => {
            if (course.courseCode && course.creditHours) {
                formData.courses[course.courseCode] = parseInt(course.creditHours);
            }
        });

        console.log("🚀 Submitted Data:", formData);
        axios.post("http://localhost:3000/api/teacher", formData)
            .then(response => {
                Toastify({
                    text: "Teacher added successfully!",
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    backgroundColor: "#4CAF50",
                    close: true,
                    stopOnFocus: true,
                }).showToast();
            })
            .catch(error => {
                console.error("There was an error adding the teacher:", error);
                Toastify({
                    text: "Error adding Teacher.",
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    backgroundColor: "#ff4d4f",
                    close: true,
                    stopOnFocus: true,
                }).showToast();
            });
        setCourses([{ courseCode: "", creditHours: "" }]); // Reset courses
        e.target.reset(); // Reset the form fields
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-xl border border-gray-200 space-y-6">
            <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
                <span>👨‍🏫</span> Add New Teacher
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        required
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                        type="text"
                        name="ID"
                        placeholder="Teacher ID (6 digits)"
                        maxLength={6}
                        required
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* Dynamic Courses */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Courses Taught
                    </label>

                    {courses.map((course, index) => (
                        <div key={index} className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Course Code (e.g., CS-101)"
                                value={course.courseCode}
                                onChange={(e) =>
                                    handleCourseChange(index, "courseCode", e.target.value)
                                }
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                            />
                            <input
                                type="number"
                                placeholder="Credit Hours"
                                value={course.creditHours}
                                onChange={(e) =>
                                    handleCourseChange(index, "creditHours", e.target.value)
                                }
                                min={1}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addCourseField}
                        className="text-blue-600 text-sm mt-2 hover:underline"
                    >
                        + Add another course
                    </button>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Add Teacher
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddTeacherForm;
