import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useHealthData } from '@/hooks/useHealthData';
import { 
  Target, 
  Scale, 
  Activity, 
  Utensils, 
  ArrowRight, 
  ArrowLeft,
  Check,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const goals = [
  { id: 'lose_weight', label: '减重塑形', icon: Scale, color: 'health-coral' },
  { id: 'gain_muscle', label: '增肌增重', icon: Activity, color: 'health-green' },
  { id: 'maintain', label: '保持身材', icon: Target, color: 'health-blue' },
  { id: 'improve_health', label: '改善健康', icon: Utensils, color: 'health-purple' },
];

const activityLevels = [
  { id: 'sedentary', label: '久坐不动', description: '基本不运动' },
  { id: 'light', label: '轻度活动', description: '每周1-2次运动' },
  { id: 'moderate', label: '中度活动', description: '每周3-4次运动' },
  { id: 'active', label: '高度活跃', description: '每周5-6次运动' },
  { id: 'very_active', label: '非常活跃', description: '每天高强度运动' },
];

const OnboardingPage = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    gender: '',
    height_cm: '',
    current_weight_kg: '',
    target_weight_kg: '',
    health_goal: '',
    activity_level: '',
    dietary_preference: ''
  });
  const [loading, setLoading] = useState(false);
  const { updateProfile } = useHealthData();
  const navigate = useNavigate();
  const { toast } = useToast();

  const steps = [
    { title: '基本信息', description: '告诉我们一些关于您的信息' },
    { title: '健康目标', description: '您想达成什么样的健康目标？' },
    { title: '活动水平', description: '您目前的运动频率如何？' },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      await updateProfile({
        gender: formData.gender || null,
        height_cm: formData.height_cm ? parseFloat(formData.height_cm) : null,
        current_weight_kg: formData.current_weight_kg ? parseFloat(formData.current_weight_kg) : null,
        target_weight_kg: formData.target_weight_kg ? parseFloat(formData.target_weight_kg) : null,
        health_goal: formData.health_goal || null,
        activity_level: formData.activity_level || null,
        dietary_preference: formData.dietary_preference || null,
      });
      toast({ title: "设置完成", description: "欢迎使用健康地图！" });
      navigate('/dashboard');
    } catch (error) {
      toast({ 
        title: "保存失败", 
        description: "请稍后重试",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero p-4 flex flex-col">
      {/* Progress bar */}
      <div className="max-w-lg mx-auto w-full pt-8 pb-4">
        <div className="flex items-center gap-2 mb-8">
          {steps.map((_, index) => (
            <div key={index} className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
              <motion.div
                className="h-full gradient-health"
                initial={{ width: 0 }}
                animate={{ width: index <= step ? '100%' : '0%' }}
                transition={{ duration: 0.3 }}
              />
            </div>
          ))}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold mb-2">{steps[step].title}</h1>
          <p className="text-muted-foreground">{steps[step].description}</p>
        </motion.div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-lg mx-auto w-full">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card variant="elevated">
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label>性别</Label>
                    <div className="flex gap-3">
                      {['male', 'female'].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setFormData({ ...formData, gender: g })}
                          className={`flex-1 py-3 rounded-xl border-2 transition-all ${
                            formData.gender === g
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          {g === 'male' ? '男' : '女'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="height">身高 (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="170"
                      value={formData.height_cm}
                      onChange={(e) => setFormData({ ...formData, height_cm: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">当前体重 (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="65"
                      value={formData.current_weight_kg}
                      onChange={(e) => setFormData({ ...formData, current_weight_kg: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="target">目标体重 (kg)</Label>
                    <Input
                      id="target"
                      type="number"
                      placeholder="60"
                      value={formData.target_weight_kg}
                      onChange={(e) => setFormData({ ...formData, target_weight_kg: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-2 gap-4"
            >
              {goals.map((goal) => (
                <Card
                  key={goal.id}
                  variant={formData.health_goal === goal.id ? 'health' : 'elevated'}
                  className={`cursor-pointer transition-all ${
                    formData.health_goal === goal.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setFormData({ ...formData, health_goal: goal.id })}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`w-14 h-14 mx-auto rounded-2xl bg-${goal.color}-light flex items-center justify-center mb-3`}>
                      <goal.icon className={`w-7 h-7 text-${goal.color}`} />
                    </div>
                    <p className="font-medium">{goal.label}</p>
                    {formData.health_goal === goal.id && (
                      <div className="absolute top-3 right-3">
                        <Check className="w-5 h-5 text-primary" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3"
            >
              {activityLevels.map((level) => (
                <Card
                  key={level.id}
                  variant={formData.activity_level === level.id ? 'health' : 'elevated'}
                  className={`cursor-pointer transition-all ${
                    formData.activity_level === level.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setFormData({ ...formData, activity_level: level.id })}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{level.label}</p>
                      <p className="text-sm text-muted-foreground">{level.description}</p>
                    </div>
                    {formData.activity_level === level.id && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <div className="max-w-lg mx-auto w-full py-6 flex gap-4">
        {step > 0 && (
          <Button variant="outline" onClick={handleBack} className="flex-1">
            <ArrowLeft className="w-4 h-4 mr-2" />
            上一步
          </Button>
        )}
        {step < steps.length - 1 ? (
          <Button variant="hero" onClick={handleNext} className="flex-1">
            下一步
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button variant="hero" onClick={handleComplete} disabled={loading} className="flex-1">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                开始使用
                <Check className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;
