import { Button } from "@/components/ui/button";
import { MapPin, Sparkles, TrendingUp, Target } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen gradient-hero overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-health-green/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-health-blue/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-health-coral/5 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-health-green-light border border-health-green/20">
              <Sparkles className="w-4 h-4 text-health-green" />
              <span className="text-sm font-medium text-health-green">AI驱动的智能健康管理</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              你的专属
              <span className="text-gradient-health block">健康地图</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              结合AI智能推荐与地图定位技术，为您精准匹配附近的健康餐厅、健身房和理疗中心。
              根据您的健康目标，提供个性化的运动和饮食建议。
            </p>

            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="lg">
                <MapPin className="w-5 h-5 mr-2" />
                开始探索
              </Button>
              <Button variant="outline" size="lg">
                了解更多
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-8 border-t border-border">
              {[
                { value: "10万+", label: "健康资源", icon: MapPin },
                { value: "98%", label: "推荐准确率", icon: Target },
                { value: "50万+", label: "活跃用户", icon: TrendingUp },
              ].map((stat, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-health-green-light flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-health-green" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Map Preview Card */}
          <div className="relative animate-fade-in">
            <div className="relative bg-card rounded-3xl shadow-elevated overflow-hidden border border-border">
              {/* Map placeholder */}
              <div className="aspect-square bg-gradient-to-br from-health-green-light via-health-blue-light to-health-purple-light p-8">
                <div className="w-full h-full rounded-2xl bg-card/50 backdrop-blur-sm flex items-center justify-center relative overflow-hidden">
                  {/* Decorative map elements */}
                  <div className="absolute inset-0">
                    {/* Grid pattern */}
                    <div className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage: `linear-gradient(hsl(var(--health-green) / 0.3) 1px, transparent 1px),
                                          linear-gradient(90deg, hsl(var(--health-green) / 0.3) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                      }}
                    />
                    
                    {/* Animated location markers */}
                    <div className="absolute top-1/4 left-1/3 animate-bounce">
                      <div className="w-8 h-8 rounded-full gradient-health flex items-center justify-center shadow-glow">
                        <MapPin className="w-4 h-4 text-primary-foreground" />
                      </div>
                    </div>
                    <div className="absolute top-1/2 right-1/4 animate-bounce" style={{ animationDelay: '0.5s' }}>
                      <div className="w-8 h-8 rounded-full gradient-energy flex items-center justify-center shadow-health">
                        <MapPin className="w-4 h-4 text-primary-foreground" />
                      </div>
                    </div>
                    <div className="absolute bottom-1/3 left-1/4 animate-bounce" style={{ animationDelay: '1s' }}>
                      <div className="w-8 h-8 rounded-full gradient-calm flex items-center justify-center shadow-health">
                        <MapPin className="w-4 h-4 text-primary-foreground" />
                      </div>
                    </div>
                  </div>

                  {/* Center content */}
                  <div className="relative z-10 text-center space-y-4">
                    <div className="w-20 h-20 mx-auto rounded-2xl gradient-health flex items-center justify-center shadow-glow">
                      <MapPin className="w-10 h-10 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">发现附近健康资源</p>
                      <p className="text-sm text-muted-foreground">餐厅 · 健身房 · 公园</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom info bar */}
              <div className="p-4 bg-card border-t border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-health-green animate-pulse" />
                    <span className="text-sm text-muted-foreground">实时定位中...</span>
                  </div>
                  <span className="text-sm font-medium text-health-green">12个资源在附近</span>
                </div>
              </div>
            </div>

            {/* Floating cards */}
            <div className="absolute -bottom-6 -left-6 bg-card rounded-2xl shadow-health p-4 border border-border animate-float">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-health-coral-light flex items-center justify-center">
                  <Target className="w-5 h-5 text-health-coral" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">今日目标</p>
                  <p className="text-xs text-muted-foreground">完成 85%</p>
                </div>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 bg-card rounded-2xl shadow-health p-4 border border-border animate-float" style={{ animationDelay: '1s' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-health-blue-light flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-health-blue" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">健康趋势</p>
                  <p className="text-xs text-health-green">↑ 12%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
