'use client';

import React from "react";
import Modal from "./Modal"; // import the generic Modal

interface LogoutPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmLogout: () => void;
}

const LogoutPopup: React.FC<LogoutPopupProps> = ({ isOpen, onClose, onConfirmLogout }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Logout">
      <div className="text-center">
        <p>Are you sure you want to log out?</p>
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}  // Close the modal
            className="px-4 py-2 bg-gray-400 text-black rounded"
          >
            Cancel
          </button>
          <button
            onClick={onConfirmLogout}  // Confirm and log out
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LogoutPopup;
