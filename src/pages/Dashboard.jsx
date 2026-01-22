import { useState, useEffect } from 'react';
import { 
  Users, 
  GraduationCap, 
  CreditCard, 
  Wallet,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import StatsCard from '../components/dashboard/StatsCard';
import RevenueChart from '../components/dashboard/RevenueChart';
import AttendanceChart from '../components/dashboard/AttendanceChart';
import RecentActivity from '../components/dashboard/RecentActivity';
import { formatCurrency } from '../lib/utils';

export default function Dashboard() {
  const [stats, setStats] = useState([
    {
      title: "Total Students",
      value: "...",
      icon: Users,
      trend: "0%",
      trendUp: true,
      description: "since last month",
      color: "blue"
    },
    {
      title: "Total Teachers",
      value: "...",
      icon: GraduationCap,
      trend: "0",
      trendUp: true,
      description: "active staff",
      color: "purple"
    },
    {
      title: "Fee Collected",
      value: "...",
      icon: CreditCard,
      trend: "0%",
      trendUp: true,
      description: "total collected",
      color: "green"
    },
    {
      title: "Pending Fees",
      value: "...",
      icon: Wallet,
      trend: "0%",
      trendUp: false,
      description: "total pending",
      color: "red"
    }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // 1. Students Count
      const studentsSnap = await getDocs(collection(db, 'students'));
      const studentCount = studentsSnap.size;

      // 2. Teachers Count
      const teachersSnap = await getDocs(collection(db, 'teachers'));
      const teacherCount = teachersSnap.size;

      // 3. Finance Stats
      const feesSnap = await getDocs(collection(db, 'fees'));
      let totalCollected = 0;
      let totalPending = 0;
      
      feesSnap.forEach(doc => {
        const data = doc.data();
        totalCollected += Number(data.paid) || 0;
        totalPending += Number(data.due) || 0;
      });

      setStats([
        {
          title: "Total Students",
          value: studentCount.toString(),
          icon: Users,
          trend: "+12%", // Mock trend for now
          trendUp: true,
          description: "active students",
          color: "blue"
        },
        {
          title: "Total Teachers",
          value: teacherCount.toString(),
          icon: GraduationCap,
          trend: "+2", // Mock trend
          trendUp: true,
          description: "active staff",
          color: "purple"
        },
        {
          title: "Fee Collected",
          value: formatCurrency(totalCollected),
          icon: CreditCard,
          trend: "+8%", // Mock trend
          trendUp: true,
          description: "all time",
          color: "green"
        },
        {
          title: "Pending Fees",
          value: formatCurrency(totalPending),
          icon: Wallet,
          trend: "5%", // Mock trend
          trendUp: false,
          description: "unpaid dues",
          color: "red"
        }
      ]);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
        <div className="text-sm text-slate-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <AttendanceChart />
      </div>

      <div className="grid grid-cols-1">
        <RecentActivity />
      </div>
    </div>
  );
}
