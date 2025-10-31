import type { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { useCallback, useEffect, useState } from "react";
import axiosInstance from "../api/axios";

interface UseAxiosOptions<T> {
  instance?: AxiosInstance;
  manual?: boolean; // If true, request won't be sent automatically
}

interface UseAxiosState<T> {
  data: T | null;
  loading: boolean;
  error: AxiosError | null;
}

interface UseAxiosReturn<T> extends UseAxiosState<T> {
  execute: (config?: AxiosRequestConfig) => Promise<T | null>;
  reset: () => void;
}

/**
 * Hook for making axios requests
 * @param config - Axios request configuration
 * @param options - Hook options
 * @returns Object with data, loading, error, execute function, and reset function
 */
export function useAxios<T = any>(
  config?: AxiosRequestConfig,
  options: UseAxiosOptions<T> = {}
): UseAxiosReturn<T> {
  const { instance = axiosInstance, manual = false } = options;

  const [state, setState] = useState<UseAxiosState<T>>({
    data: null,
    loading: !manual,
    error: null,
  });

  const execute = useCallback(
    async (requestConfig?: AxiosRequestConfig) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await instance.request<T>({
          ...config,
          ...requestConfig,
        });
        setState({ data: response.data, loading: false, error: null });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        setState({ data: null, loading: false, error: axiosError });
        return null;
      }
    },
    [instance, config]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  useEffect(() => {
    if (!manual && config) {
      execute();
    }
  }, [manual, execute]);

  return {
    ...state,
    execute,
    reset,
  };
}
