// 'use client';

// import { useSearchParams } from 'next/navigation';
// import { useEffect, useState } from 'react';

// const SearchPage = () => {
//   const searchParams = useSearchParams();
//   const query = searchParams.get('q');
//   const filter = searchParams.get('filter');

//   const [results, setResults] = useState<any[]>([]); // Defining the type as any[] for now

//   // Fetch the search results based on query and filter
//   useEffect(() => {
//     const fetchResults = async () => {
//       if (query) {
//         try {
//           const res = await fetch(`http://localhost:3000/search?q=${query}&filter=${filter}`);
//           const data = await res.json();
//           setResults(data);
//         } catch (err) {
//           console.error('Erreur lors de la recherche', err);
//         }
//       }
//     };

//     fetchResults();
//   }, [query, filter]);

//   console.log('Results:', results); // Logging the results for debugging

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">
//         Résultats pour "{query}" ({filter})
//       </h1>

//       <div className="space-y-4">
//         {results.length > 0 ? (
//           results.map((result: any, index: number) => (
//             <div key={index} className="p-4 bg-gray-800 rounded-lg text-white">
//               {/* Display Podcast Image */}
//               {result.podcastImage && (
//                 <img
//                   src={result.podcastImage}
//                   alt={result.podcastName}
//                   className="w-full h-48 object-cover rounded-lg"
//                 />
//               )}

//               {/* Display Podcast Name */}
//               <h2 className="text-xl font-semibold mt-2">{result.podcastName}</h2>

//               {/* Display Podcast Description */}
//               <p className="mt-2 text-sm">{result.podcastDescription}</p>

//               {/* Display Categories only if filter is not 'episode' */}
//               {filter !== "episode" && result.categories && result.categories.length > 0 && (
//                 <div className="mt-2">
//                   <span className="font-semibold">Categories:</span>
//                   <ul className="list-disc pl-4">
//                     {result.categories.map((category: string, idx: number) => (
//                       <li key={idx}>{category}</li>
//                     ))}
//                   </ul>
//                 </div>
//               )}

//               {/* Display Episodes only if filter is 'episode' */}
//               {filter === "episode" && result.episodes && result.episodes.length > 0 && (
//                 <div className="mt-2">
//                   <span className="font-semibold">Episodes:</span>
//                   <ul className="list-disc pl-4">
//                     {result.episodes.map((episodeId: string, idx: number) => (
//                       <li key={episodeId}>Episode ID: {episodeId}</li>
//                     ))}
//                   </ul>
//                 </div>
//               )}

//               {/* Display Likes */}
//               <p className="mt-2 text-sm">Likes: {result.likes}</p>

//               {/* Display Creator (Assuming it's an ID or a reference to a user) */}
//               <p className="mt-2 text-sm">Creator ID: {result.creator}</p>
//             </div>
//           ))
//         ) : (
//           <p>Aucun résultat trouvé.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SearchPage;

"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import PodcastCard from "../components/PodcastCard/PodcastCard";
import EpisodeCard from "../components/EpisodeCard/EpisodeCard";
import CategoryButton from "../components/CategoryButton/CategoryButton";
import CreatorCard from "../components/CreatorCard/CreatorCard";
import { Episode, Podcast, SearchResult } from "../Types";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const filter = searchParams.get("filter");

  const [results, setResults] = useState<SearchResult[]>([]);
  // Defining the type as any[] for now

  // Fetch the search results based on query and filter
  useEffect(() => {
    const fetchResults = async () => {
      if (query) {
        try {
          const res = await fetch(
            `http://localhost:3000/search?q=${query}&filter=${filter}`
          );
          const data = await res.json();
          setResults(data);
        } catch (err) {
          console.error("Erreur lors de la recherche", err);
        }
      }
    };

    fetchResults();
  }, [query, filter]);

  console.log("Results:", results); // Logging the results for debugging

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Results for "{query}"</h1>

      {/* <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Résultats</h2>
      </div> */}
      <div className="space-y-4 scrollable-container scrollbar-hide">
        {results.length > 0 ? (
          <>
            {/* For Podcast */}
            {filter === "podcast" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2">
                {results
                  .filter((result) => "podcastName" in result)
                  .map((result, index) => (
                    <PodcastCard
                      key={index}
                      id={result._id}
                      podcastName={result.podcastName}
                      podcastImage={`http://localhost:3000/uploads/podcasts/${result.podcastImage}`}
                      // podcastImage={result.podcastImage}
                      podcastDescription={result.podcastDescription}
                      creator={{
                        firstName: result.creator?.firstName || "",
                        lastName: result.creator?.lastName || "",
                      }}
                    />
                  ))}
              </div>
            )}

            {/* For Episode */}
            {filter === "episode" &&
              results
                .filter((result) => "episodeTitle" in result)
                .map((result, index) => (
                  <EpisodeCard
                    key={index}
                    episode={result as Episode}
                    podcast={(result as any).podcast as Podcast}
                    playlistId={undefined}
                  />
                ))}

            {/* For Category */}
            {filter === "category" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-8 gap-2">
                {results
                  .filter((result) => "categoryName" in result)
                  .map((result, index) => (
                    <CategoryButton
                      key={index}
                      categoryName={result.categoryName}
                      _id={result._id}
                    />
                  ))}
              </div>
            )}

            {/* For Creator */}
            {filter === "creator" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2">
                {results
                  .filter((result) => "firstName" in result)
                  .map((result, index) => (
                    <CreatorCard
                      key={index}
                      firstName={result.firstName}
                      lastName={result.lastName}
                      profilePic={result.profilePic || ""}
                      _id={result._id}
                      bio={result.bio}
                      email={result.email}
                      password={result.password}
                      favoritePodcasts={result.favoritePodcasts}
                      likedEpisodes={result.likedEpisodes}
                      playlists={result.playlists} role={0} createdAt={""} updatedAt={""}                    />
                  ))}
              </div>
            )}
          </>
        ) : (
          <p>Aucun résultat trouvé.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
