'use client';

import { useState } from 'react';
import Modal from './Modal';

interface ChangePasswordPopupProps {
  onClose: () => void;
}

const ChangePasswordPopup: React.FC<ChangePasswordPopupProps> = ({ onClose }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/auth/changePassword', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to change password');
      }

      alert('Password changed successfully!');
      onClose();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Change Password">
      <div className="flex flex-col gap-4">
        <input
          type="password"
          placeholder="Current Password"
          className="p-2 rounded bg-gray-700 text-white"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          className="p-2 rounded bg-gray-700 text-white"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <div className="flex justify-end gap-4 mt-4">
          <button
            className="px-4 py-2 bg-gray-500 rounded hover:bg-gray-600"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ChangePasswordPopup;
