'use client';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { User } from '../../Types';  // Import the User interface
import UserCard from '../../components/UserCard/UserCard';
import EditUserPopup from '../../components/PopUps/EditUserPopUp';
import DeleteProfilePopup from '../../components/PopUps/deleteProfilePopUp';
import { useRouter } from 'next/navigation';


export default function UserDetailPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const router = useRouter();

  

  useEffect(() => {
    // Fetch user details from the backend
    fetch(`http://localhost:3000/user/${id}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error('Error fetching user:', err));
  }, [id]);

  if (!user) return <div>Loading...</div>;

  const handleEdit = () => setEditOpen(true);
  const handleDelete = () => setDeleteOpen(true);
  const handleCloseEdit = () => setEditOpen(false);
  const handleCloseDelete = () => setDeleteOpen(false);


  const handleDeleteUser = async () => {
    try {
      const response = await fetch(`http://localhost:3000/user/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          //  Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('User deleted successfully!');
        router.push('/Users'); 
      } else {
        alert('Error deleting user');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-900 text-white px-4 py-10">
      <div className="max-w-3xl w-full bg-gray-800 shadow-2xl rounded-2xl p-8 space-y-8">
        
        {/* Title Centered */}
        <h1 className="text-3xl font-semibold text-center text-purple-400">
          User Details
        </h1>
  
        {/* User Card */}
        <div className="flex justify-center">
          <UserCard userId={id as string} />
        </div>
  
        {/* Buttons Centered and Styled */}
        <div className="flex justify-center gap-6 mt-6">
          <button
            onClick={handleEdit}
            className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white px-6 py-2 rounded-xl transition"
          >
            Edit User
          </button>
          <button
            onClick={handleDelete}
            className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white px-6 py-2 rounded-xl transition"
          >
            Delete User
          </button>
        </div>
  
        {/* Modals */}
        {isEditOpen && (
          <EditUserPopup
            isOpen={isEditOpen}
            onClose={handleCloseEdit}
            user={user}
          />
        )}
        {isDeleteOpen && (
          <DeleteProfilePopup
            onCancel={handleCloseDelete}
            onConfirm={handleDeleteUser}
          />
        )}
      </div>
    </div>
  );
  
}
