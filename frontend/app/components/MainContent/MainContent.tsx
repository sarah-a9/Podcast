'use client';
import { useEffect, useState } from 'react';
import PodcastCard from '../PodcastCard/PodcastCard';
import CategoryButton from '../CategoryButton/CategoryButton';

const MainContent = () => {
  const [podcasts, setPodcasts] = useState<{
    creator: any; _id: string; podcastName: string; podcastDescription: string; podcastImage: string 
}[]>([]);
  const [categories, setCategories] = useState<{ _id: string; categoryName: string }[]>([]);

  useEffect(() => {
    console.log('Fetching podcasts...');
    fetch('http://localhost:3000/podcast')  // Make sure the endpoint is correct
      .then((res) => res.json())
      .then((data) => {
        console.log(data); // Log to inspect the structure
        // Check if the data is an array of podcasts
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
    fetch('http://localhost:3000/category')  // Assuming this is correct endpoint for categories
      .then((res) => res.json())
      .then((data) => {
        console.log(data); // Log to check categories data
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error('Received categories is not an array:', data);
        }
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  return (
    <div>
      <h2 className='text-4xl pb-3'>Suggestions</h2>
      <div className="container max-w-full overflow-hidden">
      <div className="podcast-list overflow-x-auto overflow-y-hidden flex space-x-4 whitespace-nowrap flex-nowrap scrollbar-hide w-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {podcasts.length > 0 ? (
            podcasts.map((podcast) => (
              <PodcastCard
                key={podcast._id}
                podcastDescription={podcast.podcastDescription}
                podcastName={podcast.podcastName}
                creator={podcast.creator}
                podcastImage={podcast.podcastImage} id={podcast._id}              />
            ))
          ) : (
            <p>No podcasts available.</p>
          )}
        </div>
      </div>

      <h2 className='text-4xl pb-3 pt-5'>Categories</h2>

      <div className="category-list">
      <div className="container  w-full">
        <div className="podcast-list overflow-x-auto flex space-x-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

        {categories.length > 0 ? (
          categories.map((category) => (
            <CategoryButton key={category._id} categoryName={category.categoryName} />
          ))
        ) : (
          <p>No categories available.</p>
        )}
      </div>
      </div>
      </div>
    </div>
  );
};

export default MainContent;
