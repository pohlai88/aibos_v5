"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/shared/components/ui/card";
import { Loading, SkeletonCard } from "@/app/shared/components/feedback/loading";
import { formatCurrency, formatNumber } from "@/app/shared/utils/format";
import { CHART_COLORS } from "@/app/shared/constants";
import { Task, Employee, Project } from "@/app/shared/types";

interface DashboardStats {
  totalRevenue: number;
  activeUsers: number;
  totalTransactions: number;
  pendingApprovals: number;
  monthlyRevenue: Record<string, number>;
}

interface DashboardData {
  stats: DashboardStats;
  recentTransactions: any[];
  recentTasks: Task[];
  recentEmployees: Employee[];
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initializeDashboard() {
      try {
        setLoading(true);
        
        // Get current user
        const { data: userData } = await getSupabaseClient().auth.getUser();
        setUser(userData?.user);

        // Fetch dashboard data
        const [stats, transactions, tasks, employees] = await Promise.all([
          fetchDashboardStats(),
          fetchRecentTransactions(),
          fetchRecentTasks(),
          fetchRecentEmployees()
        ]);

        setData({
          stats,
          recentTransactions: transactions,
          recentTasks: tasks,
          recentEmployees: employees
        });
      } catch (err) {
        console.error('Dashboard initialization error:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }

    initializeDashboard();
  }, []);

  async function fetchDashboardStats(): Promise<DashboardStats> {
    // For now, return mock data since the original dashboard used transactions table
    // In a real implementation, you would fetch from your actual tables
    return {
      totalRevenue: 125000,
      activeUsers: 45,
      totalTransactions: 234,
      pendingApprovals: 12,
      monthlyRevenue: {
        'Jan': 15000,
        'Feb': 18000,
        'Mar': 22000,
        'Apr': 19000,
        'May': 25000,
        'Jun': 26000,
      }
    };
  }

  async function fetchRecentTransactions() {
    // Mock data for now - replace with actual Supabase query
    return [
      { id: 1, amount: 1500, type: 'income', status: 'completed', description: 'Project Alpha Payment', created_at: '2024-01-15' },
      { id: 2, amount: 2300, type: 'income', status: 'completed', description: 'Consulting Services', created_at: '2024-01-14' },
      { id: 3, amount: 800, type: 'expense', status: 'pending', description: 'Office Supplies', created_at: '2024-01-13' },
    ];
  }

  async function fetchRecentTasks() {
    const { data, error } = await getSupabaseClient()
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }

    return data || [];
  }

  async function fetchRecentEmployees() {
    const { data, error } = await getSupabaseClient()
      .from('employee_master')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching employees:', error);
      return [];
    }

    return data || [];
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <SkeletonCard />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg mb-2">Error</div>
        <div className="text-gray-600">{error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <Loading text="Loading user..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.email}
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your business today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data?.stats.totalRevenue || 0)}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data?.stats.activeUsers || 0)}</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data?.stats.totalTransactions || 0)}</div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.stats.pendingApprovals || 0}</div>
            <p className="text-xs text-muted-foreground">
              Requires attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">{transaction.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.recentTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      task.status === 'completed' ? 'bg-green-100 text-green-800' :
                      task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Chart component will be implemented here
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
