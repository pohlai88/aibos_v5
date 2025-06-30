// Dashboard module JS
// Add interactivity and Supabase data fetching here 

// dashboard.js
// Live Supabase integration for dashboard data

import { supabase } from '../../utils/supabase.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Show loading state
  showLoading();

  try {
    // Fetch all dashboard data
    const [stats, transactions] = await Promise.all([
      fetchDashboardStats(),
      fetchRecentTransactions()
    ]);

    // Update UI with real data
    updateStats(stats);
    updateChart(stats);
    updateTransactionsTable(transactions);

    // Hide loading state
    hideLoading();
  } catch (error) {
    console.error('Dashboard error:', error);
    showError('Failed to load dashboard data');
  }
});

async function fetchDashboardStats() {
  // Total revenue (sum of approved income transactions)
  const { data: revenueData, error: revenueError } = await supabase
    .from('transactions')
    .select('amount')
    .eq('type', 'income')
    .eq('status', 'approved');

  if (revenueError) throw revenueError;
  const totalRevenue = revenueData.reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

  // Active users (users with transactions in last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const { data: activeUsersData, error: usersError } = await supabase
    .from('transactions')
    .select('user_id')
    .gte('created_at', thirtyDaysAgo.toISOString())
    .not('user_id', 'is', null);

  if (usersError) throw usersError;
  const activeUsers = new Set(activeUsersData.map(tx => tx.user_id)).size;

  // Total transactions count
  const { count: totalTransactions, error: transactionsError } = await supabase
    .from('transactions')
    .select('*', { count: 'exact', head: true });

  if (transactionsError) throw transactionsError;

  // Pending approvals count
  const { count: pendingApprovals, error: approvalsError } = await supabase
    .from('approvals')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  if (approvalsError) throw approvalsError;

  // Monthly revenue data for chart (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const { data: monthlyData, error: monthlyError } = await supabase
    .from('transactions')
    .select('amount, created_at')
    .eq('type', 'income')
    .eq('status', 'approved')
    .gte('created_at', sixMonthsAgo.toISOString());

  if (monthlyError) throw monthlyError;

  // Group by month for chart
  const monthlyRevenue = {};
  monthlyData.forEach(tx => {
    const month = new Date(tx.created_at).toLocaleDateString('en-US', { month: 'short' });
    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + parseFloat(tx.amount);
  });

  return {
    totalRevenue,
    activeUsers,
    totalTransactions,
    pendingApprovals,
    monthlyRevenue
  };
}

async function fetchRecentTransactions() {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      id,
      amount,
      type,
      status,
      description,
      created_at,
      users(name)
    `)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) throw error;
  return data;
}

function updateStats(stats) {
  document.getElementById('stat-revenue').textContent = `$${stats.totalRevenue.toLocaleString()}`;
  document.getElementById('stat-users').textContent = stats.activeUsers.toLocaleString();
  document.getElementById('stat-transactions').textContent = stats.totalTransactions.toLocaleString();
  document.getElementById('stat-approvals').textContent = stats.pendingApprovals.toLocaleString();
}

function updateChart(stats) {
  const ctx = document.getElementById('dashboardChart').getContext('2d');
  
  // Get last 6 months for chart labels
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    months.push(date.toLocaleDateString('en-US', { month: 'short' }));
  }

  // Map data to chart labels
  const chartData = months.map(month => stats.monthlyRevenue[month] || 0);

  new window.Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [{
        label: 'Revenue',
        data: chartData,
        borderColor: '#007AFF',
        backgroundColor: 'rgba(0,122,255,0.1)',
        tension: 0.4,
        fill: true,
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

function updateTransactionsTable(transactions) {
  const tbody = document.getElementById('transactions-table-body');
  tbody.innerHTML = ''; // Clear existing rows

  transactions.forEach(tx => {
    const tr = document.createElement('tr');
    tr.className = 'border-t border-gray-100';
    tr.innerHTML = `
      <td class="py-2 pr-4">${new Date(tx.created_at).toLocaleDateString()}</td>
      <td class="py-2 pr-4">${tx.description || 'N/A'}</td>
      <td class="py-2 pr-4 text-primary">$${parseFloat(tx.amount).toLocaleString()}</td>
      <td class="py-2 pr-4">${tx.status}</td>
    `;
    tbody.appendChild(tr);
  });
}

function showLoading() {
  // Add loading state to stat cards
  const statElements = ['stat-revenue', 'stat-users', 'stat-transactions', 'stat-approvals'];
  statElements.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = 'Loading...';
      element.classList.add('text-gray-400');
    }
  });
}

function hideLoading() {
  // Remove loading state
  const statElements = ['stat-revenue', 'stat-users', 'stat-transactions', 'stat-approvals'];
  statElements.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.classList.remove('text-gray-400');
    }
  });
}

function showError(message) {
  // Simple error display
  const main = document.querySelector('main');
  const errorDiv = document.createElement('div');
  errorDiv.className = 'bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4';
  errorDiv.textContent = message;
  main.insertBefore(errorDiv, main.firstChild);
} 