'use client';
import { use, useEffect, useState } from 'react';
import PodcastCard from '../PodcastCard/PodcastCard';
import CategoryButton from '../CategoryButton/CategoryButton';
import CreatorCard from '../CreatorCard/CreatorCard';

const MainContent = () => {
  const [podcasts, setPodcasts] = useState<{
    creator: any; _id: string; podcastName: string; podcastDescription: string; podcastImage: string 
}[]>([]);
  const [categories, setCategories] = useState<{ _id: string; categoryName: string }[]>([]);
  const [users , setUsers]= useState<{_id:string , firstName:string , lastName:string , profilePic:string}[]>([]);
  useEffect(() => {
    console.log('Fetching podcasts...');


    //fetch podcasts
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




      //fetch creators aka users
      fetch('http://localhost:3000/user')
      .then((res)=>res.json())
      .then((data)=>{
        if (Array.isArray(data)){
          setUsers(data);
        }else{
          console.error('Received Users is not an array :', data);
        }
      })
      .catch((error)=>{
        console.error('Error fetching users', error);
      })
  }, []);

  return (
    <div className='scrollable-container scrollbar-hide '>
      <h2 className='text-2xl sm:text-3xl font-semibold pb-5 '>Suggestions</h2>
      <div className="container max-w-full overflow-hidden ">
      <div className="podcast-list overflow-x-auto overflow-y-hidden flex space-x-4 whitespace-nowrap flex-nowrap scrollbar-hide w-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden  ">
     
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

      <h2 className='text-2xl sm:text-3xl font-semibold pb-5 pt-12'>Categories</h2>

      <div className="category-list">
      <div className="container  w-full">
        <div className="podcast-list overflow-x-auto flex space-x-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

        {categories.length > 0 ? (
          categories.map((category) => (
            <CategoryButton key={category._id} categoryName={category.categoryName} _id={category._id} />
          ))
        ) : (
          <p>No categories available.</p>
        )}
      </div>
      </div>
      </div>

      <h2 className="text-2xl sm:text-3xl font-semibold pb-3 pt-12">Creators</h2>
      <div className="creator-list">
        <div className="container w-full">
          <div className="overflow-x-auto flex space-x-8">
            {users.length > 0 ? (
              users.map((users) => (
                <CreatorCard
                  key={users._id}
                  firstName={users.firstName}
                  lastName={users.lastName}
                  profilePic={users.profilePic} id={users._id}                 />
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
