import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MetricsCards } from './MetricsCards';
import { CallHistoryTable } from './CallHistoryTable';
import { DetailedInsights } from './DetailedInsights';
import { ChartsSection } from './ChartsSection';
import { Loader2, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const [filteredData, setFilteredData] = useState<CallData[]>([]);
  const [filteredIndividualData, setFilteredIndividualData] = useState<CallData[]>([]);

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

    setFilteredIndividualData(filteredIndividual);
  }, [data, individualData, selectedManager, selectedClient]);

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

  // Reset both filters
  const resetFilters = () => {
    setSelectedManager(ALL_MANAGERS);
    setSelectedClient(ALL_CLIENTS);
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
              {(selectedManager !== ALL_MANAGERS || selectedClient !== ALL_CLIENTS) && (
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

