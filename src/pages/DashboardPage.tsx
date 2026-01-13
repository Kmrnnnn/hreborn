import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/lib/auth';
import { useHealthData } from '@/hooks/useHealthData';
import { useAIRecommendation } from '@/hooks/useAIRecommendation';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { 
  Flame, 
  Footprints, 
  Droplets, 
  Moon,
  TrendingUp,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Plus,
  MapPin,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer 
} from 'recharts';

const DashboardPage = () => {
  const { user } = useAuth();
  const { profile, todayRecord, weeklyRecords, loading: dataLoading } = useHealthData();
  const { loading: aiLoading, recommendation, getRecommendation } = useAIRecommendation();
  const [showAIInsight, setShowAIInsight] = useState(false);

  const healthMetrics = [
    { 
      icon: Flame, 
      label: '消耗热量', 
      value: todayRecord?.calories_burned || 0, 
      unit: 'kcal', 
      target: 2400,
      color: 'health-coral',
    },
    { 
      icon: Footprints, 
      label: '今日步数', 
      value: todayRecord?.steps || 0, 
      unit: '步', 
      target: 10000,
      color: 'health-green',
    },
    { 
      icon: Droplets, 
      label: '饮水量', 
      value: (todayRecord?.water_intake_ml || 0) / 1000, 
      unit: 'L', 
      target: 2.5,
      color: 'health-blue',
    },
    { 
      icon: Moon, 
      label: '睡眠', 
      value: todayRecord?.sleep_hours || 0, 
      unit: '小时', 
      target: 8,
      color: 'health-purple',
    },
  ];

  const chartData = weeklyRecords.map(record => ({
    day: new Date(record.record_date).toLocaleDateString('zh-CN', { weekday: 'short' }),
    weight: record.weight_kg || 0,
    steps: record.steps || 0
  }));

  const fetchAIInsight = async () => {
    setShowAIInsight(true);
    await getRecommendation('daily_insight', {
      steps: todayRecord?.steps || 0,
      caloriesBurned: todayRecord?.calories_burned || 0,
      caloriesConsumed: todayRecord?.calories_consumed || 0,
      waterIntake: todayRecord?.water_intake_ml || 0,
      sleepHours: todayRecord?.sleep_hours || 0,
      targetWeight: profile?.target_weight_kg || undefined,
    }, {
      healthGoal: profile?.health_goal || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="gradient-health text-primary-foreground p-6 pt-12 pb-8 rounded-b-3xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-primary-foreground/80 text-sm">欢迎回来</p>
          <h1 className="text-2xl font-bold">{profile?.full_name || '健康达人'}</h1>
          
          <div className="mt-6 bg-primary-foreground/20 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">今日目标完成度</span>
              <span className="font-bold">
                {Math.round((healthMetrics.reduce((acc, m) => acc + Math.min(m.value / m.target, 1), 0) / healthMetrics.length) * 100)}%
              </span>
            </div>
            <Progress 
              value={(healthMetrics.reduce((acc, m) => acc + Math.min(m.value / m.target, 1), 0) / healthMetrics.length) * 100} 
              className="h-2 bg-primary-foreground/30" 
            />
          </div>
        </motion.div>
      </div>

      <div className="p-4 -mt-4 space-y-6">
        {/* Quick metrics */}
        <div className="grid grid-cols-2 gap-3">
          {healthMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="elevated">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className={`w-10 h-10 rounded-xl bg-${metric.color}-light flex items-center justify-center`}>
                      <metric.icon className={`w-5 h-5 text-${metric.color}`} />
                    </div>
                    <div className={`flex items-center gap-1 text-xs ${
                      metric.value >= metric.target * 0.8 ? 'text-health-green' : 'text-health-coral'
                    }`}>
                      {metric.value >= metric.target * 0.8 ? (
                        <ArrowUp className="w-3 h-3" />
                      ) : (
                        <ArrowDown className="w-3 h-3" />
                      )}
                      <span>{Math.round((metric.value / metric.target) * 100)}%</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xl font-bold">
                      {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                    </span>
                    <span className="text-xs text-muted-foreground">{metric.unit}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* AI Insight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card variant="health">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl gradient-health flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">AI 健康洞察</h3>
                  <p className="text-xs text-muted-foreground">基于您的健康数据</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={fetchAIInsight}
                  disabled={aiLoading}
                >
                  {aiLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                </Button>
              </div>
              
              {showAIInsight && recommendation ? (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {recommendation}
                </p>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={fetchAIInsight}
                  disabled={aiLoading}
                >
                  {aiLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  获取今日健康建议
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Weight Trend Chart */}
        {chartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card variant="elevated">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-health-green" />
                  本周趋势
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(168, 76%, 42%)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(168, 76%, 42%)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                      <Area 
                        type="monotone" 
                        dataKey="steps" 
                        stroke="hsl(168, 76%, 42%)" 
                        strokeWidth={2}
                        fill="url(#colorSteps)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-3">
          <Button variant="hero" className="flex-1" onClick={() => window.location.href = '/map'}>
            <MapPin className="w-4 h-4 mr-2" />
            探索附近
          </Button>
          <Button variant="outline" className="flex-1">
            <Plus className="w-4 h-4 mr-2" />
            记录数据
          </Button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default DashboardPage;
