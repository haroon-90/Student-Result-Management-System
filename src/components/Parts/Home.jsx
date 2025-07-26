// Home.jsx
const Home = ({ data }) => {
    const storedRole = sessionStorage.getItem("role");

    if (storedRole === "admin") {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-1 sm:col-span-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold mb-2">Welcome Back, Admin {data?.name}!</h2>
                    <p className="text-sm">Manage your system efficiently using the tabs above.</p>
                </div>

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
        );
    }

    if (storedRole === "teacher") {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 space-y-6 max-w-5xl mx-auto">
                <div className="mb-4 text-center">
                    <h2 className="text-3xl font-bold text-blue-700 mb-1">
                        Welcome, {data?.name || "Teacher"}
                    </h2>
                    <p className="text-gray-600 text-sm">
                        Manage your students, courses, and performance insights here.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm">
                        <p className="text-sm text-gray-500">Total Courses</p>
                        <p className="text-2xl font-bold text-blue-700">
                            {data?.courses?.length || 0}
                        </p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 shadow-sm">
                        <p className="text-sm text-gray-500">Average Marks</p>
                        <p className="text-2xl font-bold text-green-700">
                            {
                                data?.courses?.length
                                    ? Math.round(
                                        data.courses.reduce((acc, c) => acc + c.averageMarks, 0) /
                                        data.courses.length
                                    )
                                    : 0
                            }
                            %
                        </p>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 shadow-sm">
                        <p className="text-sm text-gray-500">Top Performing Course</p>
                        <p className="text-lg font-semibold text-yellow-700">
                            {
                                data?.courses?.length
                                    ? data.courses.reduce((top, current) =>
                                        current.averageMarks > top.averageMarks ? current : top
                                    ).code
                                    : "N/A"
                            }
                        </p>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm">
                        <p className="text-sm text-gray-500">Courses Reviewing</p>
                        <p className="text-2xl font-bold text-red-600">
                            {data?.courses?.filter(c => c.status === "Reviewing").length || 0}
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
                    <table className="min-w-full bg-white text-left text-sm">
                        <thead className="bg-blue-100 text-blue-800 font-semibold">
                            <tr>
                                <th className="py-3 px-4">Course Code</th>
                                <th className="py-3 px-4">Students Enrolled</th>
                                <th className="py-3 px-4">Avg. Marks</th>
                                <th className="py-3 px-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.courses?.map((course, idx) => (
                                <tr className="border-t" key={idx}>
                                    <td className="py-3 px-4">{course.code}</td>
                                    <td className="py-3 px-4">{course.enrolled}</td>
                                    <td className="py-3 px-4">{course.averageMarks}%</td>
                                    <td
                                        className={`py-3 px-4 ${course.status === "Active"
                                                ? "text-green-600"
                                                : "text-yellow-600"
                                            }`}
                                    >
                                        {course.status}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }


    if (storedRole === "student") {
        return (
            <div className="bg-white shadow-md rounded-2xl p-6 max-w-3xl mx-auto mt-10 border border-blue-200">
                <h2 className="text-4xl font-extrabold mb-2 text-blue-700 text-center">
                    Welcome, {data?.name}!
                </h2>
                <p className="text-gray-500 text-lg text-center underline mb-6">Quick Summary</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-lg text-gray-700 font-medium">
                    <div className="bg-blue-50 border border-blue-100 rounded-xl py-4 px-2 shadow-sm">
                        <p className="text-sm text-gray-500">Roll No</p>
                        <p>{data?.rollNo || "N/A"}</p>
                    </div>
                    <div className="bg-green-50 border border-green-100 rounded-xl py-4 px-2 shadow-sm">
                        <p className="text-sm text-gray-500">GPA</p>
                        <p>{data?.gpa || "N/A"}</p>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-100 rounded-xl py-4 px-2 shadow-sm">
                        <p className="text-sm text-gray-500">Grade</p>
                        <p>{data?.grade || "N/A"}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white text-center rounded-xl border border-gray-300 shadow-sm">
            <p className="text-gray-600">Unknown storedRole: can't render dashboard</p>
        </div>
    );
};

export default Home;
