import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { adminAPI } from '../../services/api';
import AdminSidebar from './components/AdminSidebar';
import SummaryCards from './components/SummaryCards';
import UsersTable from './components/UsersTable';
import BehaviorPanel from './components/BehaviorPanel';
import ForensicLogPanel from './components/ForensicLogPanel';
import SecurityLogTable from './components/SecurityLogTable';
// SOC Redesign components
import ActivityGraph from './components/Overview/ActivityGraph';
import RiskDistribution from './components/Overview/RiskDistribution';
import ClickstreamAnalysis from './components/Overview/ClickstreamAnalysis';
import SessionAnalytics from './components/Overview/SessionAnalytics';
import GeoLocationHeatmap from './components/Overview/GeoLocationHeatmap';
import LiveAlertsPanel from './components/Overview/LiveAlertsPanel';
import UserClickstreamList from './components/Overview/UserClickstreamList';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [anomalies, setAnomalies] = useState(null);
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState([]);
  const [socMetrics, setSocMetrics] = useState(null);
  const [clickstreamData, setClickstreamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, anomaliesRes, activitiesRes, usersRes, socMetricsRes, clickstreamRes] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getAnomalies(),
        adminAPI.getAllActivities({ limit: 50 }),
        adminAPI.getAllUsers(),
        adminAPI.getSOCMetrics(),
        adminAPI.getClickstreamMatrix()
      ]);

      setStats(statsRes.data.stats);
      setAnomalies(anomaliesRes.data.anomalies);
      setActivities(activitiesRes.data.activities);
      setSocMetrics(socMetricsRes.data.data);
      setClickstreamData(clickstreamRes.data.data);

      // Filter out soft-deleted users for the table
      const activeUsers = (usersRes.data.users || []).filter(u => !u.isDeleted);
      setUsers(activeUsers);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-theme bg-admin-bg text-white min-h-screen w-full flex font-sans relative">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px] opacity-50 pointer-events-none z-0"></div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar Navigation */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out h-screen`}>
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setSelectedUser(null);
            setIsMobileMenuOpen(false);
          }}
          handleLogout={handleLogout}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative z-10 w-full md:pl-72 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8 flex flex-col relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 shrink-0 gap-4 md:gap-0 border-b border-white/5 pb-4 w-full">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <button
                className="md:hidden p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu size={24} />
              </button>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-white tracking-wide uppercase truncate">
                {activeTab === 'overview' && 'SOC Overview'}
                {activeTab === 'users' && 'User Governance'}
                {activeTab === 'monitoring' && 'Behavioral Monitoring'}
              </h1>
            </div>
            <div className="text-[10px] md:text-xs lg:text-sm text-gray-500 font-mono tracking-widest bg-black/40 px-3 py-1.5 rounded border border-white/10 uppercase self-end md:self-auto">
              System Active <span className="hidden sm:inline">• {new Date().toLocaleTimeString()}</span>
            </div>
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-admin-accent"></div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col space-y-6 flex-1">
              {selectedUser ? (
                <ForensicLogPanel user={selectedUser} onBack={() => setSelectedUser(null)} />
              ) : (
                <>
                  {activeTab === 'overview' && socMetrics && (
                    <div className="flex flex-col flex-1 space-y-4">
                      {/* Row 1: KPI Cards */}
                      <SummaryCards kpi={socMetrics.kpi} />

                      <div className="flex flex-col gap-4 flex-1 pb-6 w-full">
                        {/* Row 2: Graph, Risk, Alerts */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[350px]">
                          <div className="col-span-1 lg:col-span-5 h-[350px] lg:h-auto">
                            <ActivityGraph data={socMetrics.activityTrend} />
                          </div>
                          <div className="col-span-1 lg:col-span-4 h-[350px] lg:h-auto">
                            <RiskDistribution data={socMetrics.riskDistribution} />
                          </div>
                          <div className="col-span-1 lg:col-span-3 h-[350px] lg:h-auto">
                            <LiveAlertsPanel alerts={socMetrics.alerts} />
                          </div>
                        </div>

                        {/* Row 3: Clickstream Sankey Flow */}
                        <div className="w-full">
                          <ClickstreamAnalysis data={clickstreamData} />
                        </div>

                        {/* Row 4: Live Security Events */}
                        <div className="w-full min-h-[350px]">
                          {/* Re-using your beautifully crafted SecurityLogTable we built previously */}
                          <SecurityLogTable activities={activities.length > 0 ? activities.slice(0, 10) : []} />
                        </div>

                        {/* Row 5: Map & Sessions */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[400px]">
                          <div className="h-auto">
                            <SessionAnalytics data={socMetrics.sessionAnalytics} />
                          </div>
                          <div className="h-[400px] lg:h-auto min-h-[400px]">
                            <GeoLocationHeatmap />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'users' && (
                    <div className="flex flex-col flex-1 space-y-6">
                      <SummaryCards stats={stats} />
                      <div className="flex-1">
                        <UsersTable users={users} fetchUsers={fetchDashboardData} onSelectUser={setSelectedUser} title="User Governance Directory" />
                      </div>
                    </div>
                  )}

                  {activeTab === 'clickstream' && (
                    <div className="flex flex-col flex-1 h-full min-h-[600px] gap-6">
                      <div className="bg-admin-bg/50 border border-white/5 p-6 rounded-lg">
                        <h2 className="text-xl font-bold text-white mb-2 tracking-wide uppercase">Markov Transition Matrix Engine</h2>
                        <p className="text-gray-400 text-sm">
                          This system performs real-time Behavioral Probability Anomaly Detection.
                          It actively tracks all React Router context transitions globally across the application, computing the absolute probability `P(Target | Source)` of every edge maneuver.
                        </p>
                      </div>
                      <div className="flex-1 w-full min-h-[400px]">
                        <ClickstreamAnalysis data={clickstreamData} />
                      </div>
                      <div className="w-full min-h-[400px]">
                        <UserClickstreamList users={users} />
                      </div>
                    </div>
                  )}

                  {activeTab === 'monitoring' && (
                    <div className="flex flex-col flex-1 space-y-6">
                      <BehaviorPanel anomalies={anomalies} />
                      <div className="flex-1">
                        <SecurityLogTable activities={activities} />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
