import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useHealthResources, HealthResource } from '@/hooks/useHealthResources';
import BottomNavigation from '@/components/layout/BottomNavigation';
import {
  MapPin,
  Star,
  Navigation,
  Utensils,
  Dumbbell,
  Trees,
  Heart,
  Building,
  Search,
  X,
  Loader2,
  ChevronUp,
  Phone,
  Clock
} from 'lucide-react';

const categoryIcons: Record<string, typeof Utensils> = {
  restaurant: Utensils,
  gym: Dumbbell,
  park: Trees,
  wellness: Heart,
  clinic: Building
};

const categoryLabels: Record<string, string> = {
  restaurant: '餐厅',
  gym: '健身房',
  park: '公园',
  wellness: '理疗',
  clinic: '诊所'
};

const categoryColors: Record<string, string> = {
  restaurant: '#14b8a6',
  gym: '#f97316',
  park: '#22c55e',
  wellness: '#8b5cf6',
  clinic: '#3b82f6'
};

const MapPage = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  
  const [mapToken, setMapToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedResource, setSelectedResource] = useState<HealthResource | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { resources, loading, selectedCategory, setSelectedCategory } = useHealthResources(
    userLocation || undefined
  );

  const categories = [
    { id: null, label: '全部', icon: MapPin },
    { id: 'restaurant', label: '餐厅', icon: Utensils },
    { id: 'gym', label: '健身房', icon: Dumbbell },
    { id: 'park', label: '公园', icon: Trees },
    { id: 'wellness', label: '理疗', icon: Heart },
  ];

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          // Default to Shanghai if location denied
          setUserLocation({ lat: 31.2304, lng: 121.4737 });
        }
      );
    } else {
      setUserLocation({ lat: 31.2304, lng: 121.4737 });
    }
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapToken || !userLocation) return;

    mapboxgl.accessToken = mapToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [userLocation.lng, userLocation.lat],
      zoom: 14,
    });

    // Add user location marker
    new mapboxgl.Marker({ color: '#14b8a6' })
      .setLngLat([userLocation.lng, userLocation.lat])
      .addTo(map.current);

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    setShowTokenInput(false);

    return () => {
      map.current?.remove();
    };
  }, [mapToken, userLocation]);

  // Add resource markers
  useEffect(() => {
    if (!map.current || !resources.length) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add new markers
    resources.forEach(resource => {
      if (!resource.latitude || !resource.longitude) return;

      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.innerHTML = `
        <div style="
          width: 36px;
          height: 36px;
          background: ${categoryColors[resource.category] || '#14b8a6'};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          cursor: pointer;
          transition: transform 0.2s;
        ">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
      `;

      el.addEventListener('click', () => {
        setSelectedResource(resource);
      });

      el.addEventListener('mouseenter', () => {
        el.querySelector('div')!.style.transform = 'scale(1.2)';
      });
      
      el.addEventListener('mouseleave', () => {
        el.querySelector('div')!.style.transform = 'scale(1)';
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat([Number(resource.longitude), Number(resource.latitude)])
        .addTo(map.current!);

      markers.current.push(marker);
    });
  }, [resources]);

  const filteredResources = resources.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDistance = (km?: number) => {
    if (!km) return '';
    if (km < 1) return `${Math.round(km * 1000)}m`;
    return `${km.toFixed(1)}km`;
  };

  if (showTokenInput) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card variant="elevated" className="w-full max-w-md">
          <CardContent className="p-6 space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl gradient-health flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="text-xl font-bold mb-2">设置地图</h2>
              <p className="text-sm text-muted-foreground">
                请输入您的 Mapbox 公钥以启用地图功能
              </p>
            </div>
            
            <Input
              placeholder="pk.eyJ1..."
              value={mapToken}
              onChange={(e) => setMapToken(e.target.value)}
            />
            
            <Button 
              variant="hero" 
              className="w-full"
              disabled={!mapToken}
              onClick={() => setShowTokenInput(false)}
            >
              启用地图
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              访问 <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a> 获取公钥
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col relative">
      {/* Search bar */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            className="pl-10 pr-10 h-12 rounded-2xl shadow-health bg-card/95 backdrop-blur-sm"
            placeholder="搜索健康资源..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Category filters */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <Button
              key={cat.id || 'all'}
              variant={selectedCategory === cat.id ? 'hero' : 'glass'}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
              className="flex-shrink-0"
            >
              <cat.icon className="w-4 h-4 mr-1" />
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div ref={mapContainer} className="flex-1" />

      {/* Resource list at bottom */}
      <motion.div 
        className="absolute bottom-20 left-0 right-0 px-4"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {loading ? (
            <Card variant="elevated" className="w-64 flex-shrink-0">
              <CardContent className="p-4 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </CardContent>
            </Card>
          ) : (
            filteredResources.slice(0, 5).map((resource) => {
              const Icon = categoryIcons[resource.category] || MapPin;
              return (
                <Card
                  key={resource.id}
                  variant="elevated"
                  className={`w-64 flex-shrink-0 cursor-pointer transition-all ${
                    selectedResource?.id === resource.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => {
                    setSelectedResource(resource);
                    if (map.current && resource.latitude && resource.longitude) {
                      map.current.flyTo({
                        center: [Number(resource.longitude), Number(resource.latitude)],
                        zoom: 16
                      });
                    }
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${categoryColors[resource.category]}20` }}
                      >
                        <Icon 
                          className="w-6 h-6" 
                          style={{ color: categoryColors[resource.category] }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{resource.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {categoryLabels[resource.category]}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-health-yellow text-health-yellow" />
                            <span className="text-xs font-medium">{resource.rating}</span>
                          </div>
                          {resource.distance && (
                            <span className="text-xs text-muted-foreground">
                              {formatDistance(resource.distance)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </motion.div>

      {/* Selected resource detail */}
      <AnimatePresence>
        {selectedResource && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="absolute bottom-20 left-0 right-0 bg-card rounded-t-3xl shadow-elevated z-20"
          >
            <div className="p-4">
              <button
                onClick={() => setSelectedResource(null)}
                className="w-12 h-1 bg-border rounded-full mx-auto mb-4"
              />
              
              <div className="flex gap-4">
                {selectedResource.image_url && (
                  <img
                    src={selectedResource.image_url}
                    alt={selectedResource.name}
                    className="w-24 h-24 rounded-xl object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{selectedResource.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary">
                      {categoryLabels[selectedResource.category]}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-health-yellow text-health-yellow" />
                      <span className="text-sm font-medium">{selectedResource.rating}</span>
                      <span className="text-xs text-muted-foreground">
                        ({selectedResource.review_count}条评价)
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {selectedResource.description}
                  </p>
                </div>
              </div>

              {selectedResource.tags && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedResource.tags.map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <Button variant="hero" className="flex-1">
                  <Navigation className="w-4 h-4 mr-2" />
                  导航前往
                </Button>
                {selectedResource.phone && (
                  <Button variant="outline" size="icon">
                    <Phone className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNavigation />
    </div>
  );
};

export default MapPage;
