import { useState, useContext } from 'react'
import { ChevronDown, ChevronLeft, Menu, SearchIcon, X } from 'lucide-react'
import { UserContext } from '../context/UserContext'
import { BarChart3 } from 'lucide-react'

const listItemForRole = {
  student: [
    { id: 1, name: 'Home' },
    { id: 2, name: 'Profile' },
    { id: 3, name: 'Courses' },
    { id: 4, name: 'Grades' },
    { id: 5, name: 'Update password' },
  ],
  teacher: [
    { id: 1, name: 'Home' },
    { id: 2, name: 'Profile' },
    { id: 3, name: 'Students' },
    { id: 4, name: 'Courses' },
    { id: 5, name: 'Grades' },
    { id: 6, name: 'Update password' },
  ],
  admin: [
    { id: 1, name: 'Home' },
    { id: 2, name: 'Profile' },
    { id: 3, name: 'Add Student' },
    { id: 4, name: 'Courses' },
    { id: 5, name: 'Grades' },
    { id: 6, name: 'Update password' },

  ],
};

const Sidebar = () => {
  const { role, setSidebaritem, sidebaritem } = useContext(UserContext);
  const [showList, setShowList] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  const listItems = listItemForRole[role] || [];
  const filteredList = listItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleDropdown = () => setShowList(!showList);
  const toggleMobileSidebar = () => setMobileOpen(!mobileOpen);

  return (
    <>
      {/* Mobile Hamburger */}
      <div className="sm:hidden flex justify-end px-4 py-3">
        <button onClick={toggleMobileSidebar}>
          {mobileOpen ? <X className="w-6 h-6 text-gray-800" /> : <Menu className="w-6 h-6 text-gray-800" />}
        </button>
      </div>

      {/* Sidebar - visible always on desktop, toggle on mobile */}
      <div className={`sm:block ${mobileOpen ? 'block' : 'hidden'}`}>
        <div className="w-full max-w-md mx-auto px-3">
          {/* Search input */}
          <div className="relative border-b border-gray-300 mt-2">
            <input
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full my-2 px-3 py-1 pr-10 rounded-md border border-gray-400 focus:border-blue-500 focus:shadow-[0_0_5px_0.5px_rgba(59,130,246,0.5)] focus:outline-none"
              type="text"
              placeholder="Search"
            />
            <SearchIcon className="absolute top-3.5 right-2 h-4 text-gray-700" />
          </div>

          {/* Dropdown toggle */}
          <div
            onClick={toggleDropdown}
            className="px-3 py-2 flex items-center justify-between text-blue-800/80  bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200 transition-all"
          >
            <span className="font-medium flex justify-start items-center">
              <BarChart3 className='h-5 w-5 mr-2' />
              {role}</span>
            {showList ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </div>

          {/* Dropdown list */}
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${showList ? 'max-h-60 mt-2' : 'max-h-0'}`}
          >
            <ul className="rounded-md ">
              {filteredList.map((item) => (
                <li
                  key={item.id}
                  className={`${item.name === sidebaritem ? 'bg-blue-100' : ''
                    } border-b last:border-b-0 border-gray-300 px-4 py-2 text-gray-800 hover:bg-blue-50 transition-all`}
                >
                  <button
                    onClick={() => setSidebaritem(item.name)}
                    className="w-full text-left"
                  >
                    {item.id} - {item.name}
                  </button>
                </li>
              ))}
              {filteredList.length === 0 && (
                <li className="border-b border-gray-300 px-4 py-2 text-gray-500 text-center">
                  No results found
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
