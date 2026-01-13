import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface HealthData {
  weight?: number;
  targetWeight?: number;
  healthGoal?: string;
  steps?: number;
  caloriesBurned?: number;
  caloriesConsumed?: number;
  waterIntake?: number;
  sleepHours?: number;
  exerciseLogs?: Array<{ type: string; name: string; duration: number }>;
  mealLogs?: Array<{ type: string; name: string; calories: number }>;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, healthData, userProfile, nearbyResources } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    switch (type) {
      case "daily_insight":
        systemPrompt = `你是一位专业的健康管理AI助手。根据用户的健康数据，提供个性化的健康洞察和建议。
回复要求：
- 使用中文回复
- 友好且鼓励性的语气
- 提供具体可行的建议
- 控制在150字以内
- 不要使用markdown格式`;
        userPrompt = `用户健康数据：
- 今日步数：${healthData?.steps || 0}步
- 消耗热量：${healthData?.caloriesBurned || 0}卡路里
- 摄入热量：${healthData?.caloriesConsumed || 0}卡路里
- 饮水量：${healthData?.waterIntake || 0}毫升
- 睡眠时长：${healthData?.sleepHours || 0}小时
- 健康目标：${userProfile?.healthGoal || "保持健康"}
- 目标体重：${userProfile?.targetWeight || "未设置"}kg

请根据以上数据，给出今日健康洞察和改进建议。`;
        break;

      case "resource_recommendation":
        systemPrompt = `你是一位健康资源推荐专家。根据用户的健康目标和附近的健康资源，推荐最适合的场所。
回复要求：
- 使用中文回复
- 解释为什么推荐这些资源
- 给出具体的使用建议
- 控制在200字以内`;
        userPrompt = `用户健康目标：${userProfile?.healthGoal || "保持健康"}
饮食偏好：${userProfile?.dietaryPreference || "无特殊偏好"}
活动水平：${userProfile?.activityLevel || "中等"}

附近可用资源：
${JSON.stringify(nearbyResources, null, 2)}

请推荐最适合用户的健康资源，并说明理由。`;
        break;

      case "meal_suggestion":
        systemPrompt = `你是一位专业的营养师AI。根据用户的健康数据和目标，推荐适合的餐食。
回复要求：
- 使用中文回复
- 提供具体的食物建议
- 说明营养价值
- 控制在150字以内`;
        userPrompt = `用户信息：
- 健康目标：${userProfile?.healthGoal || "保持健康"}
- 饮食偏好：${userProfile?.dietaryPreference || "无特殊偏好"}
- 今日已摄入：${healthData?.caloriesConsumed || 0}卡路里
- 目标：${healthData?.caloriesBurned || 2000}卡路里

请推荐下一餐的饮食建议。`;
        break;

      case "exercise_suggestion":
        systemPrompt = `你是一位专业的运动教练AI。根据用户的健康状况和目标，推荐适合的运动。
回复要求：
- 使用中文回复
- 提供具体的运动建议
- 说明预期效果
- 控制在150字以内`;
        userPrompt = `用户信息：
- 健康目标：${userProfile?.healthGoal || "保持健康"}
- 活动水平：${userProfile?.activityLevel || "中等"}
- 今日步数：${healthData?.steps || 0}步
- 今日运动：${JSON.stringify(healthData?.exerciseLogs || [])}

请推荐适合的运动建议。`;
        break;

      case "trend_analysis":
        systemPrompt = `你是一位健康数据分析专家。根据用户的历史健康数据，分析趋势并预测未来变化。
回复要求：
- 使用中文回复
- 客观分析数据趋势
- 提供未来预测
- 给出改进建议
- 控制在200字以内`;
        userPrompt = `用户历史数据：${JSON.stringify(healthData)}
请分析健康趋势并给出预测。`;
        break;

      default:
        systemPrompt = "你是一位友好的健康管理AI助手，帮助用户实现健康目标。使用中文回复。";
        userPrompt = "请提供健康建议。";
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "请求过于频繁，请稍后再试" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI服务额度已用尽" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "暂时无法提供建议";

    return new Response(
      JSON.stringify({ recommendation: content }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("AI Health Assistant Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
