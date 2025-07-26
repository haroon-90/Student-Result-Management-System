import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';

const Logout = () => {
    const { setRole, setUserId, setSidebaritem } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        setRole("");
        setUserId("");
        setSidebaritem("");
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("role");
        sessionStorage.removeItem("sidebaritem");
        navigate('/');
    };

    return (
        <button
            onClick={handleLogout}
            className="m-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 transition text-white font-semibold rounded-full shadow-md"
        >
            Log Out
        </button>
    )
}

export default Logout
