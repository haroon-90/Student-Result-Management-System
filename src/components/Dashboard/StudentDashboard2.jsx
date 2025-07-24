import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loading from '../Loading';

const getGrade = (marks) => {
    if (marks >= 84.5) return 'A+';
    else if (marks >= 79.5) return 'A';
    else if (marks >= 74.5) return 'B+';
    else if (marks >= 69.5) return 'B';
    else if (marks >= 64.5) return 'B-';
    else if (marks >= 59.5) return 'C+';
    else if (marks >= 54.5) return 'C';
    else if (marks >= 49.5) return 'D';
    else return 'F';
};

const StudentDashboard2 = () => {
    const navigate = useNavigate();
    const { setRole, userId, setUserId, sidebaritem } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [student, setStudent] = useState({});
    const storedId = sessionStorage.getItem("userId");

    const getstudent = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/api/student/${storedId}`);
            if (res) setStudent(res.data);
        } catch (err) {
            console.error("Error fetching student data:", err);
        }
    };

    useEffect(() => {
        setLoading(true);
        getstudent();
    }, []);

    useEffect(() => {
        if (student && Object.keys(student).length > 0) setLoading(false);
    }, [student]);

    const handleLogout = () => {
        setRole("");
        setUserId("");
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("role");
        navigate('/');
    };

    if (loading || !student) return <Loading />;

    const renderContent = () => {
        switch (sidebaritem) {
            case 'Home':
            case '':
                return (
                    <div className="bg-white shadow-md rounded-2xl p-6 max-w-3xl mx-auto mt-10 border border-blue-200">
                        <h2 className="text-4xl font-extrabold mb-2 text-blue-700 text-center">
                            Welcome, {student.name}!
                        </h2>
                        <p className="text-gray-500 text-lg text-center underline mb-6">
                            Quick Summary
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-lg text-gray-700 font-medium">
                            <div className="bg-blue-50 border border-blue-100 rounded-xl py-4 px-2 shadow-sm">
                                <p className="text-sm text-gray-500">Roll No</p>
                                <p>{student.rollNo || 'N/A'}</p>
                            </div>
                            <div className="bg-green-50 border border-green-100 rounded-xl py-4 px-2 shadow-sm">
                                <p className="text-sm text-gray-500">GPA</p>
                                <p>{student.gpa || 'N/A'}</p>
                            </div>
                            <div className="bg-yellow-50 border border-yellow-100 rounded-xl py-4 px-2 shadow-sm">
                                <p className="text-sm text-gray-500">Grade</p>
                                <p>{student.grade || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                );
            case 'Profile':
                return (
                    <div className="bg-white shadow-md rounded-2xl p-6 max-w-4xl mx-auto mt-10 border border-gray-200">
                        <h3 className="text-3xl font-bold text-blue-700 mb-6 text-center underline">
                            Student Profile
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 text-lg text-gray-800 font-medium">
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
                                <p className="text-sm text-gray-500">Name</p>
                                <p>{student.name || 'N/A'}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
                                <p className="text-sm text-gray-500">Roll No</p>
                                <p>{student.rollNo || 'N/A'}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
                                <p className="text-sm text-gray-500">Class</p>
                                <p>{student.class || 'N/A'}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
                                <p className="text-sm text-gray-500">Email</p>
                                <p>{student.email || 'Not Provided'}</p>
                            </div>
                        </div>
                    </div>
                );
            case 'Courses':
                return (
                    <div className="bg-white shadow-md rounded-2xl p-6 max-w-4xl mx-auto mt-8 border border-gray-200">
                        <h3 className="text-2xl font-bold text-blue-700 mb-4 underline text-center">Your Courses</h3>
                        <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-gray-800 font-medium">
                            {Object.keys(student.marks).map(course => (
                                <li
                                    key={course}
                                    className="bg-gray-50 hover:bg-blue-50 transition-all duration-200 border border-gray-100 rounded-lg px-4 py-2 shadow-sm"
                                >
                                    <span>📘 {course}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            case 'Grades':
                return (
                    <div>
                        <h3 className="text-2xl font-semibold text-blue-600 mb-3 border-b border-blue-300 pb-2">Grades</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-gray-800 border border-blue-300 rounded-xl overflow-hidden shadow">
                                <thead className="bg-blue-100 text-blue-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left border">Course</th>
                                        <th className="px-6 py-3 text-left border">Marks</th>
                                        <th className="px-6 py-3 text-left border">Grade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(student.marks).map(([subject, mark]) => (
                                        <tr key={subject} className="hover:bg-blue-50">
                                            <td className="px-6 py-3 border">{subject}</td>
                                            <td className="px-6 py-3 border">{mark}</td>
                                            <td className="px-6 py-3 border">{getGrade(parseFloat(mark))}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-5 flex justify-around text-blue-800 font-medium">
                            <span><strong>GPA:</strong> {student.gpa}</span>
                            <span><strong>Grade:</strong> {student.grade}</span>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="m-4 bg-gradient-to-br from-white to-blue-50 border border-blue-200 shadow-2xl rounded-2xl min-w-[80%]">
            <div className="flex justify-between items-center mb-6">
                <h2 className="p-4 text-3xl font-bold rounded-tl-2xl rounded-br-2xl bg-blue-700 text-white tracking-tight">Student Dashboard</h2>
                <button
                    onClick={handleLogout}
                    className="m-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 transition text-white font-semibold rounded-full shadow-md"
                >
                    Log Out
                </button>
            </div>
            <div className="pb-6 px-6">
                {renderContent()}
            </div>
        </div>
    );
};

export default StudentDashboard2;