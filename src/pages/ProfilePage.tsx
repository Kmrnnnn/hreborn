import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth';
import { useHealthData } from '@/hooks/useHealthData';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { 
  User, 
  Settings, 
  Target, 
  Scale, 
  Activity,
  ChevronRight,
  LogOut,
  Bell,
  Shield,
  HelpCircle,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const { profile, updateProfile, loading } = useHealthData();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    height_cm: profile?.height_cm?.toString() || '',
    current_weight_kg: profile?.current_weight_kg?.toString() || '',
    target_weight_kg: profile?.target_weight_kg?.toString() || ''
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        full_name: formData.full_name || null,
        height_cm: formData.height_cm ? parseFloat(formData.height_cm) : null,
        current_weight_kg: formData.current_weight_kg ? parseFloat(formData.current_weight_kg) : null,
        target_weight_kg: formData.target_weight_kg ? parseFloat(formData.target_weight_kg) : null,
      });
      toast({ title: "保存成功", description: "您的资料已更新" });
      setEditing(false);
    } catch (error) {
      toast({ title: "保存失败", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const goalLabels: Record<string, string> = {
    lose_weight: '减重塑形',
    gain_muscle: '增肌增重',
    maintain: '保持身材',
    improve_health: '改善健康'
  };

  const activityLabels: Record<string, string> = {
    sedentary: '久坐不动',
    light: '轻度活动',
    moderate: '中度活动',
    active: '高度活跃',
    very_active: '非常活跃'
  };

  const menuItems = [
    { icon: Bell, label: '通知设置', href: '#' },
    { icon: Shield, label: '隐私安全', href: '#' },
    { icon: HelpCircle, label: '帮助中心', href: '#' },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="gradient-health text-primary-foreground p-6 pt-12 pb-20 rounded-b-3xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="w-20 h-20 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <User className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{profile?.full_name || '健康达人'}</h1>
            <p className="text-primary-foreground/80">{user?.email}</p>
          </div>
        </motion.div>
      </div>

      <div className="p-4 -mt-12 space-y-4">
        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { 
              icon: Scale, 
              label: '当前体重', 
              value: profile?.current_weight_kg ? `${profile.current_weight_kg}kg` : '--',
              color: 'health-coral'
            },
            { 
              icon: Target, 
              label: '目标体重', 
              value: profile?.target_weight_kg ? `${profile.target_weight_kg}kg` : '--',
              color: 'health-green'
            },
            { 
              icon: Activity, 
              label: '活动水平', 
              value: profile?.activity_level ? activityLabels[profile.activity_level] : '--',
              color: 'health-blue'
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="elevated">
                <CardContent className="p-3 text-center">
                  <div className={`w-10 h-10 mx-auto rounded-xl bg-${stat.color}-light flex items-center justify-center mb-2`}>
                    <stat.icon className={`w-5 h-5 text-${stat.color}`} />
                  </div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="font-semibold text-sm mt-1">{stat.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Profile info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="elevated">
            <CardHeader className="flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">个人资料</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => editing ? handleSave() : setEditing(true)}
                disabled={saving}
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  editing ? '保存' : '编辑'
                )}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {editing ? (
                <>
                  <div className="space-y-2">
                    <Label>姓名</Label>
                    <Input
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>身高 (cm)</Label>
                      <Input
                        type="number"
                        value={formData.height_cm}
                        onChange={(e) => setFormData({ ...formData, height_cm: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>当前体重 (kg)</Label>
                      <Input
                        type="number"
                        value={formData.current_weight_kg}
                        onChange={(e) => setFormData({ ...formData, current_weight_kg: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>目标体重 (kg)</Label>
                    <Input
                      type="number"
                      value={formData.target_weight_kg}
                      onChange={(e) => setFormData({ ...formData, target_weight_kg: e.target.value })}
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">身高</span>
                    <span className="font-medium">{profile?.height_cm ? `${profile.height_cm}cm` : '未设置'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">健康目标</span>
                    <span className="font-medium">
                      {profile?.health_goal ? goalLabels[profile.health_goal] : '未设置'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">饮食偏好</span>
                    <span className="font-medium">{profile?.dietary_preference || '无特殊偏好'}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Menu items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card variant="elevated">
            <CardContent className="p-0">
              {menuItems.map((item, index) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`flex items-center justify-between p-4 ${
                    index !== menuItems.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-muted-foreground" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </a>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          退出登录
        </Button>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default ProfilePage;
