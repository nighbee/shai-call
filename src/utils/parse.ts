import { CallData } from '@/components/Dashboard';

export function parseNumber(value: any): number {
  if (value === null || value === undefined || value === '') return 0;
  const str = value.toString().trim().replace(',', '.');
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}

// Parse individual calls without grouping
export function parseIndividualRows(rows: any[]): CallData[] {
  let parsedData: CallData[] = rows.map((row: any, i: number) => {
    console.log("Row", i, row.c.map((c: any) => c?.v));

    return {
      Date: parseDate(row.c[0]?.v),
      Time: parseTime(row.c[1]?.v),
      'ID man': row.c[2]?.v || '',
      'Man name': (row.c[3]?.v || '').toString().trim(),
      LINK: row.c[4]?.v || '',
      'Client Phone': (row.c[5]?.v || '').toString().trim(),
      ClientId: row.c[6]?.v || '',
      Duration: row.c[7]?.v || '',
      'Quality of Call': parseNumber(row.c[8]?.v),
      'Script Match': parseNumber(row.c[9]?.v),
      'Errors Free': parseNumber(row.c[10]?.v),
      'Overall Rating': parseNumber(row.c[11]?.v),
      KPI: parseNumber(row.c[12]?.v),
      Recommendations: row.c[13]?.v || '',
      Brief: row.c[14]?.v || '',
      'Next Best Action': row.c[15]?.v || '',
    };
  });

  // Filter invalid entries and remove duplicates by exact date+time+manager+client
  parsedData = parsedData.filter(
    (call) =>
      call['Man name'] &&
      call['Client Phone'] &&
      call.Date &&
      !call.Date.toString().includes('1899')
  );

  // Remove duplicates by exact timestamp + manager + client
  const uniqueMap = new Map<string, CallData>();
  parsedData.forEach((call) => {
    const key = `${call.Date}-${call.Time}-${call['ID man']}-${call.ClientId}`;
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, call);
    }
  });

  return Array.from(uniqueMap.values());
}

// Parse and group calls for metrics and insights
export function parseRows(rows: any[]): CallData[] {
  let parsedData: CallData[] = rows.map((row: any, i: number) => {
    console.log("Row", i, row.c.map((c: any) => c?.v));

    return {
      Date: parseDate(row.c[0]?.v),
      Time: parseTime(row.c[1]?.v),
      'ID man': row.c[2]?.v || '',
      'Man name': (row.c[3]?.v || '').toString().trim(),
      LINK: row.c[4]?.v || '',
      'Client Phone': (row.c[5]?.v || '').toString().trim(),
      ClientId: row.c[6]?.v || '',
      Duration: row.c[7]?.v || '',
      'Quality of Call': parseNumber(row.c[8]?.v),
      'Script Match': parseNumber(row.c[9]?.v),
      'Errors Free': parseNumber(row.c[10]?.v),
      'Overall Rating': parseNumber(row.c[11]?.v),
      KPI: parseNumber(row.c[12]?.v),
      Recommendations: row.c[13]?.v || '',
      Brief: row.c[14]?.v || '',
      'Next Best Action': row.c[15]?.v || '',
    };
  });

  // Filter invalid entries
  parsedData = parsedData.filter(
    (call) =>
      call['Man name'] &&
      call['Client Phone'] &&
      call.Date &&
      !call.Date.toString().includes('1899')
  );

  // Group by manager-client pairs and combine data
  const groupedMap = new Map<string, CallData[]>();
  parsedData.forEach((call) => {
    const key = `${call['ID man']}_${call.ClientId}`;
    if (!groupedMap.has(key)) {
      groupedMap.set(key, []);
    }
    groupedMap.get(key)!.push(call);
  });

  // Combine calls for each manager-client pair
  const combinedData: CallData[] = [];
  groupedMap.forEach((calls) => {
    if (calls.length === 1) {
      combinedData.push(calls[0]);
    } else {
      // Sort by date/time to get chronological order
      const sortedCalls = calls.sort((a, b) => {
        const dateA = new Date(`${a.Date} ${a.Time}`).getTime();
        const dateB = new Date(`${b.Date} ${b.Time}`).getTime();
        return dateA - dateB;
      });

      // Calculate averages for numeric fields
      const avgQuality = calls.reduce((sum, call) => sum + call['Quality of Call'], 0) / calls.length;
      const avgScript = calls.reduce((sum, call) => sum + call['Script Match'], 0) / calls.length;
      const avgErrors = calls.reduce((sum, call) => sum + call['Errors Free'], 0) / calls.length;
      const avgRating = calls.reduce((sum, call) => sum + call['Overall Rating'], 0) / calls.length;
      const avgKPI = calls.reduce((sum, call) => sum + call['KPI'], 0) / calls.length;

      // Combine text fields
      const combinedRecommendations = calls.map(call => call.Recommendations).filter(Boolean).join('\n\n');
      const combinedBrief = calls.map(call => call.Brief).filter(Boolean).join('\n\n');
      const combinedNextAction = calls.map(call => call['Next Best Action']).filter(Boolean).join('\n\n');

      // Use the latest call as base and update with combined data
      const latestCall = sortedCalls[sortedCalls.length - 1];
      combinedData.push({
        ...latestCall,
        'Quality of Call': parseFloat(avgQuality.toFixed(2)),
        'Script Match': parseFloat(avgScript.toFixed(2)),
        'Errors Free': parseFloat(avgErrors.toFixed(2)),
        'Overall Rating': parseFloat(avgRating.toFixed(2)),
        KPI: parseFloat(avgKPI.toFixed(2)),
        Recommendations: combinedRecommendations,
        Brief: combinedBrief,
        'Next Best Action': combinedNextAction,
      });
    }
  });

  return combinedData;
}

// Date/Time parsing helpers (unchanged)
function parseDate(value: any): string {
  if (!value) return '';
  if (typeof value === 'string' && value.startsWith('Date(')) {
    try {
      const parts = value.replace('Date(', '').replace(')', '').split(',').map((p) => parseInt(p, 10));
      const [year, month, day, hour, minute, second] = parts;
      const jsDate = new Date(year, month, day, hour, minute, second);
      return jsDate.toLocaleDateString('ru-RU');
    } catch {
      return '';
    }
  }
  if (typeof value === 'string') return value.trim();
  return '';
}

function parseTime(value: any): string {
  if (!value) return '';
  if (typeof value === 'string' && value.startsWith('Date(')) {
    try {
      const parts = value.replace('Date(', '').replace(')', '').split(',').map((p) => parseInt(p, 10));
      const [year, month, day, hour, minute, second] = parts;
      const jsDate = new Date(year, month, day, hour, minute, second);
      return jsDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  }
  return value.toString().trim();
}
