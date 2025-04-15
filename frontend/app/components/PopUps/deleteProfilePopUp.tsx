// DeleteProfilePopup.tsx (refactored)
'use client';

import { DeleteProfilePopupProps } from "../../Types";
import Modal from "./Modal";

export default function DeleteProfilePopup({ onCancel, onConfirm }: DeleteProfilePopupProps) {
  return (
    <Modal isOpen={true} onClose={onCancel} title="Confirm Deletion">
      <div className="text-center">
        <p>Are you sure you want to delete your profile?</p>
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-400 text-black rounded"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
}
