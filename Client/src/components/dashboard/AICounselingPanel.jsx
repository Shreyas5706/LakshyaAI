import { Brain, Sparkles, Target, BookOpen, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

const AICounselingPanel = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setHasGenerated(true);
    }, 2000);
  };

  return (
    <div
      className="card-gradient rounded-xl border border-border/50 shadow-card overflow-hidden animate-fade-in"
      style={{ animationDelay: "500ms" }}
    >
      {/* Header */}
      <div className="p-5 border-b border-border/30 bg-gradient-to-r from-chart-1/10 to-chart-3/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-chart-1/20 border border-chart-1/30">
            <Brain className="h-5 w-5 text-chart-1" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground">
              AI Counseling Assistant
            </h3>
            <p className="text-sm text-muted-foreground">
              Intelligent insights for student guidance
            </p>
          </div>
        </div>
      </div>

      <div className="p-5">
        {!hasGenerated ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/50 border border-border/30 mb-4">
              <Sparkles
                className={cn(
                  "h-8 w-8 text-chart-1",
                  isGenerating && "animate-pulse-subtle"
                )}
              />
            </div>

            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Generate AI-powered counseling insights for at-risk students based
              on their performance data.
            </p>

            <Button
              variant="ai"
              size="lg"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
                  Analyzing Students...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4" />
                  Generate AI Advice
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* AI Summary */}
            <div className="p-4 rounded-lg bg-accent/30 border border-border/30">
              <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-chart-1" />
                AI-Generated Summary
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Analysis of 67 students shows 2 high-risk cases requiring
                immediate attention. Priya Sharma and Vikram Reddy show declining
                trends in core technical skills. Recommend scheduling 1-on-1
                sessions this week.
              </p>
            </div>

            {/* Suggested Paths */}
            <div className="p-4 rounded-lg bg-accent/30 border border-border/30">
              <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <Target className="h-4 w-4 text-chart-2" />
                Suggested Career Paths
              </h4>

              <div className="space-y-2">
                {[
                  {
                    name: "Priya Sharma",
                    path: "QA Engineering → Structured learning path",
                  },
                  {
                    name: "Vikram Reddy",
                    path: "Technical Support → Bridge to Development",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-md bg-background/50"
                  >
                    <span className="text-sm text-foreground">
                      {item.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {item.path}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Actions */}
            <div className="p-4 rounded-lg bg-accent/30 border border-border/30">
              <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-chart-3" />
                Recommended Actions
              </h4>

              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 mt-0.5 text-chart-1 shrink-0" />
                  Schedule intervention meeting with high-risk students
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 mt-0.5 text-chart-1 shrink-0" />
                  Assign peer mentors for Data Structures support
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 mt-0.5 text-chart-1 shrink-0" />
                  Review batch progress in 2 weeks
                </li>
              </ul>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setHasGenerated(false)}
            >
              Regenerate Insights
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AICounselingPanel;
