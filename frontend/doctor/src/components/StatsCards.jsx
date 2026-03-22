import React from 'react';

const StatsCards = () => {
  // Yeh data aap baad mein API se fetch kar sakte hain
  const stats = [
    {
      id: 1,
      title: "Total Patients",
      count: "1,240",
      icon: "👥",
      trend: "+12% last month",
      color: "bg-blue-50 border-blue-200 text-blue-700"
    },
    {
      id: 2,
      title: "Today's Appointments",
      count: "18",
      icon: "📅",
      trend: "4 pending",
      color: "bg-green-50 border-green-200 text-green-700"
    },
    {
      id: 3,
      title: "Avg. Consultation Time",
      count: "15 min",
      icon: "⏱️",
      trend: "-2 min from avg",
      color: "bg-purple-50 border-purple-200 text-purple-700"
    },
    {
      id: 4,
      title: "Emergency Alerts",
      count: "02",
      icon: "🚨",
      trend: "Immediate action",
      color: "bg-red-50 border-red-200 text-red-700"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((item) => (
        <div 
          key={item.id} 
          className={`p-6 rounded-2xl border transition-all hover:shadow-md ${item.color}`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold opacity-80 uppercase tracking-wider">
                {item.title}
              </p>
              <h3 className="text-3xl font-bold mt-2">{item.count}</h3>
            </div>
            <span className="text-2xl p-2 bg-white/50 rounded-lg shadow-sm">
              {item.icon}
            </span>
          </div>
          
          <div className="mt-4 flex items-center text-xs font-medium">
            <span className="opacity-70">{item.trend}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

// Yeh line sabse zaroori hai taaki error na aaye
export default StatsCards;