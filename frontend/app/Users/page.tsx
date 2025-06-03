"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "../Types";
import AddUserPopup from "../components/PopUps/AddUserPopUp"; // We'll create this component below

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/user")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);
  console.log(users);

  const handleAddUser = (newUser: User) => {
  setUsers((prev) => [...prev, newUser]);
  setShowModal(false);
};

const handleUserUpdate = (updatedUser: User) => {
  setSelectedUser(updatedUser);
};


  if (loading) return <p className="text-white p-6">Loading users...</p>;
  if (error) return <p className="text-red-500 p-6">Error: {error}</p>;

  return (
    <div className="height bg-gray-900 text-white p-8 space-y-6 scrollable-container scrollbar-hide">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Users</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-white"
        >
          + Add User
        </button>
      </div>

      <div className="overflow-x-auto max-h-[80vh] overflow-y-auto rounded-lg shadow-md border border-gray-700">
        <table className="min-w-full divide-y divide-gray-700 text-sm">
          <thead className="bg-gray-800 text-gray-300 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3"># Podcasts</th>
              <th className="px-6 py-3"># Episodes</th>
              <th className="px-6 py-3">Created</th>
              <th className="px-6 py-3">Updated</th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-800">
            {users.map((user) => {
              const uploadedEpisodeCount =
                user.podcasts?.reduce((acc: number, podcast: any) => acc + (podcast.episodes?.length || 0), 0) || 0;

              return (
                <tr
                  key={user._id}
                  onClick={() => router.push(`/Users/${user._id}`)}
                  className="hover:bg-gray-800 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-white">{user.firstName} {user.lastName}</td>
                  <td className="px-6 py-4 text-gray-300">{user.email}</td>
                  <td className="px-6 py-4">{user.role === 0 ? "Admin" : "User"}</td>
                  <td className="px-6 py-4">{user.podcasts?.length ?? 0}</td>
                  <td className="px-6 py-4">{uploadedEpisodeCount}</td>
                  <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{new Date(user.updatedAt).toLocaleDateString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <AddUserPopup
          onClose={() => setShowModal(false)}
          onSave={handleAddUser}
        />

      )}
    </div>
  );
}
