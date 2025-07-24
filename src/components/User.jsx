import { useContext } from 'react'
import { UserContext } from '../context/UserContext';
import Navbar from './Navbar'
import Footer from './Footer'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom';
// import StudentDashboard from './Dashboard/StudentDashboard'

function User() {
    const { role } = useContext(UserContext);

    return (
        <>
            <div className="w-full min-h-screen flex flex-col">
                <div className="h-20 bg-blue-50 border-b border-gray-300">
                    <Navbar />
                </div>
                <div className="flex flex-1"
                >
                    <div className="md:w-1/6 block bg-gray-100 border-r border-gray-300">
                        <Sidebar />
                    </div>
                    <div className="flex-1 flex justify-center">
                        <Outlet/>
                    </div>
                </div>
                <div className="bg-blue-50 border-t border-gray-300">
                    <Footer />
                </div>
            </div>

        </>
    )
}

export default User