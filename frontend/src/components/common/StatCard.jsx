import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'indigo' }) => {
  const colorMap = {
    indigo: 'bg-indigo-500/10 text-indigo-600 border-indigo-100',
    emerald: 'bg-emerald-500/10 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-500/10 text-amber-600 border-amber-100',
    purple: 'bg-purple-500/10 text-purple-600 border-purple-100',
    rose: 'bg-rose-500/10 text-rose-600 border-rose-100',
    cyan: 'bg-cyan-500/10 text-cyan-600 border-cyan-100',
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-3.5 rounded-xl border ${colorMap[color] || colorMap.indigo}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};
