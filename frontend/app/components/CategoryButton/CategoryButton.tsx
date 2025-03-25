// // components/CategoryButton.tsx
// import React from "react";

// interface CategoryButtonProps {
//   name: string;
//   onClick: () => void;
// }

// const CategoryButton: React.FC<CategoryButtonProps> = ({ name, onClick }) => {
//   return (
//     <button onClick={onClick} className="px-6 py-3 bg-gray-700 rounded-full text-white">
//       {name}
//     </button>
//   );
// };

// export default CategoryButton;



import React from 'react';

interface CategoryProps {
  categoryName: string;
}

const CategoryButton: React.FC<CategoryProps> = ({ categoryName }) => {
  return (
    <div
      className={`relative w-1/12 flex-shrink-0 h-10 rounded-full shadow-md flex items-center justify-center cursor-pointer text-white font-bold text-xs bg-gray-800`}
    >
      {categoryName}
    </div>  );
};

export default CategoryButton;
