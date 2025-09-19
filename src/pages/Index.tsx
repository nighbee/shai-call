import Header from "@/components/Header";
import WorkflowEmbed from "@/components/WorkflowEmbed";
import Footer from "@/components/Footer";
import { Dashboard } from "@/components/Dashboard";
const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <WorkflowEmbed />
      <Dashboard />
      <Footer />
    </div>
  );
};

export default Index;
