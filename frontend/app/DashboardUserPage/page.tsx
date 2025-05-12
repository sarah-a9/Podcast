"use client";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../components/Providers/AuthContext/AuthContext";
import { Episode, Podcast } from "../Types";
import { Bar, Line, Pie } from "react-chartjs-2";
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
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>(
    {}
  );

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
          "#FF6384",
          "#36A2EB",
          "#FF9F40",
          "#4BC0C0",
          "#FFCD56",
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
        const resPodcasts = await fetch(
          `http://localhost:3000/podcast/creator/${user._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const podcastsData = await resPodcasts.json();
        setPodcasts(podcastsData);

        const allEpisodes = [];
        for (const podcast of podcastsData) {
          const resEpisodes = await fetch(
            `http://localhost:3000/podcast/${podcast._id}/episodes`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const episodesData = await resEpisodes.json();
          console.log("episode data",episodesData);
          allEpisodes.push(...episodesData); 
        }
        setEpisodes(allEpisodes);
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
      {podcasts.length > 0 ? (
        <>
          <h1 className="text-3xl font-bold">Welcome, {user?.firstName}</h1>

          <div className="p-8 bg-gray-950     text-white space-y-8 rounded-lg">
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

           {/* Third Row */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
  {/* Pie chart of Number of Podcasts by Category */}
  <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">
    <h2 className="text-xl font-semibold mb-4">
      Podcast Growth Over Time (2025)
    </h2>
    <Line data={podcastGrowthData} />
  </div>

  <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">
    <h2 className="text-xl font-semibold mb-4">
      Number of Podcasts by Category
    </h2>
    <div className="h-[250px]">
      <Pie data={categoryData} />
    </div>
  </div>
</div>

{/* Fourth Row */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
  <div className="bg-gray-900 p-6 rounded-2xl  shadow-lg">
    <h2 className="text-white text-xl mb-4 font-semibold">Top Listened Episodes</h2>
    <div className="h-[400px]">
      <Bar data={topListenedEpisodesData} options={defaultChartOptions} />
    </div>
  </div>
</div>

          </div>
        </>
      ) : (
        <div className="p-8  text-white rounded-lg shadow-xl flex flex-col items-center justify-center space-y-6">
          <h2 className="text-3xl font-semibold text-center mb-4">
            You have no content yet!
          </h2>
          <p className="text-lg text-center mb-6">
            Create a podcast and upload episodes to see your stats here!
          </p>

          {/* Button wrapped with Link component */}
          <Link href={`/Profile/me`}>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:scale-105 transition duration-300 ease-in-out transform">
              Start Creating Content
            </button>
          </Link>

          {/* Icon with blue and purple color scheme */}
          <div className="mt-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-12 h-12 text-gradient-to-r from-blue-500 to-purple-500 animate-pulse"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4l3 3" />
            </svg>
          </div>

          <p className="text-sm text-gray-400 text-center">
            Start creating content to track your progress and grow your
            audience.
          </p>
        </div>
      )}
    </div>
  );
}
