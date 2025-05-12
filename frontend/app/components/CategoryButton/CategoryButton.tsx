import { Category } from '@/app/Types';
import { useRouter } from 'next/navigation';
import React from 'react';

const CategoryButton: React.FC<Category> = ({ categoryName, _id }) => {
  const router = useRouter();
  
  // Handle category click
  const handleViews = () => {
    if (!_id) {
      console.error("Category ID is undefined!");
      return;
    }
    router.push(`/categoryFeed/${_id}`);
  };

  return (
    <div
      className="w-28 h-12 bg-gradient-to-r from-gray-800 to-slate-700 rounded-full shadow-lg flex items-center justify-center cursor-pointer text-purple-400 font-semibold text-sm hover:scale-105 transition-transform duration-300 ease-in-out"
      onClick={handleViews}
    >
      {categoryName}
    </div>
  );
};

export default CategoryButton;
