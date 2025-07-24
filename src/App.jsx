import './App.css'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import Login from './components/Login';
import User from './components/User';
import StudentProfile from './components/Dashboard/StudentDashboard';
import StudentDashboard2 from './components/Dashboard/StudentDashboard2';

import TeacherDashboard from './components/Dashboard/TeacherDashboard';
import TeacherDashboard2 from './components/Dashboard/TeacherDashboard2';

import AdminDashboard from './components/Dashboard/AdminDashboard'
import AdminDashboard2 from './components/Dashboard/AdminDashboard2';

import bg from './assets/bg.png'

function App() {
  const Layout = () => {
    return (
      <div
        className="min-h-screen flex justify-center items-center text-[13px]"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <Outlet />
      </div>
    )
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        { index: true, element: <Login /> },
        {
          path: 'user',
          element: <User />,
          children: [
            { path: 'teacher', element: <TeacherDashboard2 /> },
            { path: 'student', element: <StudentDashboard2 /> },
            { path: 'admin', element: <AdminDashboard2 /> }
          ]
        }
      ]
    }
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
