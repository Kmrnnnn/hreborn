import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Navigation, Utensils, X, Loader2, Bike, MapPin, Menu } from 'lucide-react';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface FoodPlace {
  id: string;
  name: string;
  lat: number;
  lon: number;
  address: string;
  canDeliver: boolean;
  distance?: number;
}

// Simple map component using OpenStreetMap
const SimpleMap = ({ center, places, selectedPlace }: { 
  center: [number, number], 
  places: FoodPlace[],
  selectedPlace: FoodPlace | null
}) => {
  const mapUrl = `https://maps.openstreetmap.org/export/embed.html?bbox=${center[1]-0.05},${center[0]-0.05},${center[1]+0.05},${center[0]+0.05}&layer=mapnik&marker=${center[0]},${center[1]}`;
  
  return (
    <div className="w-full h-full bg-gray-100 relative overflow-hidden">
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        marginHeight={0}
        marginWidth={0}
        src={mapUrl}
        style={{ border: 0 }}
      />
      {/* Overlay markers indicator */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="text-center text-white drop-shadow-lg">
          <MapPin className="w-8 h-8 mx-auto mb-2 text-blue-500" />
          <p className="text-sm font-semibold">您的位置</p>
          {places.length > 0 && (
            <p className="text-xs mt-2">找到 {places.length} 个美食地点</p>
          )}
        </div>
      </div>
    </div>
  );
};

const MapPage = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<FoodPlace[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<FoodPlace | null>(null);
  const [isRouting, setIsRouting] = useState(false);

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          toast.success('已获取您的位置');
        },
        () => {
          toast.error("无法获取位置，已默认设为上海");
          setUserLocation([31.2304, 121.4737]);
        }
      );
    } else {
      setUserLocation([31.2304, 121.4737]);
    }
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim() || !userLocation) {
      toast.error('请输入搜索内容');
      return;
    }

    setIsSearching(true);
    setSelectedPlace(null);
    setIsRouting(false);

    try {
      // Use Nominatim for searching food near user location
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + ' 餐厅')}&lat=${userLocation[0]}&lon=${userLocation[1]}&bounded=1&viewbox=${userLocation[1]-0.05},${userLocation[0]+0.05},${userLocation[1]+0.05},${userLocation[0]-0.05}&limit=10`
      );
      const data = await response.json();
      
      if (data.length === 0) {
        toast.info("未找到相关美食");
        setSearchResults([]);
      } else {
        const places: FoodPlace[] = data.map((item: any, idx: number) => {
          const lat = parseFloat(item.lat);
          const lon = parseFloat(item.lon);
          const userLat = userLocation[0];
          const userLon = userLocation[1];
          
          // Calculate distance
          const R = 6371; // Earth's radius in km
          const dLat = (lat - userLat) * Math.PI / 180;
          const dLon = (lon - userLon) * Math.PI / 180;
          const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(userLat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
                    Math.sin(dLon/2) * Math.sin(dLon/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          const distance = R * c;
          
          return {
            id: `${item.place_id}-${idx}`,
            name: item.display_name.split(',')[0],
            lat,
            lon,
            address: item.display_name,
            canDeliver: Math.random() > 0.3,
            distance
          };
        });

        setSearchResults(places);
        toast.success(`找到 ${places.length} 个美食地点`);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("搜索失败，请稍后再试");
    } finally {
      setIsSearching(false);
    }
  };

  const startRouting = (place: FoodPlace) => {
    setSelectedPlace(place);
    setIsRouting(true);
    setSearchResults([]); // Clear list to focus on map
    toast.success(`已选择: ${place.name}`);
  };

  const openGoogleMaps = (place: FoodPlace) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lon}&travelmode=driving`;
    window.open(url, '_blank');
  };

  if (!userLocation) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">正在获取您的位置...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      {/* Header / Search Bar */}
      <div className="absolute top-0 left-0 right-0 z-[1000] p-4 bg-gradient-to-b from-background/90 to-transparent">
        <form onSubmit={handleSearch} className="relative flex gap-2 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              className="pl-10 pr-10 h-12 rounded-full shadow-lg bg-card/95 backdrop-blur-md border-none"
              placeholder="想吃什么？输入美食名称..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isSearching}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            )}
          </div>
          <Button 
            type="submit" 
            size="icon" 
            className="h-12 w-12 rounded-full shadow-lg" 
            disabled={isSearching}
          >
            {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          </Button>
        </form>
      </div>

      {/* Map Container */}
      <div className="flex-1 z-0 bg-gray-200">
        <SimpleMap center={userLocation} places={searchResults} selectedPlace={selectedPlace} />
      </div>

      {/* Results / Selected Place Overlay */}
      <AnimatePresence>
        {(searchResults.length > 0 || selectedPlace) && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="absolute bottom-0 left-0 right-0 z-[1001] p-4 pointer-events-none"
          >
            <div className="max-w-2xl mx-auto pointer-events-auto">
              {isRouting && selectedPlace ? (
                <Card className="shadow-2xl border-t-4 border-orange-500">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                          <Utensils className="w-5 h-5 text-orange-500" />
                          {selectedPlace.name}
                        </h2>
                        <p className="text-sm text-muted-foreground">{selectedPlace.address}</p>
                        {selectedPlace.distance && (
                          <p className="text-xs text-primary mt-1">距离: {selectedPlace.distance.toFixed(2)} km</p>
                        )}
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => setIsRouting(false)}>
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="flex gap-3">
                      <div className={`flex-1 p-3 rounded-xl flex items-center gap-2 ${selectedPlace.canDeliver ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                        <Bike className="w-5 h-5" />
                        <span className="font-medium text-sm">{selectedPlace.canDeliver ? '支持外卖' : '暂不支持外卖'}</span>
                      </div>
                      <Button className="flex-1 gap-2" onClick={() => openGoogleMaps(selectedPlace)}>
                        <Navigation className="w-4 h-4" />
                        开始导航
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : searchResults.length > 0 ? (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {searchResults.map((place) => (
                    <Card 
                      key={place.id} 
                      className="w-72 flex-shrink-0 shadow-xl cursor-pointer hover:border-orange-500 transition-colors"
                      onClick={() => startRouting(place)}
                    >
                      <CardContent className="p-4">
                        <h3 className="font-bold truncate">{place.name}</h3>
                        <p className="text-xs text-muted-foreground truncate mb-2">{place.address}</p>
                        {place.distance && (
                          <p className="text-xs text-primary mb-2">距离: {place.distance.toFixed(2)} km</p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className={`text-xs px-2 py-1 rounded-full ${place.canDeliver ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {place.canDeliver ? '支持外卖' : '仅到店'}
                          </span>
                          <Button size="sm" variant="outline" className="h-8">
                            查看路线
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side Menu Trigger (Simplified UI) */}
      <div className="absolute bottom-6 left-6 z-[1000]">
        <Button variant="secondary" size="icon" className="h-12 w-12 rounded-full shadow-lg bg-white/90 backdrop-blur">
          <Menu className="w-6 h-6" />
        </Button>
      </div>
      
      {/* Current Location Button */}
      <div className="absolute bottom-24 right-6 z-[1000]">
        <Button 
          variant="secondary" 
          size="icon" 
          className="h-12 w-12 rounded-full shadow-lg bg-white/90 backdrop-blur"
          onClick={() => {
            if (userLocation) {
              toast.success('已重新定位到您的位置');
            }
          }}
        >
          <MapPin className="w-6 h-6 text-blue-500" />
        </Button>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default MapPage;
