'use client';

import { useEffect, useRef, useState } from 'react';
import MenuButton from '../../components/MenuButton/MenuButton';
import { ProfileHeaderProps } from '../../Types';

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  id: string, //yasmine added this
  firstName,
  lastName,
  bio, 
  profilePic, 
  onEdit, 
  onDelete,
  onChangePassword 
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu((prev) => !prev);
  };

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 relative">
          {/* Skeleton loader while image is not loaded */}
          {!imageLoaded && (
            <div className="w-full h-full rounded-full bg-gray-700 animate-pulse absolute top-0 left-0 z-0" />
          )}

          {/* Only render <img> if profilePic is available */}
          {profilePic && (
            <img
              src={profilePic}
              alt="User Profile"
              className={`w-20 h-20 rounded-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)} // hide skeleton if image fails
            />
          )}
        </div>
        <div>
        <h1 className="text-3xl font-bold text-white">{`${firstName ?? ''} ${lastName ?? ''}`.trim()}</h1>
        <p className="text-gray-400">{bio || 'No bio available.'}</p>
        </div>
      </div>

      <div className="relative" ref={menuRef}>
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
              <li
                onClick={() => {
                  onChangePassword?.(); // ✅ Only call if provided
                  setShowMenu(false);
                }}
                className="p-2 rounded-lg hover:bg-gray-800 cursor-pointer"
              >
                Change Password
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
