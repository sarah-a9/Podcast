// /app/all-creators/page.tsx
'use client';

import { useEffect, useState } from 'react';

import { User } from '@/app/Types'; // Import the User type if needed
import CreatorCard from '../components/CreatorCard/CreatorCard';

const AllCreators = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    console.log('Fetching all creators...');
    fetch('http://localhost:3000/user')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error('Received users is not an array:', data);
        }
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

  return (
    <div className="container mx-auto">
      <h2 className="text-3xl font-semibold pb-5">All Creators</h2>
      <div className="creator-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-y-auto scrollbar-hide">
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
              playlists={user.playlists}
            />
          ))
        ) : (
          <p>No creators available.</p>
        )}
      </div>
    </div>
  );
};

export default AllCreators;
