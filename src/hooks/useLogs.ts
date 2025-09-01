import { useEffect, useCallback, useRef } from 'react';
import { useLogStore } from '../stores/logStore';
import { apiService } from '../services/api';
import { FilterState } from '../types';

export const useLogs = () => {
  const {
    logs,
    stats,
    filterOptions,
    pagination,
    isLoading,
    isInitialized,
    error,
    setLogs,
    setStats,
    setFilterOptions,
    setPagination,
    setLoading,
    setInitialized,
    setError,
    updateFilters,
  } = useLogStore();

  // Use refs to prevent infinite loops
  const isInitializingRef = useRef(false);
  const lastFiltersRef = useRef<Partial<FilterState>>({});

  const loadLogs = useCallback(async (
    page = 1,
    limit = 100,
    filters?: Partial<FilterState>
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getLogs(page, limit, filters);
      
      // Debug: Log the first few entries to see the data structure
      if (response.logs.length > 0) {
        console.log('Sample log entry:', response.logs[0]);
        console.log('Timestamp format:', response.logs[0].timestamp);
        console.log('Created at format:', response.logs[0].created_at);
      }
      
      setLogs(response.logs);
      setPagination(response.pagination);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load logs';
      setError(errorMessage);
      console.error('Failed to load logs:', err);
    } finally {
      setLoading(false);
    }
  }, [setLogs, setPagination, setLoading, setError]);

  const loadStats = useCallback(async (filters?: Partial<FilterState>) => {
    try {
      setError(null);
      const statsData = await apiService.getStats(filters);
      console.log('Stats loaded:', statsData);
      setStats(statsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load stats';
      setError(errorMessage);
      console.error('Failed to load stats:', err);
    }
  }, [setStats, setError]);

  const loadFilterOptions = useCallback(async () => {
    try {
      setError(null);
      const options = await apiService.getFilterOptions();
      console.log('Filter options loaded:', options);
      setFilterOptions(options);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load filter options';
      setError(errorMessage);
      console.error('Failed to load filter options:', err);
    }
  }, [setFilterOptions, setError]);

  const initializeData = useCallback(async () => {
    if (isInitialized || isInitializingRef.current) return;
    
    try {
      isInitializingRef.current = true;
      setLoading(true);
      setError(null);
      
      // Load filter options first
      await loadFilterOptions();
      
      // Load initial logs and stats
      await Promise.all([
        loadLogs(1, 100),
        loadStats()
      ]);
      
      setInitialized(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize data';
      setError(errorMessage);
      console.error('Failed to initialize data:', err);
    } finally {
      setLoading(false);
      isInitializingRef.current = false;
    }
  }, [isInitialized, setLoading, setError, loadFilterOptions, loadLogs, loadStats, setInitialized]);

  const refreshData = useCallback(async () => {
    await Promise.all([
      loadLogs(pagination.page, pagination.limit),
      loadStats()
    ]);
  }, [loadLogs, loadStats, pagination.page, pagination.limit]);

  const applyFiltersAndReload = useCallback(async (newFilters: Partial<FilterState>) => {
    // Prevent duplicate API calls for the same filters
    const currentFilters = useLogStore.getState().filters;
    const combinedFilters = { ...currentFilters, ...newFilters };
    
    // Check if filters actually changed
    const filtersChanged = JSON.stringify(combinedFilters) !== JSON.stringify(lastFiltersRef.current);
    
    if (!filtersChanged) {
      console.log('Filters unchanged, skipping reload');
      return;
    }
    
    lastFiltersRef.current = combinedFilters;
    
    // Update local state first
    updateFilters(newFilters);
    
    // Then reload data with new filters
    await Promise.all([
      loadLogs(1, pagination.limit, combinedFilters),
      loadStats(combinedFilters)
    ]);
  }, [updateFilters, loadLogs, loadStats, pagination.limit]);

  const changePage = useCallback(async (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    await loadLogs(newPage, pagination.limit);
  }, [loadLogs, pagination.totalPages, pagination.limit]);

  const changePageSize = useCallback(async (newLimit: number) => {
    await loadLogs(1, newLimit);
  }, [loadLogs]);

  // Only run initialization once
  useEffect(() => {
    if (!isInitialized && !isInitializingRef.current) {
      initializeData();
    }
  }, [isInitialized, initializeData]);

  return {
    logs,
    stats,
    filterOptions,
    pagination,
    isLoading,
    isInitialized,
    error,
    loadLogs,
    loadStats,
    loadFilterOptions,
    initializeData,
    refreshData,
    applyFiltersAndReload,
    changePage,
    changePageSize,
  };
};