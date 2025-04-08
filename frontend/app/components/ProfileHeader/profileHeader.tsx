'use client';

import { useState } from 'react';
import MenuButton from '../../components/MenuButton/MenuButton';

interface ProfileHeaderProps {
  username: string;
  bio?: string;
  profilePic?: string;
  onEdit: () => void;
  onDelete: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ username, bio, profilePic, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    setShowMenu((prev) => !prev);
  };

  return (
    <div className="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
      {/* Profile Image and User Info */}
      <div className="flex items-center gap-4">
        <img
          src={profilePic || '/default-profile.png'}  // fallback if no profile pic exists
          alt="User Profile"
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h1 className="text-3xl font-bold text-white">{username}</h1>
          <p className="text-gray-400">{bio || 'No bio available.'}</p>
        </div>
      </div>

      {/* Menu Button and Dropdown */}
      <div className="relative">
        <MenuButton
          onClick={toggleMenu}
          buttonSize="p-2 rounded-full hover:bg-gray-700"
          iconSize={24}
        />
        {showMenu && (
          <div className="absolute right-0 mt-2 w-32 bg-gray-900 text-white rounded-lg shadow-lg">
            <ul>
              <li
                onClick={() => {
                  onEdit();
                  setShowMenu(false);
                }}
                className="p-2 rounded-lg hover:bg-gray-800 cursor-pointer"
              >
                Edit Profile
              </li>
              <li
                onClick={() => {
                  onDelete();
                  setShowMenu(false);
                }}
                className="p-2 rounded-lg hover:bg-gray-800 cursor-pointer"
              >
                Delete Profile
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
