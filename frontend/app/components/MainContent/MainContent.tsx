'use client';
import { use, useEffect, useState } from 'react';
import PodcastCard from '../PodcastCard/PodcastCard';
import CategoryButton from '../CategoryButton/CategoryButton';
import CreatorCard from '../CreatorCard/CreatorCard';
import { User } from '@/app/Types';
import { useRouter } from 'next/navigation';
import SeeMoreButton from '../SeeMoreButton/SeeMoreButton';

const MainContent = () => {
  const [podcasts, setPodcasts] = useState<{
    creator: any; _id: string; podcastName: string; podcastDescription: string; podcastImage: string
  }[]>([]);
  const [categories, setCategories] = useState<{ _id: string; categoryName: string }[]>([]);
  const [users , setUsers]= useState<User[]>([]);
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    console.log('Fetching podcasts...');
    
    // Fetch podcasts
    fetch('http://localhost:3000/podcast')
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (Array.isArray(data)) {
          setPodcasts(data);
        } else {
          console.error('Received data is not an array:', data);
        }
      })
      .catch((error) => {
        console.error('Error fetching podcasts:', error);
      });

    // Fetch categories
    fetch('http://localhost:3000/category')
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error('Received categories is not an array:', data);
        }
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });

    // Fetch creators aka users
    fetch('http://localhost:3000/user')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error('Received Users is not an array:', data);
        }
      })
      .catch((error) => {
        console.error('Error fetching users', error);
      });
  }, []);

  // Handler to navigate to the See More page
  const handleSeeMore = (type: string) => {
    router.push(`/All${type}`); // Redirect to /all/{type} page
  };

  return (
    <div className="scrollable-container scrollbar-hide bg-gray-900 rounded-lg pl-6">
      <h2 className="text-2xl sm:text-3xl font-semibold mt-4 ">Suggestions</h2>
      <div className="container max-w-full overflow-hidden">
        <div className="flex justify-end mb-4">
          <SeeMoreButton label="See More Podcasts" onClick={() => handleSeeMore('Podcasts')} />
        </div>
        <div className="podcast-list overflow-x-auto overflow-y-hidden flex space-x-12 whitespace-nowrap flex-nowrap scrollbar-hide w-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {podcasts.length > 0 ? (
            podcasts.slice(0, 6).map((podcast) => (
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

      <h2 className="text-2xl sm:text-3xl font-semibold pb-5 pt-12">Categories</h2>
      <div className="category-list">
        <div className="container w-full">
          <div className="podcast-list overflow-x-auto flex space-x-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.length > 0 ? (
              categories.slice(0, 6).map((category) => (
                <CategoryButton key={category._id} categoryName={category.categoryName} _id={category._id} />
              ))
            ) : (
              <p>No categories available.</p>
            )}
          </div>
        </div>
        <SeeMoreButton label="See More Categories" onClick={() => handleSeeMore('Categories')} />
      </div>

      <h2 className="text-2xl sm:text-3xl font-semibold pb-3 pt-12">Creators</h2>
      <div className="creator-list">
        {/* Align "See More Creators" button to the right above the creator list */}
        <div className="flex justify-end mb-4">
          <SeeMoreButton label="See More Creators" onClick={() => handleSeeMore('Creators')} />
        </div>
        <div className="container w-full">
          <div className="overflow-x-auto flex space-x-8 scrollbar-hide [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {users.length > 0 ? (
              users.map((user) => (
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
                  playlists={user.playlists} role={0} createdAt={''} updatedAt={''}                />
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
