import React, { useState } from 'react';
import Modal from './Modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateCategoryPopup({ isOpen, onClose, onCreated }: Props) {
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('http://localhost:3000/category', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categoryName: name }),
    });
    setName('');
    onCreated();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Category">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 rounded bg-gray-700"
          required
        />
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="bg-gray-500 px-4 py-2 rounded">Cancel</button>
          <button type="submit" className="bg-purple-600 px-4 py-2 text-white rounded">Add</button>
        </div>
      </form>
    </Modal>
  );
}
