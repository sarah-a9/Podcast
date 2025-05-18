'use client';

import { useEffect, useState } from 'react';
import CategoryButton from '../components/CategoryButton/CategoryButton';
import CreateCategoryPopup from '../components/PopUps/CreateCategoryPopUp';
import { useAuth } from '../components/Providers/AuthContext/AuthContext';

const AllCategories = () => {
  const { user } = useAuth(); // Get user info
  const isAdmin = user?.role === 0;

  const [categories, setCategories] = useState<{ _id: string; categoryName: string }[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showAddPopup, setShowAddPopup] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
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
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDelete = async () => {
    for (const id of selectedIds) {
      await fetch(`http://localhost:3000/category/${id}`, {
        method: 'DELETE',
      });
    }
    setSelectedIds([]);
    fetchCategories();
  };

  return (
    <div className="container mx-auto p-6 bg-gray-900 text-white min-h-screen rounded-lg">
      <h2 className="text-3xl font-semibold pb-5">All Categories</h2>

      {isAdmin && (
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setShowAddPopup(true)}
            className="px-4 py-2 text-white bg-gradient-to-r from-purple-900 via-purple-600 to-purple-400 rounded-xl shadow-md hover:scale-105 transition-transform"
          >
            Add Category
          </button>
          <button
            onClick={() => setSelectionMode((prev) => !prev)}
            className="px-4 py-2 bg-purple-700 hover:bg-purple-800 rounded transition-colors"
          >
            {selectionMode ? 'Cancel Selection' : 'Select Categories'}
          </button>
          {selectionMode && selectedIds.length > 0 && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-indigo-700 hover:bg-indigo-500 rounded transition-colors"
            >
              Delete Selected
            </button>
          )}
        </div>
      )}

      <div className="category-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto scrollbar-hide">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div key={category._id} className="relative p-2 rounded">
              {selectionMode && (
                <input
                  type="checkbox"
                  checked={selectedIds.includes(category._id)}
                  onChange={() => toggleSelection(category._id)}
                  className="absolute top-2 left-2 z-10"
                />
              )}
              <CategoryButton
                categoryName={category.categoryName}
                _id={category._id}
              />
            </div>
          ))
        ) : (
          <p>No categories available.</p>
        )}
      </div>


      {showAddPopup && (
        <CreateCategoryPopup
          isOpen={showAddPopup}
          onClose={() => setShowAddPopup(false)}
          onCreated={fetchCategories}
        />
      )}
    </div>
  );
};

export default AllCategories;
