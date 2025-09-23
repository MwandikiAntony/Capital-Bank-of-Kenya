// client/src/pages/Dashboard.js
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FaWallet, FaExchangeAlt, FaUserEdit, FaCog, FaBell, FaCreditCard, FaFileInvoice, FaChartLine, FaBars } from "react-icons/fa";
import UpdateProfile from "../components/UpdateProfile";
import LoanApplication from "../components/LoanApplication";

// Overview Component
function Overview({ balance, transactions, darkMode }) {
  return (
    <>
      <div className={`${darkMode ? "bg-gray-700 text-white" : "bg-gradient-to-r from-indigo-500 to-blue-600 text-white"} p-6 rounded-2xl shadow mb-8`}>
        <p className="text-sm">Current Balance</p>
        <h2 className="text-3xl font-bold mt-1">Ksh{balance}</h2>
      </div>
      <div className={`${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"} p-6 rounded-xl shadow mb-8`}>
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        <ul className="divide-y divide-gray-300 dark:divide-gray-600">
          {transactions.length > 0 ? transactions.map(tx => (
            <li key={tx.id} className="py-3 flex justify-between text-sm">
              <span className="font-medium">{tx.type} - Ksh{tx.amount}</span>
              <span className="text-gray-500 dark:text-gray-400">{new Date(tx.created_at).toLocaleString()}</span>
            </li>
          )) : <p className="text-gray-500 dark:text-gray-400 text-sm">No transactions yet.</p>}
        </ul>
      </div>
    </>
  );
}

// Deposit / Withdraw Component (modified)
function DepositWithdraw({ amount, setAmount, deposit, withdraw, simulateMpesa, phone, darkMode }) {
  return (
    <div className={`${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"} p-6 rounded-xl shadow w-full mb-8`}>
      <h3 className="font-semibold mb-3 flex items-center gap-2"><FaWallet /> Deposit / Withdraw</h3>
      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" className="w-full p-3 border rounded-lg mb-3 focus:ring focus:ring-blue-300 dark:bg-gray-800 dark:border-gray-600"/>
      <div className="flex gap-2">
        <button onClick={deposit} className="flex-1 bg-green-500 text-white py-2 rounded-lg shadow hover:bg-green-600">Deposit</button>
        <button onClick={withdraw} className="flex-1 bg-red-500 text-white py-2 rounded-lg shadow hover:bg-red-600">Withdraw</button>
        <button onClick={() => simulateMpesa()} className="flex-1 bg-yellow-500 text-white py-2 rounded-lg shadow hover:bg-yellow-600">Simulate M-Pesa</button>
      </div>
      <p className="text-xs mt-3 text-gray-500 dark:text-gray-400">Simulate M-Pesa deposit (for development)</p>
    </div>
  );
}


// Transfer Funds Component
function TransferFunds({ amount, setAmount, recipient, setRecipient, transfer, darkMode }) {
  return (
    <div className={`${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"} p-6 rounded-xl shadow w-full mb-8`}>
      <h3 className="font-semibold mb-3 flex items-center gap-2"><FaExchangeAlt /> Transfer Funds</h3>
      <input type="email" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="Recipient Email" className="w-full p-3 border rounded-lg mb-3 focus:ring focus:ring-blue-300 dark:bg-gray-800 dark:border-gray-600"/>
      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" className="w-full p-3 border rounded-lg mb-3 focus:ring focus:ring-blue-300 dark:bg-gray-800 dark:border-gray-600"/>
      <button onClick={transfer} className="w-full bg-blue-600 text-white py-2 rounded-lg shadow hover:bg-blue-700">Send</button>
    </div>
  );
}

// Update Profile Component

// Settings Component
function Settings({ darkMode, toggleDarkMode }) {
  return (
    <div className={`${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"} p-6 rounded-xl shadow w-full mb-8`}>
      <h3 className="font-semibold mb-3 flex items-center gap-2"><FaCog /> Settings</h3>
      <div className="flex items-center gap-4 mb-4">
        <span>Dark Mode</span>
        <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} className="h-5 w-5"/>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold">Other Settings:</p>
        <label className="flex items-center gap-2"><input type="checkbox" className="h-5 w-5" /> Receive Notifications</label>
        <label className="flex items-center gap-2"><input type="checkbox" className="h-5 w-5" /> Two-factor Authentication</label>
        <label className="flex items-center gap-2"><input type="checkbox" className="h-5 w-5" /> Allow International Transfers</label>
      </div>
    </div>
  );
}

// Sidebar Transactions Widget
function SidebarTransactions({ transactions, darkMode }) {
  return (
    <div className={`${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900 shadow"} p-4 rounded-xl mt-6`}>
      <h4 className="font-semibold mb-2 flex items-center gap-2"><FaFileInvoice /> Recent Transactions</h4>
      <ul className="divide-y divide-gray-300 dark:divide-gray-600 max-h-64 overflow-y-auto text-sm">
        {transactions.length > 0 ? transactions.map(tx => (
          <li key={tx.id} className="py-2 flex justify-between">
            <span>{tx.type}</span>
            <span>${tx.amount}</span>
          </li>
        )) : <p className="text-gray-500 dark:text-gray-400">No transactions yet.</p>}
      </ul>
    </div>
  );
}

// Debit Card Component
function DebitCard({ card, darkMode, onView }) {
  return (
    <div className={`${darkMode ? "bg-gray-700 text-white" : "bg-gradient-to-r from-blue-400 to-indigo-600 text-white"} p-6 rounded-xl shadow cursor-pointer`} onClick={() => onView(card)}>
      <p className="text-sm">Card Holder</p>
      <h3 className="text-lg font-semibold">{card.holder}</h3>
      <p className="mt-4 text-sm">Card Number</p>
      <h2 className="text-xl tracking-widest">{card.number.replace(/\d{4}(?=.)/g, "**** ")}</h2>
      <div className="flex justify-between mt-4 text-sm">
        <span>Expiry: {card.expiry}</span>
        <span>CVV: ***</span>
      </div>
    </div>
  );
}
// Notifications Component
function Notifications({ notifications, darkMode }) {
  return (
    <div className={`${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900 shadow"} p-4 rounded-xl mt-6`}>
      <h4 className="font-semibold mb-2 flex items-center gap-2"><FaBell /> Recent Notifications</h4>
      <ul className="divide-y divide-gray-300 dark:divide-gray-600 max-h-64 overflow-y-auto text-sm">
        {notifications.length > 0 ? notifications.map((note, idx) => (
          <li key={idx} className="py-2 flex justify-between">
            <span>{note.message}</span>
            <span className="text-gray-500 dark:text-gray-400 text-xs">{new Date(note.created_at).toLocaleTimeString()}</span>
          </li>
        )) : <p className="text-gray-500 dark:text-gray-400 text-sm">No notifications yet.</p>}
      </ul>
    </div>
  );
}

// Loans Component


// Add Card Modal
function AddCardModal({ show, onClose, onAdd }) {
  const [number, setNumber] = useState("");
  const [holder, setHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const handleAdd = () => {
    if (!number || !holder || !expiry || !cvv) return;
    onAdd({ number, holder, expiry, cvv });
    setNumber(""); setHolder(""); setExpiry(""); setCvv("");
    onClose();
  };

  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-80">
        <h2 className="text-lg font-semibold mb-4">Add Card</h2>
        <input value={holder} onChange={e => setHolder(e.target.value)} placeholder="Card Holder" className="w-full p-2 mb-2 border rounded"/>
        <input value={number} onChange={e => setNumber(e.target.value)} placeholder="Card Number" className="w-full p-2 mb-2 border rounded"/>
        <input value={expiry} onChange={e => setExpiry(e.target.value)} placeholder="Expiry MM/YY" className="w-full p-2 mb-2 border rounded"/>
        <input value={cvv} onChange={e => setCvv(e.target.value)} placeholder="CVV" className="w-full p-2 mb-2 border rounded"/>
        <div className="flex justify-end gap-2 mt-2">
          <button onClick={onClose} className="px-3 py-1 bg-gray-400 rounded">Cancel</button>
          <button onClick={handleAdd} className="px-3 py-1 bg-green-500 text-white rounded">Add</button>
        </div>
      </div>
    </div>
  );
}

// Card Details Modal
function CardDetailsModal({ card, onClose }) {
  if (!card) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-80">
        <h2 className="text-lg font-semibold mb-4">Card Details</h2>
        <p><strong>Holder:</strong> {card.holder}</p>
        <p><strong>Number:</strong> {card.number}</p>
        <p><strong>Expiry:</strong> {card.expiry}</p>
        <p><strong>CVV:</strong> {card.cvv}</p>
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="px-3 py-1 bg-gray-400 rounded">Close</button>
        </div>
      </div>
    </div>
  );
}

// Main Dashboard
export default function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
 
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loans] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("user"));
    const [phone, setPhone] = useState(currentUser?.phone || "");
  const [, setNationalId] = useState(currentUser?.national_id || "");
 


  //Deposit/Withdraw
  const simulateMpesa = async () => {
  if (!amount) return alert('Enter amount to simulate');
  const payload = {
    phone: phone || (user && user.phone) || "254723456786", // prioritize stored phone
    amount,
    userId: user?.id || null
  };

  try {
    const res = await axios.post('http://localhost:5000/api/mpesa/simulate', payload);
    // res.data includes newBalance and message
    addNotification(`Simulated M-Pesa deposit of ${amount} KES completed.`);
    setAmount('');
    fetchAccount(); // refresh balance & transactions
    alert(res.data.ResponseDescription || 'Simulated deposit successful');
  } catch (err) {
    console.error(err);
    alert('Simulation failed');
  }
};





  const addNotification = (message) => {
  setNotifications(prev => [
    { message, created_at: new Date() },
    ...prev
  ]);
};

  
  // Cards State
  const [cards, setCards] = useState([]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [viewCard, setViewCard] = useState(null);

  const token = localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user"));
  

  const api = axios.create({
    baseURL: "http://localhost:5000/api/account",
    headers: { Authorization: `Bearer ${token}` },
  });

  const fetchAccount = useCallback(async () => {
    try {
      const res = await api.get("/");
      setBalance(res.data.balance);
      setTransactions(res.data.transactions);
      if (storedUser) {
        setUser(storedUser);
        setPhone(storedUser.phone || "");
        setNationalId(storedUser.id_number || "");
      }
    } catch (err) {
      console.error("Error fetching account:", err.response?.data || err.message);
    }
  }, [api, storedUser]);

  useEffect(() => { fetchAccount(); }, [fetchAccount]);

  const deposit = async () => {
  if (!amount) return;
  await api.post("/deposit", { amount });
  addNotification(`Deposited Ksh ${amount} successfully.`);
  setAmount("");
  fetchAccount();
};

const withdraw = async () => {
  if (!amount) return;
  await api.post("/withdraw", { amount });
  addNotification(`Withdrew Ksh ${amount} successfully.`);
  setAmount("");
  fetchAccount();
};

const transfer = async () => {
  if (!recipient || !amount) return;
  await api.post("/transfer", { email: recipient, amount });
  addNotification(`Transferred $${amount} to ${recipient} successfully.`);
  setAmount("");
  setRecipient("");
  fetchAccount();
};






  const addCard = (card) => { setCards(prev => [...prev, card]); };

  const handleLogout = () => { localStorage.clear(); window.location.href = "/login"; };
  const toggleDarkMode = () => { setDarkMode(!darkMode); localStorage.setItem("darkMode", !darkMode); };

  const sidebarBtnClass = (section) => `flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition ${activeSection === section ? "bg-blue-600 text-white" : ""}`;

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} min-h-screen flex flex-col overflow-hidden`}>
      {/* Header */}
      <header className={`shadow flex justify-between items-center px-6 py-4 ${darkMode ? "bg-gray-900 text-white" : "bg-blue-800 text-white"}`}>
        <div className="flex items-center gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-2xl"><FaBars /></button>
          <h1 className="text-2xl font-bold">🏦 Capital Bank</h1>
        </div>
        <div className="flex items-center gap-4">
          {user && <span className="font-semibold">{user.name}</span>}
          <button onClick={handleLogout} className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg shadow">Logout</button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className={`${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900 shadow"} w-64 p-6 flex-shrink-0 flex flex-col fixed md:static top-0 left-0 h-full transform transition-transform duration-300 z-40 overflow-y-auto
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
          <nav className="flex flex-col gap-2 mb-4">
            {["overview","deposit","transfer","profile","settings","notifications","cards","limits","statements"].map(section => (
              <button
                key={section}
                onClick={() => { setActiveSection(section); setSidebarOpen(false); }}
                className={sidebarBtnClass(section)}
              >
                {section === "overview" && <><FaWallet /> Overview</>}
                {section === "deposit" && <><FaWallet /> Deposit / Withdraw</>}
                {section === "transfer" && <><FaExchangeAlt /> Transfer Funds</>}
                {section === "profile" && <><FaUserEdit /> Update Profile</>}
                {section === "settings" && <><FaCog /> Settings</>}
                {section === "notifications" && <><FaBell /> Notifications</>}
                {section === "cards" && <><FaCreditCard /> Cards</>}
                {section === "limits" && <><FaChartLine /> Limits</>}
                {section === "statements" && <><FaFileInvoice /> Statements</>}
              </button>
            ))}
          </nav>
          <SidebarTransactions transactions={transactions} darkMode={darkMode} />
        </aside>
         

        {/* Main Content */}
<main className="flex-1 px-6 py-8 overflow-auto">
  {activeSection === "overview" && 
    <Overview balance={balance} transactions={transactions} darkMode={darkMode} />
  }

  {activeSection === "deposit" &&
    <>
      <DepositWithdraw
  amount={amount}
  setAmount={setAmount}
  deposit={deposit}
  withdraw={withdraw}
  simulateMpesa={simulateMpesa}
  phone={phone}
  darkMode={darkMode}
/>

      <Overview balance={balance} transactions={transactions} darkMode={darkMode} />
    </>
  }
  
    

  {activeSection === "transfer" &&
    <>
      <TransferFunds 
        amount={amount} 
        setAmount={setAmount} 
        recipient={recipient} 
        setRecipient={setRecipient} 
        transfer={transfer} 
        darkMode={darkMode} 
      />
      <Overview balance={balance} transactions={transactions} darkMode={darkMode} />
    </>
  }

 
      {/* 👇 ADD THIS SECTION FOR PROFILE */}
  {activeSection === "profile" && (
    <UpdateProfile currentUser={currentUser} />
  )}



  {activeSection === "settings" &&
    <Settings darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
  }

  {activeSection === "cards" &&
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Your Cards</h2>
        <button 
          onClick={() => setShowAddCard(true)} 
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Add Card
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.length > 0 ? cards.map((card, idx) => (
          <DebitCard key={idx} card={card} darkMode={darkMode} onView={setViewCard} />
        )) : (
          <p className="text-gray-500 dark:text-gray-400">No cards added yet.</p>
        )}
      </div>

      <AddCardModal 
        show={showAddCard} 
        onClose={() => setShowAddCard(false)} 
        onAdd={addCard} 
      />
      <CardDetailsModal 
        card={viewCard} 
        onClose={() => setViewCard(null)} 
      />
    </>
  }

  {/* Placeholder sections for notifications, limits, statements */}
  {activeSection === "notifications" && (
  <>
    <Notifications notifications={notifications} darkMode={darkMode} />
  </>
)}

  
 
{/* LoanApplication should only show in Limits */}
{activeSection === "limits" && (
  <div className={`${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900 shadow"} p-4 rounded-xl`}>
    <h4 className="font-semibold mb-2">Loan Request</h4>

    {/* LoanApplication component handles the form */}
    <LoanApplication userId={user?.id} />

    <h5 className="font-semibold mt-4">Loan Requests</h5>
    <ul className="divide-y divide-gray-300 dark:divide-gray-600 max-h-48 overflow-y-auto text-sm">
      {loans.map((loan) => (
        <li key={loan.id} className="py-2 flex justify-between">
          <span>Ksh{loan.amount} - {loan.duration} ({loan.status})</span>
          <span className="text-xs text-gray-500">
            {loan.requested_at.toLocaleDateString()}
          </span>
        </li>
      ))}
    </ul>
  </div>
)}


  {activeSection === "statements" && <p>Statements section coming soon.</p>}
</main>

      </div>
    </div>
  );
}
