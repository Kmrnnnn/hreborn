import { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Navigation, Utensils, X, Loader2, Bike, MapPin, Menu, Star, Clock, Leaf } from 'lucide-react';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Geolocation } from '@capacitor/geolocation';
import { Device } from '@capacitor/device';

// Fix Leaflet default icon issue
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom icons
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

// Component to handle map center and view updates
const MapController = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);
  return null;
};

const MapPage = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [places, setPlaces] = useState<FoodPlace[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<FoodPlace | null>(null);
  const [isAutoLoading, setIsAutoLoading] = useState(true);

  // Function to search for healthy food
  const searchHealthyFood = useCallback(async (location: [number, number], query: string = 'healthy food') => {
    setIsSearching(true);
    try {
      const q = query.includes('healthy') ? query : `${query} healthy food`;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&lat=${location[0]}&lon=${location[1]}&bounded=1&viewbox=${location[1]-0.05},${location[0]+0.05},${location[1]+0.05},${location[0]-0.05}&limit=15`
      );
      const data = await response.json();
      
      const mappedPlaces: FoodPlace[] = data.map((item: any, idx: number) => {
        const lat = parseFloat(item.lat);
        const lon = parseFloat(item.lon);
        
        // Calculate distance
        const R = 6371;
        const dLat = (lat - location[0]) * Math.PI / 180;
        const dLon = (lon - location[1]) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(location[0] * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        
        return {
          id: `${item.place_id}-${idx}`,
          name: item.display_name.split(',')[0],
          lat,
          lon,
          address: item.display_name.split(',').slice(1, 3).join(',').trim(),
          canDeliver: Math.random() > 0.3,
          distance: R * c,
          rating: 4 + Math.random(),
          tags: ['健康', '有机', '低卡'].sort(() => 0.5 - Math.random()).slice(0, 2),
          openingHours: '09:00 - 21:00'
        };
      });

      setPlaces(mappedPlaces);
      if (mappedPlaces.length > 0 && isAutoLoading) {
        toast.success(`已自动为您发现周边 ${mappedPlaces.length} 家健康餐厅`);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("获取餐厅数据失败");
    } finally {
      setIsSearching(false);
      setIsAutoLoading(false);
    }
  }, [isAutoLoading]);

  // Get user location and auto-search on mount using Capacitor Geolocation
  useEffect(() => {
    const getLocation = async () => {
      try {
        const coordinates = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true
        });
        const loc: [number, number] = [coordinates.coords.latitude, coordinates.coords.longitude];
        setUserLocation(loc);
        searchHealthyFood(loc);
      } catch (error) {
        console.error("Geolocation error:", error);
        const defaultLoc: [number, number] = [31.2304, 121.4737];
        setUserLocation(defaultLoc);
        searchHealthyFood(defaultLoc);
        toast.info("无法获取实时位置，已显示默认区域健康餐厅");
      }
    };
    getLocation();
  }, [searchHealthyFood]);

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (userLocation && searchQuery.trim()) {
      searchHealthyFood(userLocation, searchQuery);
    }
  };

  const openNavigation = async (place: FoodPlace) => {
    const info = await Device.getInfo();
    if (info.platform === 'ios') {
      // Use Apple Maps on iOS
      window.open(`maps://?daddr=${place.lat},${place.lon}&dirflg=d`, '_blank');
    } else {
      // Use Google Maps on other platforms
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lon}`, '_blank');
    }
  };

  if (!userLocation) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Loader2 className="w-10 h-10 text-primary" />
        </motion.div>
        <p className="mt-4 text-muted-foreground font-medium">正在为您开启智能健康地图...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col relative overflow-hidden bg-slate-50">
      {/* Smart Search Header */}
      <div className="absolute top-0 left-0 right-0 z-[1000] p-4">
        <div className="max-w-2xl mx-auto space-y-3">
          <form onSubmit={handleManualSearch} className="relative group">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                <Input
                  className="pl-12 pr-10 h-14 rounded-2xl shadow-2xl bg-white/95 backdrop-blur-xl border-none text-lg focus-visible:ring-2 focus-visible:ring-primary/50"
                  placeholder="想吃什么健康美食？"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>
              <Button type="submit" className="h-14 w-14 rounded-2xl shadow-2xl" disabled={isSearching}>
                {isSearching ? <Loader2 className="w-6 h-6 animate-spin" /> : <Leaf className="w-6 h-6" />}
              </Button>
            </div>
          </form>
          
          {/* Quick Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {['沙拉', '素食', '低脂', '轻食', '果汁'].map((tag) => (
              <Button
                key={tag}
                variant="secondary"
                size="sm"
                className="rounded-full bg-white/80 backdrop-blur-md border-none shadow-sm hover:bg-primary hover:text-white transition-all whitespace-nowrap"
                onClick={() => {
                  setSearchQuery(tag);
                  searchHealthyFood(userLocation, tag);
                }}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Map Container */}
      <div className="flex-1 z-0">
        <MapContainer
          center={userLocation}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <Marker position={userLocation} icon={userIcon}>
            <Popup className="custom-popup">您的当前位置</Popup>
          </Marker>

          {places.map((place) => (
            <Marker 
              key={place.id} 
              position={[place.lat, place.lon]} 
              icon={healthyFoodIcon}
              eventHandlers={{
                click: () => setSelectedPlace(place),
              }}
            >
              <Popup>
                <div className="p-1 min-w-[150px]">
                  <h3 className="font-bold text-sm">{place.name}</h3>
                  <div className="flex items-center gap-1 text-orange-500 my-1">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-xs font-bold">{place.rating.toFixed(1)}</span>
                  </div>
                  <Button size="sm" className="w-full h-7 text-xs mt-1" onClick={() => setSelectedPlace(place)}>
                    查看详情
                  </Button>
                </div>
              </Popup>
            </Marker>
          ))}

          <MapController center={userLocation} />
        </MapContainer>
      </div>

      {/* Smart Interaction Overlay */}
      <AnimatePresence>
        {selectedPlace && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="absolute bottom-24 left-0 right-0 z-[1001] p-4"
          >
            <Card className="max-w-2xl mx-auto shadow-2xl border-none bg-white/95 backdrop-blur-xl overflow-hidden">
              <div className="h-1.5 w-full bg-green-500" />
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-slate-800">{selectedPlace.name}</h2>
                      <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">
                        <Leaf className="w-3 h-3" />
                        健康优选
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {selectedPlace.address}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setSelectedPlace(null)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-slate-50 p-3 rounded-2xl text-center">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">评分</p>
                    <div className="flex items-center justify-center gap-1 text-orange-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-bold">{selectedPlace.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl text-center">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">距离</p>
                    <p className="font-bold text-slate-700">{selectedPlace.distance?.toFixed(1)}km</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl text-center">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">营业</p>
                    <p className="font-bold text-slate-700 text-xs">营业中</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className={`flex-1 p-4 rounded-2xl flex items-center justify-center gap-3 ${selectedPlace.canDeliver ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-slate-50 text-slate-400'}`}>
                    <Bike className="w-5 h-5" />
                    <div className="text-left">
                      <p className="text-xs font-bold leading-none">外卖服务</p>
                      <p className="text-[10px] opacity-80">{selectedPlace.canDeliver ? '支持配送' : '暂不支持'}</p>
                    </div>
                  </div>
                  <Button className="flex-[1.5] h-auto py-4 rounded-2xl gap-2 text-lg font-bold shadow-lg shadow-primary/20" onClick={() => openNavigation(selectedPlace)}>
                    <Navigation className="w-5 h-5" />
                    规划路线
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Buttons */}
      <div className="absolute right-6 bottom-28 z-[1000] flex flex-col gap-3">
        <Button 
          variant="secondary" 
          size="icon" 
          className="h-14 w-14 rounded-2xl shadow-2xl bg-white/90 backdrop-blur hover:bg-white transition-all"
          onClick={() => {
            if (userLocation) {
              searchHealthyFood(userLocation);
              toast.success("已为您刷新周边健康餐厅");
            }
          }}
        >
          <RefreshCw className="w-6 h-6 text-green-600" />
        </Button>
        <Button 
          variant="secondary" 
          size="icon" 
          className="h-14 w-14 rounded-2xl shadow-2xl bg-white/90 backdrop-blur hover:bg-white transition-all"
          onClick={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition((pos) => {
                const loc: [number, number] = [pos.coords.latitude, pos.coords.longitude];
                setUserLocation(loc);
                toast.success("已定位到您的当前位置");
              });
            }
          }}
        >
          <MapPin className="w-6 h-6 text-blue-600" />
        </Button>
      </div>

      <BottomNavigation />
    </div>
  );
};

// Add missing icon
const RefreshCw = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
);

export default MapPage;
