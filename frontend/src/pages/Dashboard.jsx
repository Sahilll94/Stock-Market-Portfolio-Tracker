import { useEffect, useState } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import PortfolioSummary from '../components/Dashboard/PortfolioSummary';
import DistributionChart from '../components/Dashboard/DistributionChart';
import PerformanceChart from '../components/Dashboard/PerformanceChart';
import TopPerformers from '../components/Dashboard/TopPerformers';
import dashboardService from '../services/dashboardService';
import holdingsService from '../services/holdingsService';
import { useTheme } from '../contexts/ThemeContext';
import toast from 'react-hot-toast';
import { RotateCcw, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const [summary, setSummary] = useState({
    totalInvested: 0,
    currentPortfolioValue: 0,
    totalProfitLoss: 0,
    totalProfitLossPercentage: 0,
    numberOfHoldings: 0
  });
  const [distribution, setDistribution] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const { isDark } = useTheme();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all dashboard data with individual error handling
      try {
        const summaryRes = await dashboardService.getSummary();
        if (summaryRes.data.success) {
          setSummary(summaryRes.data.data.summary);
          if (summaryRes.data.data.lastUpdatedAt) {
            setLastUpdated(new Date(summaryRes.data.data.lastUpdatedAt));
          }
        }
      } catch (error) {
        console.error('Failed to fetch summary:', error);
      }

      try {
        const distributionRes = await dashboardService.getDistribution();
        if (distributionRes.data.success) {
          setDistribution(distributionRes.data.data.distribution || []);
        }
      } catch (error) {
        console.error('Failed to fetch distribution:', error);
      }

      try {
        const performanceRes = await dashboardService.getPerformance(30);
        if (performanceRes.data.success) {
          setPerformance(performanceRes.data.data.performance || []);
        }
      } catch (error) {
        console.error('Failed to fetch performance:', error);
      }

      try {
        const holdingsRes = await holdingsService.getAll();
        if (holdingsRes.data.success) {
          setHoldings(holdingsRes.data.data.holdings || []);
        }
      } catch (error) {
        console.error('Failed to fetch holdings:', error);
      }
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      toast.error('Some dashboard data could not be loaded. Please try refreshing.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${isDark ? 'border-blue-500' : 'border-blue-600'}`}></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Minimalist Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Portfolio
          </h1>
          <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
            Last updated: {lastUpdated.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })} at {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          className={`p-2.5 rounded-lg transition-all duration-300 group ${
            isDark
              ? 'hover:bg-gray-700/50 text-gray-400 hover:text-gray-300'
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          }`}
          title="Refresh data"
        >
          <RotateCcw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
        </button>
      </div>

      {/* Portfolio Summary Cards - Minimalist */}
      <PortfolioSummary summary={summary} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div>
          <DistributionChart data={distribution} />
          {/* Top Performers below Distribution */}
          <div className="mt-6">
            <TopPerformers holdings={holdings} />
          </div>
        </div>
        <PerformanceChart data={performance} />
      </div>
    </MainLayout>
  );
}
