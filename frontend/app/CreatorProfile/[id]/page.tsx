"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PodcastCard from "@/app/components/PodcastCard/PodcastCard";
import FollowUnfollowButton from "@/app/components/FollowUnfollowButton/FollowUnfollowButton";
import { useAuth } from "@/app/components/Providers/AuthContext/AuthContext";

const CreatorProfile = () => {
  const { id } = useParams();
  const [creator, setCreator] = useState<any>(null);
  const [creatorPodcasts, setCreatorPodcasts] = useState<any[]>([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const { token , user} = useAuth();
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    if (user && id && user._id === id) {
      router.push('/Profile/me'); 
    }
  }, [user, id, router]);
  useEffect(() => {
    const fetchIsFollowing = async () => {
      if (!token || !id) return;
      const response = await fetch(
        `http://localhost:3000/user/${id}/is-following`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setIsFollowing(data.isFollowing);
    };
    fetchIsFollowing();
  }, [token, id]);

  useEffect(() => {
    if (id) {
      fetchCreator();
      fetchCreatorPodcasts();
      fetchFollowCounts();
    }
  }, [id]);

  const fetchCreator = async () => {
    try {
      const res = await fetch(`http://localhost:3000/user/${id}`);
      if (!res.ok) throw new Error("Could not fetch user");
      const data = await res.json();
      setCreator(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCreatorPodcasts = async () => {
    try {
      const res = await fetch("http://localhost:3000/podcast");
      if (!res.ok) throw new Error("Could not fetch podcasts");
      const data = await res.json();
      const filtered = data.filter(
        (podcast: any) => podcast.creator && podcast.creator._id === id
      );
      setCreatorPodcasts(filtered);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFollowCounts = async () => {
    try {
      const [followersRes, followingRes] = await Promise.all([
        fetch(`http://localhost:3000/user/${id}/followers-count`),
        fetch(`http://localhost:3000/user/${id}/following-count`),
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

  if (!creator) return <div>Loading creator profile...</div>;

  return (
    <div className="p-6 h-screen bg-gray-900 text-white rounded-lg scrollable-container scrollbar-hide">
      {/* Profile header container */}
      <div className="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
        {/* Left side: image + user info */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 relative rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
            {!imageLoaded && <div className="w-full h-full animate-pulse" />}
            {creator.profilePic && (
              <img
                src={creator.profilePic}
                alt="User Profile"
                className={`w-20 h-20 object-cover transition-opacity duration-300 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(true)}
              />
            )}
          </div>

          <div>
            <h1 className="text-3xl font-bold text-white">
              {`${creator.firstName ?? ""} ${creator.lastName ?? ""}`.trim()}
            </h1>
            <p className="text-gray-400">
              {creator.bio || "No bio available."}
            </p>

            {/* NEW: Followers and Following counts */}
            <div className="flex gap-6 mt-1 text-gray-300 text-sm">
              <div>
                <span className="font-semibold">{followersCount}</span>{" "}
                Followers
              </div>
              <div>
                <span className="font-semibold">{followingCount}</span>{" "}
                Following
              </div>
            </div>
          </div>
        </div>

        {/* Right side: Follow button */}
        <FollowUnfollowButton
          isFollowing={isFollowing}
          onFollow={() => {
            setIsFollowing(true);
            fetchFollowCounts(); // refresh counts after follow
          }}
          onUnfollow={() => {
            setIsFollowing(false);
            fetchFollowCounts(); // refresh counts after unfollow
          }}
          TargetUserId={id as string}
        />
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">
          {creator.firstName}'s Podcasts
        </h2>
        {creatorPodcasts.length > 0 ? (
          <div className="flex overflow-x-auto gap-4">
            {creatorPodcasts.map((podcast) => (
              <PodcastCard
                key={podcast._id}
                id={podcast._id}
                podcastName={podcast.podcastName}
                podcastDescription={podcast.podcastDescription}
                podcastImage={`http://localhost:3000/uploads/podcasts/${podcast.podcastImage}`}
                creator={podcast.creator}
              />
            ))}
          </div>
        ) : (
          <p>No podcasts to show yet...</p>
        )}
      </div>
    </div>
  );
};

export default CreatorProfile;
