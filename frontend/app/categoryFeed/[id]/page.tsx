"use client";
import PodcastCard from '@/app/components/PodcastCard/PodcastCard';
import { Podcast } from '@/app/Types';
import React, { useEffect, useState } from 'react'




  interface Category {
    _id: string;
    categoryName: string;
    listePodcasts: Podcast[]; // Now storing full podcast objects
  }

const CategoryFeed = ({ params }: { params: { id: string } }) => {

    const [category, setCategory] = useState<Category | null>(null);


    
     // Fetch categories
    
  useEffect(() => {
    if (!params.id) return; // Prevent unnecessary API calls

    fetch(`http://localhost:3000/category/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Category Data:", data);

        if (data && typeof data === "object" && !Array.isArray(data)) {
          setCategory(data);
        } else {
          console.error("Expected an object, but received:", data);
        }
      })
      .catch((error) => console.error("Error fetching category:", error));
  }, [params.id]);


  return (
    <div>
         {category?.listePodcasts.length ? (
          <div>
          <h2 className="text-2xl font-bold">{category.categoryName} Podcasts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 mt-4">
            {category.listePodcasts.map((podcast) => (
              <PodcastCard
                key={podcast._id}
                id={podcast._id}
                podcastName={podcast.podcastName}
                podcastImage={podcast.podcastImage}
                podcastDescription={podcast.podcastDescription}
                creator={podcast.creator} // Replace with actual creator info if available
              />
            ))}
          </div>
        </div>
      ) : (
        <p>no podcasts available for this category...</p>
      )}
    </div>
  );
}

export default CategoryFeed