import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import UpdatePassword from '../Parts/UpdatePassword';
import Logout from '../Parts/Logout';
import Home from '../Parts/Home';
import Profile from '../Parts/Profile';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { role, sidebaritem, setSidebaritem } = useContext(UserContext);
    const [adminProfile, setAdminProfile] = useState({ name: "admin" })
    const [student, setStudent] = useState({
        name: '',
        rollNo: '',
        class: '',
        subjects: [''],
    });

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

    if (role !== 'admin') {
        return <div className="text-center text-red-500 font-semibold">Unauthorized Access</div>;
    }

    const renderSection = () => {
        switch (sidebaritem) {
            case '':
            case 'Home':
                return (
                    <Home data={adminProfile} />
                );
            case 'Add Student':
                return (
                    <div className='flex flex-col shadow-md rounded-2xl p-6 border border-blue-200'>
                        <label className="font-semibold">Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={student.name}
                            onChange={handleChange}
                            placeholder="Full Name"
                            className="text-sm border my-2 border-gray-600 rounded-lg px-2 py-1 w-full focus:border-blue-500 focus:shadow-[0_0_5px_0.5px_rgba(59,130,246,0.5)] focus:outline-none"
                        />
                        <label className="font-semibold">Roll no:</label>
                        <input
                            type="text"
                            name="rollNo"
                            value={student.rollNo}
                            onChange={handleChange}
                            placeholder="Roll No"
                            className="text-sm border my-2 border-gray-600 rounded-lg px-2 py-1 w-full focus:border-blue-500 focus:shadow-[0_0_5px_0.5px_rgba(59,130,246,0.5)] focus:outline-none"
                        />
                        <label className="font-semibold">Class:</label>
                        <input
                            type="text"
                            name="class"
                            value={student.class}
                            onChange={handleChange}
                            placeholder="Class"
                            className="text-sm border my-2 border-gray-600 rounded-lg px-2 py-1 w-full focus:border-blue-500 focus:shadow-[0_0_5px_0.5px_rgba(59,130,246,0.5)] focus:outline-none"
                        />

                        <div className="mb-4 text-center">
                            <div className='flex justify-between items-center mb-2'>
                                <label className="font-semibold">Courses:</label>
                                <button
                                    type="button"
                                    onClick={addSubjectField}
                                    className="px-3 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                                >
                                    + Add Course
                                </button>
                            </div>
                            {student.subjects.map((subject, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    value={subject}
                                    onChange={(e) => handleSubjectChange(index, e.target.value)}
                                    placeholder={`Course ${index + 1}`}
                                    className="text-sm border my-2 border-gray-600 rounded-lg px-2 py-1 w-full focus:border-blue-500 focus:shadow-[0_0_5px_0.5px_rgba(59,130,246,0.5)] focus:outline-none"
                                />
                            ))}
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={disabedSubmit()}
                            className="disabled:opacity-60 disabled:hover:bg-blue-600 px-8 py-2 mb-4 mx-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-md transition-all duration-200"
                        >
                            Add Student
                        </button>
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
                return <div className="bg-white border border-blue-200 rounded-xl p-6 shadow-md">
                    <h3 className="text-xl font-bold text-blue-600 mb-4">📘 Available Courses</h3>
                    <ul className="divide-y divide-blue-100">
                        <li className="py-2">
                            <p className="font-medium text-gray-800">Mathematics</p>
                            <p className="text-sm text-gray-500">Class: 10 | Instructor: Mr. Ali</p>
                        </li>
                        <li className="py-2">
                            <p className="font-medium text-gray-800">Physics</p>
                            <p className="text-sm text-gray-500">Class: 9 | Instructor: Ms. Sana</p>
                        </li>
                        <li className="py-2">
                            <p className="font-medium text-gray-800">Biology</p>
                            <p className="text-sm text-gray-500">Class: 8 | Instructor: Dr. Ahmed</p>
                        </li>
                        <li className="py-2">
                            <p className="font-medium text-gray-800">Computer Science</p>
                            <p className="text-sm text-gray-500">Class: 11 | Instructor: Mr. Usman</p>
                        </li>
                    </ul>
                </div>;
            case 'Grades':
                return <div className="bg-white border border-blue-200 rounded-xl p-6 shadow-md">
                    <h3 className="text-xl font-bold text-blue-600 mb-4">📊 Grades Summary</h3>
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
                    </div>
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
