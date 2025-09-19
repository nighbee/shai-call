import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MetricsCards } from './MetricsCards';
import { CallHistoryTable } from './CallHistoryTable';
import { DetailedInsights } from './DetailedInsights';
import { ChartsSection } from './ChartsSection';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface CallData {
  Date: string;
  Time: string;
  'ID man': string;
  'Man name': string;
  LINK: string;
  'Client Phone': string;
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
  const [data, setData] = useState<CallData[]>([]);
  const [loading, setLoading] = useState(true);
  // Use non-empty sentinel values to satisfy Radix Select requirements
  const ALL_MANAGERS = '__ALL_MANAGERS__';
  const ALL_CLIENTS = '__ALL_CLIENTS__';
  const [selectedManager, setSelectedManager] = useState<string>(ALL_MANAGERS);
  const [selectedClient, setSelectedClient] = useState<string>(ALL_CLIENTS);
  const [filteredData, setFilteredData] = useState<CallData[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://docs.google.com/spreadsheets/d/1WBoa0GfdwriFrqKCTzNMnTA2DaKEbKvh5BsZ6kyiTLo/gviz/tq?tqx=out:json'
      );
      const text = await response.text();
      
      // Parse Google Sheets JSON response (remove gviz wrapper)
      const jsonString = text.replace(/.*?({.*}).*/s, '$1');
      const parsed = JSON.parse(jsonString);
      
      const rows = parsed.table.rows;
      const parsedData: CallData[] = rows.map((row: any) => ({
        Date: row.c[0]?.v || '',
        Time: row.c[1]?.v || '',
        'ID man': row.c[2]?.v || '',
        'Man name': (row.c[3]?.v || '').toString().trim(),
        LINK: row.c[4]?.v || '',
        'Client Phone': (row.c[5]?.v || '').toString().trim(),
        Duration: row.c[6]?.v || '',
        'Quality of Call': parseFloat(row.c[7]?.v) || 0,
        'Script Match': parseFloat(row.c[8]?.v) || 0,
        'Errors Free': parseFloat(row.c[9]?.v) || 0,
        'Overall Rating': parseFloat(row.c[10]?.v) || 0,
        KPI: parseFloat(row.c[11]?.v) || 0,
        Recommendations: row.c[12]?.v || '',
        Brief: row.c[13]?.v || '',
        'Next Best Action': row.c[14]?.v || '',
      }));
      
      setData(parsedData);
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
    let filtered = data;
    
    if (selectedManager && selectedManager !== ALL_MANAGERS) {
      const normalizedManager = selectedManager.trim();
      filtered = filtered.filter(item => item['Man name'].trim() === normalizedManager);
    }
    
    if (selectedClient && selectedClient !== ALL_CLIENTS) {
      const normalizedClient = selectedClient.trim();
      filtered = filtered.filter(item => item['Client Phone'].trim() === normalizedClient);
    }
    
    setFilteredData(filtered);
  }, [data, selectedManager, selectedClient]);

  const managers = [...new Set(
    data.map(item => item['Man name']?.toString().trim()).filter(Boolean)
  )];
  const clients = [...new Set(
    data.map(item => item['Client Phone']?.toString().trim()).filter(Boolean)
  )];

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
            <CardTitle className="text-card-foreground">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Manager
                </label>
                <Select value={selectedManager} onValueChange={setSelectedManager}>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder="All Managers" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border z-50">
                    <SelectItem value={ALL_MANAGERS}>All Managers</SelectItem>
                    {managers.map((manager) => (
                      <SelectItem key={manager} value={manager}>
                        {manager}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Client
                </label>
                <Select value={selectedClient} onValueChange={setSelectedClient}>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder="All Clients" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border z-50">
                    <SelectItem value={ALL_CLIENTS}>All Clients</SelectItem>
                    {clients.map((client) => (
                      <SelectItem key={client} value={client}>
                        {client}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metrics */}
        <MetricsCards data={filteredData} />

        {/* Charts */}
        <ChartsSection data={filteredData} />

        {/* Detailed Insights */}
        {selectedManager && selectedClient && (
          <DetailedInsights data={filteredData} />
        )}

        {/* Recent Calls Table */}
        <CallHistoryTable data={filteredData} />
      </div>
    </div>
  );
};