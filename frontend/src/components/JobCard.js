import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaUser, FaCalendarAlt, FaBriefcase, FaClock, FaDollarSign, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const JobCard = ({ job }) => {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  
  const handleSaveJob = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please log in to save jobs');
      return;
    }
    
    setIsSaved(!isSaved);
    if (!isSaved) {
      toast.success('Job saved to your favorites');
    } else {
      toast.info('Job removed from your favorites');
    }
  };
  
  const handleApplyClick = (e) => {
    if (!user) {
      e.preventDefault();
      toast.error('Please log in to apply for jobs');
    } else {
      toast.info('Redirecting to application form...');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return 'Not specified';
      
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    } catch (error) {
      return 'Not specified';
    }
  };

  // Format salary
  const formatSalary = (salary) => {
    if (!salary) return 'Salary not specified';
    
    // Try to format as currency
    try {
      const salaryNum = parseFloat(salary);
      if (!isNaN(salaryNum)) {
        return `$${salaryNum.toFixed(2)}/hr`;
      }
    } catch (e) {}
    
    // If not a number, return as is
    return `${salary}/hr`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
      <Link to={`/jobs/${job._id}`} className="block p-5">
        <div className="flex justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-1">{job.title}</h3>
            <p className="text-gray-600 mb-3">{job.company || job.posterId?.name}</p>
          </div>
          <button 
            onClick={handleSaveJob}
            className="text-primary hover:text-primary-dark transition-colors duration-200"
            aria-label={isSaved ? "Unsave job" : "Save job"}
          >
            {isSaved ? <FaBookmark size={20} /> : <FaRegBookmark size={20} />}
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center text-gray-600">
            <FaMapMarkerAlt className="mr-2 text-gray-400" />
            <span>{job.location?.city && job.location?.state ? 
              `${job.location.city}, ${job.location.state}` : 
              'Location not specified'}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FaBriefcase className="mr-2 text-gray-400" />
            <span>{job.jobType || 'Full-time'}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FaDollarSign className="mr-2 text-gray-400" />
            <span>{formatSalary(job.salary)}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FaClock className="mr-2 text-gray-400" />
            <span>Deadline: {formatDate(job.deadline)}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {job.skills && job.skills.map((skill, index) => (
            <span 
              key={index} 
              className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded"
            >
              {skill}
            </span>
          ))}
        </div>
        
        <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Posted {formatDate(job.createdAt)}
          </span>
          <Link 
            to={`/jobs/${job._id}/apply`} 
            className="btn btn-primary"
            onClick={handleApplyClick}
          >
            Apply Now
          </Link>
        </div>
      </Link>
    </div>
  );
};

export default JobCard; 