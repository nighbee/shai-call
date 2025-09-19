import { CallData } from '@/components/Dashboard';

export function computeMetrics(
  data: CallData[],
  manager: string,
  client: string,
  ALL_MANAGERS: string,
  ALL_CLIENTS: string
) {
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

  // 🎯 если выбран менеджер и клиент → берём последний звонок
  if (manager !== ALL_MANAGERS && client !== ALL_CLIENTS) {
    const sorted = [...validData].sort((a, b) => {
      const da = new Date(`${a.Date} ${a.Time}`).getTime();
      const db = new Date(`${b.Date} ${b.Time}`).getTime();
      return da - db;
    });
    const latest = sorted[sorted.length - 1];

    return {
      avgQuality: latest['Quality of Call'],
      avgScript: latest['Script Match'],
      avgErrors: latest['Errors Free'],
      avgRating: latest['Overall Rating'],
      avgKPI: latest['KPI'],
    };
  }

  // 📊 иначе → считаем среднее
  const sum = validData.reduce(
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

  const count = validData.length;

  return {
    avgQuality: +(sum.quality / count).toFixed(2),
    avgScript: +(sum.script / count).toFixed(2),
    avgErrors: +(sum.errors / count).toFixed(2),
    avgRating: +(sum.rating / count).toFixed(2),
    avgKPI: +(sum.kpi / count).toFixed(2),
  };
}
