import { Card } from "@/components/ui/card";

const WorkflowEmbed = () => {
  return (
    <section className="w-full py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <Card className="bg-card shadow-large animate-slide-up overflow-hidden">
          <div className="p-1">
            <iframe
              src="http://hackathon.shai.pro/workflow/vRMNjSXsiBMxoAVC"
              width="100%"
              height="800"
              className="rounded-lg border-0"
              title="Shai.pro Sales Call Analyzer"
              allow="microphone; camera; autoplay; encrypted-media"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
            />
          </div>
        </Card>
      </div>
    </section>
  );
};

export default WorkflowEmbed;