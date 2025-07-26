import { useState } from 'react'
import axios from 'axios';

const UpdatePassword = () => {
    const [updated, setupdated] = useState(false);
    const [iserror, setIserror] = useState(false)
    const [newPassword, setNewPassword] = useState('');
    const storedId = sessionStorage.getItem("userId");
    const storedRole = sessionStorage.getItem("role");

    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:3000/api/student/${storedId}/password`, {
                password: newPassword,
                role: storedRole
            })
            setNewPassword('');
            setupdated(true);
            setTimeout(() => {
                setupdated(false);
            }, 3000);
        }
        catch (error) {
            console.error('Failed to update password');
            setIserror(true);
            setTimeout(() => {
                setIserror(false);
            }, 3000);
        }
    }

    return (
        <div className="bg-white flex flex-col justify-center items-center shadow-md rounded-2xl p-6 max-w-4xl mx-auto mt-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-blue-700 mb-4 underline">Update Password</h3>
            <form className="space-y-4 max-w-[60%]">
                {updated && (
                    <div className="bg-green-100 text-green-700 p-4 rounded-lg shadow-sm">
                        <p>Password updated successfully!</p>
                    </div>
                )}
                {iserror && (
                    <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow-sm">
                        <p>Failed to update password, please try again</p>
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
    )
}

export default UpdatePassword
