import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface HealthData {
  steps?: number;
  caloriesBurned?: number;
  caloriesConsumed?: number;
  waterIntake?: number;
  sleepHours?: number;
  weight?: number;
  targetWeight?: number;
}

interface UserProfile {
  healthGoal?: string;
  dietaryPreference?: string;
  activityLevel?: string;
}

export function useAIRecommendation() {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const { toast } = useToast();

  const getRecommendation = async (
    type: 'daily_insight' | 'resource_recommendation' | 'meal_suggestion' | 'exercise_suggestion' | 'trend_analysis',
    healthData?: HealthData,
    userProfile?: UserProfile,
    nearbyResources?: unknown[]
  ) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-health-assistant', {
        body: { type, healthData, userProfile, nearbyResources }
      });

      if (error) throw error;

      if (data.error) {
        if (data.error.includes('频繁')) {
          toast({
            title: "请稍后再试",
            description: "AI请求过于频繁",
            variant: "destructive"
          });
        } else {
          throw new Error(data.error);
        }
        return null;
      }

      setRecommendation(data.recommendation);
      return data.recommendation;
    } catch (error) {
      console.error('AI recommendation error:', error);
      // Return default recommendation instead of null
      const defaultRecommendation = "保持每天8杯水，适量运动，早睡早起。均衡饮食，多吃蔬菜水果，您的健康目标指日可待！";
      setRecommendation(defaultRecommendation);
      toast({
        title: "使用默认建议",
        description: "AI服务暂时不可用，已为您提供通用健康建议",
      });
      return defaultRecommendation;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    recommendation,
    getRecommendation
  };
}
