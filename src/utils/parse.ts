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
      call.Date !== 'Invalid Date' &&
      call.Date !== '' &&
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
      call.Date !== 'Invalid Date' &&
      call.Date !== '' &&
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

// Date/Time parsing helpers
function parseDate(value: any): string {
  if (!value) return '';
  
  console.log('parseDate input:', value, typeof value);
  
  // Handle Google Sheets Date() format
  if (typeof value === 'string' && value.startsWith('Date(')) {
    try {
      const parts = value.replace('Date(', '').replace(')', '').split(',').map((p) => parseInt(p, 10));
      const [year, month, day, hour = 0, minute = 0, second = 0] = parts;
      
      // Google Sheets months are 1-based, JavaScript months are 0-based
      // So we need to subtract 1 from the month
      const jsDate = new Date(year, month, day, hour, minute, second);
      
      // Check if date is valid
      if (isNaN(jsDate.getTime())) {
        console.log('parseDate Date() invalid date:', jsDate);
        return '';
      }
      
      const result = jsDate.toLocaleDateString('ru-RU');
      console.log('parseDate Date() result:', result);
      // Ensure consistent DD.MM.YYYY format
      const dateParts = result.split('.');
      if (dateParts.length === 3) {
        const day = dateParts[0].padStart(2, '0');
        const month = dateParts[1].padStart(2, '0');
        const year = dateParts[2];
        return `${day}.${month}.${year}`;
      }
      return result;
    } catch (e) {
      console.log('parseDate Date() error:', e);
      return '';
    }
  }
  
  // Handle string dates like "12.02.2025"
  if (typeof value === 'string') {
    const trimmed = value.trim();
    console.log('parseDate string input:', trimmed);
    
    // Check if it's already in DD.MM.YYYY format - just return it as-is
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(trimmed)) {
      console.log('parseDate DD.MM.YYYY format (returning as-is):', trimmed);
      return trimmed;
    }
    
    // Try to parse DD.MM.YYYY format specifically
    const ddmmyyyyMatch = trimmed.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
    if (ddmmyyyyMatch) {
      const [, day, month, year] = ddmmyyyyMatch;
      try {
        // Create date with MM.DD.YYYY format (month is 0-indexed in JS)
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        if (!isNaN(date.getTime())) {
          const result = date.toLocaleDateString('ru-RU');
          console.log('parseDate DD.MM.YYYY parsed result:', result);
          // Ensure consistent DD.MM.YYYY format
          const dateParts = result.split('.');
          if (dateParts.length === 3) {
            const day = dateParts[0].padStart(2, '0');
            const month = dateParts[1].padStart(2, '0');
            const year = dateParts[2];
            return `${day}.${month}.${year}`;
          }
          return result;
        } else {
          console.log('parseDate DD.MM.YYYY invalid date:', date);
        }
      } catch (e) {
        console.log('parseDate DD.MM.YYYY parse error:', e);
      }
    }
    
    // Try to parse as a date string
    try {
      const date = new Date(trimmed);
      if (!isNaN(date.getTime())) {
        const result = date.toLocaleDateString('ru-RU');
        console.log('parseDate parsed date result:', result);
        // Ensure consistent DD.MM.YYYY format
        const dateParts = result.split('.');
        if (dateParts.length === 3) {
          const day = dateParts[0].padStart(2, '0');
          const month = dateParts[1].padStart(2, '0');
          const year = dateParts[2];
          return `${day}.${month}.${year}`;
        }
        return result;
      } else {
        console.log('parseDate string parse invalid date:', date);
      }
    } catch (e) {
      console.log('parseDate string parse error:', e);
    }
    
    return trimmed;
  }
  
  // Handle number timestamps
  if (typeof value === 'number') {
    try {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        const result = date.toLocaleDateString('ru-RU');
        console.log('parseDate number result:', result);
        // Ensure consistent DD.MM.YYYY format
        const dateParts = result.split('.');
        if (dateParts.length === 3) {
          const day = dateParts[0].padStart(2, '0');
          const month = dateParts[1].padStart(2, '0');
          const year = dateParts[2];
          return `${day}.${month}.${year}`;
        }
        return result;
      } else {
        console.log('parseDate number invalid date:', date);
      }
    } catch (e) {
      console.log('parseDate number error:', e);
    }
  }
  
  console.log('parseDate fallback, returning empty string');
  return '';
}

function parseTime(value: any): string {
  if (!value) return '';
  
  console.log('parseTime input:', value, typeof value);
  
  // Handle Google Sheets Date() format
  if (typeof value === 'string' && value.startsWith('Date(')) {
    try {
      const parts = value.replace('Date(', '').replace(')', '').split(',').map((p) => parseInt(p, 10));
      const [year, month, day, hour = 0, minute = 0, second = 0] = parts;
      
      // Google Sheets months are 1-based, JavaScript months are 0-based
      const jsDate = new Date(year, month - 1, day, hour, minute, second);
      
      // Check if date is valid
      if (isNaN(jsDate.getTime())) {
        console.log('parseTime Date() invalid date:', jsDate);
        return '';
      }
      
      const result = jsDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
      console.log('parseTime Date() result:', result);
      return result;
    } catch (e) {
      console.log('parseTime Date() error:', e);
      return '';
    }
  }
  
  // Handle string times like "5:23", "07:23"
  if (typeof value === 'string') {
    const trimmed = value.trim();
    console.log('parseTime string input:', trimmed);
    
    // Check if it's already in HH:mm format
    if (/^\d{1,2}:\d{2}$/.test(trimmed)) {
      console.log('parseTime HH:mm format:', trimmed);
      return trimmed;
    }
    
    // Try to parse as a time string
    try {
      const date = new Date(`2000-01-01T${trimmed}`);
      if (!isNaN(date.getTime())) {
        const result = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
        console.log('parseTime parsed time result:', result);
        return result;
      }
    } catch (e) {
      console.log('parseTime string parse error:', e);
    }
    
    return trimmed;
  }
  
  // Handle number timestamps
  if (typeof value === 'number') {
    try {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        const result = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
        console.log('parseTime number result:', result);
        return result;
      }
    } catch (e) {
      console.log('parseTime number error:', e);
    }
  }
  
  console.log('parseTime fallback, returning string value');
  return value.toString().trim();
}
