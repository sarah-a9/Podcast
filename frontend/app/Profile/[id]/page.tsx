'use client';

import { useState, useEffect } from "react";
import { useAuth } from "../../components/Providers/AuthContext/AuthContext";
import ProfileHeader from "../../components/ProfileHeader/profileHeader";
import EditProfilePopup from "../../components/PopUps/EditProfilePopUp";
import DeleteProfilePopup from "../../components/PopUps/deleteProfilePopUp";
import CreatePodcastButton from "../../components/CreatePodcastButton/CreatePodcastButton";
import PodcastCard from "../../components/PodcastCard/PodcastCard";
import { useRouter } from "next/navigation";
import ChangePasswordPopup from "../../components/PopUps/ChangePasswordPopUp";

const Profile = () => {
  const { user, setUser } = useAuth();
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showChangePasswordPopup, setShowChangePasswordPopup] = useState(false);
  const [myPodcasts, setMyPodcasts] = useState<any[]>([]);
  const router = useRouter();
  
  useEffect(() => {
    fetchMyPodcasts();
  }, [user]);
  
  // Fetch podcasts created by this user.
  const fetchMyPodcasts = async () => {
    try {
      const res = await fetch("http://localhost:3000/podcast");
      if (!res.ok) throw new Error("Could not fetch podcasts");
      const data = await res.json();
      // Filter podcasts by matching the creator's id with the logged-in user's id
      const filtered = data.filter(
        (podcast: any) => podcast.creator && user && podcast.creator._id === user._id
      );
      setMyPodcasts(filtered);
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) return <div>Loading user profile...</div>;

  

  const handleEditSave = async (data: {
    firstName: string;
    lastName: string;
    bio: string;
    profilePic: string;
  }) => {
    setShowEditPopup(false);

    try {
      const res = await fetch("http://localhost:3000/user/updateProfile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Update failed");
      }

      const updatedProfile = await res.json();
      setUser(updatedProfile);
      console.log("Profile successfully updated!", updatedProfile);
    } catch (error: any) {
      console.error("Update failed:", error.message);
      alert(`Profile update failed: ${error.message}`);
    }
  };

  const handleDeleteConfirm = async () => {
    setShowDeletePopup(false);
    try {
      const res = await fetch("http://localhost:3000/user/profile", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Delete failed");
      }
  
      const result = await res.json();
      console.log("Profile successfully deleted.", result);
  
      // CLEAR everything
      localStorage.removeItem("token");        // clear the token
      setUser(null);                           // clear the user context
      console.log("User and token cleared");
  
      router.push("/");                        // redirect to homepage
    } catch (error: any) {
      console.error("Delete failed:", error.message);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white">
      <ProfileHeader
        firstName={user.firstName}
        lastName={user.lastName}
        profilePic={user.profilePic}
        bio={user.bio}
        onEdit={() => setShowEditPopup(true)}
        onDelete={() => setShowDeletePopup(true)}
        onChangePassword={() => setShowChangePasswordPopup(true)}
      />

      {/* Create Podcast Button placed right after the profile header */}
      <CreatePodcastButton />

      {/* My Podcasts Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">My Podcasts</h2>
        {myPodcasts.length > 0 ? (
          <div className="flex overflow-x-auto gap-4">
            {myPodcasts.map((podcast) => (
              <PodcastCard
                key={podcast._id}
                id={podcast._id}
                podcastName={podcast.podcastName}
                podcastDescription={podcast.podcastDescription}
                podcastImage={podcast.podcastImage}
                creator={podcast.creator}
              />
            ))}
          </div>
        ) : (
          <p>No podcasts to show yet...</p>
        )}
      </div>

      {showEditPopup && (
        <EditProfilePopup
          user={{
            firstName: user.firstName,
            lastName: user.lastName,
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

      {showChangePasswordPopup && (
        <ChangePasswordPopup onClose={() => setShowChangePasswordPopup(false)} />
      )}

    </div>
  );
};

export default Profile;
