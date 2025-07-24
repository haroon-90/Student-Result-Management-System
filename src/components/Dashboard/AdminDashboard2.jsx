import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { role, sidebaritem, setSidebaritem } = useContext(UserContext);
    const storedId = sessionStorage.getItem("userId");
    const [newPassword, setNewPassword] = useState('');
    const [updated, setupdated] = useState(false);
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
            alert('Student added successfully!');
            setStudent({ name: '', rollNo: '', class: '', subjects: [''] });
        } catch (err) {
            console.error(err);
            alert('Error adding student.');
        }
    };

    const handleUpdate = async () => {
        try {
            const res = await axios.put(`http://localhost:3000/api/student/${storedId}/password`, {
                password: newPassword,
                role: "admin"
            })
            setNewPassword('');
            setupdated(true);
            setTimeout(() => {
                setupdated(false);
            }, 3000);
            console.log("Password updated successfully!");
        }
        catch (error) {
            console.error('Failed to update password');
        }
    }

    const handleLogout = () => {
        setSidebaritem("");
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("role");
        navigate('/');
    };

    if (role !== 'admin') {
        return <div className="text-center text-red-500 font-semibold">Unauthorized Access</div>;
    }

    const renderSection = () => {
        switch (sidebaritem) {
            case '':
            case 'Home':
                return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Welcome Box */}
                    <div className="col-span-1 sm:col-span-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6 rounded-xl shadow-md">
                        <h2 className="text-xl font-bold mb-2">Welcome Back, Admin {adminProfile.name}!</h2>
                        <p className="text-sm">Manage your system efficiently using the tabs above.</p>
                    </div>
                    {/* Stats Boxes */}
                    <div className="bg-white border border-blue-400 p-4 rounded-lg shadow-sm">
                        <h3 className="text-blue-600 text-lg font-semibold">📚 Total Students</h3>
                        <p className="text-2xl font-bold mt-2 text-gray-800">128</p>
                    </div>

                    <div className="bg-white border border-green-400 p-4 rounded-lg shadow-sm">
                        <h3 className="text-green-600 text-lg font-semibold">👨‍🏫 Total Teachers</h3>
                        <p className="text-2xl font-bold mt-2 text-gray-800">15</p>
                    </div>

                    <div className="bg-white border border-yellow-400 p-4 rounded-lg shadow-sm">
                        <h3 className="text-yellow-600 text-lg font-semibold">🏫 Total Classes</h3>
                        <p className="text-2xl font-bold mt-2 text-gray-800">8</p>
                    </div>

                    <div className="bg-white border border-red-400 p-4 rounded-lg shadow-sm">
                        <h3 className="text-red-600 text-lg font-semibold">🛠 System Status</h3>
                        <p className="text-2xl font-bold mt-2 text-green-600">Operational</p>
                    </div>
                </div>
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
                    <div className="bg-white flex flex-col justify-center items-center shadow-md rounded-2xl p-6 max-w-4xl mx-auto mt-8 border border-gray-200">
                        <h3 className="text-2xl font-bold text-blue-700 mb-4 underline">Update Password</h3>
                        <form className="space-y-4 max-w-[60%]">
                            {updated && (
                                <div className="bg-green-100 text-green-700 p-4 rounded-lg shadow-sm">
                                    <p>Password updated successfully!</p>
                                </div>
                            )}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">New Password</label>
                                <input
                                    type="password"
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter new password"
                                />
                            </div>
                            <button
                                // type="submit"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleUpdate();
                                }}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
                            >
                                Update Password
                            </button>
                            <p className="text-sm text-gray-500 text-center mt-2">
                                Please contact your administrator if you face any issues.
                            </p>
                        </form>
                    </div>
                );
            case 'Profile':
                return <div className="bg-white border border-blue-400 p-4 rounded-lg shadow-sm">
                    <h3 className="text-blue-600 text-lg font-semibold mb-2">👤 Admin Information</h3>
                    <div className="text-sm text-gray-700 space-y-1">
                        <p><span className="font-semibold">Admin ID:</span> {adminProfile.ID}</p>
                        <p><span className="font-semibold">Name:</span> {adminProfile.name}</p>
                        <p><span className="font-semibold">Email:</span>{adminProfile.email}</p>
                        <p><span className="font-semibold">Role:</span> Super Admin</p>
                    </div>
                </div>
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
                <button
                    onClick={handleLogout}
                    className="m-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 transition text-white font-semibold rounded-full shadow-md"
                >
                    Log Out
                </button>
            </div>
            <div className="pb-6 px-6">
                {renderSection()}
            </div>
        </div>
    );
};

export default AdminDashboard;
