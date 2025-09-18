import { useState, useMemo } from "react";
import { KPICard } from "./KPIcard";
import { DashboardFilters } from "./DashboardFilter";
import { CallsChart } from "./CallsChart";
import { CallsTable } from "./CallsTable";
import { PhoneIcon, StarIcon, CheckCircleIcon, AlertTriangleIcon, Loader2 } from "lucide-react";
import { useCallsByManager } from "@/hooks/useCalls";
import { useManagers } from "@/hooks/useManagers";

export const Dashboard = () => {
  const [selectedManager, setSelectedManager] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("7days");

  // Fetch data from Supabase
  const { calls: allCalls, loading: callsLoading, error: callsError } = useCallsByManager(selectedManager);
  const { managers, loading: managersLoading, error: managersError } = useManagers();

  const filteredCalls = useMemo(() => {
    // Additional date filtering can be added here if needed
    return allCalls;
  }, [allCalls, selectedDateRange]);

  const kpis = useMemo(() => {
    const totalCalls = filteredCalls.length;
    
    if (totalCalls === 0) {
      return {
        totalCalls: 0,
        avgQuality: "0.0",
        avgRating: "0.0",
        avgScriptMatch: "0.0",
        avgErrors: "0.0"
      };
    }

    const avgQuality = filteredCalls.reduce((sum, call) => sum + call.quality_of_call, 0) / totalCalls;
    const avgRating = filteredCalls.reduce((sum, call) => sum + call.rating, 0) / totalCalls;
    const avgScriptMatch = filteredCalls.reduce((sum, call) => sum + call.script_match, 0) / totalCalls;
    const avgErrors = filteredCalls.reduce((sum, call) => sum + call.errors, 0) / totalCalls;

    return {
      totalCalls,
      avgQuality: avgQuality.toFixed(1),
      avgRating: avgRating.toFixed(1),
      avgScriptMatch: avgScriptMatch.toFixed(1),
      avgErrors: avgErrors.toFixed(1)
    };
  }, [filteredCalls]);

  const barChartData = useMemo(() => {
    if (managers.length === 0) return [];
    
    const managerStats = managers.map(manager => {
      const managerCalls = filteredCalls.filter(call => call.manager_name === manager);
      const avgRating = managerCalls.length > 0 
        ? managerCalls.reduce((sum, call) => sum + call.rating, 0) / managerCalls.length
        : 0;
      return {
        name: manager.split(' ')[0], // First name only for chart
        value: managerCalls.length,
        calls: managerCalls.length,
        rating: Number(avgRating.toFixed(1))
      };
    });
    return managerStats;
  }, [managers, filteredCalls]);

  const lineChartData = [
    { name: "Mon", value: 12 },
    { name: "Tue", value: 8 },
    { name: "Wed", value: 15 },
    { name: "Thu", value: 20 },
    { name: "Fri", value: 18 },
    { name: "Sat", value: 6 },
    { name: "Sun", value: 4 }
  ];

  const pieChartData = useMemo(() => {
    const good = filteredCalls.filter(call => call.rating >= 8).length;
    const medium = filteredCalls.filter(call => call.rating >= 4 && call.rating < 8).length;
    const bad = filteredCalls.filter(call => call.rating < 4).length;

    return [
      { name: "Good (8-10)", value: good },
      { name: "Medium (4-7)", value: medium },
      { name: "Bad (1-3)", value: bad }
    ];
  }, [filteredCalls]);

  // Show loading state
  if (callsLoading || managersLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (callsError || managersError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <AlertTriangleIcon className="h-12 w-12 text-destructive mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">Error Loading Data</h3>
            <p className="text-muted-foreground">
              {callsError || managersError}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Analytics Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Dashboard Analytics
          </h2>
        </div>

        {/* Filters */}
        <DashboardFilters
          selectedManager={selectedManager}
          selectedDateRange={selectedDateRange}
          managers={managers}
          onManagerChange={setSelectedManager}
          onDateRangeChange={setSelectedDateRange}
        />

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <KPICard
            title="Total Calls"
            value={kpis.totalCalls}
            icon={<PhoneIcon className="h-4 w-4" />}
            color="primary"
            change={12}
          />
          <KPICard
            title="Avg Quality"
            value={kpis.avgQuality}
            icon={<StarIcon className="h-4 w-4" />}
            color="success"
            change={5.2}
          />
          <KPICard
            title="Avg Rating"
            value={`${kpis.avgRating}/10`}
            icon={<CheckCircleIcon className="h-4 w-4" />}
            color="primary"
            change={-2.1}
          />
          <KPICard
            title="Script Match"
            value={`${kpis.avgScriptMatch}%`}
            icon={<CheckCircleIcon className="h-4 w-4" />}
            color="success"
            change={3.8}
          />
          <KPICard
            title="Avg Errors"
            value={kpis.avgErrors}
            icon={<AlertTriangleIcon className="h-4 w-4" />}
            color="warning"
            change={-8.5}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <CallsChart
            type="bar"
            title="Calls per Manager"
            data={barChartData}
            height={300}
          />
          <CallsChart
            type="line"
            title="Calls Over Time"
            data={lineChartData}
            height={300}
          />
          <CallsChart
            type="pie"
            title="Rating Distribution"
            data={pieChartData}
            height={300}
          />
        </div>

        {/* Calls Table */}
        <CallsTable calls={filteredCalls} />
      </div>
    </div>
  );
};