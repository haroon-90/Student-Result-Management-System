import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Loading from '../Loading';
import UpdatePassword from '../Parts/UpdatePassword';
import Logout from '../Parts/Logout';
import Home from '../Parts/Home';
import Profile from '../Parts/Profile';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const TeacherDashboard2 = () => {
    const navigate = useNavigate();

    const { sidebaritem } = useContext(UserContext);
    const [rollNo, setRollNo] = useState('');
    const [student, setStudent] = useState(null);
    const [allstudent, setallstudent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [TeacherProfile, setTeacherProfile] = useState({})
    const userId = sessionStorage.getItem("userId");

    useEffect(() => {
        fetchprofile();
    }, [])

    const fetchprofile = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/api/teacher/${userId}`);
            if (res) setTeacherProfile(res.data);
            console.log("Teacher Profile:", res.data);
        } catch (err) {
            console.error("Error fetching admin profile:", err);
            navigate('/');
        }
    };

    const fetchStudent = async () => {
        try {
            setLoading(true);
            if (!rollNo.trim()) {
                Toastify({
                    text: "Please enter a roll number",
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    backgroundColor: "#ff4d4f",
                    close: true,
                    stopOnFocus: true,
                }).showToast();
                setLoading(false);
                return;
            }
            const { data } = await axios.get(`http://localhost:3000/api/student/roll/${rollNo}`);
            console.log('Fetched student:', data[0]);
            if (data.length === 0 || !data[0]) {
                Toastify({
                    text: "No student found with this roll number",
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    backgroundColor: "#ff4d4f",
                    close: true,
                    stopOnFocus: true,
                }).showToast();
                setStudent(null);
                return;
            }
            setStudent(data[0]);
            Toastify({
                text: "Student fetched successfully",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "#4CAF50",
                close: true,
                stopOnFocus: true,
            }).showToast();
        } catch (err) {
            console.error('Error fetching student:', err);

            Toastify({
                text: "Error fetching student",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "#ff4d4f",
                close: true,
                stopOnFocus: true,
            }).showToast();

            setStudent(null);
        } finally {
            setLoading(false);
        }
    };

    const getallstudents = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`http://localhost:3000/api/students`);
            console.log('Fetched all students:', data);
            setallstudent(data);
        } catch (err) {
            console.error('Error fetching students:', err);
            setallstudent(null);
        } finally {
            setLoading(false);
        }
    };

    const updateAllMarks = async () => {
        try {
            for (let student of allstudent) {
                await axios.put(`http://localhost:3000/api/student/${student._id}`, {
                    marks: student.marks,
                });
            }
            Toastify({
                text: "Marks updated successfully!",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "#4CAF50",
                close: true,
                stopOnFocus: true,
            }).showToast();

        } catch (error) {
            console.error("Error while updating marks:", error);
            Toastify({
                text: "Something went wrong. Could not update all marks.",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "#FF3B3B",
                close: true,
                stopOnFocus: true
            }).showToast();

        }
    };

    const handleMarksChange = (subject, value) => {
        setStudent((prev) => ({
            ...prev,
            marks: { ...prev.marks, [subject]: Number(value) },
        }));
    };

    const handleStudentMarkChange = (index, subject, value) => {
        setallstudent((prev) => {
            const updatedStudents = [...prev];
            updatedStudents[index].marks[subject] = Number(value);
            return updatedStudents;
        });
    };

    const updateMarks = async () => {
        try {
            await axios.put(`http://localhost:3000/api/student/${student._id}`, {
                marks: student.marks,
            });
            Toastify({
                text: "Marks updated successfully!",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "#4CAF50",
                close: true,
                stopOnFocus: true
            }).showToast();
        } catch (err) {
            console.error('Error updating marks:', err);
            Toastify({
                text: "Failed to update marks",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "#ff0000",
                close: true,
                stopOnFocus: true
            }).showToast();
        }
    };
    // ----- Section-based Rendering -----
    const renderSection = () => {
        switch (sidebaritem) {
            case 'Home':
            case '':
                return (
                    <Home
                        data={{
                            name: "Sir Ali Raza",
                            courses: [
                                { code: "CS-101", enrolled: 42, averageMarks: 79, status: "Active", },
                                { code: "DSA-202", enrolled: 38, averageMarks: 85, status: "Active", },
                                { code: "WEB-303", enrolled: 29, averageMarks: 78, status: "Reviewing", },
                            ],
                        }}
                    />
                );

            case 'Profile':
                return (
                    <Profile
                        data={TeacherProfile}
                    />);

            case 'Courses':
                return (
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 w-full max-w-md">
                        <div className="mb-3">
                            <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
                                <span>📘</span>
                                Your Courses
                            </h2>
                        </div>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 pl-2">
                            <li><span className="font-medium text-gray-900">Mathematics</span> - Class 10</li>
                            <li><span className="font-medium text-gray-900">Physics</span> - Class 9</li>
                            <li><span className="font-medium text-gray-900">General Science</span> - Class 8</li>
                        </ul>
                    </div>
                );

            case 'Grades':
                return (
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 w-full max-w-md">
                        <div className="mb-3">
                            <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
                                <span>📊</span>
                                Grade Stats
                            </h2>
                        </div>
                        <div className="space-y-2 text-sm text-gray-700">
                            <p><span className="font-medium text-gray-900">Avg GPA this term:</span> 3.4</p>
                            <p><span className="font-medium text-gray-900">Highest GPA:</span> 4.0</p>
                            <p><span className="font-medium text-gray-900">Students Failed:</span> 3</p>
                        </div>
                    </div>
                );

            case 'Update password':
                return (
                    <UpdatePassword />
                );

            case 'Students':
                return (
                    <div className='flex flex-col w-full px-4'>
                        {/* Search Section */}
                        <div className="mb-4">
                            <label className="block font-medium">Search student</label>
                            <div className='flex gap-4 justify-center items-center'>
                                <input
                                    type="text"
                                    value={rollNo}
                                    onChange={(e) => setRollNo(e.target.value)}
                                    className="text-sm min-w-[50%] border my-2 border-gray-600 rounded-full px-2 py-1 focus:border-blue-700 focus:shadow-[0_0_5px_0.5px_rgba(59,130,246,0.5)] focus:outline-none"
                                    placeholder="Search student by roll number"
                                />
                                <button
                                    onClick={fetchStudent}
                                    className="bg-blue-600 py-1 text-white px-4 rounded-full hover:bg-blue-700"
                                >
                                    Search
                                </button>
                            </div>
                        </div>

                        {/* Loading */}
                        {loading && <Loading />}

                        {/* Student Found */}
                        {student && (
                            <div className="space-y-2 text-left">
                                <div className='pl-8'>
                                    <p className='pt-2'><strong>Name:</strong> {student.name}</p>
                                    <p className='pt-2'><strong>Class:</strong> {student.class}</p>
                                </div>

                                {/* Editable Marks Table */}
                                <div className='flex flex-col justify-center items-center'>
                                    <label className="font-semibold">Marks:</label>
                                    <table className="w-full mt-2 text-sm">
                                        <thead>
                                            <tr className="bg-blue-100">
                                                <th className="p-2 text-left">Subject</th>
                                                <th className="p-2 text-left">Mark</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(student.marks).map(([subject, mark], index) => (
                                                <tr key={index} className="border-b">
                                                    <td className="p-2">{subject}</td>
                                                    <td className="p-2">
                                                        <input
                                                            type="number"
                                                            value={mark}
                                                            onChange={(e) => handleMarksChange(subject, e.target.value)}
                                                            className="w-20 border rounded px-2 py-1"
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <button
                                        onClick={updateMarks}
                                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                                    >
                                        Update Marks
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* All Students Section */}
                        <div className="mt-6">
                            <button
                                onClick={getallstudents}
                                className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                            >
                                Get All Students
                            </button>

                            {allstudent && (
                                <div className="mt-4 overflow-x-auto flex flex-col justify-center items-center">
                                    <h3 className="text-lg font-semibold mb-2">All Students</h3>
                                    <table className="w-full text-sm border border-blue-700 rounded-lg overflow-hidden">
                                        <thead>
                                            <tr className="bg-blue-100">
                                                <th className="p-2 text-left">Roll No</th>
                                                <th className="p-2 text-left">Name</th>
                                                <th className="p-2 text-left">Class</th>
                                                <th className="p-2 text-left">Marks</th>
                                                <th className="p-2 text-left">GPA</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allstudent.map((stud, idx) => (
                                                <tr key={stud._id} className="border-b hover:bg-gray-50">
                                                    <td className="p-2 border">{stud.rollNo}</td>
                                                    <td className="p-2 border">{stud.name}</td>
                                                    <td className="p-2 border">{stud.class}</td>
                                                    <td className="p-2 border">
                                                        <div className="flex flex-wrap gap-2">
                                                            {Object.entries(stud.marks).map(([subject, mark], index) => (
                                                                <div key={index} className="flex flex-col">
                                                                    <span className="text-xs font-medium">{subject}</span>
                                                                    <input
                                                                        type="number"
                                                                        value={mark || '0'}
                                                                        onChange={(e) =>
                                                                            handleStudentMarkChange(idx, subject, e.target.value)
                                                                        }
                                                                        className="w-14 px-1 py-0.5 border rounded"
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="p-2 border">{stud.gpa}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className='flex justify-end p-2 '>
                                        <button
                                            onClick={updateAllMarks}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                                        >
                                            Update
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );

            default:
                return <p className="text-center text-gray-500">Select a section from the sidebar</p>;
        }
    };

    return (
        <div className="min-w-[80%] my-4 mx-auto text-center pb-4 border border-blue-700 bg-white rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="p-4 text-3xl font-bold rounded-tl-2xl rounded-br-2xl bg-blue-700 text-white tracking-tight">Teacher Dashboard</h2>
                <Logout />
            </div>
            <div className='pb-6 px-6'>
                {renderSection()}
            </div>
        </div>
    );
};

export default TeacherDashboard2;
