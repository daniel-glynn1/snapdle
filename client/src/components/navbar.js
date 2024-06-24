import Link from 'next/link';
import { IoSettingsSharp as SettingsIcon} from "react-icons/io5";
import { IoMdHelpCircleOutline as HelpIcon } from "react-icons/io";

// import help from '../assets/help.png';
// import settings from '../assets/settings.png';

const Navbar = () => {
  return (
    <nav className="p-2">
      <ul className="flex justify-between">
        <li>
          <Link href="/rules">
            <HelpIcon className='mt-1 w-6 h-6'/>
          </Link>
        </li>
        <li>
          <Link href="/">
            <div className='flex flex-row text-3xl font-bold'>
              <p>SNAP</p> 
              <p className='text-purple-600'>DLE</p>
            </div>
          </Link>
          
        </li>
        <li>
          <Link href="/settings">
            <SettingsIcon className='mt-1 w-6 h-6' />
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
