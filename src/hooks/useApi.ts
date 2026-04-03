import { useState, useEffect } from 'react';
import apiService from '../services/api';

export const useApi = <T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiCall();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

export const useTeachers = (params?: any) => {
  return useApi(() => apiService.getTeachers(params), [params]);
};

export const useEvents = (params?: any) => {
  return useApi(() => apiService.getEvents(params), [params]);
};

export const useAnnouncements = (params?: any) => {
  return useApi(() => apiService.getAnnouncements(params), [params]);
};

export const useTimetable = (params?: any) => {
  return useApi(() => apiService.getTimetable(params), [params]);
};

export const useBlocks = () => {
  return useApi(() => apiService.getBlocks(), []);
};

export const useRooms = (params?: any) => {
  return useApi(() => apiService.getRooms(params), [params]);
};