// app/components/EditProfilePopup.tsx
'use client';

interface EditProfilePopupProps {
    user: { 
      username: string;
      bio?: string, 
      profilePic?: string }; // Add the user property
    onClose: () => void;
    onSave: (data: { username: string; bio: string }) => void;
  }

export default function EditProfilePopup({ onClose, onSave }: EditProfilePopupProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedData = {
      username: "example", // replace with real state if needed
      bio: "new bio",       // replace with real state if needed
    };
    onSave(updatedData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white text-black p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block mb-1">Username</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter your username"
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1">Bio</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Write your bio"
            ></textarea>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
