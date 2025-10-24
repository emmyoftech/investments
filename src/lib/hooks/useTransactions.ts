import useSWR from 'swr';

interface TransactionData {
  depositHistory: Array<{
    id: number;
    amount: number;
    address: string;
    currency: string;
    status: string;
    createdAt: string;
  }>;
  withdrawalHistory: Array<{
    id: number;
    amount: number;
    address: string;
    currency: string;
    status: string;
    createdAt: string;
  }>;
  investmentHistory: Array<{
    id: number;
    amount: number;
    address: string;
    currency: string;
    status: string;
    createdAt: string;
  }>;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useTransactions(userEmail: string | null) {
  const { data, error, mutate } = useSWR<TransactionData>(
    userEmail ? `/api/dashboard?user=${encodeURIComponent(userEmail)}` : null,
    fetcher,
    {
      refreshInterval: 15000, // Refresh every 15 seconds for transaction updates
      revalidateOnFocus: true,
    }
  );

  return {
    transactions: data || {
      depositHistory: [],
      withdrawalHistory: [],
      investmentHistory: []
    },
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
