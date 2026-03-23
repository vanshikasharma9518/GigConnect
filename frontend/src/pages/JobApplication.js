import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaPaperPlane, FaExclamationTriangle } from 'react-icons/fa';

const JobApplication = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [availability, setAvailability] = useState('Immediately');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (!user) {
      toast.error('Please log in to apply for jobs');
      navigate('/login', { state: { from: `/jobs/${id}/apply` } });
      return;
    }
    
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/jobs/${id}`);
        setJob(response.data);
        
        // Check if user has already applied to this job
        if (response.data.applicants) {
          const hasApplied = response.data.applicants.some(
            applicant => applicant.user === user._id || (applicant.user._id && applicant.user._id === user._id)
          );
          
          if (hasApplied) {
            toast.info('You have already applied to this job');
            navigate(`/jobs/${id}`, { state: { applied: true } });
            return;
          }
        }
        
        // Check if user is the job owner
        if (response.data.posterId === user._id || 
            (response.data.posterId._id && response.data.posterId._id === user._id)) {
          toast.error('You cannot apply to your own job posting');
          navigate(`/jobs/${id}`);
          return;
        }
        
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError('Failed to load job details. Please try again later.');
        toast.error('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobDetails();
  }, [id, user, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!coverLetter.trim()) {
      setError('Please provide a cover letter');
      toast.error('Please provide a cover letter');
      return;
    }
    
    try {
      setSubmitting(true);
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      
      await axios.post(
        `http://localhost:5000/api/jobs/${id}/apply`,
        { 
          coverLetter,
          expectedSalary,
          availability
        },
        config
      );
      
      toast.success('Application submitted successfully!');
      navigate(`/jobs/${id}`, { state: { applied: true } });
    } catch (err) {
      console.error('Error submitting application:', err);
      const message = err.response?.data?.message || 'Failed to submit application. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
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
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-primary hover:underline mb-4"
      >
        <FaArrowLeft className="mr-2" /> Back to Job
      </button>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-2">Apply for Position</h1>
        <h2 className="text-xl text-gray-700 mb-6">{job?.title} at {job?.company}</h2>
        
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
              rows="6"
              className="form-textarea w-full"
              placeholder="Introduce yourself and explain why you're a good fit for this position..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
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
              className="form-input w-full"
              placeholder="Enter your expected hourly rate"
              value={expectedSalary}
              onChange={(e) => setExpectedSalary(e.target.value)}
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="availability">
              Availability
            </label>
            <select
              id="availability"
              className="form-select w-full"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
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

export default JobApplication; 