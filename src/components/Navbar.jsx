import logo from '../assets/LMS_logo3.svg'

const Navbar = () => {
  return (
    <nav className='p-2 px-4 flex justify-between'>
      <img className='h-15' src={logo} alt="LMS Logo" />
      <div className='text-lg font-bold text-blue-800'>Welcome!</div>
        {/* <ul className='flex justify-center items-center gap-4 text-lg'>
          <li ><a className='hover:text-blue-800 hover:border-b-2 border-blue-800 animation-all' href="#">Admin</a></li>
          <li ><a className='hover:text-blue-800 hover:border-b-2 border-blue-800 animation-all' href="#">Teacher</a></li>
          <li ><a className='hover:text-blue-800 hover:border-b-2 border-blue-800 animation-all' href="#">Student</a></li>
        </ul> */}
    </nav>
  )
}

export default Navbar
