'use client';

import { useState } from 'react';
import { useAuth } from '../../components/Providers/AuthContext/AuthContext';
import ProfileHeader from '../../components/ProfileHeader/profileHeader';
import EditProfilePopup from '../../components/PopUps/EditProfilePopUp';
import DeleteProfilePopup from '../../components/PopUps/deleteProfilePopUp';

const Profile = () => {
  const { user } = useAuth();
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  if (!user) return <div>Loading user profile...</div>;

  const handleEditSave = (data: { username: string; bio: string }) => {
    console.log("Updated data:", data);
    setShowEditPopup(false);
    // Optionally, update the backend via a PUT/PATCH request here and update the AuthContext accordingly.
  };

  const handleDeleteConfirm = () => {
    console.log("Profile deleted");
    setShowDeletePopup(false);
    // Optionally, call your backend endpoint to delete the profile.
  };

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white">
      <ProfileHeader
        username={`${user.firstName} ${user.lastName}`}
        profilePic={user.profilePic}
        bio={user.bio}
        onEdit={() => setShowEditPopup(true)}
        onDelete={() => setShowDeletePopup(true)}
      />

      {showEditPopup && (
        <EditProfilePopup
          user={{
            username: `${user.firstName} ${user.lastName}`,
            bio: user.bio,
            profilePic: user.profilePic,
          }}
          onClose={() => setShowEditPopup(false)}
          onSave={handleEditSave}
        />
      )}

      {showDeletePopup && (
        <DeleteProfilePopup
          onCancel={() => setShowDeletePopup(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
};

export default Profile;
