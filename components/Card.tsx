export default function Card({ exhibitor }) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transform hover:scale-105 transition p-6 flex flex-col justify-between min-h-[260px]">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold">{exhibitor.name}</h3>
          <span className={`text-xs px-2 py-1 rounded-full ${exhibitor.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"}`}>
            {exhibitor.status}
          </span>
        </div>
        <div className="text-xs text-gray-500 mb-2">Customer ID: {exhibitor.customerId}</div>
        <div className="mb-2">
          <div className="font-semibold text-sm">Address</div>
          <div className="text-xs text-gray-600">{exhibitor.address}</div>
        </div>
        <div className="mb-2">
          <div className="text-xs">Phone: <span className="text-gray-700">{exhibitor.phone}</span></div>
          <div className="text-xs">Email: <span className="text-gray-700">{exhibitor.email}</span></div>
        </div>
        <div>
          <div className="font-semibold text-sm">Booth Info</div>
          <div className="text-xs text-gray-600">{exhibitor.boothInfo}</div>
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <button className="text-indigo-600 hover:underline text-sm font-medium">Booth Details &rarr;</button>
      </div>
    </div>
  );
} 