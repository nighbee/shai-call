import { CallData } from '@/components/Dashboard';

export function parseNumber(value: any): number {
  if (value === null || value === undefined || value === '') return 0;
  const str = value.toString().trim().replace(',', '.');
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}

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

  parsedData = parsedData.filter(
    (call) =>
      call['Man name'] &&
      call['Client Phone'] &&
      call.Date &&
      !call.Date.toString().includes('1899')
  );

  // убираем дубликаты
  const uniqueMap = new Map<string, CallData>();
  parsedData.forEach((call) => {
    const key = `${call.Date}-${call.Time}-${call['Man name']}-${call['Client Phone']}`;
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, call);
    }
  });

  return Array.from(uniqueMap.values());
}

function parseDate(value: any): string {
    if (!value) return '';
    
    // Если Google Sheets вернул что-то вроде "Date(2025,1,23,12,23,0)"
    if (typeof value === 'string' && value.startsWith('Date(')) {
      try {
        const parts = value
          .replace('Date(', '')
          .replace(')', '')
          .split(',')
          .map((p) => parseInt(p, 10));
        
        // Google Sheets: месяц идет с 0 → прибавляем 1
        const [year, month, day, hour, minute, second] = parts;
        const jsDate = new Date(year, month, day, hour, minute, second);
        
        // форматируем в DD.MM.YYYY
        return jsDate.toLocaleDateString('ru-RU');
      } catch {
        return '';
      }
    }
    
    // Если это просто строка вида "23.02.2025"
    if (typeof value === 'string') return value.trim();
  
    return '';
  }
  
  function parseTime(value: any): string {
    if (!value) return '';
    
    if (typeof value === 'string' && value.startsWith('Date(')) {
      try {
        const parts = value
          .replace('Date(', '')
          .replace(')', '')
          .split(',')
          .map((p) => parseInt(p, 10));
        const [year, month, day, hour, minute, second] = parts;
        const jsDate = new Date(year, month, day, hour, minute, second);
        
        // формат HH:mm
        return jsDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
      } catch {
        return '';
      }
    }
  
    return value.toString().trim();
  }
  
  function parseDateTime(value: any): { date: string; time: string } {
    if (!value) return { date: '', time: '' };
  
    if (typeof value === 'string' && value.startsWith('Date(')) {
      try {
        const parts = value
          .replace('Date(', '')
          .replace(')', '')
          .split(',')
          .map((p) => parseInt(p, 10));
        const [year, month, day, hour, minute, second] = parts;
        const jsDate = new Date(year, month, day, hour, minute, second);
  
        return {
          date: jsDate.toLocaleDateString('ru-RU'), // "23.02.2025"
          time: jsDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) // "12:23"
        };
      } catch {
        return { date: '', time: '' };
      }
    }
  
    // Если дата/время пришли строкой
    if (typeof value === 'string') {
      // Если формат DD.MM.YYYY
      if (/\d{2}\.\d{2}\.\d{4}/.test(value)) {
        return { date: value.trim(), time: '' };
      }
      // Если формат HH:mm
      if (/\d{1,2}:\d{2}/.test(value)) {
        return { date: '', time: value.trim() };
      }
    }
  
    return { date: '', time: '' };
  }
  