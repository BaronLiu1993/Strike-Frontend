import React from 'react';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import AddBoxIcon from '@mui/icons-material/AddBox';

const Navbar = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <>
      <div className="flex flex-row bg-slate-100 justify-evenly items-center p-4 fixed bottom-0 w-[25rem]">
        <button
          className="flex items-center justify-center p-2"
          onClick={() => handleNavigation('/teacher-home')}
        >
          <HomeIcon />
        </button>
        <button
          className="flex items-center justify-center p-2"
          onClick={() => handleNavigation('/leaderboard')}
        >
          <LeaderboardIcon />
        </button>
        <button
          className="flex items-center justify-center p-2"
          onClick={() => handleNavigation('/add-course')}
        >
          <AddBoxIcon />
        </button>
      </div>
    </>
  );
};

export default Navbar;
