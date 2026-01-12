import { User, Calendar, FileDown, MessageSquare } from "lucide-react";
import { Button } from "../ui/button";

const actions = [
  {
    icon: User,
    label: "View Student Profile",
    description: "Access detailed student information",
  },
  {
    icon: Calendar,
    label: "Schedule Session",
    description: "Book a counseling session",
  },
  {
    icon: FileDown,
    label: "Export Report (PDF)",
    description: "Download analytics report",
  },
  {
    icon: MessageSquare,
    label: "Send Guidance",
    description: "Message students directly",
  },
];

const QuickActions = () => {
  return (
    <div
      className="card-gradient rounded-xl border border-border/50 shadow-card p-5 animate-fade-in"
      style={{ animationDelay: "600ms" }}
    >
      <div className="mb-5">
        <h3 className="font-display font-semibold text-lg text-foreground">
          Quick Actions
        </h3>
        <p className="text-sm text-muted-foreground">
          Common counselor tasks
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.label}
              variant="action"
              className="h-auto flex-col items-start p-4 gap-2"
            >
              <Icon className="h-5 w-5 text-chart-1" />
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">
                  {action.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {action.description}
                </p>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
