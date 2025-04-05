import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DEMO_USER_ID } from '@/lib/constants';
import { SocialAccount } from '@shared/schema';

export default function useAccounts() {
  const [activeAccount, setActiveAccount] = useState<SocialAccount | null>(null);

  // Fetch accounts for the demo user
  const { 
    data: accounts,
    isLoading,
    error
  } = useQuery({
    queryKey: [`/api/accounts/${DEMO_USER_ID}`]
  });

  // Set the first active account when accounts are loaded
  useEffect(() => {
    if (accounts && accounts.length > 0 && !activeAccount) {
      setActiveAccount(accounts[0]);
    }
  }, [accounts, activeAccount]);

  return {
    accounts,
    isLoading,
    error,
    activeAccount,
    setActiveAccount
  };
}
