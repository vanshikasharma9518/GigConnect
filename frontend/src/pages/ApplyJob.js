import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaArrowLeft, FaPaperPlane, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ApplyJob = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [job, setJob] = useState(null);
  const [formData, setFormData] = useState({
    coverLetter: '',
    expectedSalary: '',
    availability: 'Immediately'
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/jobs/${id}`);
        setJob(response.data);
        
       
        if (user && response.data.applicants) {
          const hasApplied = response.data.applicants.some(
            applicant => applicant.user._id === user._id
          );
          
          if (hasApplied) {
           
            toast.info('You have already applied to this job');
            navigate(`/jobs/${id}`, { state: { message: 'You have already applied to this job' } });
          }
        }
       
        if (user && response.data.posterId && response.data.posterId._id === user._id) {
        
          toast.error('You cannot apply to your own job posting');
          navigate(`/jobs/${id}`, { state: { message: 'You cannot apply to your own job posting' } });
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching job details:', error);
        setError('Failed to load job details. Please try again later.');
        toast.error('Failed to load job details');
        setLoading(false);
      }
    };
    
    fetchJobDetails();
  }, [id, user, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to apply for jobs');
      navigate('/login', { state: { from: `/jobs/${id}/apply` } });
      return;
    }
    
    setSubmitting(true);
    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      };
      
      const applicationData = {
        ...formData,
        jobId: id
      };
      
      await axios.post(
        'http://localhost:5000/api/applications',
        applicationData,
        config
      );
      
      toast.success('Application submitted successfully!');
      navigate(`/jobs/${id}`, { state: { message: 'Application submitted successfully!' } });
    } catch (error) {
      console.error('Error submitting application:', error);
      const message = error.response?.data?.message || 'Failed to submit application';
      setError(message);
      toast.error(message);
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error && !job) {
    return (
      <div className="bg-red-100 p-4 rounded-lg text-red-700">
        <div className="flex items-center mb-3">
          <FaExclamationTriangle className="text-xl mr-2" />
          <h2 className="text-lg font-semibold">Error</h2>
        </div>
        <p>{error}</p>
        <Link to="/jobs" className="text-primary hover:underline mt-4 inline-block">
          Back to Jobs
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-primary hover:underline mb-4"
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Apply for: {job?.title}</h1>
        
        {error && (
          <div className="bg-red-100 p-4 rounded-lg text-red-700 mb-6">
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="coverLetter">
              Cover Letter
            </label>
            <textarea
              id="coverLetter"
              name="coverLetter"
              rows="6"
              className="form-textarea w-full"
              placeholder="Introduce yourself and explain why you're a good fit for this position..."
              value={formData.coverLetter}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="expectedSalary">
              Expected Salary ($/hr)
            </label>
            <input
              type="number"
              id="expectedSalary"
              name="expectedSalary"
              className="form-input w-full"
              placeholder="Enter your expected hourly rate"
              value={formData.expectedSalary}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="availability">
              Availability
            </label>
            <select
              id="availability"
              name="availability"
              className="form-select w-full"
              value={formData.availability}
              onChange={handleChange}
              required
            >
              <option value="Immediately">Immediately</option>
              <option value="1 week">Within 1 week</option>
              <option value="2 weeks">Within 2 weeks</option>
              <option value="1 month">Within 1 month</option>
            </select>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary flex items-center"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <FaPaperPlane className="mr-2" />
                  Submit Application
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyJob; 