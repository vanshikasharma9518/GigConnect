import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  FaBriefcase, 
  FaBuilding, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaDollarSign,
  FaUserCheck,
  FaArrowLeft,
  FaBookmark,
  FaRegBookmark
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasApplied, setHasApplied] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  useEffect(() => {
    if (location.state?.message) {
      toast.info(location.state.message);
      
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);
  
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/jobs/${id}`);
        setJob(response.data);
        
        if (user && response.data.applicants) {
          const userApplied = response.data.applicants.some(
            applicant => applicant.user._id === user._id
          );
          setHasApplied(userApplied);
        }
        
        if (user && response.data.posterId) {
          setIsOwner(response.data.posterId._id === user._id);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching job details:', error);
        setError('Failed to load job details. Please try again later.');
        setLoading(false);
        toast.error('Failed to load job details');
      }
    };
    
    fetchJobDetails();
  }, [id, user]);
  
  const handleApply = async () => {
    if (!user) {
      toast.warning('Please log in to apply for this job');
      navigate('/login', { state: { from: `/jobs/${id}` } });
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `http://localhost:5000/api/jobs/${id}/apply`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setHasApplied(true);
      toast.success('Application submitted successfully!');
    } catch (error) {
      console.error('Error applying for job:', error);
      toast.error(error.response?.data?.message || 'Failed to apply for this job. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveJob = async () => {
    if (!user) {
      toast.warning('Please log in to save this job');
      navigate('/login', { state: { from: `/jobs/${id}` } });
      return;
    }

    try {
      setLoading(true);
      if (isSaved) {
        await axios.delete(`http://localhost:5000/api/users/saved-jobs/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setIsSaved(false);
        toast.info('Job removed from saved jobs');
      } else {
        await axios.post(
          `http://localhost:5000/api/users/saved-jobs/${id}`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setIsSaved(true);
        toast.success('Job saved successfully!');
      }
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error(error.response?.data?.message || 'Failed to save job. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 p-4 rounded-lg text-red-700">
        <p>{error}</p>
        <Link to="/jobs" className="text-primary hover:underline mt-2 inline-block">
          Back to Jobs
        </Link>
      </div>
    );
  }
  
  if (!job) {
    return (
      <div className="bg-yellow-100 p-4 rounded-lg text-yellow-700">
        <p>Job not found.</p>
        <Link to="/jobs" className="text-primary hover:underline mt-2 inline-block">
          Back to Jobs
        </Link>
      </div>
    );
  }
  
  // Format the date if it exists
  const formattedDate = job.deadline 
    ? new Date(job.deadline).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Not specified';
  
  return (
    <div>
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-primary hover:underline mb-4"
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="bg-primary text-white p-6">
          <h1 className="text-2xl font-bold">{job.title}</h1>
          <div className="flex flex-wrap items-center text-blue-100 mt-2">
            <div className="flex items-center mr-4 mb-2">
              <FaBuilding className="mr-2" />
              {job.company}
            </div>
            <div className="flex items-center mr-4 mb-2">
              <FaMapMarkerAlt className="mr-2" />
              {job.location.city}, {job.location.state}, {job.location.country}
            </div>
            <div className="flex items-center mb-2">
              <FaBriefcase className="mr-2" />
              {job.jobType}
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center">
              <FaDollarSign className="text-primary mr-2 text-xl" />
              <div>
                <h3 className="text-sm text-gray-500">Salary/Rate</h3>
                <p className="font-semibold">{job.salary}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <FaCalendarAlt className="text-primary mr-2 text-xl" />
              <div>
                <h3 className="text-sm text-gray-500">Application Deadline</h3>
                <p className="font-semibold">{formattedDate}</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Job Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
          </div>
          
          {job.requirements && job.requirements.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Requirements</h2>
              <ul className="list-disc pl-5 text-gray-700">
                {job.requirements.map((req, index) => (
                  <li key={index} className="mb-1">{req}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Posted By</h2>
            <div className="flex items-center">
              <img 
                src={job.posterId.profilePic || 'https://via.placeholder.com/50?text=User'} 
                alt={job.posterId.name} 
                className="w-12 h-12 rounded-full object-cover mr-4"
              />
              <div>
                <h3 className="font-semibold">{job.posterId.name}</h3>
                <p className="text-gray-600 text-sm">
                  {new Date(job.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
          
          {user && (
            <div className="flex justify-end">
              {isOwner ? (
                <button 
                  className="btn btn-outline"
                  onClick={() => navigate(`/jobs/${job._id}/applicants`)}
                >
                  View Applicants ({job.applicants?.length || 0})
                </button>
              ) : hasApplied ? (
                <button className="btn btn-success" disabled>
                  <FaUserCheck className="mr-2" /> Applied
                </button>
              ) : (
                <button
                  onClick={handleApply}
                  className="btn btn-primary"
                >
                  Apply for this Job
                </button>
              )}
            </div>
          )}
          
          <div className="flex justify-between items-center mt-6">
            <button 
              onClick={handleSaveJob}
              className="text-primary hover:text-primary-dark transition-colors duration-200"
              aria-label={isSaved ? "Unsave job" : "Save job"}
            >
              {isSaved ? <FaBookmark size={24} /> : <FaRegBookmark size={24} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails; 