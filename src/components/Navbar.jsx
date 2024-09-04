import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-500 p-4">
      <ul className="flex space-x-4 justify-center text-white">
        <li>
          <Link to="/" className="hover:underline">Home</Link>
        </li>
        <li>
          <Link to="/track-location" className="hover:underline">Track Location</Link>
        </li>
        <li>
          <Link to="/about" className="hover:underline">About</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
