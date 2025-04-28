export default function Header() {
  return (
    <header className="sticky top-0 z-10 bg-white flex items-center justify-between px-8 py-4 shadow-sm">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search Here..."
          className="w-full max-w-xs px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>
      <div className="flex items-center space-x-4">
        <button className="relative">
          <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-green-500 rounded-full"></span>
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 7.165 6 9.388 6 12v2.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        <div className="flex items-center space-x-2">
          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" className="w-8 h-8 rounded-full" />
          <div>
            <div className="font-semibold text-sm">Sai Krishna</div>
            <div className="text-xs text-gray-400">Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
} 