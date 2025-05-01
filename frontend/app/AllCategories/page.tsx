// /app/all-categories/page.tsx
'use client';

import { useEffect, useState } from 'react';
import CategoryButton from '../components/CategoryButton/CategoryButton';


const AllCategories = () => {
  const [categories, setCategories] = useState<{ _id: string; categoryName: string }[]>([]);

  useEffect(() => {
    console.log('Fetching all categories...');
    fetch('http://localhost:3000/category')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error('Received categories is not an array:', data);
        }
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  return (
    <div className="container mx-auto">
      <h2 className="text-3xl font-semibold pb-5">All Categories</h2>
      <div className="category-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto scrollbar-hide">
        {categories.length > 0 ? (
          categories.map((category) => (
            <CategoryButton
              key={category._id}
              categoryName={category.categoryName}
              _id={category._id}
            />
          ))
        ) : (
          <p>No categories available.</p>
        )}
      </div>
    </div>
  );
};

export default AllCategories;
