import { CallData } from '@/components/Dashboard';

export function computeMetrics(
  data: CallData[],
  manager: string,
  client: string,
  ALL_MANAGERS: string,
  ALL_CLIENTS: string
) {
  // Filter invalid numeric data
  const validData = data.filter(
    (d) =>
      !isNaN(d['Quality of Call']) &&
      !isNaN(d['Script Match']) &&
      !isNaN(d['Errors Free']) &&
      !isNaN(d['Overall Rating']) &&
      !isNaN(d['KPI'])
  );

  if (validData.length === 0) {
    return { avgQuality: 0, avgScript: 0, avgErrors: 0, avgRating: 0, avgKPI: 0 };
  }

  // Deduplicate by manager+client for metrics
  const uniqueMap = new Map<string, CallData>();
  validData.forEach((call) => {
    const key = `${call['ID man']}_${call.ClientId}`;
    // Keep only the latest call per pair
    const existing = uniqueMap.get(key);
    const callTime = new Date(`${call.Date} ${call.Time}`).getTime();
    if (!existing) {
      uniqueMap.set(key, call);
    } else {
      const existingTime = new Date(`${existing.Date} ${existing.Time}`).getTime();
      if (callTime > existingTime) {
        uniqueMap.set(key, call);
      }
    }
  });

  const dedupData = Array.from(uniqueMap.values());

  // If specific manager + client → take latest
  if (manager !== ALL_MANAGERS && client !== ALL_CLIENTS) {
    const latest = dedupData[dedupData.length - 1];
    return {
      avgQuality: latest['Quality of Call'],
      avgScript: latest['Script Match'],
      avgErrors: latest['Errors Free'],
      avgRating: latest['Overall Rating'],
      avgKPI: latest['KPI'],
    };
  }

  // Otherwise → average metrics
  const sum = dedupData.reduce(
    (acc, call) => {
      acc.quality += call['Quality of Call'];
      acc.script += call['Script Match'];
      acc.errors += call['Errors Free'];
      acc.rating += call['Overall Rating'];
      acc.kpi += call['KPI'];
      return acc;
    },
    { quality: 0, script: 0, errors: 0, rating: 0, kpi: 0 }
  );

  const count = dedupData.length;

  return {
    avgQuality: +(sum.quality / count).toFixed(2),
    avgScript: +(sum.script / count).toFixed(2),
    avgErrors: +(sum.errors / count).toFixed(2),
    avgRating: +(sum.rating / count).toFixed(2),
    avgKPI: +(sum.kpi / count).toFixed(2),
  };
}
