import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { Card } from '../components/ui/Card';

import { format, subDays, isWithinInterval, parseISO } from 'date-fns';

const COLORS = ['#6366f1', '#60a5fa', '#f59e42', '#10b981', '#ef4444', '#a78bfa', '#fbbf24', '#6ee7b7'];

const ReportsPage: React.FC = () => {
  const [cases, setCases] = React.useState<any[]>([]);
  React.useEffect(() => {
    const loadCases = () => {
      const storedCases = JSON.parse(localStorage.getItem('cases') || '[]');
      setCases(storedCases);
    };
    loadCases();
    window.addEventListener('storage', loadCases);
    return () => window.removeEventListener('storage', loadCases);
  }, []);

  // Aggregate cases by month
  const casesPerMonth = useMemo(() => {
    const map: { [key: string]: number } = {};
    cases.forEach((c) => {
      const month = format(parseISO(c.dateCreated), 'yyyy-MM');
      map[month] = (map[month] || 0) + 1;
    });
    return Object.entries(map).map(([month, count]) => ({ month, count }));
  }, [cases]);

  // Document uploads per type

  // Upcoming hearings within 30 days
  const upcomingHearings = useMemo(() => {
    const now = new Date();
    const future = subDays(now, -30);
    return cases.filter(c => c.nextHearingDate && isWithinInterval(parseISO(c.nextHearingDate), { start: now, end: future }));
  }, [cases]);

  // Closed vs Active cases
  const closedActive = useMemo(() => {
    let closed = 0, active = 0;
    cases.forEach(c => {
      if (c.status === 'Closed') closed += 1;
      else active += 1;
    });
    return [
      { name: 'Closed', value: closed },
      { name: 'Active', value: active },
    ];
  }, [cases]);

  // Top cards
  const totalCases = cases.length;
  const activeCases = closedActive[1].value;
  const closedCases = closedActive[0].value;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Statistics & Analytics Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card title="Total Cases" value={totalCases} color="blue" />
        <Card title="Active Cases" value={activeCases} color="green" />
        <Card title="Closed Cases" value={closedCases} color="red" />
      </div>
      <div className="grid grid-cols-1 gap-10 mb-10">
        <div className="bg-white rounded-xl shadow p-8">
          <h2 className="text-xl font-semibold mb-4">Cases Added Per Month</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={casesPerMonth}>
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#6366f1" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Closed vs Active Cases</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={closedActive} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} label>
                {closedActive.map((_, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Hearings (Next 30 Days)</h2>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-2 px-3 text-gray-700">Client</th>
                <th className="py-2 px-3 text-gray-700">Date</th>
                <th className="py-2 px-3 text-gray-700">Location</th>
                <th className="py-2 px-3 text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {upcomingHearings.length === 0 ? (
                <tr><td colSpan={4} className="py-4 text-gray-500 text-center">No upcoming hearings</td></tr>
              ) : (
                upcomingHearings.map(c => (
                  <tr key={c.id} className="border-b">
                    <td className="py-2 px-3 font-medium text-blue-700">{c.clientName}</td>
                    <td className="py-2 px-3">{c.nextHearingDate}</td>
                    <td className="py-2 px-3">{c.accidentLocation}</td>
                    <td className="py-2 px-3">{c.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
