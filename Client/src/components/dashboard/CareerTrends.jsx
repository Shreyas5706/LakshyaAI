import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { month: "Jan", software: 45, data: 32, cloud: 18, security: 12, ai: 28 },
  { month: "Feb", software: 48, data: 35, cloud: 22, security: 15, ai: 32 },
  { month: "Mar", software: 52, data: 40, cloud: 28, security: 18, ai: 38 },
  { month: "Apr", software: 50, data: 45, cloud: 32, security: 22, ai: 42 },
  { month: "May", software: 55, data: 48, cloud: 38, security: 25, ai: 48 },
  { month: "Jun", software: 58, data: 52, cloud: 42, security: 28, ai: 55 },
];

const CareerTrends = () => {
  return (
    <div
      className="card-gradient rounded-xl border border-border/50 shadow-card p-5 animate-fade-in"
      style={{ animationDelay: "400ms" }}
    >
      <div className="mb-5">
        <h3 className="font-display font-semibold text-lg text-foreground">
          Batch Career Trends
        </h3>
        <p className="text-sm text-muted-foreground">
          Top career interests over time
        </p>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorSoftware" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(200, 40%, 45%)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(200, 40%, 45%)"
                  stopOpacity={0}
                />
              </linearGradient>

              <linearGradient id="colorData" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(180, 30%, 40%)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(180, 30%, 40%)"
                  stopOpacity={0}
                />
              </linearGradient>

              <linearGradient id="colorAI" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(220, 35%, 50%)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(220, 35%, 50%)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(200, 15%, 25%)"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(195, 7%, 63%)", fontSize: 12 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(195, 7%, 63%)", fontSize: 12 }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(207, 30%, 21%)",
                border: "1px solid hsl(200, 15%, 35%)",
                borderRadius: "8px",
                boxShadow: "0 4px 20px -4px rgba(0, 0, 0, 0.3)",
              }}
              labelStyle={{ color: "hsl(160, 4%, 81%)" }}
              itemStyle={{ color: "hsl(195, 7%, 63%)" }}
            />

            <Legend
              wrapperStyle={{ paddingTop: "20px" }}
              formatter={(value) => (
                <span
                  style={{
                    color: "hsl(195, 7%, 63%)",
                    fontSize: "12px",
                  }}
                >
                  {value}
                </span>
              )}
            />

            <Area
              type="monotone"
              dataKey="software"
              name="Software Dev"
              stroke="hsl(200, 40%, 45%)"
              fill="url(#colorSoftware)"
              strokeWidth={2}
            />

            <Area
              type="monotone"
              dataKey="data"
              name="Data Science"
              stroke="hsl(180, 30%, 40%)"
              fill="url(#colorData)"
              strokeWidth={2}
            />

            <Area
              type="monotone"
              dataKey="ai"
              name="AI/ML"
              stroke="hsl(220, 35%, 50%)"
              fill="url(#colorAI)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CareerTrends;
