'use client';

import { useEffect, useState } from 'react';
import { Bar, Line, Pie, Doughnut, Radar, PolarArea, Bubble  } from 'react-chartjs-2';
import { format, parseISO, isValid} from 'date-fns';
// import ChartDataLabels from 'chartjs-plugin-datalabels';

import {
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  TimeScale,
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  ChartOptions,

} from 'chart.js';
import { useAuth } from '../components/Providers/AuthContext/AuthContext';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  TimeScale,
  RadialLinearScale,
  // ChartDataLabels,
);

type RoleStat = { role: string; count: number };

export default function AdminDashboard() {
  const [roleData, setRoleData] = useState<RoleStat[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [podcastCount, setPodcastCount] = useState(0);
  const [episodeCount, setEpisodeCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [grouping, setGrouping] = useState<'day' | 'week' | 'month'>('day');
  const [podcastStats, setPodcastStats] = useState<{ date: string; count: number }[]>([]);
  const [topCreators, setTopCreators] = useState<{ creatorName: string; podcastCount: number }[]>([]);
  const [categoryStats, setCategoryStats] = useState<{ name: string; count: number }[]>([]);
  const [mostFavorited, setMostFavorited] = useState<{ podcastName: string; favoriteCount: number }[]>([]);
  const [mostLiked, setMostLiked] = useState<{ title: string; likeCount: number }[]>([]);
  const [topRated, setTopRated] = useState<{ title: string; playCount: number; rating: number; reviewCount?: number }[]>([]);
  const [topListened, setTopListened] = useState<{ episodeTitle: string; listens: number }[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // Fetch role data for chart
    fetch('http://localhost:3000/user/stats/roles')
      .then(res => res.json())
      .then(data => setRoleData(data))
      .catch(err => {
        console.error("Failed to fetch role data", err);
        setRoleData([]);
      });

    // Fetch total users
    fetch('http://localhost:3000/user')
      .then(res => res.json())
      .then(data => setUserCount(data.length))
      .catch(err => console.error("Error fetching users", err));

    // Fetch total podcasts
    fetch('http://localhost:3000/podcast')
      .then(res => res.json())
      .then(data => setPodcastCount(data.length))
      .catch(err => console.error("Error fetching podcasts", err));

    // Fetch total episodes
    fetch('http://localhost:3000/episode')
      .then(res => res.json())
      .then(data => setEpisodeCount(data.length))
      .catch(err => console.error("Error fetching episodes", err));

    // Fetch total categories
    fetch('http://localhost:3000/category')
      .then(res => res.json())
      .then(data => {
        setCategoryCount(data.length); // Already here

        // NEW: compute how many podcasts per category
        const stats = data.map((cat: any) => ({
          name: cat.categoryName,
          count: cat.listePodcasts?.length || 0,
        }));
        console.log('Category stats for chart:', stats);
        setCategoryStats(stats);
      })
      .catch(err => console.error("Error fetching categories", err));

  }, []);

  useEffect(() => {
    fetch(`http://localhost:3000/podcast/stats/created-over-time?groupBy=${grouping}`)
      .then(res => res.json())
      .then(data => setPodcastStats(data))
      .catch(err => console.error("Error fetching podcast stats", err));
  }, [grouping]);

  useEffect(() => {
    fetch(`http://localhost:3000/podcast/stats/top-creators?limit=5`)
      .then(res => res.json())
      .then(data => setTopCreators(data))
      .catch(err => console.error("Error fetching top creators", err));
  }, []);

  useEffect(() => {
    fetch('http://localhost:3000/admin/most-favorited-podcasts')
      .then(res => res.json())
      .then(data => setMostFavorited(data))
      .catch(err => console.error('Error fetching most favorited podcasts', err));
  }, []);

  useEffect(() => {
    fetch('http://localhost:3000/admin/most-liked-episodes')
      .then(res => res.json())
      .then(data => setMostLiked(data))
      .catch(err => console.error('Error fetching most liked episodes', err));
  }, []);


  useEffect(() => {
    fetch('http://localhost:3000/admin/top-rated-episodes')
      .then(res => res.json())
      .then(data => setTopRated(data))
      .catch(err => console.error('Error fetching top-rated episodes', err));
  }, []);

  useEffect(() => {
    fetch('http://localhost:3000/admin/top-listened-episodes') 
      .then(res => res.json())
      .then(data => setTopListened(data))
      .catch(err => console.error('Failed to fetch top listened episodes:', err));
  }, []);


  const chartData = {
    labels: roleData.map(r => r.role),
    datasets: [
      {
        data: roleData.map(r => r.count),
        backgroundColor: ['#840202', '#f7c7c7', '#b0604f'],
        borderWidth: 1,
      },
    ],
  };


  const VBarChartData = {
    labels: podcastStats
      .filter(p => p.date && isValid(parseISO(p.date))) // ❗ filter out null or invalid dates
      .map(p => {
        const date = parseISO(p.date);
        switch (grouping) {
          case 'day':
            return format(date, 'MMM dd, yyyy');       // e.g., Apr 12, 2025
          case 'week':
            return format(date, "'Week of' MMM dd");   // e.g., Week of Apr 08
          case 'month':
            return format(date, 'MMMM yyyy');          // e.g., April 2025
          default:
            return format(date, 'yyyy-MM-dd');
        }
      }),
    datasets: [
      {
        label: 'Podcasts Created',
        data: podcastStats
          .filter(p => p.date && isValid(parseISO(p.date))) // make sure labels and data match
          .map(p => p.count),
        fill: false,
        borderColor: '#fb64b6',
        backgroundColor: '#fb64b6',
        tension: 0.3,
      },
    ],
  };


  const HBarChartData = {
    labels: topCreators.map(c => c.creatorName),
    datasets: [
      {
        label: 'Number of Podcasts',
        data: topCreators.map(c => c.podcastCount),
        backgroundColor: '#8fcef6',
      },
    ],
  };


  const CategoryDonutData = {
    labels: categoryStats.map(c => c.name),
    datasets: [
      {
        data: categoryStats.map(c => c.count),
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
        borderWidth: 1,
      },
    ],
  };

  console.log("Most Favorited Data:", mostFavorited);
  console.log("Most Liked Data:", mostLiked);
  console.log("Top Rated Data:", topRated);


  const lineData = {
    labels: mostFavorited.slice(0, 5).map(p =>
      p.podcastName.length > 15 ? p.podcastName.slice(0, 15) + '…' : p.podcastName
    ),
    datasets: [{
      label: 'Favorites',
      data: mostFavorited.slice(0, 5).map(p => p.favoriteCount),
      fill: true,
      backgroundColor: 'rgba(255, 64, 129, 0.2)',
      borderColor: '#ff4081',
      tension: 0.3, // Smoother curves
      pointBackgroundColor: '#ff4081',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#ff4081',
    }]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: '#fff',
        },
        grid: {
          color: 'rgba(255,255,255,0.1)',
        },
      },
      x: {
        ticks: {
          color: '#fff',
        },
        grid: {
          color: 'rgba(255,255,255,0.05)',
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: '#fff'
        }
      },
      tooltip: {
        callbacks: {
          label: (context: { label: any; raw: any; }) => `${context.label}: ${context.raw} favorites`
        }
      }
    }
  };


  const polarData = {
    labels: mostLiked.slice(0, 5).map(e =>
      e.title.length > 20 ? e.title.slice(0, 20) + '…' : e.title
    ),
    datasets: [{
      label: 'Likes',
      data: mostLiked.slice(0, 5).map(e => e.likeCount),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
      ],
      borderColor: '#ffffff',
      borderWidth: 1,
    }]
    };

  const polarOptions: ChartOptions<'polarArea'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right', 
        labels: {
          color: '#ffffff',
          boxWidth: 20,
          padding: 15,
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        callbacks: {
          label: context => `${context.label}: ${context.raw} likes`
        }
      },
    },
    scales: {
      r: {
        min: 1,
        max: Math.max(...mostLiked.map(e => e.likeCount)),
        ticks: {
          stepSize: 1,
          color: '#ffffff',
          backdropColor: 'transparent',
          showLabelBackdrop: false,
          z: 10, // ensures ticks render above chart elements
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        angleLines: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        pointLabels: {
          color: '#ffffff',
          font: {
            size: 12
          }
        }
      }
    }

  };

  
  const barData = {
    labels: topRated.map(ep => ep.title),
    datasets: [{
      label: 'Average Rating',
      data:  topRated.map(ep => ep.rating),
      backgroundColor: topRated.map((_, i) =>
        `rgba(${100 + i*30}, ${150 - i*20}, 220, 0.6)`
      ),
      borderColor: '#fff',
      borderWidth: 1,
    }]
  };

  const barOptions = {
    indexAxis: 'y' as const,    // horizontal bars
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: { dataIndex: string | number; parsed: { x: any; }; }) => {
            const index = typeof ctx.dataIndex === 'number' ? ctx.dataIndex : parseInt(ctx.dataIndex as string, 10);
            const rev = topRated[index]?.reviewCount ?? 0;
            return ` ${ctx.parsed.x} stars from ${rev} review${rev > 1 ? 's' : ''}`;
          }
        }
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'Average Rating (★)' },
        min: 0, max: 5,           // assuming 5-star system
        ticks: { stepSize: 0.5 }
      },
      y: {
        title: { display: true, text: 'Episode' },
      }
    }
  };


    const linearData = {
      labels: topListened
        .slice()
        .reverse()
       .map(e =>e.episodeTitle && typeof e.episodeTitle === 'string'? (e.episodeTitle.length > 20 ? e.episodeTitle.slice(0, 20) + '…' : e.episodeTitle): 'Sans titre'),
      datasets: [
        {
          label: 'Listens',
          data: topListened.slice().reverse().map(e => e.listens),
          fill: false,
          borderColor: '#4bc0c0',
          backgroundColor: '#4bc0c0',
          tension: 0.3,
          pointBorderColor: '#fff',
          pointBackgroundColor: '#4bc0c0',
          pointRadius: 4,
        },
      ],
    };

    const linearOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: '#fff' },
          grid: { color: 'rgba(255,255,255,0.1)' },
        },
        x: {
          ticks: { color: '#fff' },
          grid: { color: 'rgba(255,255,255,0.05)' },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: '#fff',
            font: {
              size: 14,
              weight: 500,
            },
          },
        },
        tooltip: {
          callbacks: {
            label: (context: { raw: any; }) => `${context.raw} listens`,
          },
        },
      },
    };




  return (
    <div className="p-6 space-y-8 scrollable-container scrollbar-hide bg-gray-900 rounded-lg text-white">
      <h1 className="text-3xl font-bold">Welcome, {user?.firstName}</h1>

      {/* Summary Cards */}
      <div className="bg-gray-950 text-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-center">
            Global Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard title="Total Users" count={userCount} color=" bg-violet-950" />
          <SummaryCard title="Total Podcasts" count={podcastCount} color="bg-violet-800" />
          <SummaryCard title="Total Episodes" count={episodeCount} color="bg-violet-600" />
          <SummaryCard title="Total Categories" count={categoryCount} color="bg-violet-400" />
        </div>
      </div>

      <div className="flex gap-6">
        {/* Pie Chart */}
        <div className="bg-gray-950 text-white p-6 rounded-lg shadow-lg flex-1">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Role Distribution of Users
          </h2>
          <div className="h-[300px] w-full flex items-center justify-center">
            <Pie data={chartData} />
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-gray-950 text-white p-6 rounded-lg shadow-lg flex-1">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Podcast Distribution by Category
        </h2>
        <div className="flex items-center justify-center h-[350px] w-full">
          <Doughnut 
            data={CategoryDonutData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              cutout: '50%', // adjust to control "thickness" of the donut
              plugins: {
                legend: {
                  position: 'left',
                  align: 'center',
                  labels: {
                    color: 'white',
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

      <div className="flex  gap-6">
      {/* Vertical Bar Chart Section */}
      <div className="bg-gray-950 p-6 rounded-lg shadow-lg w-1/2">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Podcast Creation Over Time
        </h2>

        <div className="flex justify-center mb-4 space-x-2">
          {['day', 'week', 'month'].map(option => (
            <button
              key={option}
              className={`px-4 py-2 rounded ${
                grouping === option ? 'bg-pink-400 text-white' : 'bg-gray-700'
              }`}
              onClick={() => setGrouping(option as 'day' | 'week' | 'month')}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>

        <div className="h-[300px] w-full ">
          <Bar
            data={VBarChartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Date',
                  },
                },
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Number of Podcasts',
                  },
                  ticks: {
                    stepSize: 1,
                  },
                },
              },
            }}

          />

        </div>
      </div>

      {/* Horizontal Bar Chart Section */}
      <div className="bg-gray-950 p-6 rounded-lg shadow-lg w-1/2">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Top Podcast Creators
        </h2>
        <div className="h-[300px] w-full">
          <Bar
            data={HBarChartData}
            options={{
              indexAxis: 'y',
              scales: {
                x: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1, // Force step size of 1 on horizontal (x) axis
                  },
                  title: {
                    display: true,
                    text: 'Number of Podcasts',
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Creators',
                  },
                },
              },
            }}

          />
        </div>
      </div>
    </div>

    {/* Charts: line, Polar Area*/}
    <div className="flex gap-6">
      {/* line Chart */}
        <div className="bg-gray-950 text-white p-6 rounded-lg shadow-lg flex-1">
        <h2 className="text-lg font-semibold mb-4 text-center">Most Favorited Podcasts</h2>
        <div className="h-[300px]">
          <Line data={lineData} options={lineOptions} />
        </div>
    </div>
    
      {/* Polar Area Chart */}
        <div className="bg-gray-950 text-white p-6 rounded-lg shadow-lg flex-1">
        <h2 className="text-lg font-semibold mb-4 text-center">Most Liked Episodes</h2>
        <div className="h-[300px]">
          <PolarArea data={polarData} options={polarOptions} />
        </div>
      </div>

    </div>

    <div className="flex gap-6">
      {/* Bar Chart */}
      <div className="bg-gray-950 text-white p-6 rounded-lg shadow-lg flex-1">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Top Rated Episodes
        </h2>
        <div className="h-[300px]">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      {/* Linear chart*/ }
      <div className="bg-gray-950 text-white p-6 rounded-lg shadow-lg flex-1">
        <h2 className="text-lg font-semibold mb-4 text-center">Top Listened Episodes</h2>
        <div className="h-[300px]">
          <Line data={linearData} options={linearOptions} />
        </div>
      </div>
    </div>
  </div>

  );
}

function SummaryCard({ title, count, color }: { title: string, count: number, color: string }) {
  return (
    
      <div
        className={`rounded-lg p-6 shadow-lg ${color} transform transition-transform duration-300 hover:scale-105`}
      >
        <h3 className="text-xl font-semibold text-center">{title}</h3>
        <p className="text-4xl font-bold mt-2 text-center">{count}</p>
      </div>
    
  );
}


