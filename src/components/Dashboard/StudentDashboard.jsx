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

const StudentProfile = () => {
    const navigate = useNavigate();
    const { setRole, userId, setUserId, sidebaritem } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [student, setStudent] = useState({});

    const storedId = sessionStorage.getItem("userId");

    const getstudent = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/api/student/${storedId}`)
            console.log("res is ", res)
            if (!res) return <div>No Record found</div>
            setStudent(res.data);
        } catch (err) {
            console.log("ERROR: ", err)
            return <div>There is an issue in getting your result, please try again later</div>
        }
    }

    useEffect(() => {
        console.log("Fetching student data");
        setLoading(true);
        getstudent()
    }, [])

    useEffect(() => {
        if (student && Object.keys(student).length > 0) {
            setLoading(false);
        }
    }, [student]);

    const handleLogout = () => {
        setRole("");
        setUserId("");
        console.log('logout');
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("role");
        navigate('/');
    }

    if (loading || !student) {
        return (
            <Loading />
        );
    }

    return (
        <div className="min-w-[calc(100%-36px)] m-4 px-6 flex flex-col justify-between border border-blue-500 bg-white shadow-lg rounded-lg">
            <h2 className=" w-full bg-blue-500 text-white text-center rounded-b-2xl py-2 text-xl font-bold mb-4">Student Detail</h2>
            <div className="space-y-1 flex flex-col text-gray-700">
                <div className="grid sm:grid-cols-2 gap-y-4 gap-x-10 text-gray-800 my-2">
                    <p><span className="font-semibold">Name:</span> {student.name}</p>
                    <p><span className="font-semibold">Roll No:</span> {student.rollNo}</p>
                    <p><span className="font-semibold">Class:</span> {student.class}</p>
                    <p><span className="font-semibold">Email:</span> {student.email || 'Not Provided'}</p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-3 underline">Result</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-gray-700 border border-gray-300 rounded-lg overflow-hidden">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-5 py-3 text-left border">Course</th>
                                    <th className="px-5 py-3 text-left border">Marks</th>
                                    <th className="px-5 py-3 text-left border">Grade</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(student.marks).map(([subject, mark]) => (
                                    <tr key={subject} className="hover:bg-gray-50">
                                        <td className="px-5 py-2 border">{subject}</td>
                                        <td className="px-5 py-2 border">{mark}</td>
                                        <td className="px-5 py-2 border">{getGrade(mark)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="mt-4 flex justify-around items-center">
                    <span><strong>GPA: </strong>{student.gpa}</span>
                    <span><strong>Grade: </strong>{student.grade}</span>
                </div>
            </div>
            <div className="pt-4 flex justify-center">
                <button
                    onClick={handleLogout}
                    className="px-8 py-2 mb-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full shadow-md transition-all duration-200"
                >
                    Log Out
                </button>
            </div>
        </div>
    );
};

export default StudentProfile;
