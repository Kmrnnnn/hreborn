import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface HealthResource {
  id: string;
  name: string;
  category: string;
  description: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  rating: number;
  review_count: number;
  tags: string[] | null;
  phone: string | null;
  website: string | null;
  opening_hours: unknown;
  image_url: string | null;
  is_verified: boolean;
  distance?: number;
}

export function useHealthResources(userLocation?: { lat: number; lng: number }) {
  const [resources, setResources] = useState<HealthResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchResources();
  }, [selectedCategory]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      let query = supabase.from('health_resources').select('*');
      
      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query.order('rating', { ascending: false });

      if (error) throw error;

      // Calculate distance if user location is available
      let resourcesWithDistance = data || [];
      if (userLocation) {
        resourcesWithDistance = resourcesWithDistance.map(resource => ({
          ...resource,
          distance: resource.latitude && resource.longitude
            ? calculateDistance(
                userLocation.lat,
                userLocation.lng,
                Number(resource.latitude),
                Number(resource.longitude)
              )
            : undefined
        })).sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
      }

      setResources(resourcesWithDistance);
    } catch (error) {
      console.error('Error fetching health resources:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    resources,
    loading,
    selectedCategory,
    setSelectedCategory,
    refetch: fetchResources
  };
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}
