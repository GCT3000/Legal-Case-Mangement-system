// Removed unused useCases import
import React from 'react';
import { 
  FileText, 
  Clock, 
  Plus, 
  Search,
  TrendingUp
} from 'lucide-react';
import StatCard from './StatCard';
interface DashboardProps {
  onPageChange: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onPageChange }) => {
  const [cases, setCases] = React.useState<any[]>([]);
  React.useEffect(() => {
    const storedCases = JSON.parse(localStorage.getItem('cases') || '[]');
    setCases(storedCases);
  }, []);

  // Compute stats from local cases
  const stats = {
    total: cases.length,
    underInvestigation: cases.filter((c: any) => c.status === 'Under Investigation').length,
    courtProceedings: cases.filter((c: any) => c.status === 'Court Proceedings').length,
  };

  const recentCases = [...cases]
    .sort((a, b) => new Date(b.lastUpdated || b.dateCreated).getTime() - new Date(a.lastUpdated || a.dateCreated).getTime())
    .slice(0, 5);

  const upcomingDeadlines = cases
    .filter((c: any) => c.nextHearingDate)
    .sort((a, b) => new Date(a.nextHearingDate).getTime() - new Date(b.nextHearingDate).getTime())
    .slice(0, 3);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-50';
      case 'Pending': return 'text-yellow-600 bg-yellow-50';
      case 'Completed': return 'text-blue-600 bg-blue-50';
      case 'On Hold': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'text-red-600';
      case 'High': return 'text-orange-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Road Accident Cases Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, Adv. S. Kumara Swami. Here's your accident case overview.</p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button
            onClick={() => onPageChange('add-case')}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Register Case</span>
          </button>
          <button
            onClick={() => onPageChange('search-cases')}
            className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Accident Cases"
          value={stats.total}
          icon={FileText}
          color="blue"
          onClick={() => onPageChange('case-details')}
        />
        <StatCard
          title="Under Investigation"
          value={stats.underInvestigation}
          icon={Clock}
          color="yellow"
          onClick={() => onPageChange('search-cases')}
        />
        <StatCard
          title="Court Proceedings"
          value={stats.courtProceedings}
          icon={TrendingUp}
          color="green"
        />

      </div>

  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Cases */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Accident Cases</h3>
                <button
                  onClick={() => onPageChange('case-details')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All →
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentCases.map((case_) => (
                  <div key={case_.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium text-gray-900">{case_.clientName}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(case_.status)}`}>
                          {case_.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{case_.injuryType} - {case_.accidentLocation}</p>
                      <p className="text-xs text-gray-500 mt-1">Updated: {case_.lastUpdated}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`text-sm font-medium ${getPriorityColor(case_.priority)}`}>
                        {case_.priority}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        ₹{case_.claimAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

  {/* Upcoming Deadlines & Quick Actions */}
  <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                {/* Calendar icon removed */}
                Upcoming Court Hearings
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {upcomingDeadlines.filter(c => c.nextHearingDate).length > 0 ? upcomingDeadlines.filter(c => c.nextHearingDate).map((case_) => (
                  <div key={case_.id} className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{case_.clientName}</p>
                      <p className="text-xs text-gray-600">{case_.courtName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-red-600">{case_.nextHearingDate}</p>
                      <p className="text-xs text-red-500">Next Hearing</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-500 text-center py-8">No upcoming hearings</p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <button
                  onClick={() => onPageChange('add-case')}
                  className="w-full flex items-center space-x-3 p-4 text-left bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Plus className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-700">Register New Case</span>
                </button>
                {/* Search quick action removed */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;