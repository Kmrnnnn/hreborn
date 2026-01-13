import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MapPin, Leaf, Shield, Zap, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '@/components/layout/BottomNavigation';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white px-6 pt-16 pb-24 shadow-sm">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-green-500 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500 blur-[120px]" />
        </div>

        <div className="relative max-w-2xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700 text-sm font-bold"
          >
            <Leaf className="w-4 h-4" />
            您的智能健康饮食助手
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-black tracking-tight text-slate-900 leading-tight"
          >
            发现身边的<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
              健康美味
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 max-w-md mx-auto"
          >
            hreborn 利用智能地图技术，为您自动筛选周边高品质健康餐厅，让每一餐都充满活力。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            <Button 
              size="lg" 
              className="h-14 px-8 rounded-2xl text-lg font-bold shadow-xl shadow-green-200"
              onClick={() => navigate('/')}
            >
              立即开启地图
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-2xl mx-auto px-6 py-16 space-y-12">
        <h2 className="text-2xl font-bold text-slate-800 text-center">为什么选择 hreborn？</h2>
        
        <div className="grid gap-6">
          {[
            {
              icon: Zap,
              title: "智能自动搜索",
              desc: "无需输入，进入地图即刻为您展示周边最健康的饮食选择。",
              color: "bg-amber-50 text-amber-600"
            },
            {
              icon: MapPin,
              title: "精准路线规划",
              desc: "一键连接专业导航，为您规划前往美味的最短路径。",
              color: "bg-blue-50 text-blue-600"
            },
            {
              icon: Shield,
              title: "品质餐厅筛选",
              desc: "基于大数据评分，只为您推荐高分、健康的优质餐厅。",
              color: "bg-green-50 text-green-600"
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-5 p-6 rounded-3xl bg-white shadow-sm border border-slate-100"
            >
              <div className={`w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center ${feature.color}`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Index;
