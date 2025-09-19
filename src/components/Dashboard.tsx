import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MetricsCards } from './MetricsCards';
import { CallHistoryTable } from './CallHistoryTable';
import { DetailedInsights } from './DetailedInsights';
import { ChartsSection } from './ChartsSection';
import { Loader2, RefreshCw, X, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

import { parseRows, parseIndividualRows } from '@/utils/parse';
import { computeMetrics } from '@/utils/metrics';

export interface CallData {
  Date: string;
  Time: string;
  'ID man': string;
  'Man name': string;
  LINK: string;
  'Client Phone': string;
  ClientId: string;
  Duration: string;
  'Quality of Call': number;
  'Script Match': number;
  'Errors Free': number;
  'Overall Rating': number;
  KPI: number;
  Recommendations: string;
  Brief: string;
  'Next Best Action': string;
}

export const Dashboard = () => {
  const [data, setData] = useState<CallData[]>([]); // Grouped data for metrics
  const [individualData, setIndividualData] = useState<CallData[]>([]); // Individual calls for table
  const [loading, setLoading] = useState(true);

  const ALL_MANAGERS = '__ALL_MANAGERS__';
  const ALL_CLIENTS = '__ALL_CLIENTS__';

  const [selectedManager, setSelectedManager] = useState<string>(ALL_MANAGERS);
  const [selectedClient, setSelectedClient] = useState<string>(ALL_CLIENTS);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [calendarKey, setCalendarKey] = useState(0);
  const [filteredData, setFilteredData] = useState<CallData[]>([]);
  const [filteredIndividualData, setFilteredIndividualData] = useState<CallData[]>([]);

  // Helper function to parse DD.MM.YYYY format to Date
  const parseDateString = (dateStr: string): Date | null => {
    if (!dateStr || dateStr === 'Invalid Date' || dateStr.trim() === '') return null;
    
    console.log('parseDateString input:', dateStr);
    
    // Try DD.MM.YYYY format first
    let match = dateStr.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
    if (match) {
      const [, day, month, year] = match;
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      // Normalize to start of day
      date.setHours(0, 0, 0, 0);
      console.log('parseDateString DD.MM.YYYY result:', date);
      if (!isNaN(date.getTime())) return date;
    }
    
    // Try D.M.YYYY format (single digits)
    match = dateStr.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
    if (match) {
      const [, day, month, year] = match;
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      // Normalize to start of day
      date.setHours(0, 0, 0, 0);
      console.log('parseDateString D.M.YYYY result:', date);
      if (!isNaN(date.getTime())) return date;
    }
    
    // Try to parse as a general date string
    try {
      const date = new Date(dateStr);
      // Normalize to start of day
      date.setHours(0, 0, 0, 0);
      console.log('parseDateString general parse result:', date);
      if (!isNaN(date.getTime())) return date;
    } catch (e) {
      console.log('parseDateString general parse error:', e);
    }
    
    console.log('parseDateString failed to parse:', dateStr);
    return null;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://docs.google.com/spreadsheets/d/1WBoa0GfdwriFrqKCTzNMnTA2DaKEbKvh5BsZ6kyiTLo/gviz/tq?tqx=out:json'
      );
      const text = await response.text();

      // вырезаем JSON из ответа Google Sheets
      const jsonString = text.replace(/.*?({.*}).*/s, '$1');
      const parsed = JSON.parse(jsonString);

      const rows = parsed.table.rows;
      const parsedData = parseRows(rows); // Grouped data for metrics
      const individualParsedData = parseIndividualRows(rows); // Individual calls

      setData(parsedData);
      setIndividualData(individualParsedData);
      
      // Debug: log sample dates to understand format
      console.log('Sample dates from data:');
      if (parsedData.length > 0) {
        console.log('First 3 dates from grouped data:', parsedData.slice(0, 3).map(item => item.Date));
      }
      if (individualParsedData.length > 0) {
        console.log('First 3 dates from individual data:', individualParsedData.slice(0, 3).map(item => item.Date));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Filter grouped data for metrics
    let filtered = data;

    if (selectedManager !== ALL_MANAGERS) {
      filtered = filtered.filter(
        (item) => item['Man name'].trim() === selectedManager.trim()
      );
    }

    if (selectedClient !== ALL_CLIENTS) {
      filtered = filtered.filter(
        (item) => item['Client Phone'].trim() === selectedClient.trim()
      );
    }

    // Filter by date range
    if (dateFrom || dateTo) {
      console.log('Filtering by date range:', { dateFrom, dateTo });
      console.log('Before date filter, filtered count:', filtered.length);
      
      filtered = filtered.filter((item) => {
        const itemDate = parseDateString(item.Date);
        console.log('Item date string:', item.Date, 'parsed date:', itemDate);
        
        if (!itemDate) {
          console.log('Item date could not be parsed, excluding');
          return false;
        }

        if (dateFrom) {
          // Set time to start of day for dateFrom comparison
          const startOfDay = new Date(dateFrom);
          startOfDay.setHours(0, 0, 0, 0);
          if (itemDate < startOfDay) {
            console.log('Item date is before dateFrom, excluding');
            return false;
          }
        }
        
        if (dateTo) {
          // Set time to end of day for dateTo comparison
          const endOfDay = new Date(dateTo);
          endOfDay.setHours(23, 59, 59, 999);
          if (itemDate > endOfDay) {
            console.log('Item date is after dateTo, excluding');
            return false;
          }
        }

        console.log('Item passed date filter');
        return true;
      });
      
      console.log('After date filter, filtered count:', filtered.length);
    }

    setFilteredData(filtered);

    // Filter individual data for call history table
    let filteredIndividual = individualData;

    if (selectedManager !== ALL_MANAGERS) {
      filteredIndividual = filteredIndividual.filter(
        (item) => item['Man name'].trim() === selectedManager.trim()
      );
    }

    if (selectedClient !== ALL_CLIENTS) {
      filteredIndividual = filteredIndividual.filter(
        (item) => item['Client Phone'].trim() === selectedClient.trim()
      );
    }

    // Filter individual data by date range
    if (dateFrom || dateTo) {
      console.log('Filtering individual data by date range:', { dateFrom, dateTo });
      console.log('Before date filter, individual count:', filteredIndividual.length);
      
      filteredIndividual = filteredIndividual.filter((item) => {
        const itemDate = parseDateString(item.Date);
        console.log('Individual item date string:', item.Date, 'parsed date:', itemDate);
        
        if (!itemDate) {
          console.log('Individual item date could not be parsed, excluding');
          return false;
        }

        if (dateFrom) {
          // Set time to start of day for dateFrom comparison
          const startOfDay = new Date(dateFrom);
          startOfDay.setHours(0, 0, 0, 0);
          if (itemDate < startOfDay) {
            console.log('Individual item date is before dateFrom, excluding');
            return false;
          }
        }
        
        if (dateTo) {
          // Set time to end of day for dateTo comparison
          const endOfDay = new Date(dateTo);
          endOfDay.setHours(23, 59, 59, 999);
          if (itemDate > endOfDay) {
            console.log('Individual item date is after dateTo, excluding');
            return false;
          }
        }

        console.log('Individual item passed date filter');
        return true;
      });
      
      console.log('After date filter, individual count:', filteredIndividual.length);
    }

    setFilteredIndividualData(filteredIndividual);
  }, [data, individualData, selectedManager, selectedClient, dateFrom, dateTo]);

  // Get all managers and clients from individual data for accurate filtering
  const allManagers = [...new Set(individualData.map((item) => item['Man name']).filter(Boolean))];
  const allClients = [...new Set(individualData.map((item) => item['Client Phone']).filter(Boolean))];

  // Dynamic filtering based on selections
  const getFilteredManagers = () => {
    if (selectedClient === ALL_CLIENTS) {
      return allManagers;
    }
    // Return only managers who have contacted the selected client
    return [...new Set(
      individualData
        .filter(item => item['Client Phone'].trim() === selectedClient.trim())
        .map(item => item['Man name'])
        .filter(Boolean)
    )];
  };

  const getFilteredClients = () => {
    if (selectedManager === ALL_MANAGERS) {
      return allClients;
    }
    // Return only clients contacted by the selected manager
    return [...new Set(
      individualData
        .filter(item => item['Man name'].trim() === selectedManager.trim())
        .map(item => item['Client Phone'])
        .filter(Boolean)
    )];
  };

  const availableManagers = getFilteredManagers();
  const availableClients = getFilteredClients();

  // Handle manager selection change
  const handleManagerChange = (manager: string) => {
    setSelectedManager(manager);
    // Reset client filter if the selected client is not available for the new manager
    if (manager !== ALL_MANAGERS && selectedClient !== ALL_CLIENTS) {
      const clientsForManager = getFilteredClients();
      if (!clientsForManager.includes(selectedClient)) {
        setSelectedClient(ALL_CLIENTS);
      }
    }
  };

  // Handle client selection change
  const handleClientChange = (client: string) => {
    setSelectedClient(client);
    // Reset manager filter if the selected manager is not available for the new client
    if (client !== ALL_CLIENTS && selectedManager !== ALL_MANAGERS) {
      const managersForClient = getFilteredManagers();
      if (!managersForClient.includes(selectedManager)) {
        setSelectedManager(ALL_MANAGERS);
      }
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedManager(ALL_MANAGERS);
    setSelectedClient(ALL_CLIENTS);
    setDateFrom(undefined);
    setDateTo(undefined);
    setCalendarKey(prev => prev + 1); // Force calendar re-render
  };

  const metrics = computeMetrics(
    filteredData,
    selectedManager,
    selectedClient,
    ALL_MANAGERS,
    ALL_CLIENTS
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary-accent" />
          <span className="text-muted-foreground">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Call Quality Dashboard</h1>
            <p className="text-muted-foreground">Real-time analytics from Google Sheets</p>
          </div>
          <Button
            onClick={fetchData}
            variant="outline"
            size="sm"
            disabled={loading}
            className="bg-card border-border hover:bg-accent"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <Card className="bg-card shadow-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-card-foreground">Filters</CardTitle>
              {(selectedManager !== ALL_MANAGERS || selectedClient !== ALL_CLIENTS || dateFrom || dateTo) && (
                <Button
                  onClick={resetFilters}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Reset Filters
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Manager {selectedClient !== ALL_CLIENTS && `(for ${selectedClient})`}
                </label>
                <Select value={selectedManager} onValueChange={handleManagerChange}>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder="All Managers" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border z-50">
                    <SelectItem value={ALL_MANAGERS}>All Managers</SelectItem>
                    {availableManagers.map((manager) => (
                      <SelectItem key={manager} value={manager}>
                        {manager}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedClient !== ALL_CLIENTS && availableManagers.length === 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    No managers found for this client
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Client {selectedManager !== ALL_MANAGERS && `(for ${selectedManager})`}
                </label>
                <Select value={selectedClient} onValueChange={handleClientChange}>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder="All Clients" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border z-50">
                    <SelectItem value={ALL_CLIENTS}>All Clients</SelectItem>
                    {availableClients.map((client) => (
                      <SelectItem key={client} value={client}>
                        {client}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedManager !== ALL_MANAGERS && availableClients.length === 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    No clients found for this manager
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Date From
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-input border-border hover:bg-accent"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, 'dd.MM.yyyy') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-popover border-border" align="start">
                    <Calendar
                      key={`dateFrom-${calendarKey}`}
                      mode="single"
                      selected={dateFrom}
                      onSelect={setDateFrom}
                      defaultMonth={dateFrom}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Date To
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-input border-border hover:bg-accent"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, 'dd.MM.yyyy') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-popover border-border" align="start">
                    <Calendar
                      key={`dateTo-${calendarKey}`}
                      mode="single"
                      selected={dateTo}
                      onSelect={setDateTo}
                      defaultMonth={dateTo}
                      disabled={(date) => dateFrom ? date < dateFrom : false}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metrics */}
        <MetricsCards metrics={metrics} callsCount={filteredData.length} />

        {/* Charts */}
        <ChartsSection data={filteredData} />

        {selectedManager !== ALL_MANAGERS && selectedClient !== ALL_CLIENTS && (
            <DetailedInsights data={filteredData} />
        )}

        {/* Recent Calls Table */}
        <CallHistoryTable data={filteredIndividualData} />
      </div>
    </div>
  );
};

