"use client";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../components/Providers/AuthContext/AuthContext";
import { Episode, Playlist, Podcast } from "../Types";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import Link from "next/link";
import CreatePodcastButton from "../components/CreatePodcastButton/CreatePodcastButton";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

export default function Dashboard() {
  const { user, token } = useAuth();
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [showCreatePodcastPopUp, setShowCreatePodcastPopUp] = useState(false);



  const [loading, setLoading] = useState(true);

  const defaultChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#ffffff",
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#ffffff" },
      },
      y: {
        ticks: { color: "#ffffff" },
      },
    },
  };

  // Chart Data
  const podcastsVsEpisodesData = {
    labels: ["Podcasts", "Episodes"],
    datasets: [
      {
        label: "Content Created",
        data: [podcasts.length, episodes.length],
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#FF5A6D", "#4C8CFF"],
      },
    ],
  };

  console.log("podcastVSepisode", podcastsVsEpisodesData);

  const sortedEpisodesByLikes = episodes
    .slice()
    .sort((a, b) => b.likedByUsers.length - a.likedByUsers.length)
    .slice(0, 3);

  const topLikedEpisodesData = {
    labels: sortedEpisodesByLikes.map((ep) => ep.episodeTitle),
    datasets: [
      {
        label: "Likes",
        data: sortedEpisodesByLikes.map((ep) => ep.likedByUsers.length),
        backgroundColor: "#FF9F40",
      },
    ],
  };

  const sortedPodcastsByFavorites = podcasts
    .slice()
    .sort((a, b) => b.favoritedByUsers.length - a.favoritedByUsers.length)
    .slice(0, 3);

  const topFavoritedPodcastsData = {
    labels: sortedPodcastsByFavorites.map((pod) => pod.podcastName),
    datasets: [
      {
        label: "Favorites",
        data: sortedPodcastsByFavorites.map(
          (pod) => pod.favoritedByUsers.length
        ),
        backgroundColor: "#FFCD56",
      },
    ],
  };

  const podcastGrowthData = useMemo(() => {
    return {
      labels: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      datasets: [
        {
          label: "Podcasts Created",
          data: podcasts.reduce((acc, podcast) => {
            const month = new Date(podcast.createdAt).getMonth();
            acc[month] += 1;
            return acc;
          }, new Array(12).fill(0)),
          fill: false,
          borderColor: "#4BC0C0",
          tension: 0.1,
        },
        {
          label: "Episodes Created",
          data: episodes.reduce((acc, episode) => {
            const month = new Date(episode.createdAt).getMonth();
            acc[month] += 1;
            return acc;
          }, new Array(12).fill(0)),
          fill: false,
          borderColor: "#FF6347",
          tension: 0.1,
        },
      ],
    };
  }, [podcasts, episodes]);

  const sortedEpisodesByRating = episodes
    .slice()
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 3);

  const engagementData = {
    labels: sortedEpisodesByRating.map((ep) => ep.episodeTitle),
    datasets: [
      {
        label: "Ratings",
        data: sortedEpisodesByRating.map((ep) => ep.averageRating),
        backgroundColor: "#FF9F40",
      },
    ],
  };

  const sortedEpisodesByListens = episodes
    .slice()
    .sort((a, b) => b.listens - a.listens)
    .slice(0, 5);

  const topListenedEpisodesData = {
    labels: sortedEpisodesByListens.map((ep) => ep.episodeTitle),
    datasets: [
      {
        label: "Listens",
        data: sortedEpisodesByListens.map((ep) => ep.listens),
        backgroundColor: "#36A2EB",
      },
    ],
  };

  const categoryData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: "Number of Podcasts",
        data: Object.values(categoryCounts),
        backgroundColor: [
          '#ffb3ba', // soft cherry blossom
          '#ffdfba', // pastel apricot
          '#ffffba', // lemon chiffon
          '#baffc9', // minty green
          '#bae1ff', // baby blue
          '#d5a6ff', // light orchid
          '#ffbaff', // cotton candy
          '#ffd6e0', // rose blush
          '#c3f0ca', // matcha mint
          '#c9c9ff'  // lavender mist
        ],
      },
    ],
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/category");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

   useEffect(() => {
  if (!user) return;

  const fetchFollowersCount = async () => {
    try {
      const response = await fetch(`http://localhost:3000/user/${user._id}/followers-count`);
      const data = await response.json();
      console.log("Followers count data:", data);
      // If API returns an object like { count: number }
      if (typeof data === "object" && "followers" in data) {
       setFollowersCount(data.followers ?? 0);

      } else if (typeof data === "number") {
        setFollowersCount(data);
      } else {
        console.warn("Unexpected followers count data:", data);
        setFollowersCount(0);
      }
    } catch (error) {
      console.error("Error fetching followers count:", error);
    }
  };

  fetchFollowersCount();
}, [user]);
console.log("Followers Count:", followersCount);

  useEffect(() => {
    if (categories.length && podcasts.length) {
      const categoryMap: Record<string, string> = {};
      categories.forEach(({ _id, categoryName }) => {
        categoryMap[_id] = categoryName;
      });

      const newCategoryCounts = podcasts.reduce((acc, podcast) => {
        const podcastCategories = podcast.categories?.length
          ? podcast.categories
          : ["Uncategorized"];
        podcastCategories.forEach((id) => {
          const categoryName = categoryMap[id] || "Uncategorized";
          acc[categoryName] = (acc[categoryName] || 0) + 1;
        });
        return acc;
      }, {} as Record<string, number>);

      setCategoryCounts(newCategoryCounts);
    }
  }, [categories, podcasts]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Fetch podcasts
        const resPodcasts = await fetch(
          `http://localhost:3000/podcast/creator/${user._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const podcastsData = await resPodcasts.json();
        setPodcasts(podcastsData);

        // Fetch episodes from all podcasts
        const allEpisodes = [];
        for (const podcast of podcastsData) {
          const resEpisodes = await fetch(
            `http://localhost:3000/podcast/${podcast._id}/episodes`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const episodesData = await resEpisodes.json();
          allEpisodes.push(...episodesData);
        }
        setEpisodes(allEpisodes);

        // Fetch playlists created by user
        const resPlaylists = await fetch(
          `http://localhost:3000/Playlist/user/${user._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const playlistsData = await resPlaylists.json();
        setPlaylists(playlistsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, token]);

  return (
    <div className="p-6 space-y-8 scrollable-container scrollbar-hide bg-gray-900 rounded-lg">
      {loading ? (
      <p className="text-white">Loading...</p>
    ) : user?.role === 1 && podcasts.length === 0 ? (
      <div className="flex flex-col items-center justify-center text-white space-y-6 p-12 bg-gray-950 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold">Welcome, {user?.firstName}</h2>
        <p className="text-lg text-center max-w-lg">
          You haven’t started creating any content yet. Get started by creating your first podcast and uploading some episodes!
        </p>
        <CreatePodcastButton />

      </div>
    ) : (
      <>
          <h1 className="text-3xl font-bold">Welcome, {user?.firstName}</h1>

          {/* Global Overview Section */}
          <div className="bg-gray-950 text-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Global Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <SummaryCard
                title="Total Podcasts"
                count={podcasts.length}
                color="bg-violet-800"
              />
              <SummaryCard
                title="Total Episodes"
                count={episodes.length}
                color="bg-violet-800"
              />
              <SummaryCard
                title="Total Playlists"
                count={playlists.length}
                color="bg-violet-800"
              />
              <SummaryCard
                title="Total followers"
                count={followersCount}
                color="bg-violet-800"
              />
            </div>
          </div>

          <div className="p-8 bg-gray-950     text-white space-y-8 rounded-lg">



            
            {/* Second Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {/* Bar chart of Top 3 most favorited podcasts */}
              <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4">
                  Top 3 Favorited Podcasts
                </h2>
                <Bar data={topFavoritedPodcastsData} />
              </div>

              {/* Bar chart of Top 3 most liked episodes */}
              <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4">
                  Top 3 Most Liked Episodes
                </h2>
                <div className="h-[250px]">
                  <Bar
                    data={topLikedEpisodesData}
                    options={defaultChartOptions}
                  />
                </div>
              </div>
            </div>
            {/* First Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {/* Pie chart of podcast vs Episode */}
              <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4">
                  Number of Podcasts and Episodes created
                </h2>
                <div className="h-[250px]">
                  <Pie data={podcastsVsEpisodesData} />
                </div>
              </div>

              {/* Bar chart of Highest rated episodes */}
              <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4">
                  Highest Rated Episodes
                </h2>
                <Bar data={engagementData} />
              </div>
            </div>


            


            {/* Third Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {/* Line chart */}
              <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4">
                  Podcast Growth Over Time (2025)
                </h2>
                <Line data={podcastGrowthData} />
              </div>

              {/* Donut chart */}
              <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-center">
                  Podcast Distribution by Category
                </h2>
                <div className="flex items-center justify-center h-[250px] w-full">
                  <Doughnut
                    data={categoryData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      cutout: "50%",
                      plugins: {
                        legend: {
                          position: "left",
                          align: "center",
                          labels: {
                            color: "white",
                            boxWidth: 20,
                            padding: 20,
                            font: {
                              size: 14,
                            },
                          },
                        },
                      },
                      layout: {
                        padding: {
                          top: 10,
                          bottom: 10,
                          left: 10,
                          right: 10,
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Fourth Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
              <div className="bg-gray-900 p-6 rounded-2xl  shadow-lg">
                <h2 className="text-white text-xl mb-4 font-semibold">
                  Top Listened Episodes
                </h2>
                <div className="h-[400px]">
                  <Bar
                    data={topListenedEpisodesData}
                    options={defaultChartOptions}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
function SummaryCard({
  title,
  count,
  color,
}: {
  title: string;
  count: number;
  color: string;
}) {
  return (
    <div
      className={`rounded-lg p-6 shadow-lg ${color} transform transition-transform duration-300 hover:scale-105`}
    >
      <h3 className="text-xl font-semibold text-center">{title}</h3>
      <p className="text-4xl font-bold mt-2 text-center">{count}</p>
    </div>
  );
}
