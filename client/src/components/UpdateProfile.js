import React, { useState } from "react";

export default function UpdateProfile({ currentUser }) {
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [nationalId, setNationalId] = useState(currentUser?.national_id || "");

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:5000/api/users/${currentUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phone,
          national_id: nationalId,
        }),
        credentials: "include", // If you're using cookies/sessions for auth
      });

      if (res.ok) {
        alert("Profile updated successfully!");
      } else {
        const errorData = await res.json();
        alert(`Failed to update profile: ${errorData.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Error updating profile.");
    }
  };

  return (
    <div className="p-4 border rounded max-w-md mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">Update Profile</h2>
      <form onSubmit={handleUpdate}>
        <div className="mb-4">
          <label className="block mb-1">Phone Number</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">National ID</label>
          <input
            type="text"
            value={nationalId}
            onChange={(e) => setNationalId(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Update
        </button>
      </form>
    </div>
  );
}
