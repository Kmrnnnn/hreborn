-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  birth_date DATE,
  height_cm NUMERIC,
  current_weight_kg NUMERIC,
  target_weight_kg NUMERIC,
  health_goal TEXT CHECK (health_goal IN ('lose_weight', 'gain_muscle', 'maintain', 'improve_health')),
  activity_level TEXT CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active')),
  dietary_preference TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create health_records table for daily health tracking
CREATE TABLE public.health_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  weight_kg NUMERIC,
  body_fat_percentage NUMERIC,
  steps INTEGER DEFAULT 0,
  calories_burned INTEGER DEFAULT 0,
  calories_consumed INTEGER DEFAULT 0,
  water_intake_ml INTEGER DEFAULT 0,
  sleep_hours NUMERIC,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, record_date)
);

-- Create exercise_logs table
CREATE TABLE public.exercise_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_type TEXT NOT NULL,
  exercise_name TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  calories_burned INTEGER,
  distance_km NUMERIC,
  notes TEXT,
  logged_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create meal_logs table
CREATE TABLE public.meal_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  meal_name TEXT NOT NULL,
  calories INTEGER,
  protein_g NUMERIC,
  carbs_g NUMERIC,
  fat_g NUMERIC,
  notes TEXT,
  logged_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create health_resources table for restaurants, gyms, parks etc.
CREATE TABLE public.health_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('restaurant', 'gym', 'park', 'wellness', 'clinic')),
  description TEXT,
  address TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  rating NUMERIC DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  tags TEXT[],
  phone TEXT,
  website TEXT,
  opening_hours JSONB,
  image_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_favorites table
CREATE TABLE public.user_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES public.health_resources(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, resource_id)
);

-- Create ai_recommendations table
CREATE TABLE public.ai_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recommendation_type TEXT NOT NULL,
  content TEXT NOT NULL,
  resource_ids UUID[],
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for health_records
CREATE POLICY "Users can view their own health records" ON public.health_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own health records" ON public.health_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own health records" ON public.health_records FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own health records" ON public.health_records FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for exercise_logs
CREATE POLICY "Users can view their own exercise logs" ON public.exercise_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own exercise logs" ON public.exercise_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own exercise logs" ON public.exercise_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own exercise logs" ON public.exercise_logs FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for meal_logs
CREATE POLICY "Users can view their own meal logs" ON public.meal_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own meal logs" ON public.meal_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own meal logs" ON public.meal_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own meal logs" ON public.meal_logs FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for health_resources (public read, admin write)
CREATE POLICY "Anyone can view health resources" ON public.health_resources FOR SELECT USING (true);

-- RLS Policies for user_favorites
CREATE POLICY "Users can view their own favorites" ON public.user_favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add their own favorites" ON public.user_favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove their own favorites" ON public.user_favorites FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for ai_recommendations
CREATE POLICY "Users can view their own recommendations" ON public.ai_recommendations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own recommendations" ON public.ai_recommendations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own recommendations" ON public.ai_recommendations FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample health resources
INSERT INTO public.health_resources (name, category, description, address, latitude, longitude, rating, review_count, tags, image_url) VALUES
('绿野轻食', 'restaurant', '新鲜有机食材，专为健康饮食者定制的轻食餐厅', '上海市静安区南京西路1266号', 31.2304, 121.4737, 4.8, 256, ARRAY['低卡', '素食', '有机', '沙拉'], 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd'),
('活力健身中心', 'gym', '专业教练团队，个性化训练方案，24小时营业', '上海市徐汇区淮海中路999号', 31.2195, 121.4586, 4.6, 189, ARRAY['24小时', '私教', '团课', '器械'], 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48'),
('滨江生态公园', 'park', '城市绿肺，晨跑夜跑最佳选择，空气清新', '上海市浦东新区滨江大道2727号', 31.2356, 121.5067, 4.9, 512, ARRAY['跑道', '瑜伽区', '空气清新', '免费'], 'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90'),
('和谐理疗馆', 'wellness', '专业理疗服务，舒缓运动疲劳，恢复身心平衡', '上海市长宁区延安西路2299号', 31.2122, 121.4237, 4.7, 128, ARRAY['按摩', '理疗', '放松', '康复'], 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874'),
('素心斋', 'restaurant', '传统素食餐厅，健康养生，环境优雅', '上海市黄浦区福州路388号', 31.2389, 121.4759, 4.5, 178, ARRAY['素食', '养生', '传统', '清淡'], 'https://images.unsplash.com/photo-1498837167922-ddd27525d352'),
('动感单车馆', 'gym', '专业动感单车训练，燃脂高效', '上海市普陀区中山北路2000号', 31.2456, 121.4123, 4.4, 95, ARRAY['动感单车', '燃脂', '团课', '音乐'], 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f'),
('世纪公园', 'park', '大型城市公园，多条跑步路线', '上海市浦东新区锦绣路1001号', 31.2167, 121.5456, 4.8, 623, ARRAY['跑步', '骑行', '草坪', '湖泊'], 'https://images.unsplash.com/photo-1585938389612-a552a28c6914'),
('健康诊所', 'clinic', '专业体检，健康咨询，营养指导', '上海市闵行区虹桥路1588号', 31.1923, 121.3867, 4.6, 87, ARRAY['体检', '营养咨询', '健康管理'], 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d');