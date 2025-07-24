import { useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [student, setStudent] = useState({
    name: '',
    rollNo: '',
    class: '',
    subjects: [''],
  });

  const disabedSubmit = () => {
    if (!student.name || !student.rollNo || !student.class || student.subjects.some(subj => !subj.trim()))
      return "disabled";
  }

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

  return (
    <div className="max-w-xl my-2 mx-auto text-center px-6 pb-2 border border-blue-500 bg-white rounded-xl shadow">
      <h2 className="w-full bg-blue-500 text-white text-center rounded-b-2xl py-2 text-xl font-bold mb-4">Admin Dashboard</h2>

      <input
        type="text"
        name="name"
        value={student.name}
        onChange={handleChange}
        placeholder="Student Name"
        className="text-sm border my-2 border-gray-600 rounded-lg px-2 py-1 w-full focus:border-blue-500 focus:shadow-[0_0_5px_0.5px_rgba(59,130,246,0.5)] focus:outline-none"
      />
      <input
        type="text"
        name="rollNo"
        value={student.rollNo}
        onChange={handleChange}
        placeholder="Roll No"
        className="text-sm border my-2 border-gray-600 rounded-lg px-2 py-1 w-full focus:border-blue-500 focus:shadow-[0_0_5px_0.5px_rgba(59,130,246,0.5)] focus:outline-none"
      />
      <input
        type="text"
        name="class"
        value={student.class}
        onChange={handleChange}
        placeholder="Class"
        className="text-sm border my-2 border-gray-600 rounded-lg px-2 py-1 w-full focus:border-blue-500 focus:shadow-[0_0_5px_0.5px_rgba(59,130,246,0.5)] focus:outline-none"
      />

      <div className="mb-4 text-center">
        <label className="font-semibold">Subjects:</label>
        {student.subjects.map((subject, index) => (
          <input
            key={index}
            type="text"
            value={subject}
            onChange={(e) => handleSubjectChange(index, e.target.value)}
            placeholder={`Subject ${index + 1}`}
            className="text-sm border my-2 border-gray-600 rounded-lg px-2 py-1 w-full focus:border-blue-500 focus:shadow-[0_0_5px_0.5px_rgba(59,130,246,0.5)] focus:outline-none"
          />
        ))}
        <button
          type="button"
          onClick={addSubjectField}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          + Add Subject
        </button>
      </div>

      <button
        onClick={handleSubmit}
        disabled={disabedSubmit()}
        className="disabled:opacity-80 disabled:hover:bg-blue-500 px-8 py-2 mb-4 mx-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full shadow-md transition-all duration-200"
      >
        Add Student
      </button>
    </div>
  );
};

export default AdminDashboard;
