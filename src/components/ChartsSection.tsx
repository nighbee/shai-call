  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
  import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
  import { CallData } from './Dashboard';
  import { TrendingUp, PieChartIcon, BarChart3 } from 'lucide-react';
  import { parseDateTimeFromDotted } from '@/lib/utils';

  interface ChartsSectionProps {
    data: CallData[];
  }

  export const ChartsSection = ({ data }: ChartsSectionProps) => {
    // Prepare data for quality trends over time
    const qualityTrends = data
      .reduce((acc: any[], call) => {
        const dateKey = parseDateTimeFromDotted(call.Date, call.Time).toLocaleDateString();
        const existing = acc.find(item => item.date === dateKey);
        
        if (existing) {
          existing.quality = (existing.quality + call['Quality of Call']) / 2;
          existing.script = (existing.script + call['Script Match']) / 2;
          existing.errors = (existing.errors + call['Errors Free']) / 2;
        } else {
          acc.push({
            date: dateKey,
            quality: call['Quality of Call'],
            script: call['Script Match'],
            errors: call['Errors Free']
          });
        }
        
        return acc;
      }, [])
      .sort((a, b) => parseDateTimeFromDotted(a.date).getTime() - parseDateTimeFromDotted(b.date).getTime());

    // Prepare data for manager performance
    const managerPerformance = Object.entries(
      data.reduce(
        (
          acc: Record<string, { calls: number; avgRating: number; totalRating: number }>,
          call
        ) => {
          let manager = call['Man name'];
    
          // Нормализуем
          if (manager === null || manager === undefined) return acc;
          manager = manager.toString().trim();
    
          // Если строка пустая или явно "undefined" → пропускаем
          if (!manager || manager.toLowerCase() === 'undefined') return acc;
    
          if (!acc[manager]) {
            acc[manager] = { calls: 0, avgRating: 0, totalRating: 0 };
          }
          acc[manager].calls += 1;
          acc[manager].totalRating += Number(call['Overall Rating']) || 0;
          acc[manager].avgRating = acc[manager].totalRating / acc[manager].calls;
          return acc;
        },
        {}
      )
    ).map(([name, stats]) => ({
      manager: name,
      rating: Number(stats.avgRating.toFixed(1)),
      calls: stats.calls,
    }));
    
    

    // Prepare data for performance distribution
    const performanceDistribution = [
      { name: 'Excellent (8-10)', value: data.filter(d => d['Overall Rating'] >= 8).length, color: '#2e8f49' },
      { name: 'Good (6-8)', value: data.filter(d => d['Overall Rating'] >= 6 && d['Overall Rating'] < 8).length, color: '#9e9429' },
      { name: 'Poor (0-6)', value: data.filter(d => d['Overall Rating'] < 6).length, color: '#520d1a' }
    ].filter(item => item.value > 0);

    if (data.length === 0) {
      return (
        <Card className="bg-card shadow-card border-border">
          <CardContent className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">No data available for charts</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Quality Trends */}
        {/* <Card className="col-span-1 lg:col-span-2 xl:col-span-2 bg-card shadow-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-card-foreground">
              <TrendingUp className="h-5 w-5" />
              <span>Quality Trends Over Time</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={qualityTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="quality" 
                  stroke="hsl(var(--chart-1))" 
                  strokeWidth={2}
                  name="Quality"
                />
                <Line 
                  type="monotone" 
                  dataKey="script" 
                  stroke="hsl(var(--chart-2))" 
                  strokeWidth={2}
                  name="Script Match"
                />
                <Line 
                  type="monotone" 
                  dataKey="errors" 
                  stroke="hsl(var(--chart-3))" 
                  strokeWidth={2}
                  name="Errors Free"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card> */}

        {/* Performance Distribution */}
        {/* <Card className="bg-card shadow-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-card-foreground">
              <PieChartIcon className="h-5 w-5" />
              <span>Performance Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={performanceDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {performanceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card> */}

        {/* Manager Performance */}
        <Card className="col-span-1 lg:col-span-2 xl:col-span-3 bg-card shadow-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-card-foreground">
              <BarChart3 className="h-5 w-5" />
              <span>Manager Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={managerPerformance} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="manager" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                  formatter={(value, name) => [
                    name === 'rating' ? `${value}/10` : value,
                    name === 'rating' ? 'Avg Rating' : 'Total Calls'
                  ]}
                />
                <Bar dataKey="rating" fill="#1d4f2b" name="rating" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    );
  };