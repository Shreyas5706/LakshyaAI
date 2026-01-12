import { cn } from "../../lib/utils";
import {
  ChevronRight,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Button } from "../ui/button";

const students = [
  {
    id: "1",
    name: "Arjun Patel",
    batch: "CS-2024",
    skillScore: 72,
    weakAreas: ["Data Structures", "System Design"],
    riskLevel: "medium",
    trend: "up",
  },
  {
    id: "2",
    name: "Priya Sharma",
    batch: "CS-2024",
    skillScore: 45,
    weakAreas: ["Algorithms", "Database", "Networks"],
    riskLevel: "high",
    trend: "down",
  },
  {
    id: "3",
    name: "Rahul Kumar",
    batch: "IT-2024",
    skillScore: 88,
    weakAreas: ["Cloud Computing"],
    riskLevel: "low",
    trend: "up",
  },
  {
    id: "4",
    name: "Neha Singh",
    batch: "CS-2024",
    skillScore: 63,
    weakAreas: ["Machine Learning", "Statistics"],
    riskLevel: "medium",
    trend: "stable",
  },
  {
    id: "5",
    name: "Vikram Reddy",
    batch: "IT-2024",
    skillScore: 39,
    weakAreas: ["Programming Basics", "OOP", "Web Dev"],
    riskLevel: "high",
    trend: "down",
  },
];

const getRiskStyles = (level) => {
  switch (level) {
    case "low":
      return "risk-low";
    case "medium":
      return "risk-medium";
    case "high":
      return "risk-high";
    default:
      return "";
  }
};

const StudentAnalytics = () => {
  return (
    <div
      className="card-gradient rounded-xl border border-border/50 shadow-card animate-fade-in"
      style={{ animationDelay: "200ms" }}
    >
      <div className="flex items-center justify-between p-5 border-b border-border/30">
        <div>
          <h3 className="font-display font-semibold text-lg text-foreground">
            Student Analytics
          </h3>
          <p className="text-sm text-muted-foreground">
            Monitor individual student progress and risk levels
          </p>
        </div>

        <Button variant="outline" size="sm" className="gap-2">
          View All
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Student
              </th>
              <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Batch
              </th>
              <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Skill Score
              </th>
              <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Weak Areas
              </th>
              <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Risk Level
              </th>
              <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Trend
              </th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr
                key={student.id}
                className="border-b border-border/20 hover:bg-accent/30 transition-colors cursor-pointer"
              >
                {/* Student */}
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center border border-border/30">
                      <span className="text-sm font-medium text-foreground">
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <span className="font-medium text-foreground">
                      {student.name}
                    </span>
                  </div>
                </td>

                {/* Batch */}
                <td className="p-4 text-sm text-muted-foreground">
                  {student.batch}
                </td>

                {/* Skill Score */}
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-accent rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          student.skillScore >= 70
                            ? "bg-risk-low"
                            : student.skillScore >= 50
                            ? "bg-risk-medium"
                            : "bg-risk-high"
                        )}
                        style={{ width: `${student.skillScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {student.skillScore}%
                    </span>
                  </div>
                </td>

                {/* Weak Areas */}
                <td className="p-4">
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {student.weakAreas.slice(0, 2).map((area, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 text-xs rounded-md bg-accent text-muted-foreground border border-border/30"
                      >
                        {area}
                      </span>
                    ))}
                    {student.weakAreas.length > 2 && (
                      <span className="px-2 py-0.5 text-xs rounded-md bg-accent text-muted-foreground">
                        +{student.weakAreas.length - 2}
                      </span>
                    )}
                  </div>
                </td>

                {/* Risk Level */}
                <td className="p-4">
                  <span
                    className={cn(
                      "px-2.5 py-1 rounded-md text-xs font-medium capitalize",
                      getRiskStyles(student.riskLevel)
                    )}
                  >
                    {student.riskLevel === "high" && (
                      <AlertTriangle className="inline h-3 w-3 mr-1" />
                    )}
                    {student.riskLevel}
                  </span>
                </td>

                {/* Trend */}
                <td className="p-4">
                  {student.trend === "up" && (
                    <TrendingUp className="h-4 w-4 text-risk-low" />
                  )}
                  {student.trend === "down" && (
                    <TrendingDown className="h-4 w-4 text-risk-high" />
                  )}
                  {student.trend === "stable" && (
                    <div className="w-4 h-0.5 bg-muted-foreground rounded" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentAnalytics;
