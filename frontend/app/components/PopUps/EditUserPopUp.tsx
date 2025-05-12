'use client';
import { useState } from 'react';
import Modal from './Modal';
import { User } from '../../Types';

interface EditUserPopupProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

const EditUserPopup: React.FC<EditUserPopupProps> = ({ isOpen, onClose, user }) => {
  const [form, setForm] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    bio: user.bio || '',
    role: user.role ?? 1, // Default to user (1)
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Convert role to number before saving in state
    const newValue = name === 'role' ? parseInt(value, 10) : value;

    setForm(prev => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/user/admin/${user._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(`Update failed: ${error.message || 'Unknown error'}`);
        return;
      }

      alert('User updated successfully!');
      onClose();
    } catch (err) {
      console.error(err);
      alert('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit User">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-white">First Name</label>
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-white">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-white">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-white">Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
          ></textarea>
        </div>

        {/* Role Dropdown */}
        <div>
          <label className="block mb-1 text-sm font-medium text-white">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
          >
            <option value={0}>Admin</option>
            <option value={1}>User</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-black rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditUserPopup;
