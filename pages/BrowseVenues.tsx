
import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MapPin, Star, Filter, Search, X } from 'lucide-react';
import { CITIES, SPORTS, DEFAULT_VENUE_IMAGE } from '../constants';

export const BrowseVenues: React.FC = () => {
  const { venues } = useApp();
  const [searchParams] = useSearchParams();
  
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedSport, setSelectedSport] = useState<string>(searchParams.get('sport') || '');
  const [priceRange, setPriceRange] = useState<number>(3000);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Sync with URL params on mount or change
  useEffect(() => {
    const sportParam = searchParams.get('sport');
    setSelectedSport(sportParam || '');
  }, [searchParams]);

  // Extract all unique amenities
  const allAmenities = useMemo(() => {
    return Array.from(new Set(venues.flatMap(v => v.amenities))).sort();
  }, [venues]);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const clearFilters = () => {
    setSelectedCity('');
    setSelectedSport('');
    setPriceRange(3000);
    setSearchQuery('');
    setSelectedAmenities([]);
  };

  // Filter Logic
  const filteredVenues = useMemo(() => {
    return venues.filter(venue => {
      const cityMatch = selectedCity ? venue.city === selectedCity : true;
      const sportMatch = selectedSport 
        ? venue.facilities.some(f => f.sport === selectedSport) 
        : true;
      const priceMatch = venue.facilities.some(f => f.pricePerHour <= priceRange);
      const searchMatch = venue.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Amenity match: venue must have ALL selected amenities (AND logic)
      const amenitiesMatch = selectedAmenities.length === 0 
        ? true 
        : selectedAmenities.every(a => venue.amenities.includes(a));

      return cityMatch && sportMatch && priceMatch && searchMatch && amenitiesMatch;
    });
  }, [venues, selectedCity, selectedSport, priceRange, searchQuery, selectedAmenities]);

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Search and Main Controls Header */}
      <div className="bg-white shadow-sm sticky top-16 z-40 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-4">
            
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search venues by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>

            {/* Quick Filters Row */}
            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${showFilters ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
              >
                <Filter size={16} />
                Filters
              </button>

              <select 
                value={selectedCity} 
                onChange={(e) => setSelectedCity(e.target.value)}
                className="block pl-3 pr-8 py-2 text-sm border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-lg border bg-white text-gray-700"
              >
                <option value="">All Cities</option>
                {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
              </select>

              <select 
                value={selectedSport} 
                onChange={(e) => setSelectedSport(e.target.value)}
                className="block pl-3 pr-8 py-2 text-sm border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-lg border bg-white text-gray-700"
              >
                <option value="">All Sports</option>
                {SPORTS.map(sport => <option key={sport.name} value={sport.name}>{sport.name}</option>)}
              </select>

              <div className="flex items-center gap-2 ml-auto">
                 {selectedAmenities.length > 0 && (
                   <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full hidden sm:inline-block">
                     {selectedAmenities.length} amenities
                   </span>
                 )}
                 {(selectedCity || selectedSport || searchQuery || selectedAmenities.length > 0 || priceRange < 3000) && (
                    <button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-700 font-medium">
                      Clear All
                    </button>
                 )}
              </div>
            </div>

            {/* Expanded Filters Section */}
            {showFilters && (
              <div className="pt-4 pb-2 border-t border-gray-100 animate-fade-in">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Price Slider */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Max Price: ₹{priceRange}/hr</h4>
                    <input 
                      type="range" 
                      min="100" 
                      max="3000" 
                      step="100" 
                      value={priceRange} 
                      onChange={(e) => setPriceRange(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>₹100</span>
                      <span>₹3000+</span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {allAmenities.map(amenity => (
                        <button
                          key={amenity}
                          onClick={() => toggleAmenity(amenity)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                            selectedAmenities.includes(amenity)
                              ? 'bg-primary/10 text-primary border-primary'
                              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {amenity}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          {filteredVenues.length} Venues Found
          {searchQuery && <span className="text-gray-400 text-base font-normal">matching "{searchQuery}"</span>}
        </h2>
        
        {filteredVenues.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-3">
              <Search size={48} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No venues match your criteria</h3>
            <p className="text-gray-500 mt-1">Try adjusting your filters or search terms.</p>
            <button 
              onClick={clearFilters}
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-emerald-700"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVenues.map(venue => (
              <div key={venue.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-100 flex flex-col h-full group">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={venue.images[0] || DEFAULT_VENUE_IMAGE} 
                    alt={venue.name} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_VENUE_IMAGE;
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md shadow-sm flex items-center gap-1 text-xs font-bold text-gray-800">
                    <Star size={12} className="text-yellow-400 fill-current" />
                    {venue.rating}
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{venue.name}</h3>
                    <div className="flex items-start text-gray-500 text-sm mb-3">
                      <MapPin size={16} className="mr-1 mt-0.5 flex-shrink-0" />
                      {venue.address}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {venue.facilities.slice(0, 3).map(f => (
                        <span key={f.id} className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs font-medium text-gray-600">
                          {f.sport}
                        </span>
                      ))}
                      {venue.facilities.length > 3 && (
                         <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs font-medium text-gray-600">+{venue.facilities.length - 3} more</span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1 mb-2">
                       {venue.amenities.slice(0, 3).map(am => (
                         <span key={am} className="text-[10px] text-gray-500 border border-gray-100 px-1.5 py-0.5 rounded">{am}</span>
                       ))}
                       {venue.amenities.length > 3 && <span className="text-[10px] text-gray-400 px-1.5 py-0.5">...</span>}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-500 block">Starting from</span>
                      <span className="text-lg font-bold text-primary">
                        ₹{Math.min(...venue.facilities.map(f => f.pricePerHour))}<span className="text-sm text-gray-500 font-normal">/hr</span>
                      </span>
                    </div>
                    <Link 
                      to={`/venue/${venue.id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-secondary hover:bg-blue-900 focus:outline-none"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
