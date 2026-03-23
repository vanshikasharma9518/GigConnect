import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const jobIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const applicantIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const RecenterAutomatically = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);
  
  return null;
};

const ChangeMapCenter = ({ center }) => {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
};

const RadarMap = ({ jobs, applicants, center, onMapClick }) => {
  const [mapCenter, setMapCenter] = useState(center || [51.505, -0.09]);
  const [zoom, setZoom] = useState(13);
  
  useEffect(() => {
    if (center) {
      setMapCenter(center);
    }
  }, [center]);
  
  const handleJobClick = (job) => {
    toast.info(`Viewing job: ${job.title}`);
  };
  
  const handleApplicantClick = (applicant) => {
    toast.info(`Viewing applicant: ${applicant.name}`);
  };

  const handleMapClick = (e) => {
    if (onMapClick) {
      onMapClick(e.latlng);
    }
  };
  
  return (
    <div className="rounded-lg overflow-hidden border border-gray-300">
      <MapContainer 
        center={mapCenter} 
        zoom={zoom} 
        style={{ height: '400px', width: '100%' }}
        whenCreated={(map) => {
          map.on('click', handleMapClick);
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <RecenterAutomatically position={mapCenter} />
        
        {/* Job Markers */}
        {jobs && jobs.map((job) => (
          <Marker 
            key={job._id} 
            position={[job.location.lat, job.location.lng]}
            icon={jobIcon}
            eventHandlers={{
              click: () => handleJobClick(job)
            }}
          >
            <Popup>
              <div className="popup-content">
                <h3 className="font-semibold text-primary">{job.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{job.location.city}, {job.location.state}</p>
                <p className="text-xs text-gray-500 mt-1">Posted by: {job.posterId?.name}</p>
                <div className="mt-2">
                  <Link 
                    to={`/jobs/${job._id}`} 
                    className="text-sm text-primary hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Applicant Markers */}
        {applicants && applicants.map((applicant) => (
          <Marker 
            key={applicant._id} 
            position={[applicant.location.lat, applicant.location.lng]}
            icon={applicantIcon}
            eventHandlers={{
              click: () => handleApplicantClick(applicant)
            }}
          >
            <Popup>
              <div className="popup-content">
                <h3 className="font-semibold">{applicant.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{applicant.location.city}, {applicant.location.state}</p>
                <div className="flex items-center mt-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(applicant.averageRating || 0)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                  <span className="ml-1 text-xs text-gray-500">
                    ({applicant.averageRating || 0})
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default RadarMap; 