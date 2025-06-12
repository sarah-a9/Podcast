"use client";
import { use, useEffect, useState } from "react";
import PodcastCard from "../PodcastCard/PodcastCard";
import CategoryButton from "../CategoryButton/CategoryButton";
import CreatorCard from "../CreatorCard/CreatorCard";
import { User } from "@/app/Types";
import { useRouter } from "next/navigation";
import SeeMoreButton from "../SeeMoreButton/SeeMoreButton";
import { useAuth } from "../Providers/AuthContext/AuthContext";
import AdminDashboard from "../../DashboardAdminPage/page";

const MainContent = () => {
  const [podcasts, setPodcasts] = useState<
    {
      creator: any;
      _id: string;
      podcastName: string;
      podcastDescription: string;
      podcastImage: string;
    }[]
  >([]);
  const [categories, setCategories] = useState<
    { _id: string; categoryName: string }[]
  >([]);
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter(); // Initialize useRouter
const {user}=useAuth();
const currentUserId = user?._id || ""; // Get the current user's ID, default to empty string if not available
  
useEffect(() => {
    console.log("Fetching podcasts...");

    
    // Fetch podcasts
    fetch("http://localhost:3000/podcast")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (Array.isArray(data)) {
          setPodcasts(data);
        } else {
          console.error("Received data is not an array:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching podcasts:", error);
      });

    // Fetch categories
    fetch("http://localhost:3000/category")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error("Received categories is not an array:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });

    // Fetch creators aka users
    fetch("http://localhost:3000/user")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error("Received Users is not an array:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching users", error);
      });
  }, []);

  // Handler to navigate to the See More page
  const handleSeeMore = (type: string) => {
    router.push(`/All${type}`); // Redirect to /all/{type} page
  };

   if (user && user.role === 0) {
    return <AdminDashboard />;
  }

  return (
    <div className="scrollable-container scrollbar-hide bg-gray-900 rounded-lg pl-6 ">
<h2 className="text-2xl sm:text-3xl font-semibold mt-4">Suggestions</h2>

<div className="container max-w-full">
  <div className="flex justify-end mb-4">
    <SeeMoreButton
      label="See More Podcasts"
      onClick={() => handleSeeMore("Podcasts")}
    />
  </div>

  <div className="overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-hide w-full">
    <div className="flex space-x-12 flex-nowrap">
      {podcasts.length > 0 ? (
        podcasts.map((podcast) => (
          <PodcastCard
            key={podcast._id}
            podcastDescription={podcast.podcastDescription}
            podcastName={podcast.podcastName}
            creator={podcast.creator}
            podcastImage={`http://localhost:3000/uploads/podcasts/${podcast.podcastImage}`}
            id={podcast._id}
          />
        ))
      ) : (
        <p>No podcasts available.</p>
      )}
    </div>
  </div>
</div>


      <h2 className="text-2xl sm:text-3xl font-semibold pb-5 pt-12">
        Categories
      </h2>
      <div className="category-list">
        <div className="w-full overflow-x-auto whitespace-nowrap scrollbar-hide">
          <div className="inline-flex space-x-4">
            {categories.length > 0 ? (
              categories.map((category) => (
                <CategoryButton
                  key={category._id}
                  categoryName={category.categoryName}
                  _id={category._id}
                />
              ))
            ) : (
              <p>No categories available.</p>
            )}
          </div>
        </div>
        {/* <SeeMoreButton
          label="See More Categories"
          onClick={() => handleSeeMore("Categories")}
        /> */}
      </div>
<h2 className="text-2xl sm:text-3xl font-semibold pb-3 pt-12">
  Creators
</h2>

<div className="creator-list">
  {/* Align "See More Creators" button to the right */}
  <div className="flex justify-end mb-4">
    <SeeMoreButton
      label="See More Creators"
      onClick={() => handleSeeMore("Creators")}
    />
  </div>
<div className="w-full overflow-x-auto scrollbar-hide [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
  <div className="flex space-x-9 flex-nowrap">
    {users.length > 0 ? (
      users
        .filter((user) => user.role !== 0 && user._id !== currentUserId)
        .map((user) => (
          <CreatorCard
            key={user._id}
            firstName={user.firstName}
            lastName={user.lastName}
            profilePic={user.profilePic}
            _id={user._id}
            bio={user.bio}
            email={user.email}
            password={user.password}
            favoritePodcasts={user.favoritePodcasts}
            likedEpisodes={user.likedEpisodes}
            playlists={user.playlists}
            role={1}
            createdAt={""}
            updatedAt={""}
          />
        ))
    ) : (
      <p>No creators available.</p>
    )}
  </div>
</div>
</div>

    </div>
  );
};

export default MainContent;
