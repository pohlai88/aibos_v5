/**
 * Module Template for AI-BOS Application
 * 
 * This template provides a standardized structure for creating new modules.
 * Copy this template and customize it for your specific module needs.
 */

"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/shared/components/ui/card';
import { Button } from '@/app/shared/components/ui/button';
import { Loading, SkeletonCard } from '@/app/shared/components/feedback/loading';
import { useLocalStorage } from '@/app/shared/hooks/use-local-storage';
import { formatDate, formatNumber } from '@/app/shared/utils/format';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/app/shared/constants';
import { getSupabaseClient } from '@/lib/supabaseClient';

// Define your module's data types
interface ModuleItem {
  id: string;
  title: string;
  description?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface ModuleFilters {
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface ModuleState {
  items: ModuleItem[];
  loading: boolean;
  error: string | null;
  filters: ModuleFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

/**
 * Main Module Component
 * Replace 'ModuleName' with your actual module name
 */
export default function ModuleNamePage() {
  // State management
  const [state, setState] = useState<ModuleState>({
    items: [],
    loading: true,
    error: null,
    filters: {},
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      hasMore: false,
    },
  });

  // Local storage for user preferences
  const [userPreferences, setUserPreferences] = useLocalStorage('module-preferences', {
    viewMode: 'grid',
    sortBy: 'created_at',
    sortOrder: 'desc',
  });

  // Initialize module
  useEffect(() => {
    initializeModule();
  }, []);

  // Load data when filters or pagination changes
  useEffect(() => {
    if (!state.loading) {
      loadData();
    }
  }, [state.filters, state.pagination.page]);

  /**
   * Initialize the module
   */
  async function initializeModule() {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // Check authentication
      const { data: { user } } = await getSupabaseClient().auth.getUser();
      if (!user) {
        throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
      }

      // Load initial data
      await loadData();
    } catch (error) {
      console.error('Module initialization error:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR,
        loading: false,
      }));
    }
  }

  /**
   * Load data from the database
   */
  async function loadData() {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Build query
      let query = getSupabaseClient()
        .from('your_table_name') // Replace with actual table name
        .select('*', { count: 'exact' });

      // Apply filters
      if (state.filters.search) {
        query = query.ilike('title', `%${state.filters.search}%`);
      }
      if (state.filters.status) {
        query = query.eq('status', state.filters.status);
      }
      if (state.filters.dateFrom) {
        query = query.gte('created_at', state.filters.dateFrom);
      }
      if (state.filters.dateTo) {
        query = query.lte('created_at', state.filters.dateTo);
      }

      // Apply pagination
      const from = (state.pagination.page - 1) * state.pagination.limit;
      const to = from + state.pagination.limit - 1;
      query = query.range(from, to);

      // Apply sorting
      query = query.order(userPreferences.sortBy, {
        ascending: userPreferences.sortOrder === 'asc',
      });

      const { data, error, count } = await query;

      if (error) throw error;

      setState(prev => ({
        ...prev,
        items: data || [],
        pagination: {
          ...prev.pagination,
          total: count || 0,
          hasMore: (data?.length || 0) === state.pagination.limit,
        },
        loading: false,
      }));
    } catch (error) {
      console.error('Error loading data:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR,
        loading: false,
      }));
    }
  }

  /**
   * Create a new item
   */
  async function createItem(itemData: Partial<ModuleItem>) {
    try {
      const { data, error } = await getSupabaseClient()
        .from('your_table_name') // Replace with actual table name
        .insert([itemData])
        .select()
        .single();

      if (error) throw error;

      // Refresh data
      await loadData();

      // Show success message (implement toast notification)
      console.log(SUCCESS_MESSAGES.CREATED);
    } catch (error) {
      console.error('Error creating item:', error);
      throw error;
    }
  }

  /**
   * Update an existing item
   */
  async function updateItem(id: string, updates: Partial<ModuleItem>) {
    try {
      const { data, error } = await getSupabaseClient()
        .from('your_table_name') // Replace with actual table name
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Refresh data
      await loadData();

      // Show success message
      console.log(SUCCESS_MESSAGES.UPDATED);
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  }

  /**
   * Delete an item
   */
  async function deleteItem(id: string) {
    try {
      const { error } = await getSupabaseClient()
        .from('your_table_name') // Replace with actual table name
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Refresh data
      await loadData();

      // Show success message
      console.log(SUCCESS_MESSAGES.DELETED);
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  }

  /**
   * Update filters
   */
  function updateFilters(newFilters: Partial<ModuleFilters>) {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...newFilters },
      pagination: { ...prev.pagination, page: 1 }, // Reset to first page
    }));
  }

  /**
   * Load next page
   */
  function loadNextPage() {
    if (state.pagination.hasMore) {
      setState(prev => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          page: prev.pagination.page + 1,
        },
      }));
    }
  }

  /**
   * Render loading state
   */
  if (state.loading && state.items.length === 0) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  /**
   * Render error state
   */
  if (state.error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg mb-2">Error</div>
        <div className="text-gray-600 mb-4">{state.error}</div>
        <Button onClick={initializeModule}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Module Name</h1>
          <p className="text-gray-600 mt-1">
            Manage your module items efficiently
          </p>
        </div>
        <Button onClick={() => {/* Open create modal */}}>
          Add New Item
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search..."
              className="px-3 py-2 border rounded-md"
              value={state.filters.search || ''}
              onChange={(e) => updateFilters({ search: e.target.value })}
            />
            <select
              className="px-3 py-2 border rounded-md"
              value={state.filters.status || ''}
              onChange={(e) => updateFilters({ status: e.target.value })}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <input
              type="date"
              className="px-3 py-2 border rounded-md"
              value={state.filters.dateFrom || ''}
              onChange={(e) => updateFilters({ dateFrom: e.target.value })}
            />
            <input
              type="date"
              className="px-3 py-2 border rounded-md"
              value={state.filters.dateTo || ''}
              onChange={(e) => updateFilters({ dateTo: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.items.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle className="text-lg">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{item.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Status: {item.status}</span>
                <span>{formatDate(item.created_at)}</span>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => {/* Edit item */}}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => deleteItem(item.id)}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {state.pagination.hasMore && (
        <div className="text-center">
          <Button
            onClick={loadNextPage}
            disabled={state.loading}
            variant="outline"
          >
            {state.loading ? <Loading size="sm" /> : 'Load More'}
          </Button>
        </div>
      )}

      {/* Empty State */}
      {state.items.length === 0 && !state.loading && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">No items found</div>
          <div className="text-gray-400 mb-4">
            Try adjusting your filters or create a new item
          </div>
          <Button onClick={() => {/* Open create modal */}}>
            Create First Item
          </Button>
        </div>
      )}
    </div>
  );
}

/**
 * Usage Instructions:
 * 
 * 1. Copy this template to your module directory
 * 2. Replace 'ModuleName' with your actual module name
 * 3. Replace 'your_table_name' with your actual Supabase table name
 * 4. Customize the ModuleItem interface to match your data structure
 * 5. Implement the modal components for create/edit operations
 * 6. Add any module-specific functionality
 * 7. Update the filters and sorting options as needed
 * 8. Add proper error handling and validation
 * 9. Implement real-time updates if needed
 * 10. Add proper TypeScript types for all functions
 */ 