import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Navigation, Utensils, X, Loader2, Bike, MapPin, Menu } from 'lucide-react';
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

// Custom marker for user location
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const foodIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
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
}

// Component to handle map center and routing
const MapController = ({ center, routingTo }: { center: [number, number], routingTo: FoodPlace | null }) => {
  const map = useMap();
  const routingControlRef = useRef<any>(null);

  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);

  useEffect(() => {
    if (routingTo && center) {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }

      // @ts-ignore
      routingControlRef.current = L.Routing.control({
        waypoints: [
          L.latLng(center[0], center[1]),
          L.latLng(routingTo.lat, routingTo.lon)
        ],
        routeWhileDragging: false,
        addWaypoints: false,
        fitSelectedRoutes: true,
        showAlternatives: false,
        // @ts-ignore
        lineOptions: {
          styles: [{ color: '#f97316', weight: 6 }]
        },
        createMarker: () => null // Don't create extra markers
      }).addTo(map);

      return () => {
        if (routingControlRef.current) {
          map.removeControl(routingControlRef.current);
        }
      };
    }
  }, [routingTo, center, map]);

  return null;
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
    if (!searchQuery.trim() || !userLocation) return;

    setIsSearching(true);
    setSelectedPlace(null);
    setIsRouting(false);

    try {
      // Use Nominatim for searching food near user location
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&lat=${userLocation[0]}&lon=${userLocation[1]}&bounded=1&viewbox=${userLocation[1]-0.1},${userLocation[0]+0.1},${userLocation[1]+0.1},${userLocation[0]-0.1}&limit=10`
      );
      const data = await response.json();
      
      const places: FoodPlace[] = data.map((item: any) => ({
        id: item.place_id,
        name: item.display_name.split(',')[0],
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        address: item.display_name,
        // Mock delivery info: random for now, or based on some keywords
        canDeliver: Math.random() > 0.3
      }));

      setSearchResults(places);
      if (places.length === 0) {
        toast.info("未找到相关美食");
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
      <div className="absolute top-0 left-0 right-0 z-[1000] p-4 bg-gradient-to-b from-background/80 to-transparent">
        <form onSubmit={handleSearch} className="relative flex gap-2 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              className="pl-10 pr-10 h-12 rounded-full shadow-lg bg-card/95 backdrop-blur-md border-none"
              placeholder="想吃什么？输入美食名称..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
          <Button type="submit" size="icon" className="h-12 w-12 rounded-full shadow-lg" disabled={isSearching}>
            {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          </Button>
        </form>
      </div>

      {/* Map Container */}
      <div className="flex-1 z-0">
        <MapContainer
          center={userLocation}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="bottomright" />
          
          <Marker position={userLocation} icon={userIcon}>
            <Popup>您的当前位置</Popup>
          </Marker>

          {searchResults.map((place) => (
            <Marker 
              key={place.id} 
              position={[place.lat, place.lon]} 
              icon={foodIcon}
              eventHandlers={{
                click: () => setSelectedPlace(place),
              }}
            >
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold">{place.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{place.address}</p>
                  <Button size="sm" className="w-full h-8" onClick={() => startRouting(place)}>
                    规划路线
                  </Button>
                </div>
              </Popup>
            </Marker>
          ))}

          <MapController center={userLocation} routingTo={isRouting ? selectedPlace : null} />
        </MapContainer>
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
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => setIsRouting(false)}>
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="flex gap-3">
                      <div className={`flex-1 p-3 rounded-xl flex items-center gap-2 ${selectedPlace.canDeliver ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                        <Bike className="w-5 h-5" />
                        <span className="font-medium">{selectedPlace.canDeliver ? '支持外卖' : '暂不支持外卖'}</span>
                      </div>
                      <Button className="flex-1 gap-2" onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.lat},${selectedPlace.lon}`)}>
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
                        <p className="text-xs text-muted-foreground truncate mb-3">{place.address}</p>
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
              // This will trigger the MapController effect
              setUserLocation([...userLocation]);
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
