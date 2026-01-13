import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight, Check } from "lucide-react";

const benefits = [
  "AI个性化健康推荐",
  "实时健康数据追踪",
  "智能位置服务",
  "趋势分析与预测",
];

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-health opacity-95" />
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-primary-foreground/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
            <MapPin className="w-10 h-10 text-primary-foreground" />
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            开启您的健康之旅
          </h2>
          
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            立即体验AI驱动的智能健康管理平台，发现身边的健康资源，实现您的健康目标
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm"
              >
                <Check className="w-4 h-4 text-primary-foreground" />
                <span className="text-sm font-medium text-primary-foreground">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="xl"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-lg"
            >
              免费开始使用
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-2 border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
            >
              了解更多功能
            </Button>
          </div>

          {/* Trust indicators */}
          <p className="text-sm text-primary-foreground/60 mt-8">
            已有超过50万用户正在使用健康地图 · 无需信用卡 · 即刻开始
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
