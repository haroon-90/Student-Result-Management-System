import { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import logo from '../assets/LMS_logo3.svg'
import { useNavigate  } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const { setUserId, setRole } = useContext(UserContext);
    const [error, setError] = useState('');
    const [user, setUser] = useState({
        rollNo: '',
        password: ''
    });

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`http://localhost:3000/api/login`, user);
            const role = res.data.role;
            const Id = res.data.Id;
            setRole(role);
            console.log("role is set to", role);
            setUserId(Id);
            console.log("id is set to",Id);

            sessionStorage.setItem("userId", Id);
            sessionStorage.setItem("role", role);

            if(Id && role){
                navigate(`/user/${role}`);
            }
        } catch (err) {
            console.log(err)
            setError("Invalid credentials. Please try again.");
        }
        console.log("Submitted!", user);
        setUser({ rollNo: '', password: '' })
    };

    return (
        <div className="p-4 h-full flex flex-col justify-center items-center">
            <div className='sm:min-w-100 min-h-90 flex flex-col justify-between bg-white border border-gray-300 rounded-lg'>
                <div className='flex justify-around items-center gap-4 border-b p-4 py-8 rounded-t-lg bg-blue-50 border-gray-300'>
                    <img className='h-18' src={logo} alt="LMS logo" />
                    <div className='text-blue-800 text-xl font-bold flex flex-col'>
                        <span>Learning</span>
                        <span>Management System</span>
                    </div>
                </div>

                {error && <div className="bg-red-500/20 p-4 mx-4 my-1.5 rounded text-red-500 text-sm border border-red-500">{error}</div>}

                <div className='pl-4 text-[12px] text-red-800/80 font-bold'>
                    <h2>Please use LMS credentials for login.</h2>
                    <h2>For password reset please visit HOD office.</h2>
                </div>

                <form onSubmit={handleSubmit} className="p-4 flex flex-col justify-center items-center gap-2 space-y-">
                    <div className='w-full'>
                        {/* <label className="ml-2 mb-2">Username</label> */}
                        <input
                            type="text"
                            name="rollNo"
                            value={user.rollNo}
                            placeholder='Roll No'
                            required
                            className="text-sm border border-gray-300 rounded-lg px-2 py-1 w-full focus:border-blue-500 focus:shadow-[0_0_5px_0.5px_rgba(59,130,246,0.5)] focus:outline-none"
                            onChange={handleChange}
                        />
                    </div>
                    <div className='w-full'>
                        {/* <label className="ml-2 mb-2">Password</label> */}
                        <input
                            type="password"
                            name="password"
                            value={user.password}
                            placeholder='Password'
                            required
                            className="text-sm border border-gray-300 rounded-lg px-2 py-1 w-full focus:border-blue-500 focus:shadow-[0_0_5px_0.5px_rgba(59,130,246,0.5)] focus:outline-none"
                            onChange={handleChange}
                        />
                    </div>
                    <input
                        type="submit"
                        value="Login"
                        className="bg-blue-500 text-white mt-2 w-full py-1 rounded-lg hover:bg-blue-600 transition duration-300 cursor-pointer"
                    />
                </form>
            </div>
        </div>
    );
};

export default Login;

