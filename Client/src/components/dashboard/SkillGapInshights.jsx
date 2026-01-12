import { cn } from "../../lib/utils";

const skillGaps = [
  {
    skill: "Data Structures & Algorithms",
    studentsAffected: 45,
    percentage: 68,
    severity: "high",
  },
  {
    skill: "System Design",
    studentsAffected: 38,
    percentage: 58,
    severity: "medium",
  },
  {
    skill: "Database Management",
    studentsAffected: 32,
    percentage: 49,
    severity: "medium",
  },
  {
    skill: "Cloud Computing",
    studentsAffected: 28,
    percentage: 42,
    severity: "low",
  },
  {
    skill: "Machine Learning Basics",
    studentsAffected: 25,
    percentage: 38,
    severity: "low",
  },
  {
    skill: "Web Development",
    studentsAffected: 22,
    percentage: 33,
    severity: "low",
  },
];

const getSeverityColor = (severity) => {
  switch (severity) {
    case "high":
      return "bg-risk-high";
    case "medium":
      return "bg-risk-medium";
    case "low":
      return "bg-chart-1";
    default:
      return "bg-chart-1";
  }
};

const SkillGapInsights = () => {
  return (
    <div
      className="card-gradient rounded-xl border border-border/50 shadow-card p-5 animate-fade-in"
      style={{ animationDelay: "300ms" }}
    >
      <div className="mb-5">
        <h3 className="font-display font-semibold text-lg text-foreground">
          Skill Gap Insights
        </h3>
        <p className="text-sm text-muted-foreground">
          Common weak areas across all batches
        </p>
      </div>

      <div className="space-y-4">
        {skillGaps.map((gap, index) => (
          <div key={gap.skill} className="group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                {gap.skill}
              </span>

              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">
                  {gap.studentsAffected} students
                </span>
                <span className="text-sm font-medium text-foreground">
                  {gap.percentage}%
                </span>
              </div>
            </div>

            <div className="h-2 bg-accent rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500 ease-out",
                  getSeverityColor(gap.severity)
                )}
                style={{
                  width: `${gap.percentage}%`,
                  transitionDelay: `${index * 100}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border/30">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-risk-high" />
            <span className="text-muted-foreground">Critical</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-risk-medium" />
            <span className="text-muted-foreground">Moderate</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-chart-1" />
            <span className="text-muted-foreground">Minor</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillGapInsights;
