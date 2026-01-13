import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

export interface HealthRecord {
  id: string;
  record_date: string;
  weight_kg: number | null;
  body_fat_percentage: number | null;
  steps: number;
  calories_burned: number;
  calories_consumed: number;
  water_intake_ml: number;
  sleep_hours: number | null;
  notes: string | null;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  gender: string | null;
  birth_date: string | null;
  height_cm: number | null;
  current_weight_kg: number | null;
  target_weight_kg: number | null;
  health_goal: string | null;
  activity_level: string | null;
  dietary_preference: string | null;
}

export function useHealthData() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [todayRecord, setTodayRecord] = useState<HealthRecord | null>(null);
  const [weeklyRecords, setWeeklyRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setProfile(null);
      setTodayRecord(null);
      setWeeklyRecords([]);
      setLoading(false);
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      setProfile(profileData);

      // Fetch today's record
      const today = new Date().toISOString().split('T')[0];
      const { data: todayData } = await supabase
        .from('health_records')
        .select('*')
        .eq('user_id', user.id)
        .eq('record_date', today)
        .maybeSingle();
      
      setTodayRecord(todayData);

      // Fetch weekly records
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const { data: weeklyData } = await supabase
        .from('health_records')
        .select('*')
        .eq('user_id', user.id)
        .gte('record_date', weekAgo.toISOString().split('T')[0])
        .order('record_date', { ascending: true });
      
      setWeeklyRecords(weeklyData || []);
    } catch (error) {
      console.error('Error fetching health data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', user.id);

    if (!error) {
      setProfile(prev => prev ? { ...prev, ...updates } : null);
    }

    return { error };
  };

  const updateTodayRecord = async (updates: Partial<HealthRecord>) => {
    if (!user) return { error: new Error('Not authenticated') };

    const today = new Date().toISOString().split('T')[0];
    
    if (todayRecord) {
      const { error } = await supabase
        .from('health_records')
        .update(updates)
        .eq('id', todayRecord.id);

      if (!error) {
        setTodayRecord(prev => prev ? { ...prev, ...updates } : null);
      }
      return { error };
    } else {
      const { data, error } = await supabase
        .from('health_records')
        .insert({
          user_id: user.id,
          record_date: today,
          ...updates
        })
        .select()
        .single();

      if (!error && data) {
        setTodayRecord(data);
      }
      return { error };
    }
  };

  return {
    profile,
    todayRecord,
    weeklyRecords,
    loading,
    updateProfile,
    updateTodayRecord,
    refetch: fetchData
  };
}
