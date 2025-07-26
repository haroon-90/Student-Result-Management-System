import { FaUser, FaEnvelope, FaUserShield, FaChalkboardTeacher, FaIdBadge, FaHashtag, FaBookOpen } from 'react-icons/fa'

const Profile = ({ data }) => {
    const type = sessionStorage.getItem('role')
    console.log("id is set to", data.ID);

    return (
        <div className="max-w-4xl mx-auto mt-12 px-4">
            <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-blue-700 underline tracking-wide">
                    Profile
                </h2>
                <p className="text-gray-500 mt-2 text-sm">Your personal and academic details</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-base text-gray-800 font-medium">
                {type === 'student' && (
                    <>
                        <ProfileItem label="Name" value={data.name} icon={<FaUser />} />
                        <ProfileItem label="Roll No" value={data.rollNo} icon={<FaHashtag />} />
                        <ProfileItem label="Class" value={data.class} icon={<FaBookOpen />} />
                        <ProfileItem label="Email" value={data.email} icon={<FaEnvelope />} />
                    </>
                )}

                {type === 'teacher' && (
                    <>
                        <ProfileItem label="Name" value={data.name} icon={<FaUser />} />
                        <ProfileItem label="Teacher ID" value={data.ID} icon={<FaIdBadge />} />
                        <ProfileItem label="Email" value={data.email} icon={<FaEnvelope />} />
                        <ProfileItem
                            label="Courses"
                            icon={<FaChalkboardTeacher />}
                            value={
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {data.courses &&
                                        Object.keys(data.courses).map((courseCode, i) => (
                                            <span
                                                key={i}
                                                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold shadow-sm"
                                            >
                                                {courseCode}
                                            </span>
                                        ))}
                                </div>
                            }
                        />
                    </>
                )}

                {type === 'admin' && (
                    <>
                        <ProfileItem label="Name" value={data.name} icon={<FaUser />} />
                        <ProfileItem label="Admin ID" value={data.ID} icon={<FaIdBadge />} />
                        <ProfileItem label="Email" value={data.email} icon={<FaEnvelope />} />
                        <ProfileItem label="Role" value="Super Admin" icon={<FaUserShield />} />
                    </>
                )}
            </div>
        </div>
    )
}

const ProfileItem = ({ label, value, icon }) => (
  <div className="flex items-center gap-4 p-5 rounded-xl border border-gray-200 shadow-sm">
    
    <div className="text-blue-600 text-2xl bg-blue-100 p-3 rounded-full shadow-inner">
      {icon}
    </div>

    <div className="flex flex-col justify-center items-start w-full">
      <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">{label}</p>
      
      <p className=" font-semibold text-gray-800 mt-1">
        {value || <span className="text-gray-400 italic">N/A</span>}
      </p>
    </div>
  </div>
);


export default Profile
