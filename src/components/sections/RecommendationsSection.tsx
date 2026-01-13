import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Star, 
  Clock, 
  Navigation,
  Utensils,
  Dumbbell,
  Trees,
  Heart,
  Sparkles,
  ArrowRight
} from "lucide-react";

const recommendations = [
  {
    type: "restaurant",
    icon: Utensils,
    name: "绿野轻食",
    category: "健康餐厅",
    rating: 4.8,
    distance: "850m",
    time: "12分钟",
    tags: ["低卡", "素食", "有机"],
    description: "新鲜有机食材，专为健康饮食者定制",
    match: 95,
    color: "health-green",
  },
  {
    type: "gym",
    icon: Dumbbell,
    name: "活力健身中心",
    category: "健身房",
    rating: 4.6,
    distance: "1.2km",
    time: "15分钟",
    tags: ["24小时", "私教", "团课"],
    description: "专业教练团队，个性化训练方案",
    match: 88,
    color: "health-coral",
  },
  {
    type: "park",
    icon: Trees,
    name: "滨江生态公园",
    category: "公园",
    rating: 4.9,
    distance: "600m",
    time: "8分钟",
    tags: ["跑道", "瑜伽区", "空气清新"],
    description: "城市绿肺，晨跑夜跑最佳选择",
    match: 92,
    color: "health-blue",
  },
  {
    type: "wellness",
    icon: Heart,
    name: "和谐理疗馆",
    category: "理疗中心",
    rating: 4.7,
    distance: "1.5km",
    time: "18分钟",
    tags: ["按摩", "理疗", "放松"],
    description: "专业理疗服务，舒缓运动疲劳",
    match: 85,
    color: "health-purple",
  },
];

const RecommendationsSection = () => {
  return (
    <section id="recommendations" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-health-coral-light border border-health-coral/20 mb-6">
            <Sparkles className="w-4 h-4 text-health-coral" />
            <span className="text-sm font-medium text-health-coral">AI推荐</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            为您推荐的
            <span className="text-gradient-health"> 健康资源</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            根据您的健康目标和位置，AI为您精选附近最适合的健康场所
          </p>
        </div>

        {/* Recommendations grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {recommendations.map((item, index) => (
            <Card 
              key={index} 
              variant="elevated"
              className="group hover:shadow-elevated transition-all duration-300 overflow-hidden"
            >
              <CardContent className="p-0">
                <div className="flex">
                  {/* Left - Image/Icon area */}
                  <div className={`w-32 bg-${item.color}-light flex items-center justify-center relative`}>
                    <div className={`w-16 h-16 rounded-2xl bg-card flex items-center justify-center shadow-soft`}>
                      <item.icon className={`w-8 h-8 text-${item.color}`} />
                    </div>
                    {/* Match badge */}
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-card text-foreground text-xs font-medium shadow-soft">
                        {item.match}% 匹配
                      </Badge>
                    </div>
                  </div>

                  {/* Right - Content */}
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">{item.category}</p>
                        <h3 className="text-lg font-semibold text-foreground">{item.name}</h3>
                      </div>
                      <div className="flex items-center gap-1 text-health-yellow">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium">{item.rating}</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">
                      {item.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.tags.map((tag, tagIndex) => (
                        <Badge 
                          key={tagIndex} 
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Distance & Navigation */}
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {item.distance}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {item.time}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" className="text-primary">
                        <Navigation className="w-4 h-4 mr-1" />
                        导航
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View more */}
        <div className="text-center">
          <Button variant="hero" size="lg">
            探索更多资源
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RecommendationsSection;
