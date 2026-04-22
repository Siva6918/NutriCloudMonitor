import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Sparkles, ShieldCheck, Activity } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { adminAPI } from '../../services/api';
import AdminSidebar from './components/AdminSidebar';
import SummaryCards from './components/SummaryCards';
import UsersTable from './components/UsersTable';
import BehaviorPanel from './components/BehaviorPanel';
import ForensicLogPanel from './components/ForensicLogPanel';
import SecurityLogTable from './components/SecurityLogTable';
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

      const activeUsers = (usersRes.data.users || []).filter((u) => !u.isDeleted);
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

  const getPageTitle = () => {
    if (activeTab === 'overview') return 'SOC Overview';
    if (activeTab === 'users') return 'User Governance';
    if (activeTab === 'monitoring') return 'Behavioral Monitoring';
    if (activeTab === 'clickstream') return 'Clickstream Intelligence';
    return 'Admin Dashboard';
  };

  return (
    <div className="admin-theme min-h-screen w-full flex font-sans relative overflow-hidden bg-[#07111f] text-white">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-24 left-[-10%] h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-[-6%] top-32 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-violet-500/15 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.18]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.08),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(217,70,239,0.08),transparent_26%)]" />
      </div>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 h-screen transform transition-transform duration-300 ease-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
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

      <div className="relative z-10 flex min-h-screen w-full flex-1 flex-col md:pl-72">
        <div className="flex flex-1 flex-col p-4 md:p-6 lg:p-8">
          <header className="mb-6 rounded-[28px] border border-white/10 bg-white/8 backdrop-blur-xl shadow-[0_10px_50px_rgba(0,0,0,0.25)]">
            <div className="flex flex-col gap-5 px-4 py-4 md:px-6 md:py-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-3 md:items-center">
                  <button
                    className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white shadow-[8px_8px_20px_rgba(0,0,0,0.28),-4px_-4px_14px_rgba(255,255,255,0.04)] transition-all duration-200 hover:bg-white/15"
                    onClick={() => setIsMobileMenuOpen(true)}
                  >
                    <Menu size={22} />
                  </button>

                  <div>
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200">
                      <Sparkles size={14} />
                      NutriCloud Monitor
                    </div>

                    <h1 className="text-2xl font-black uppercase tracking-[0.08em] text-white md:text-3xl">
                      {getPageTitle()}
                    </h1>

                    <p className="mt-1 max-w-2xl text-sm text-slate-300 md:text-base">
                      Real-time admin intelligence with behavioral monitoring, user governance, and forensic visibility.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:w-auto">
                  <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-500/15 to-cyan-400/5 px-4 py-3 backdrop-blur-xl">
                    <div className="mb-1 flex items-center gap-2 text-cyan-200">
                      <ShieldCheck size={16} />
                      <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">System</span>
                    </div>
                    <p className="text-sm font-semibold text-white">Protected</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-fuchsia-500/15 to-fuchsia-400/5 px-4 py-3 backdrop-blur-xl">
                    <div className="mb-1 flex items-center gap-2 text-fuchsia-200">
                      <Activity size={16} />
                      <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">Status</span>
                    </div>
                    <p className="text-sm font-semibold text-white">Live Monitoring</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 backdrop-blur-xl">
                    <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      System Active
                    </div>
                    <p className="text-sm font-semibold text-white">
                      {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {loading ? (
            <div className="flex flex-1 items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="h-14 w-14 animate-spin rounded-full border-4 border-white/10 border-t-cyan-400 shadow-[0_0_35px_rgba(34,211,238,0.35)]" />
                <p className="text-sm uppercase tracking-[0.22em] text-slate-400">
                  Loading intelligence
                </p>
              </div>
            </div>
          ) : (
            <div className="flex h-full w-full flex-1 flex-col gap-6">
              {selectedUser ? (
                <div className="rounded-[28px] border border-white/10 bg-white/8 p-2 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.22)]">
                  <ForensicLogPanel user={selectedUser} onBack={() => setSelectedUser(null)} />
                </div>
              ) : (
                <>
                  {activeTab === 'overview' && socMetrics && (
                    <div className="flex flex-1 flex-col gap-5">
                      <div className="rounded-[28px] border border-white/10 bg-white/6 p-3 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.18)]">
                        <SummaryCards kpi={socMetrics.kpi} />
                      </div>

                      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                        <div className="lg:col-span-5 rounded-[28px] border border-white/10 bg-white/7 p-2 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.18)] min-h-[350px]">
                          <ActivityGraph data={socMetrics.activityTrend} />
                        </div>

                        <div className="lg:col-span-4 rounded-[28px] border border-white/10 bg-white/7 p-2 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.18)] min-h-[350px]">
                          <RiskDistribution data={socMetrics.riskDistribution} />
                        </div>

                        <div className="lg:col-span-3 rounded-[28px] border border-white/10 bg-white/7 p-2 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.18)] min-h-[350px]">
                          <LiveAlertsPanel alerts={socMetrics.alerts} />
                        </div>
                      </div>

                      <div className="rounded-[28px] border border-cyan-400/10 bg-gradient-to-br from-cyan-500/8 via-white/6 to-fuchsia-500/8 p-2 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.18)]">
                        <ClickstreamAnalysis data={clickstreamData} />
                      </div>

                      <div className="rounded-[28px] border border-white/10 bg-white/7 p-2 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.18)] min-h-[350px]">
                        <SecurityLogTable activities={activities.length > 0 ? activities.slice(0, 10) : []} />
                      </div>

                      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                        <div className="rounded-[28px] border border-white/10 bg-white/7 p-2 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.18)] min-h-[400px]">
                          <SessionAnalytics data={socMetrics.sessionAnalytics} />
                        </div>

                        <div className="rounded-[28px] border border-white/10 bg-white/7 p-2 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.18)] min-h-[400px]">
                          <GeoLocationHeatmap />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'users' && (
                    <div className="flex flex-1 flex-col gap-6">
                      <div className="rounded-[28px] border border-white/10 bg-white/6 p-3 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.18)]">
                        <SummaryCards stats={stats} />
                      </div>

                      <div className="rounded-[28px] border border-white/10 bg-white/7 p-2 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.18)] flex-1">
                        <UsersTable
                          users={users}
                          fetchUsers={fetchDashboardData}
                          onSelectUser={setSelectedUser}
                          title="User Governance Directory"
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'clickstream' && (
                    <div className="flex flex-1 min-h-[600px] flex-col gap-6">
                      <div className="rounded-[28px] border border-fuchsia-400/15 bg-gradient-to-r from-fuchsia-500/10 via-white/5 to-cyan-500/10 p-6 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.2)]">
                        <h2 className="mb-2 text-xl font-black uppercase tracking-[0.08em] text-white">
                          Markov Transition Matrix Engine
                        </h2>
                        <p className="max-w-4xl text-sm leading-6 text-slate-300">
                          This system performs real-time Behavioral Probability Anomaly Detection.
                          It actively tracks all React Router context transitions globally across the application,
                          computing the absolute probability P(Target | Source) of every edge maneuver.
                        </p>
                      </div>

                      <div className="rounded-[28px] border border-white/10 bg-white/7 p-2 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.18)] min-h-[400px]">
                        <ClickstreamAnalysis data={clickstreamData} />
                      </div>

                      <div className="rounded-[28px] border border-white/10 bg-white/7 p-2 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.18)] min-h-[400px]">
                        <UserClickstreamList users={users} />
                      </div>
                    </div>
                  )}

                  {activeTab === 'monitoring' && (
                    <div className="flex flex-1 flex-col gap-6">
                      <div className="rounded-[28px] border border-white/10 bg-white/7 p-2 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.18)]">
                        <BehaviorPanel anomalies={anomalies} />
                      </div>

                      <div className="rounded-[28px] border border-white/10 bg-white/7 p-2 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.18)] flex-1">
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
