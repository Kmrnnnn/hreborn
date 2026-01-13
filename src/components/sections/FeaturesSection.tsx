import { Card, CardContent } from "@/components/ui/card";
import { 
  Brain, 
  MapPin, 
  TrendingUp, 
  Utensils, 
  Dumbbell, 
  Heart,
  Target,
  Sparkles
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI个性化推荐",
    description: "根据您的健康目标、饮食偏好和运动习惯，智能推荐最适合的健康资源",
    variant: "health" as const,
    iconColor: "text-health-green",
  },
  {
    icon: MapPin,
    title: "智能地图导航",
    description: "精准定位附近的健康餐厅、健身房和公园，一键导航快速到达",
    variant: "calm" as const,
    iconColor: "text-health-blue",
  },
  {
    icon: TrendingUp,
    title: "健康趋势分析",
    description: "追踪体重、运动量、饮食等数据变化，预测未来健康趋势",
    variant: "insight" as const,
    iconColor: "text-health-purple",
  },
  {
    icon: Utensils,
    title: "饮食数据整合",
    description: "记录每日饮食，分析营养摄入，获取科学的饮食建议",
    variant: "energy" as const,
    iconColor: "text-health-coral",
  },
  {
    icon: Dumbbell,
    title: "运动计划定制",
    description: "根据您的体能状况和目标，制定个性化运动计划",
    variant: "health" as const,
    iconColor: "text-health-green",
  },
  {
    icon: Heart,
    title: "持续优化系统",
    description: "通过您的反馈和行为数据，不断优化推荐算法",
    variant: "calm" as const,
    iconColor: "text-health-blue",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-health-green-light border border-health-green/20 mb-6">
            <Sparkles className="w-4 h-4 text-health-green" />
            <span className="text-sm font-medium text-health-green">核心功能</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            全方位的
            <span className="text-gradient-health"> 健康管理</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            结合AI技术与地图服务，为您提供个性化的健康管理解决方案
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              variant={feature.variant}
              className="group hover:shadow-elevated hover:-translate-y-1 transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-card flex items-center justify-center shadow-soft`}>
                    <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 p-4 rounded-2xl bg-card shadow-health border border-border">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-health-green" />
              <span className="font-medium text-foreground">设定您的健康目标</span>
            </div>
            <span className="text-muted-foreground">→</span>
            <span className="text-muted-foreground">获取个性化推荐</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
