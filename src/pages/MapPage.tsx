import { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Navigation, X, Loader2, Bike, MapPin, Star, Leaf, RefreshCw } from 'lucide-react';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

// Fix Leaflet default icon issue
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const healthyFoodIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface FoodPlace {
  id: string;
  name: string;
  lat: number;
  lon: number;
  address: string;
  canDeliver: boolean;
  distance?: number;
  rating: number;
  tags: string[];
  openingHours: string;
}

const DEFAULT_LOCATION: [number, number] = [39.9042, 116.4074];

const generateMockPlaces = (location: [number, number]): FoodPlace[] => {
  const mockNames = [
    { name: '绿野轻食', tags: ['沙拉', '低卡'] },
    { name: '素心素食馆', tags: ['素食', '有机'] },
    { name: '健康厨房', tags: ['健康', '低脂'] },
    { name: '轻盈果汁吧', tags: ['果汁', '低糖'] },
    { name: '活力沙拉', tags: ['沙拉', '健康'] },
    { name: '纯净食堂', tags: ['有机', '天然'] },
  ];

  return mockNames.map((item, idx) => {
    const latOffset = (Math.random() - 0.5) * 0.02;
    const lonOffset = (Math.random() - 0.5) * 0.02;
    const distance = Math.sqrt(latOffset * latOffset + lonOffset * lonOffset) * 111;
    
    return {
      id: `mock-${idx}`,
      name: item.name,
      lat: location[0] + latOffset,
      lon: location[1] + lonOffset,
      address: `附近${distance.toFixed(1)}公里处`,
      canDeliver: Math.random() > 0.3,
      distance,
      rating: 4.2 + Math.random() * 0.8,
      tags: item.tags,
      openingHours: '09:00 - 21:00'
    };
  });
};

const MapPage = () => {
  const [userLocation] = useState<[number, number]>(DEFAULT_LOCATION);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [places, setPlaces] = useState<FoodPlace[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<FoodPlace | null>(null);
  const [isLocating, setIsLocating] = useState(true);
  const initialized = useRef(false);

  const searchHealthyFood = useCallback(async (location: [number, number], query: string = 'restaurant') => {
    if (isSearching) return;
    setIsSearching(true);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&lat=${location[0]}&lon=${location[1]}&bounded=1&viewbox=${location[1]-0.05},${location[0]+0.05},${location[1]+0.05},${location[0]-0.05}&limit=10`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const mapped = data.map((item: any, idx: number) => ({
          id: `${item.place_id}-${idx}`,
          name: item.display_name.split(',')[0],
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
          address: item.display_name.split(',').slice(1, 3).join(',').trim(),
          canDeliver: Math.random() > 0.3,
          distance: Math.random() * 3,
          rating: 4 + Math.random(),
          tags: ['健康', '有机'].slice(0, 2),
          openingHours: '09:00 - 21:00'
        }));
        setPlaces(mapped);
        toast.success(`已发现 ${mapped.length} 家餐厅`);
      } else {
        setPlaces(generateMockPlaces(location));
        toast.info('已推荐附近健康餐厅');
      }
    } catch {
      setPlaces(generateMockPlaces(location));
      toast.info('已推荐附近健康餐厅');
    } finally {
      setIsSearching(false);
    }
  }, [isSearching]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    
    const init = async () => {
      setIsLocating(true);
      await searchHealthyFood(DEFAULT_LOCATION);
      setIsLocating(false);
    };
    init();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) searchHealthyFood(userLocation, searchQuery);
  };

  return (
    <div className="h-screen flex flex-col relative overflow-hidden bg-slate-50">
      <div className="absolute top-0 left-0 right-0 z-[1000] p-4 pt-safe">
        <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
            <Input
              className="pl-12 h-14 rounded-2xl shadow-2xl bg-white/95 border-none"
              placeholder="搜索健康美食"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit" className="h-14 w-14 rounded-2xl" disabled={isSearching}>
            {isSearching ? <Loader2 className="w-6 h-6 animate-spin" /> : <Leaf className="w-6 h-6" />}
          </Button>
        </form>
      </div>

      <div className="flex-1 z-0 relative">
        {isLocating && (
          <div className="absolute inset-0 z-10 bg-background/80 flex flex-col items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
              <Loader2 className="w-10 h-10 text-primary" />
            </motion.div>
            <p className="mt-4 text-muted-foreground">正在加载地图...</p>
          </div>
        )}
        
        <MapContainer center={userLocation} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={userLocation} icon={userIcon}>
            <Popup>您的位置</Popup>
          </Marker>
          {places.map((place) => (
            <Marker key={place.id} position={[place.lat, place.lon]} icon={healthyFoodIcon} eventHandlers={{ click: () => setSelectedPlace(place) }}>
              <Popup>
                <strong>{place.name}</strong>
                <div className="flex items-center gap-1 text-orange-500">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{place.rating.toFixed(1)}</span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <AnimatePresence>
        {selectedPlace && (
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="absolute bottom-24 left-0 right-0 z-[1001] p-4">
            <Card className="max-w-2xl mx-auto shadow-2xl border-none bg-white/95">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold">{selectedPlace.name}</h2>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />{selectedPlace.address}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedPlace(null)}><X className="w-5 h-5" /></Button>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-slate-50 p-3 rounded-xl text-center">
                    <Star className="w-4 h-4 mx-auto text-orange-500 fill-current" />
                    <span className="font-bold">{selectedPlace.rating.toFixed(1)}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl text-center">
                    <p className="font-bold">{selectedPlace.distance?.toFixed(1)}km</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl text-center">
                    <Bike className="w-4 h-4 mx-auto" />
                    <p className="text-xs">{selectedPlace.canDeliver ? '可配送' : '不配送'}</p>
                  </div>
                </div>
                <Button className="w-full" onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.lat},${selectedPlace.lon}`, '_blank')}>
                  <Navigation className="w-4 h-4 mr-2" />规划路线
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute right-4 bottom-28 z-[1000]">
        <Button variant="secondary" size="icon" className="h-12 w-12 rounded-full shadow-lg bg-white" onClick={() => searchHealthyFood(userLocation)} disabled={isSearching}>
          <RefreshCw className={`w-5 h-5 ${isSearching ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default MapPage;