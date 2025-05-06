import { StarRatingProps } from "@/app/Types";
import React, { useState, useEffect } from "react";
import { useAuth } from "../Providers/AuthContext/AuthContext";

// Define the Rating interface to type-check the ratings array
interface Rating {
  episode: string;  // Assuming episodeId is a string
  value: number;
  _id: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  value,
  onRate,
  maxStars,
  isEditable,
  episodeId,
}) => {
  const { user, token } = useAuth();
  const [rating, setRating] = useState<number | null>(value); // Use null initially if no rating
  const [averageRating, setAverageRating] = useState<number | null>(null); // Episode's average rating
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  // const [AverageRating, setAverageRating] = useState<number | null>(value); // Use null initially if no rating

   // Fetch the rating for the logged-in user
   useEffect(() => {
    if (user && token) {
      const fetchRating = async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/user/${user._id}`, // Make sure to use the correct endpoint here
            {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            // Type the ratings array correctly
            const ratings: Rating[] = data.ratings;
            console.log("Ratings:", ratings);

            // Find the rating for the specific episode
            const userRating = ratings.find((rating) => rating.episode.toString() === episodeId);
            setRating(userRating ? userRating.value : 0); // Set the rating or default to 0 if not rated
          } else {
            console.error("Failed to fetch user details");
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };

      fetchRating();
    }
  }, [user, token, episodeId]); // This will fetch the rating when user or episodeId changes

  // Fetch the episode's average rating
  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/episode/${episodeId}`, // Assuming this endpoint fetches episode details with average rating
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Episode data:", data);

          // Get the average rating from the episode data
          setAverageRating(data.averageRating); // Assuming the backend sends this value
        } else {
          console.error("Failed to fetch episode details");
        }
      } catch (error) {
        console.error("Error fetching episode details:", error);
      }
    };
    console.log("average rating:", averageRating);
    fetchAverageRating();
  }, [episodeId, token]); // Fetch the average rating when episodeId changes

  // Handle the star click (submit rating)
  const handleStarClick = async (ratingValue: number) => {
    if (isEditable && user && token) {
      setRating(ratingValue); // Update rating locally

      try {
        const response = await fetch("http://localhost:3000/user/rateEpisode", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ episodeId, value: ratingValue }),
        });
        console.log("rating value:", ratingValue);

        if (response.ok) {
          const data = await response.json();
          // Immediately update the average rating without waiting for a full page reload
          setAverageRating(data.averageRating);
          onRate(data.averageRating); // Notify parent component about the updated average rating
        } else {
          console.error("Failed to submit rating");
        }
      } catch (error) {
        console.error("Error submitting rating:", error);
      }
    }
  };

  const handleStarHover = (ratingValue: number) => {
    if (isEditable) {
      setHoveredRating(ratingValue); // Set hovered rating for visual feedback
    }
  };

  const handleStarHoverOut = () => {
    setHoveredRating(0); // Reset hover when the mouse leaves
  };

  const renderStar = (index: number) => {
    const isFilled = hoveredRating
      ? index < hoveredRating
      : index < rating!;

    return (
      <span
        key={index}
        className={`star ${isFilled ? "filled" : ""}`}
        onClick={() => handleStarClick(index + 1)}
        onMouseEnter={() => handleStarHover(index + 1)}
        onMouseLeave={handleStarHoverOut}
      >
        &#9733;
      </span>
    );
  };

  return (
    <div className="star-rating " style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
      {/* Average Rating */}
      <div className="average-rating" style={{ fontSize: "28px", fontWeight: "bold", color: "#facc15" }}>
        {averageRating !== null ? averageRating.toFixed(1) : "N/A"}
        <span style={{ fontSize: "16px", color: "#9ca3af" }}> / {maxStars}</span>
      </div>
  
      {/* Stars */}
      <div className="stars" style={{ display: "flex", gap: "4px", fontSize: "24px" }}>
        {[...Array(maxStars)].map((_, index) => renderStar(index))}
      </div>
  
      {/* Rating Text */}
      <div className="rating-text" style={{ fontSize: "14px", color: "#9ca3af" }}>
        {rating ? `Your rating: ${rating} / ${maxStars}` : "Rate this episode"}
      </div>
    </div>
  );
  
};

export default StarRating;