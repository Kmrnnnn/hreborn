import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Flame, 
  Footprints, 
  Droplets,
  Moon,
  Apple,
  Sparkles,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

const weeklyData = [
  { day: "周一", weight: 68.2, steps: 8500 },
  { day: "周二", weight: 68.0, steps: 10200 },
  { day: "周三", weight: 67.8, steps: 7800 },
  { day: "周四", weight: 67.5, steps: 12000 },
  { day: "周五", weight: 67.4, steps: 9500 },
  { day: "周六", weight: 67.2, steps: 15000 },
  { day: "周日", weight: 67.0, steps: 6500 },
];

const healthMetrics = [
  { 
    icon: Flame, 
    label: "消耗热量", 
    value: "1,850", 
    unit: "kcal", 
    progress: 78, 
    target: "2,400",
    color: "health-coral",
    trend: "up"
  },
  { 
    icon: Footprints, 
    label: "今日步数", 
    value: "8,642", 
    unit: "步", 
    progress: 86, 
    target: "10,000",
    color: "health-green",
    trend: "up"
  },
  { 
    icon: Droplets, 
    label: "饮水量", 
    value: "1.8", 
    unit: "L", 
    progress: 72, 
    target: "2.5L",
    color: "health-blue",
    trend: "down"
  },
  { 
    icon: Moon, 
    label: "睡眠时长", 
    value: "7.5", 
    unit: "小时", 
    progress: 94, 
    target: "8小时",
    color: "health-purple",
    trend: "up"
  },
];

const DashboardPreview = () => {
  return (
    <section id="analytics" className="py-24">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-health-blue-light border border-health-blue/20 mb-6">
            <TrendingUp className="w-4 h-4 text-health-blue" />
            <span className="text-sm font-medium text-health-blue">数据分析</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            可视化
            <span className="text-gradient-health"> 健康数据</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            全面追踪您的健康指标，直观了解身体状况变化
          </p>
        </div>

        {/* Dashboard preview */}
        <div className="bg-card rounded-3xl shadow-elevated border border-border overflow-hidden">
          {/* Dashboard header */}
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-health flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">健康仪表板</h3>
                <p className="text-sm text-muted-foreground">实时数据 · 2024年1月13日</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">本周目标完成度</span>
              <span className="text-lg font-bold text-health-green">82%</span>
            </div>
          </div>

          <div className="p-6">
            {/* Metrics grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {healthMetrics.map((metric, index) => (
                <Card key={index} variant="glass" className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl bg-${metric.color}-light flex items-center justify-center`}>
                        <metric.icon className={`w-5 h-5 text-${metric.color}`} />
                      </div>
                      <div className={`flex items-center gap-1 text-xs ${metric.trend === 'up' ? 'text-health-green' : 'text-health-coral'}`}>
                        {metric.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                        <span>{metric.trend === 'up' ? '+5%' : '-3%'}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">{metric.label}</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-foreground">{metric.value}</span>
                        <span className="text-sm text-muted-foreground">{metric.unit}</span>
                      </div>
                      <Progress value={metric.progress} className="h-1.5" />
                      <p className="text-xs text-muted-foreground">目标: {metric.target}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Weight trend */}
              <Card variant="glass">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-health-green" />
                    体重趋势
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={weeklyData}>
                        <defs>
                          <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(168, 76%, 42%)" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(168, 76%, 42%)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                        <YAxis domain={[66, 69]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                        <Area 
                          type="monotone" 
                          dataKey="weight" 
                          stroke="hsl(168, 76%, 42%)" 
                          strokeWidth={2}
                          fill="url(#weightGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <div>
                      <p className="text-sm text-muted-foreground">本周变化</p>
                      <p className="text-lg font-semibold text-health-green">-1.2 kg</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">目标体重</p>
                      <p className="text-lg font-semibold text-foreground">65 kg</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Steps trend */}
              <Card variant="glass">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Footprints className="w-5 h-5 text-health-blue" />
                    运动步数
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={weeklyData}>
                        <defs>
                          <linearGradient id="stepsGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(200, 80%, 55%)" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(200, 80%, 55%)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                        <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                        <Area 
                          type="monotone" 
                          dataKey="steps" 
                          stroke="hsl(200, 80%, 55%)" 
                          strokeWidth={2}
                          fill="url(#stepsGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <div>
                      <p className="text-sm text-muted-foreground">日均步数</p>
                      <p className="text-lg font-semibold text-health-blue">9,928</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">日目标</p>
                      <p className="text-lg font-semibold text-foreground">10,000</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Insight */}
            <Card variant="health" className="mt-6">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl gradient-health flex items-center justify-center flex-shrink-0">
                    <Apple className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">AI 健康洞察</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      根据您本周的数据分析，您的运动表现良好！建议增加饮水量至每日2.5L，
                      并在下午增加一次轻度拉伸活动。附近的「绿野轻食」餐厅有适合您的低卡套餐推荐。
                    </p>
                    <div className="flex items-center gap-4 pt-2">
                      <span className="text-sm font-medium text-health-green cursor-pointer hover:underline">
                        查看详细建议 →
                      </span>
                      <span className="text-sm font-medium text-health-blue cursor-pointer hover:underline">
                        探索附近资源 →
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
