import { useState, useMemo } from 'react';
import { getDateRangeFromInterval, getCurrentInterval } from '@/lib/utils';

export default function useDateRange() {
  const [selectedInterval, setSelectedInterval] = useState(getCurrentInterval());
  
  // Calculate the date range based on the selected interval
  const dateRange = useMemo(() => {
    return getDateRangeFromInterval(selectedInterval);
  }, [selectedInterval]);

  return {
    dateRange,
    selectedInterval,
    setSelectedInterval
  };
}
