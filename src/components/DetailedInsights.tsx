import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CallData } from './Dashboard';
import { MessageSquare, FileText, ArrowRight, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { parseDateTimeFromDotted } from '@/lib/utils';

interface DetailedInsightsProps {
  data: CallData[];
}

export const DetailedInsights = ({ data }: DetailedInsightsProps) => {
  if (data.length === 0) return null;

  const latestCall = data
    .sort((a, b) => {
      const dateA = parseDateTimeFromDotted(a.Date, a.Time);
      const dateB = parseDateTimeFromDotted(b.Date, b.Time);
      return dateB.getTime() - dateA.getTime();
    })[0];

  // States for collapsible sections
  const [briefOpen, setBriefOpen] = useState(false);
  const [recOpen, setRecOpen] = useState(false);
  const [nbaOpen, setNbaOpen] = useState(false);

  const toggleBrief = () => setBriefOpen((prev) => !prev);
  const toggleRec = () => setRecOpen((prev) => !prev);
  const toggleNba = () => setNbaOpen((prev) => !prev);

  return (
    <Card className="bg-card shadow-lg border-border">
      <CardHeader className="bg-black-primary">
        <CardTitle className="flex items-center space-x-2 text-primary-foreground">
          <Lightbulb className="h-5 w-5" />
          <span>Detailed Insights</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Brief */}
          <div className="space-y-3 cursor-pointer" onClick={toggleBrief}>
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-chart-2" />
                <h3 className="text-lg font-semibold text-card-foreground">Brief</h3>
              </div>
              {briefOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
            <div
              className={`overflow-hidden transition-all duration-500 ${
                briefOpen ? 'max-h-[500px]' : 'max-h-0'
              } bg-white p-4 rounded-lg border border-border`}
            >
              <div className="text-sm text-card-foreground leading-relaxed">
                {latestCall.Brief ? (
                  latestCall.Brief.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-3 last:mb-0">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p>No brief available.</p>
                )}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="space-y-3 cursor-pointer" onClick={toggleRec}>
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-primary-accent" />
                <h3 className="text-lg font-semibold text-card-foreground">Recommendations</h3>
              </div>
              {recOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
            <div
              className={`overflow-hidden transition-all duration-500 ${
                recOpen ? 'max-h-[500px]' : 'max-h-0'
              } bg-white p-4 rounded-lg border border-border`}
            >
              <div className="text-sm text-card-foreground leading-relaxed">
                {latestCall.Recommendations ? (
                  latestCall.Recommendations.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-3 last:mb-0">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p>No recommendations available.</p>
                )}
              </div>
            </div>
          </div>

          {/* Next Best Action */}
          <div className="space-y-3 cursor-pointer" onClick={toggleNba}>
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-2">
                <ArrowRight className="h-5 w-5 text-chart-3" />
                <h3 className="text-lg font-semibold text-card-foreground">Next Best Action</h3>
              </div>
              {nbaOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
            <div
              className={`overflow-hidden transition-all duration-500 ${
                nbaOpen ? 'max-h-[500px]' : 'max-h-0'
              } bg-gradient-warning p-4 rounded-lg border border-border`}
            >
              <div className="text-sm text-warning-foreground font-medium leading-relaxed">
                {latestCall['Next Best Action'] ? (
                  latestCall['Next Best Action'].split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-3 last:mb-0">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p>No action items available.</p>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Call Summary */}
        {/* <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Latest interaction on {latestCall.Date} at {latestCall.Time}
          </p>
        </div> */}
      </CardContent>
    </Card>
  );
};
