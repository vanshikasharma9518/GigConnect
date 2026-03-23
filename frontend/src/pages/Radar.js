import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import RadarMap from '../components/RadarMap';
import { FaSearch, FaMapMarkerAlt, FaFilter } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Radar = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]); // Default to NYC

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        // Fetch all available jobs 
        const jobsResponse = await axios.get('http://localhost:5000/api/jobs');
        setJobs(jobsResponse.data);
        
        // For demonstration purposes, let's construct some applicant data
        // In a real app, this would come from a backend endpoint
        const demoApplicants = jobsResponse.data
          .filter(job => job.applicants && job.applicants.length > 0)
          .flatMap(job => 
            job.applicants.map(applicant => ({
              _id: applicant.user._id,
              name: applicant.user.name,
              averageRating: applicant.user.averageRating,
              // Mock location data (in a real app, you'd get this from the user)
              location: {
                lat: job.location.lat + (Math.random() - 0.5) * 0.1,
                lng: job.location.lng + (Math.random() - 0.5) * 0.1,
                city: job.location.city,
                state: job.location.state,
                country: job.location.country
              }
            }))
          );
        
        setApplicants(demoApplicants);
        
        // If user is logged in, try to center map on their activity
        if (user) {
          const userJobs = jobsResponse.data.filter(
            job => job.posterId._id === user._id
          );
          
          if (userJobs.length > 0) {
            setMapCenter([
              userJobs[0].location.lat,
              userJobs[0].location.lng
            ]);
          }
        }
        
        setLoading(false);
        toast.success('Map data loaded successfully');
      } catch (error) {
        console.error('Error fetching map data:', error);
        setLoading(false);
        toast.error('Failed to load map data. Please try again later.');
      }
    };
    
    fetchMapData();
  }, [user]);

  const handleMapClick = (latlng) => {
    console.log('Map clicked at:', latlng);
    // In a real app, you could use this for job posting location selection
  };

  // Function to use current location
  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter([position.coords.latitude, position.coords.longitude]);
          toast.info('Map centered to your current location');
        },
        (error) => {
          toast.error('Unable to access your location. Please check your browser settings.');
          console.error('Geolocation error:', error);
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Job Radar</h1>
      
      {/* Map controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="form-input w-full pl-10"
              placeholder="Search for jobs by title or location"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <button className="btn btn-outline flex items-center">
            <FaFilter className="mr-2" />
            Filters
          </button>
          <button 
            className="btn btn-primary flex items-center"
            onClick={useCurrentLocation}
          >
            <FaMapMarkerAlt className="mr-2" />
            My Location
          </button>
        </div>
      </div>
      
      {/* Map view */}
      <div className="mb-6">
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm h-[500px] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading map data...</p>
            </div>
          </div>
        ) : (
          <RadarMap
            jobs={jobs}
            applicants={applicants}
            center={mapCenter}
            onMapClick={handleMapClick}
          />
        )}
      </div>
      
      {/* Map legend */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-3">Map Legend</h2>
        <div className="flex gap-6">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
            <span>Job Posting</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
            <span>Job Applicant</span>
          </div>
        </div>
      </div>
      
      {/* Instructions */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-primary font-semibold mb-2">How to use the Radar</h3>
        <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
          <li>Yellow dots represent job postings</li>
          <li>Green dots represent job applicants</li>
          <li>Click on any dot to see details</li>
          <li>Use the search and filters to narrow down results</li>
          <li>Click "My Location" to center the map on your current location</li>
        </ul>
      </div>
    </div>
  );
};

export default Radar; 