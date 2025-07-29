// Home.jsx
const Home = ({ data, stats }) => {
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
                    <p className="text-2xl font-bold mt-2 text-gray-800">{stats.students}</p>
                </div>

                <div className="bg-white border border-green-400 p-4 rounded-lg shadow-sm">
                    <h3 className="text-green-600 text-lg font-semibold">👨‍🏫 Total Teachers</h3>
                    <p className="text-2xl font-bold mt-2 text-gray-800">{stats.teachers}</p>
                </div>

                <div className="bg-white border border-yellow-400 p-4 rounded-lg shadow-sm">
                    <h3 className="text-yellow-600 text-lg font-semibold">🏫 Total Classes</h3>
                    <p className="text-2xl font-bold mt-2 text-gray-800">{stats.totalClasses}</p>
                </div>

                <div className="bg-white border border-red-400 p-4 rounded-lg shadow-sm">
                    <h3 className="text-red-600 text-lg font-semibold">🛠 System Status</h3>
                    <p className="text-2xl font-bold mt-2 text-green-600">{stats.systemStatus}</p>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
                    {/* Total Courses */}
                    <div className="bg-gradient-to-tr from-blue-100 to-blue-50 p-5 rounded-xl shadow border border-blue-200">
                        <p className="text-sm text-blue-800 font-medium">Total Courses</p>
                        <p className="text-3xl font-bold text-blue-700 mt-1">{data?.courses?.length || 0}</p>
                    </div>

                    {/* Top Performing Course */}
                    <div className="col-span-2 bg-gradient-to-tr from-yellow-100 to-yellow-50 p-5 rounded-xl shadow border border-yellow-200">
                        <p className="text-sm text-yellow-800 font-medium">Top Performing Course</p>
                        <p className="text-xl font-semibold text-yellow-700 mt-1">
                            {
                                Array.isArray(data?.courses) && data.courses.length
                                    ? data.courses.reduce((top, current) =>
                                        current.enrolled > top.enrolled ? current : top
                                    ).code
                                    : "N/A"
                            }
                        </p>
                    </div>
                </div>

                <div className="mt-8 overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
                    <table className="min-w-full bg-white text-sm text-left">
                        <thead className="bg-blue-50 text-blue-700 font-semibold">
                            <tr>
                                <th className="py-3 px-5">Course Code</th>
                                <th className="py-3 px-5">Students Enrolled</th>
                                <th className="py-3 px-5">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Array.isArray(data?.courses) && data.courses.length > 0
                                    ? data.courses.map((course, idx) => (
                                        <tr key={idx} className="border-t hover:bg-gray-50 transition">
                                            <td className="py-3 px-5 font-medium text-gray-800">{course.code}</td>
                                            <td className="py-3 px-5">{course.enrolled}</td>
                                            <td className="py-3 px-5">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                    ${course.status === "Active"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-yellow-100 text-yellow-700"}`}>
                                                    {course.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                    : (
                                        <tr>
                                            <td colSpan={4} className="text-center text-gray-400 py-6">
                                                No courses data available.
                                            </td>
                                        </tr>
                                    )
                            }
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
