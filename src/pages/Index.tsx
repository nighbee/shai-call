import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react"; // icons for toggle
import Header from "@/components/Header";
import WorkflowEmbed from "@/components/WorkflowEmbed";
import Footer from "@/components/Footer";
import { Dashboard } from "@/components/Dashboard";
import { Button } from "@/components/ui/button";
import WorkflowEmbed1 from "@/components/WorkflowEmbed1";

const Index = () => {
  const [showWorkflow, setShowWorkflow] = useState(false);

  const toggleWorkflow = () => setShowWorkflow((prev) => !prev);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto p-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-md">
          <p className="text-muted-foreground mb-4 text-sm">
            Have new calls? Make analysis of your new today's calls with Shai.pro: 
          </p>

          <Button
            onClick={toggleWorkflow}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 hover:bg-accent hover:text-foreground transition-colors duration-300"
          >
            {showWorkflow ? (
              <>
                Hide Call Details <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Show Call Details <ChevronDown className="w-4 h-4" />
              </>
            )}
          </Button>

          {/* Animated toggle */}
          <div
            className={`mt-4 overflow-hidden transition-all duration-500 ${
              showWorkflow ? "max-h-[2000px]" : "max-h-0"
            }`}
          >
            {showWorkflow && (
              <div className="mt-2">
                <WorkflowEmbed1 />
              </div>
            )}
          </div>
        </div>
      </div>

      <Dashboard />

      <div className="container mx-auto p-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-md">
          <p className="text-muted-foreground mb-4 text-sm">
            Want to see the details of a single call? Click the button below:
          </p>

          <Button
            onClick={toggleWorkflow}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 hover:bg-accent hover:text-foreground transition-colors duration-300"
          >
            {showWorkflow ? (
              <>
                Hide Call Details <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Show Call Details <ChevronDown className="w-4 h-4" />
              </>
            )}
          </Button>

          {/* Animated toggle */}
          <div
            className={`mt-4 overflow-hidden transition-all duration-500 ${
              showWorkflow ? "max-h-[2000px]" : "max-h-0"
            }`}
          >
            {showWorkflow && (
              <div className="mt-2">
                <WorkflowEmbed />
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
