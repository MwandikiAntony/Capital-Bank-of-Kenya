import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UpdateProfile({ currentUser }) {
  const [accountDetails, setAccountDetails] = useState({
    balance: 0,
    account_number: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/auth/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("API response:", res.data);
    
        const user = res.data.user;
    
        setAccountDetails({
          balance: user.balance,
          account_number: user.account_number || "N/A",
        });
      } catch (err) {
        console.error("Failed to fetch account info:", err);
        setAccountDetails({
          balance: "Error",
          account_number: "Error",
        });
      } finally {
        setLoading(false);
      }
    };
    

    fetchAccount();
  }, []);

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">My Profile</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="space-y-4">
          <ProfileItem label="Full Name" value={currentUser?.name || "N/A"} />
          <ProfileItem label="Email" value={currentUser?.email || "N/A"} />
          <ProfileItem label="Phone Number" value={currentUser?.phone || "N/A"} />
          <ProfileItem label="National ID" value={currentUser?.id_number || "N/A"} />
          <ProfileItem label="Account Number" value={accountDetails.account_number} />
          <ProfileItem
            label="Account Balance"
            value={`Ksh ${Number(accountDetails.balance).toLocaleString()}`}
          />
        </div>
      )}
    </div>
  );
}

function ProfileItem({ label, value }) {
  return (
    <div className="flex justify-between items-center border-b py-2 dark:border-gray-700">
      <span className="font-semibold text-gray-700 dark:text-gray-300">{label}</span>
      <span className="text-gray-900 dark:text-gray-100">{value}</span>
    </div>
  );
}
