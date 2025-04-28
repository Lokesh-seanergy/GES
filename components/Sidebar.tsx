export default function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-indigo-900 text-white flex flex-col z-20">
      <div className="flex items-center justify-center h-20 border-b border-indigo-800">
        <span className="text-2xl font-bold tracking-wide">GES</span>
      </div>
      <nav className="flex-1 py-6">
        <ul className="space-y-2">
          {["Dashboard", "Shows", "Orders", "Exhibitors", "Customers", "Reports", "Settings"].map(link => (
            <li key={link}>
              <a href="#" className="block px-6 py-3 hover:bg-indigo-800 rounded transition">{link}</a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
} 