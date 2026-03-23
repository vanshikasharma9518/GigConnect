import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import Select from 'react-select';
import { Country, State, City } from 'country-state-city';

const customStyles = {
  control: (provided) => ({
    ...provided,
    borderColor: '#e2e8f0',
    boxShadow: 'none',
    '&:hover': {
      borderColor: '#cbd5e1',
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : null,
    color: state.isSelected ? 'white' : '#374151',
    cursor: 'pointer',
  }),
};

const LocationSelector = ({ onChange, initialLocation }) => {
  const [location, setLocation] = useState({
    country: initialLocation?.country || '',
    state: initialLocation?.state || '',
    city: initialLocation?.city || '',
    lat: initialLocation?.lat || 0,
    lng: initialLocation?.lng || 0,
  });
  
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load countries on component mount - only once
  useEffect(() => {
    const allCountries = Country.getAllCountries();
    const countryOptions = allCountries.map(country => ({
      value: country.isoCode,
      label: country.name,
      ...country
    }));
    setCountries(countryOptions);
  }, []);

  // Initialize from initialLocation if provided - only when countries or initialLocation changes
  useEffect(() => {
    if (initialLocation?.country && countries.length > 0) {
      // Try to find the country in our list
      const foundCountry = countries.find(c => 
        c.label?.toLowerCase() === initialLocation.country?.toLowerCase() || 
        c.value?.toLowerCase() === initialLocation.country?.toLowerCase()
      );
      
      if (foundCountry) {
        setSelectedCountry(foundCountry);
        
        // Load states for this country
        const countryStates = State.getStatesOfCountry(foundCountry.value);
        const stateOptions = countryStates.map(state => ({
          value: state.isoCode,
          label: state.name,
          ...state
        }));
        setStates(stateOptions);
        
        // If we have a state in initialLocation, try to find it
        if (initialLocation.state && stateOptions.length > 0) {
          const foundState = stateOptions.find(s => 
            s.label?.toLowerCase() === initialLocation.state?.toLowerCase() || 
            s.value?.toLowerCase() === initialLocation.state?.toLowerCase()
          );
          
          if (foundState) {
            setSelectedState(foundState);
            
            // Load cities for this state
            const stateCities = City.getCitiesOfState(foundCountry.value, foundState.value);
            const cityOptions = stateCities.map(city => ({
              value: city.name,
              label: city.name,
              ...city
            }));
            setCities(cityOptions);
            
            // If we have a city in initialLocation, try to find it
            if (initialLocation.city && cityOptions.length > 0) {
              const foundCity = cityOptions.find(c => 
                c.label?.toLowerCase() === initialLocation.city?.toLowerCase()
              );
              
              if (foundCity) {
                setSelectedCity(foundCity);
              }
            }
          }
        }
        
        // Set the location data
        setLocation({
          country: foundCountry.label,
          state: initialLocation.state || '',
          city: initialLocation.city || '',
          lat: initialLocation.lat || 0,
          lng: initialLocation.lng || 0,
        });
      }
    }
  }, [initialLocation, countries]);

  // Load states when country changes
  const handleCountryChange = (country) => {
    if (!country) {
      setSelectedCountry(null);
      setSelectedState(null);
      setSelectedCity(null);
      setStates([]);
      setCities([]);
      
      setLocation({
        ...location,
        country: '',
        state: '',
        city: '',
      });
      
      if (onChange) {
        onChange({
          ...location,
          country: '',
          state: '',
          city: '',
        });
      }
      
      return;
    }
    
    setSelectedCountry(country);
    setSelectedState(null);
    setSelectedCity(null);
    
    const countryStates = State.getStatesOfCountry(country.value);
    const stateOptions = countryStates.map(state => ({
      value: state.isoCode,
      label: state.name,
      ...state
    }));
    
    setStates(stateOptions);
    setCities([]);
    
    const updatedLocation = {
      ...location,
      country: country.label,
      state: '',
      city: '',
      lat: parseFloat(country.latitude) || 0,
      lng: parseFloat(country.longitude) || 0,
    };
    
    setLocation(updatedLocation);
    
    if (onChange) {
      onChange(updatedLocation);
    }
  };

  // Load cities when state changes
  const handleStateChange = (state) => {
    // Prevent the component from acting on null state values
    if (state === null) {
      setSelectedState(null);
      setSelectedCity(null);
      setCities([]);
      
      const updatedLocation = {
        ...location,
        state: '',
        city: '',
      };
      
      setLocation(updatedLocation);
      
      if (onChange) {
        onChange(updatedLocation);
      }
      
      return;
    }
    
    // Set the selected state
    setSelectedState(state);
    setSelectedCity(null);
    
    // Make sure we have a selected country before proceeding
    if (selectedCountry && selectedCountry.value) {
      // Get cities for this state
      const stateCities = City.getCitiesOfState(selectedCountry.value, state.value);
      const cityOptions = stateCities.map(city => ({
        value: city.name,
        label: city.name,
        ...city
      }));
      
      setCities(cityOptions);
      
      const updatedLocation = {
        ...location,
        state: state.label,
        city: '',
        lat: parseFloat(state.latitude) || location.lat,
        lng: parseFloat(state.longitude) || location.lng,
      };
      
      setLocation(updatedLocation);
      
      if (onChange) {
        onChange(updatedLocation);
      }
    }
  };

  // Update location when city changes
  const handleCityChange = (city) => {
    if (!city) {
      setSelectedCity(null);
      
      const updatedLocation = {
        ...location,
        city: '',
      };
      
      setLocation(updatedLocation);
      
      if (onChange) {
        onChange(updatedLocation);
      }
      
      return;
    }
    
    setSelectedCity(city);
    
    const updatedLocation = {
      ...location,
      city: city.label,
      lat: parseFloat(city.latitude) || location.lat,
      lng: parseFloat(city.longitude) || location.lng,
    };
    
    setLocation(updatedLocation);
    
    if (onChange) {
      onChange(updatedLocation);
    }
  };

  // Get user's current location
  const getCurrentLocation = () => {
    setLoading(true);
    setError('');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          try {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            const updatedLocation = {
              ...location,
              lat,
              lng
            };
            
            setLocation(updatedLocation);
            
            // Notify parent component
            if (onChange) {
              onChange(updatedLocation);
            }
            
            // Show success message
            setError('📍 Location coordinates detected! Please select your country, state, and city.');
            setLoading(false);
          } catch (err) {
            console.error('Error with location:', err);
            setError('Could not determine your location. Please enter it manually.');
            setLoading(false);
          }
        },
        (err) => {
          console.error('Error getting location:', err);
          setError('Could not access your location. Please make sure location services are enabled.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  };

  return (
    <div className="location-selector bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center mb-4">
        <div className="bg-blue-50 p-2 rounded-full">
          <FaMapMarkerAlt className="text-primary text-lg" />
        </div>
        <h3 className="font-semibold text-gray-700 ml-3">Select Location</h3>
      </div>
      
      <div className="grid grid-cols-1 gap-4 mb-4">
        {/* Country Dropdown */}
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
            Country
          </label>
          <Select
            inputId="country"
            options={countries}
            value={selectedCountry}
            onChange={handleCountryChange}
            placeholder="Select country"
            isClearable
            styles={customStyles}
            className="mb-4"
          />
        </div>

        {/* State Dropdown */}
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
            State/Province
          </label>
          <Select
            inputId="state"
            options={states}
            value={selectedState}
            onChange={handleStateChange}
            placeholder={selectedCountry ? "Select state/province" : "Select a country first"}
            isDisabled={!selectedCountry}
            isClearable
            styles={customStyles}
            className="mb-4"
          />
        </div>

        {/* City Dropdown */}
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          <Select
            inputId="city"
            options={cities}
            value={selectedCity}
            onChange={handleCityChange}
            placeholder={selectedState ? "Select city" : "Select a state/province first"}
            isDisabled={!selectedState}
            isClearable
            styles={customStyles}
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={loading}
          className="text-primary text-sm hover:text-primary-dark focus:outline-none flex items-center"
        >
          {loading ? (
            <>
              <span className="animate-spin h-4 w-4 border-t-2 border-b-2 border-primary rounded-full mr-2"></span>
              Detecting location...
            </>
          ) : (
            <>
              <FaMapMarkerAlt className="h-4 w-4 mr-1" />
              Use my current location
            </>
          )}
        </button>
      </div>
      
      {error && (
        <div className="mt-2 text-sm text-blue-600">
          {error}
        </div>
      )}
      
      {(location.lat !== 0 && location.lng !== 0) && (
        <div className="mt-4 p-2 rounded border border-green-200 bg-green-50 text-green-800 text-xs">
          <span className="font-semibold">Coordinates detected:</span> 
          <span className="ml-1">{location.lat.toFixed(6)}, {location.lng.toFixed(6)}</span>
        </div>
      )}
      
      {location.country && location.state && location.city && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md text-sm text-blue-800">
          <p className="font-medium">Selected Location:</p>
          <p>
            {location.city}, {location.state}, {location.country}
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationSelector; 