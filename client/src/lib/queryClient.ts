import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

import { getExpenses, addExpense } from "@/services/mockApi";

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<any> {
  console.log(`Mock API request: ${method} ${url} with data:`, data);

  if (url === "/api/expenses" && method === "GET") {
    return { json: () => Promise.resolve(getExpenses()) };
  }

  if (url === "/api/expenses" && method === "POST") {
    const newExpense = await addExpense(data);
    return { json: () => Promise.resolve(newExpense) };
  }

  // Add more mock API endpoints as needed
  return { json: () => Promise.resolve({}) };
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }): Promise<any> => {
    const url = queryKey[0] as string;
    console.log(`Mock API request: GET ${url}`);

    if (url === "/api/expenses") {
      return getExpenses() as any;
    }

    // Add more mock API endpoints as needed
    return {};
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
