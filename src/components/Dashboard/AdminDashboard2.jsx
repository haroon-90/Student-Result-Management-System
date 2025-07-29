import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import axios from 'axios';

import UpdatePassword from '../Parts/UpdatePassword';
import Logout from '../Parts/Logout';
import Home from '../Parts/Home';
import Profile from '../Parts/Profile';
import AddTeacherForm from '../Parts/AddTeacher';
import AddCourseForm from '../Parts/AddCourse';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [AllCourses, setAllCourses] = useState()
    const { role, sidebaritem, setSidebaritem } = useContext(UserContext);
    const [adminProfile, setAdminProfile] = useState({ name: "admin" });
    const [student, setStudent] = useState({
        name: '',
        rollNo: '',
        email: '',
        class: '',
        subjects: [''],
    });
    const [stats, setStats] = useState({
        students: 0,
        teachers: 0,
        totalClasses: 0,
        systemStatus: 'Loading...'
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/stats');
                setStats(res.data);
            } catch (error) {
                console.error("Error loading stats:", error);
            }
        };

        fetchStats();
    }, []);

    const inputStyle = "text-sm border border-gray-300 rounded-lg px-2 py-1 w-full focus:border-blue-500 focus:shadow-[0_0_5px_0.5px_rgba(59,130,246,0.5)] focus:outline-none";

    const disabedSubmit = () => {
        if (!student.name || !student.rollNo || !student.class || student.subjects.some(subj => !subj.trim()))
            return "disabled";
    };

    const handleChange = (e) => {
        setStudent({ ...student, [e.target.name]: e.target.value });
    };

    const handleSubjectChange = (index, value) => {
        const updatedSubjects = [...student.subjects];
        updatedSubjects[index] = value;
        setStudent({ ...student, subjects: updatedSubjects });
    };

    const addSubjectField = () => {
        setStudent({ ...student, subjects: [...student.subjects, ''] });
    };

    useEffect(() => {
        fetchprofile();
        FetchAllCourses();
    }, [])

    const fetchprofile = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/api/admin/${sessionStorage.getItem("userId")}`);
            if (res) setAdminProfile(res.data);
        } catch (err) {
            console.error("Error fetching admin profile:", err);
            navigate('/');
        }
    };

    const handleSubmit = async () => {
        const marks = {};
        student.subjects.forEach((subj) => {
            if (subj.trim()) marks[subj.trim()] = 0;
        });
        const newStudent = {
            name: student.name,
            rollNo: student.rollNo,
            class: student.class,
            marks,
        };
        try {
            await axios.post('http://localhost:3000/api/students', newStudent);
            Toastify({
                text: "Student added successfully!",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "#4CAF50",
                close: true,
                stopOnFocus: true,
            }).showToast();
            setStudent({ name: '', rollNo: '', class: '', subjects: [''] });
        } catch (err) {
            console.error(err);
            Toastify({
                text: "Error adding student.",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "#ff4d4f",
                close: true,
                stopOnFocus: true,
            }).showToast();
        }
    };

    const FetchAllCourses = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/courses');
            if (res) setAllCourses(res.data);
        } catch (err) {
            console.error("Error fetching courses:", err);
            Toastify({
                text: "Error fetching courses.",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "#ff4d4f",
                close: true,
                stopOnFocus: true,
            }).showToast();
        }
    };

    if (role !== 'admin') {
        return <div className="text-center text-red-500 font-semibold">Unauthorized Access</div>;
    }

    const renderSection = () => {
        switch (sidebaritem) {
            case '':
            case 'Home':
                return (
                    <Home data={adminProfile} stats={stats} />
                );
            case 'Add Teacher':
                return (
                    <AddTeacherForm />
                );
            case 'Add Courses':
                return (
                    <AddCourseForm />
                );
            case 'Add Student':
                return (
                    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-xl border border-gray-200 space-y-6">

                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-blue-700">Add New Student</h2>
                            <p className="text-sm text-gray-500 mt-1">Enter student details below</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={student.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Haroon Nawaz"
                                    className={inputStyle}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">Roll Number</label>
                                <input
                                    type="text"
                                    name="rollNo"
                                    value={student.rollNo}
                                    onChange={handleChange}
                                    placeholder="e.g. 23071519-032"
                                    className={inputStyle}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={student.email}
                                    onChange={handleChange}
                                    placeholder="e.g. student@lms.com"
                                    className={inputStyle}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">Class</label>
                                <input
                                    type="text"
                                    name="class"
                                    value={student.class}
                                    onChange={handleChange}
                                    placeholder="e.g. BSCS-4A"
                                    className={inputStyle}
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-gray-700">Courses</label>
                                <button
                                    type="button"
                                    onClick={addSubjectField}
                                    className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-full transition"
                                >
                                    + Add Course
                                </button>
                            </div>

                            <div className="space-y-2">
                                {student.subjects.map((subject, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        value={subject}
                                        onChange={(e) => handleSubjectChange(index, e.target.value)}
                                        placeholder={`Course ${index + 1}`}
                                        className={inputStyle}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="text-center pt-4">
                            <button
                                onClick={handleSubmit}
                                disabled={disabedSubmit()}
                                className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg shadow transition"
                            >
                                Add Student
                            </button>
                        </div>
                    </div>
                );
            case 'Update password':
                return (
                    <UpdatePassword />
                );
            case 'Profile':
                return (
                    <Profile
                        data={adminProfile}
                    />
                );
            case 'Courses':
                return <div className="w-full max-w-md mx-auto bg-white border border-gray-200 rounded-3xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
                            📘 Available Courses
                        </h3>
                        <span className="text-xs text-gray-400">Total: {AllCourses?.length || 0}</span>
                    </div>

                    <div className="space-y-3">
                        {AllCourses && AllCourses.map((course, index) => (
                            <div
                                key={index}
                                className="bg-blue-50 border border-blue-100 rounded-xl p-4 shadow-sm flex justify-between items-center"
                            >
                                <div>
                                    <p className="font-semibold text-blue-800">{course.title}</p>
                                    <p className="text-xs text-gray-600 mt-1">Code: {course.code}</p>
                                </div>
                                <div className="text-sm text-gray-700 bg-blue-200 px-3 py-1 rounded-full font-medium">
                                    {course.credit} cr
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            case 'Grades':
                return <div className="bg-white border border-blue-200 rounded-xl p-6 shadow-md">
                    <h1 className='text-center text-xl'>Feature in progress. Please check back later.</h1>
                    {/* <h3 className="text-xl font-bold text-blue-600 mb-4">📊 Grades Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">

                        <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                            <p className="font-semibold text-gray-800">Average GPA:</p>
                            <p className="text-blue-600 text-lg font-bold">3.4</p>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                            <p className="font-semibold text-gray-800">Highest GPA:</p>
                            <p className="text-green-600 text-lg font-bold">4.0</p>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                            <p className="font-semibold text-gray-800">Students Passed:</p>
                            <p className="text-green-500 text-lg font-bold">47</p>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                            <p className="font-semibold text-gray-800">Students Failed:</p>
                            <p className="text-red-500 text-lg font-bold">3</p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h4 className="font-semibold text-gray-800 mb-2">Top Performing Students 🎓</h4>
                        <ul className="list-disc ml-5 text-gray-700">
                            <li>Ayesha Khan - GPA: 4.0</li>
                            <li>Ali Raza - GPA: 3.9</li>
                            <li>Sana Tariq - GPA: 3.8</li>
                        </ul>
                    </div> */}
                </div>;
            default:
                return <p className="text-sm">{sidebaritem} section is under development.</p>;
        }
    };

    return (
        <div className="m-4 bg-white border border-blue-700 shadow-2xl rounded-2xl min-w-[80%]">
            <div className="flex justify-between items-center mb-6">
                <h2 className="p-4 text-3xl font-bold rounded-tl-2xl rounded-br-2xl bg-blue-700 text-white tracking-tight">Admin Dashboard</h2>
                <Logout />
            </div>
            <div className="pb-6 px-6">
                {renderSection()}
            </div>
        </div>
    );
};

export default AdminDashboard;
