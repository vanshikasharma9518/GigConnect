import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  FaBriefcase, 
  FaUserCheck, 
  FaCoins, 
  FaStar, 
  FaExchangeAlt,
  FaGraduationCap
} from 'react-icons/fa';
import JobCard from '../components/JobCard';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user, convertRatingsToCoins } = useAuth();
  const [loading, setLoading] = useState(true);
  const [myJobs, setMyJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [convertingRatings, setConvertingRatings] = useState(false);
  const [showConversionModal, setShowConversionModal] = useState(false);
  
  useEffect(() => {
    const fetchUserJobs = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const postedJobsResponse = await axios.get(
          'http://localhost:5000/api/jobs/user/jobs',
          config
        );
        
       
        const appliedJobsResponse = await axios.get(
          'http://localhost:5000/api/jobs/user/applied',
          config
        );
        
        setMyJobs(postedJobsResponse.data);
        setAppliedJobs(appliedJobsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setLoading(false);
      }
    };
    
    fetchUserJobs();
  }, [user]);
  
  const handleOpenConversionModal = () => {
    if (!user.averageRating || user.averageRating <= 0) {
      toast.error('You need an average rating above 0 to convert');
      return;
    }
    setShowConversionModal(true);
  };
  
  const handleConvertRatings = async () => {
    if (convertingRatings) return;
    setConvertingRatings(true);
    try {
      await convertRatingsToCoins();
      setShowConversionModal(false);
      toast.success(`Successfully converted average rating to coins!`);
    } catch (error) {
      console.error('Error converting ratings:', error);
    } finally {
      setConvertingRatings(false);
    }
  };
  
  const calculateEstimatedCoins = () => {
    if (!user.averageRating || user.averageRating <= 0) {
      return 0;
    }
    return Math.round(user.averageRating * 100);
  };
  
  // Conversion Modal
  const ConversionModal = () => {
    if (!showConversionModal) return null;
    const estimatedCoins = calculateEstimatedCoins();
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Convert Average Rating to Coins</h2>
          <div className="mb-6">
            <div className="flex justify-between mb-1">
              <label className="font-medium">Average Rating</label>
              <span>{user.averageRating?.toFixed(2)}</span>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Estimated Coins:</span>
                <span className="font-semibold">{estimatedCoins} coins</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current Balance:</span>
                <span className="font-semibold">{user.coins} coins</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-blue-100 mt-2">
                <span className="text-gray-600">New Balance:</span>
                <span className="font-semibold">{user.coins + estimatedCoins} coins</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowConversionModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleConvertRatings}
              disabled={convertingRatings}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700"
            >
              {convertingRatings ? 'Converting...' : 'Convert'}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* User Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <FaStar className="text-primary text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Rating</h3>
              <p className="text-2xl font-semibold">{user.averageRating ? user.averageRating.toFixed(1) : '0.0'}</p>
              <p className="text-xs text-gray-500">({user.ratings?.length || 0} ratings)</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full">
              <FaCoins className="text-secondary text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Coins</h3>
              <p className="text-2xl font-semibold">{user.coins}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <FaBriefcase className="text-green-600 text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">My Jobs</h3>
              <p className="text-2xl font-semibold">{myJobs.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full">
              <FaUserCheck className="text-purple-600 text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Applied Jobs</h3>
              <p className="text-2xl font-semibold">{appliedJobs.length}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Actions Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link 
              to="/post-job"
              className="flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-100 p-4 rounded-md transition-colors"
            >
              <FaBriefcase className="text-primary text-2xl mb-2" />
              <span className="text-center">Post a Job</span>
            </Link>
            <Link 
              to="/radar"
              className="flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-100 p-4 rounded-md transition-colors"
            >
              <FaUserCheck className="text-primary text-2xl mb-2" />
              <span className="text-center">Find Jobs</span>
            </Link>
            <button 
              onClick={handleOpenConversionModal}
              className="flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-100 p-4 rounded-md transition-colors"
            >
              <FaExchangeAlt className="text-primary text-2xl mb-2" />
              <span className="text-center">Convert Ratings</span>
            </button>
            <Link 
              to="/courses"
              className="flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-100 p-4 rounded-md transition-colors"
            >
              <FaGraduationCap className="text-primary text-2xl mb-2" />
              <span className="text-center">Browse Courses</span>
            </Link>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Profile Summary</h2>
          <div className="mb-4">
            <div className="flex items-center mb-4">
              <img 
                src={user.profilePic || 'https://via.placeholder.com/100?text=User'} 
                alt={user.name} 
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
              <div>
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="text-sm text-gray-500 mb-1">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-blue-100 text-primary text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm text-gray-500 mb-1">Location</h4>
              <p className="text-gray-700">
                {user.location.city}, {user.location.state}, {user.location.country}
              </p>
            </div>
          </div>
          <Link 
            to="/profile" 
            className="btn btn-outline w-full"
          >
            View Full Profile
          </Link>
        </div>
      </div>
      
      {/* Recent Jobs Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">My Recent Jobs</h2>
          <Link to="/post-job" className="text-primary hover:underline">
            Post New Job
          </Link>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your jobs...</p>
          </div>
        ) : myJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myJobs.slice(0, 3).map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white rounded-lg shadow-sm">
            <p className="text-gray-600">You haven't posted any jobs yet.</p>
            <Link to="/post-job" className="btn btn-primary mt-4">
              Post Your First Job
            </Link>
          </div>
        )}
      </div>
      
      {/* Applied Jobs Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recently Applied Jobs</h2>
          <Link to="/radar" className="text-primary hover:underline">
            Find More Jobs
          </Link>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading applied jobs...</p>
          </div>
        ) : appliedJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appliedJobs.slice(0, 3).map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white rounded-lg shadow-sm">
            <p className="text-gray-600">You haven't applied to any jobs yet.</p>
            <Link to="/radar" className="btn btn-primary mt-4">
              Find Jobs to Apply
            </Link>
          </div>
        )}
      </div>
      
      {/* Conversion Modal */}
      <ConversionModal />
    </div>
  );
};

export default Dashboard; 