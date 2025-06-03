"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../components/Providers/AuthContext/AuthContext";
import ProfileHeader from "../../components/ProfileHeader/profileHeader";
import EditProfilePopup from "../../components/PopUps/EditProfilePopUp";
import DeleteProfilePopup from "../../components/PopUps/deleteProfilePopUp";
import CreatePodcastButton from "../../components/CreatePodcastButton/CreatePodcastButton";
import PodcastCard from "../../components/PodcastCard/PodcastCard";
import { useRouter } from "next/navigation";
import ChangePasswordPopup from "../../components/PopUps/ChangePasswordPopUp";
import CreatorCard from "@/app/components/CreatorCard/CreatorCard";

const Profile = () => {
  const { user, setUser,token } = useAuth();
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showChangePasswordPopup, setShowChangePasswordPopup] = useState(false);
  const [myPodcasts, setMyPodcasts] = useState<any[]>([]);
  const router = useRouter();
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [followingCreators, setFollowingCreators] = useState<any[]>([]);

  useEffect(() => {
    fetchMyPodcasts();
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchFollowCounts();
    }
  }, [user]);

  const fetchFollowCounts = async () => {
    if (!user) return;
    try {
      const [followersRes, followingRes] = await Promise.all([
        fetch(`http://localhost:3000/user/${user._id}/followers-count`),
        fetch(`http://localhost:3000/user/${user._id}/following-count`),
      ]);

      if (!followersRes.ok || !followingRes.ok) {
        throw new Error("Could not fetch follow counts");
      }

      const followersData = await followersRes.json();
      const followingData = await followingRes.json();

      setFollowersCount(followersData.followers);
      setFollowingCount(followingData.following);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch podcasts created by this user.
  const fetchMyPodcasts = async () => {
    try {
      const res = await fetch("http://localhost:3000/podcast");
      if (!res.ok) throw new Error("Could not fetch podcasts");
      const data = await res.json();
      // Filter podcasts by matching the creator's id with the logged-in user's id
      const filtered = data.filter(
        (podcast: any) =>
          podcast.creator && user && podcast.creator._id === user._id
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

    const { _id, ...cleanData } = data as any;

    try {
      const res = await fetch("http://localhost:3000/user/updateProfile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(cleanData),
      });

      if (!res.ok) {
        console.log("data", res.status);
        const errData = await res.json();
        console.log("data", cleanData);
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
  console.log("JWT Token:", localStorage.getItem("token"));

  // const handleEditSave = async (data: {
  //   firstName: string;
  //   lastName: string;
  //   bio: string;
  //   profilePic: string;
  // }) => {
  //   setShowEditPopup(false);

  //   try {
  //     const res = await fetch("http://localhost:3000/user/updateProfile", {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //       body: JSON.stringify(data),
  //     });

  //     if (!res.ok) {
  //       const errData = await res.json();
  //       console.log("data", data);
  //       throw new Error(errData.message || "Update failed");
  //     }

  //     const updatedProfile = await res.json();
  //     setUser(updatedProfile);
  //     console.log("Profile successfully updated!", updatedProfile);
  //   } catch (error: any) {
  //     console.error("Update failed:", error.message);
  //     alert(`Profile update failed: ${error.message}`);
  //   }
  // };

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
      localStorage.removeItem("token"); // clear the token
      setUser(null); // clear the user context
      console.log("User and token cleared");

      router.push("/"); // redirect to homepage
    } catch (error: any) {
      console.error("Delete failed:", error.message);
    }
  };
  // console.log("profile pic",`http://localhost:3000/uploads/podcasts/${Podcast.podcastImage}`);
  console.log("user", user._id);

  useEffect(() => {
    if (user) {
      fetchFollowingCreators();
    }
  }, [user]);

  const fetchFollowingCreators = async () => {
    try {
      const res = await fetch(
  `http://localhost:3000/user/${user._id}/followingList`,
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);

      if (!res.ok) throw new Error("Could not fetch following creators");
      const data = await res.json();
      setFollowingCreators(data);
    } catch (error) {
      console.error(error);
    }
  };
  console.log("Following Creators:", followingCreators);

  return (
    <div className="p-6 h-screen bg-gray-900 text-white rounded-lg  scrollable-container scrollbar-hide">
      <ProfileHeader
        // id={user._id}
        firstName={user.firstName}
        lastName={user.lastName}
        profilePic={user.profilePic}
        bio={user.bio}
        followers={followersCount}
        following={followingCount}
        onEdit={() => setShowEditPopup(true)}
        onDelete={() => setShowDeletePopup(true)}
        onChangePassword={() => setShowChangePasswordPopup(true)}
      />

      <CreatePodcastButton />

      {/* My Podcasts Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">My Podcasts</h2>
        {myPodcasts.length > 0 ? (
          <div className="flex overflow-x-auto gap-4 scrollbar-hide">
            {myPodcasts.map((podcast) => (
              <PodcastCard
                key={podcast._id}
                id={podcast._id}
                podcastName={podcast.podcastName}
                podcastDescription={podcast.podcastDescription}
                podcastImage={`http://localhost:3000/uploads/podcasts/${podcast.podcastImage}`} // Concatenate the image path with the server URL
                creator={podcast.creator}
              />
            ))}
          </div>
        ) : (
          <p>No podcasts to show yet...</p>
        )}
      </div>
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Following Creators</h2>
        {followingCreators.length > 0 ? (
          <div className="flex overflow-x-auto gap-4 scrollbar-hide">
            {followingCreators.map((creator) => (
             <CreatorCard
              _id={creator._id} 
              role={1} 
              firstName={creator.firstName} 
              lastName={creator.lastName} 
              bio={creator.bio} 
              email={creator.email} 
              password={""} 
              profilePic={creator.profilePic} 
              favoritePodcasts={[]} 
              likedEpisodes={[]} 
              playlists={[]} 
              createdAt={""} 
              updatedAt={""}/>
            ))}
          </div>
        ) : (
          <p>You are not following anyone yet...</p>
        )}
      </div>

      {showEditPopup && (
        <EditProfilePopup
          user={{
            //_id:user._id,
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
        <ChangePasswordPopup
          onClose={() => setShowChangePasswordPopup(false)}
        />
      )}
    </div>
  );
};

export default Profile;
