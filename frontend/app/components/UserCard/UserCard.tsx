import React, { useEffect, useState } from 'react';
import { User } from '../../Types';

interface UserCardProps {
  userId: string;
}

const UserCard: React.FC<UserCardProps> = ({ userId }) => {
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/user/${userId}`);
        const data = await response.json();
        setUserData(data);
        console.log("Fetched user data:", data);

        // Step 2: Fetch each podcast by ID
        const podcastDetails = await Promise.all(
          (data.podcasts || []).map((id: string) =>
            fetch(`http://localhost:3000/podcast/${id}`)
          .then(res => res.json())
          )
        );

        // Step 3: Fetch each playlist by ID
        const playlistDetails = await Promise.all(
          (data.playlists || []).map((playlist: any) =>
            fetch(`http://localhost:3000/playlist/${playlist._id}`)
          .then(res => res.json())
          )
        );
        

        // Step 4: Replace podcast and playlist IDs with full objects
        setUserData({
          ...data,
          podcasts: podcastDetails,
          playlists: playlistDetails,
        });
      } catch (error) {
        console.error('Error fetching user data', error);
      }
    };

    fetchUserData();
    
  }, [userId]);

  if (!userData) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="w-full  mx-auto p-8 bg-gray-900 text-white shadow-xl rounded-lg">
      {/* Centered Image */}
      <div className="flex justify-center mb-6">
        <img
          src={userData.profilePic}
          alt={`${userData.firstName} ${userData.lastName}`}
          className="rounded-full w-36 h-36 object-cover border-4 border-gray-600"
        />
      </div>

      {/* Info Table Style */}
      {/* Compact & Centered User Info Card */}
        <div className="max-w-md mx-auto bg-gray-900 p-6 rounded-xl shadow-xl border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2 text-center">
            User Information
        </h2>
        <div className="space-y-4 text-gray-300">

            <div className="flex justify-between">
            <span className="font-semibold text-gray-400">👤 Name:</span>
            <span className="text-white">{userData.firstName} {userData.lastName}</span>
            </div>

            <div className="flex justify-between">
            <span className="font-semibold text-gray-400">📧 Email:</span>
            <span className="text-blue-400">{userData.email}</span>
            </div>

            <div className="flex justify-between">
            <span className="font-semibold text-gray-400">🛡️ Role:</span>
            <span className={`px-2 py-0.5 rounded text-sm font-medium ${
                userData.role === 1 ? 'bg-green-700 text-white' : 'bg-red-700 text-white'
            }`}>
                {userData.role === 1 ? 'User' : 'Admin'}
            </span>
            </div>

            <div className="flex justify-between">
            <span className="font-semibold text-gray-400">📅 Joined:</span>
            <span>{new Date(userData.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="flex justify-between">
            <span className="font-semibold text-gray-400">🔄 Updated:</span>
            <span>{new Date(userData.updatedAt).toLocaleDateString()}</span>
            </div>

            <div className="pt-2 border-t border-gray-700">
            <span className="block font-semibold text-gray-400 mb-1">📝 Bio:</span>
            <p className="text-sm italic text-gray-200">{userData.bio || 'No bio provided.'}</p>
            </div>

        </div>
        </div>
        

      {/* Podcasts */}
      <div className="mt-10">
        <h3 className="text-2xl font-bold mb-4 border-b pb-2 border-gray-700">Podcasts</h3>
        {userData.podcasts?.length ? (
          <ul className="space-y-4">
            {userData.podcasts.map((podcast: any,index: number) => (
             <li key={podcast._id ?? index} className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-xl font-semibold">{podcast.podcastName}</h4>
                <p className="text-gray-400">{podcast.podcastDescription}</p>
                <div className="mt-2">
                  {podcast.categories?.map((category: any, index: number) => (
                    <span key={category._id ?? index} className="mr-2 bg-blue-500 text-white text-sm px-2 py-1 rounded">
                      {category.categoryName}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">User has no podcasts.</p>
        )}
      </div>

      {/* Playlists */}
      <div className="mt-10">
        <h3 className="text-2xl font-bold mb-4 border-b pb-2 border-gray-700">Playlists</h3>
        {userData.playlists?.length ? (
          <ul className="space-y-4">
            {userData.playlists.map((playlist: any, index: number) => (
              <li key={playlist._id ?? index} className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-xl font-semibold">{playlist.playlistName}</h4>
                <p className="text-gray-400">{playlist.playlistDescription}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">User has no playlists.</p>
        )}
      </div>
    </div>
  );
};

export default UserCard;
