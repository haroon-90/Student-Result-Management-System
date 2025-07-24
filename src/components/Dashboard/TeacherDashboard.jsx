import { useEffect, useState } from 'react'
import axios from 'axios';
import Loading from '../Loading';

const TeacherDashboard = () => {

  // const getstudent = async (e) => {
  //   e.preventDefault();
  //   try {
  //     console.log("UserID is ", userId)
  //     const res = await axios.get(`http://localhost:3000/api/students`)
  //     console.log("res is ", res)
  //     if (!res) return <div>No Record found</div>
  //     setStudent(res.data);
  //   } catch (err) {
  //     console.log("ERROR: ", err)
  //     return <div>There is an issue in getting your result, please try again later</div>
  //   }
  // }

  // useEffect(() => {
  //   getstudent()
  // }, [])

  // useEffect(() => {
  //   if (student && Object.keys(student).length > 0) {
  //     setLoading(false);
  //   }
  // }, [student]);

  const [rollNo, setRollNo] = useState('');
  const [student, setStudent] = useState(null);
  const [allstudent, setallstudent] = useState(null)
  const [loading, setLoading] = useState(false);

  const fetchStudent = async () => {
    try {
      setLoading(true);
      if (!rollNo.trim()) {
        alert('Please enter a roll number');
        setLoading(false);
        return;
      }
      const { data } = await axios.get(`http://localhost:3000/api/student/roll/${rollNo}`);
      console.log('Fetched student:', data[0]);
      setStudent(data[0]);
    } catch (err) {
      console.error('Error fetching student:', err);
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

  useEffect(() => {
    if (student && Object.keys(student).length > 0) {
      setLoading(false);
    }
  }, [student]);

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
      alert('Marks updated successfully!');
    } catch (err) {
      console.error('Error updating marks:', err);
      alert('Failed to update marks');
    }
  };

  return (
    <div className="min-w-[70%] my-2 mx-auto text-center px-6 pb-2 border border-blue-500 bg-white rounded-xl shadow">
      <h2 className="w-full bg-blue-500 text-white text-center rounded-b-2xl py-2 text-xl font-bold mb-4">
        Teacher Dashboard
      </h2>
      <div className="mb-4">
        <label className="block font-medium">Enter Roll No:</label>
        <input
          type="text"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
          className="text-sm border my-2 border-gray-600 rounded-lg px-2 py-1 w-full focus:border-blue-500 focus:shadow-[0_0_5px_0.5px_rgba(59,130,246,0.5)] focus:outline-none"
          placeholder="Search student by roll number"
        />
        <button
          onClick={fetchStudent}
          className="mt-2 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      {loading && <Loading />}

      {student && (
        <div className="space-y-4">
          <p><strong>Name:</strong> {student.name}</p>
          <p><strong>Class:</strong> {student.class}</p>

          <div>
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
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Update Marks
            </button>
          </div>
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={getallstudents}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Get All Students
        </button>
        {allstudent && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">All Students</h3>
            <table className='w-full mt-2 text-sm border border-blue-500 rounded-lg overflow-hidden'>
              <thead>
                <tr className="bg-blue-100">
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Roll No</th>
                  <th className="p-2 text-left">Class</th>
                  <th className="p-2 text-left">Marks</th>
                  <th className="p-2 text-left">GPA</th>
                </tr>
              </thead>
              <tbody>
                {allstudent.map((stud) => (
                  <tr key={stud._id} className="border-b hover:bg-gray-50">
                    <td className="p-2 text-left border">{stud.rollNo}</td>
                    <td className="p-2 text-left border">{stud.name}</td>
                    <td className="p-2 text-left border">{stud.class}</td>
                    <td className='flex text-left border'>
                      {Object.entries(stud.marks).map(([subject, mark], index) => (
                        <div key={index} className="p-2 flex flex-col gap-1">
                          <span>{subject}</span>
                          <input
                            type="number"
                            value={mark || '0'}
                            onChange={(e) => handleStudentMarkChange(index, subject, e.target.value)}
                            className="w-10 px-1 py-0.5 border rounded"
                          />
                        </div>
                      ))}
                    </td>
                    <td className="p-2 text-left border">{stud.gpa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* <div className="pt-4 flex justify-center">
          <button
            onClick={() => setStudent(null)}
            className="px-8 py-2 mb-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full shadow-md transition-all duration-200"
          >
            Clear
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default TeacherDashboard
