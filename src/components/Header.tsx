import { Card } from "@/components/ui/card";

const Header = () => {
  return (
    <header className="w-full bg-gradient-subtle py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="bg-gradient-card shadow-business p-8 animate-fade-in">
          <div className="text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Sales Call Analyzer
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              AI-powered analysis of sales calls. Upload a call and instantly get transcript, 
              insights, and next best actions to optimize your sales performance.
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm text-business-secondary">
                <div className="w-2 h-2 bg-business-accent rounded-full"></div>
                <span>Real-time Analysis</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-business-secondary">
                <div className="w-2 h-2 bg-business-accent rounded-full"></div>
                <span>Compliance Tracking</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-business-secondary">
                <div className="w-2 h-2 bg-business-accent rounded-full"></div>
                <span>Action Recommendations</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </header>
  );
};

export default Header;