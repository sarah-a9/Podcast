
import { Category } from '@/app/Types';
import { useRouter } from 'next/navigation';
import React from 'react';


const CategoryButton: React.FC<Category> = ({ categoryName  ,_id}) => {
  console.log("CategoryButton received id:", _id); // ✅ Debugging
  const router = useRouter();
   const handleViews = () => {
    if (!_id) {
      console.error("Category ID is undefined!");
      return;
    }
    console.log('Navigating to category:', _id);
    router.push(`/categoryFeed/${_id}`);
    
    
  };
  
  return (
    <div
      className={` w-1/11 flex-shrink-0 h-11 rounded-full shadow-md flex items-center justify-center cursor-pointer text-white font-light text-s bg-gray-800`}
      onClick={handleViews}>
      {categoryName}
    </div>  );
};

export default CategoryButton;
