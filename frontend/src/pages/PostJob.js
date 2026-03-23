import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaDollarSign, FaCalendarAlt, FaBuilding, FaList } from 'react-icons/fa';
import LocationSelector from '../components/LocationSelector';
import { toast } from 'react-toastify';

const PostJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company: '',
    salary: '',
    jobType: 'Full-time',
    deadline: '',
    requirements: '',
    location: {
      country: '',
      state: '',
      city: '',
      lat: 0,
      lng: 0
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    // Set default deadline to 30 days from now
    const defaultDeadline = new Date();
    defaultDeadline.setDate(defaultDeadline.getDate() + 30);
    
    // Format to YYYY-MM-DD for input type="date"
    const formattedDate = defaultDeadline.toISOString().split('T')[0];
    
    setFormData(prev => ({
      ...prev,
      deadline: formattedDate
    }));
  }, []);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleLocationChange = (locationData) => {
    setFormData({
      ...formData,
      location: {
        ...locationData,
        lat: locationData.lat || 0,
        lng: locationData.lng || 0
      }
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to post a job');
      navigate('/login', { state: { from: '/post-job' } });
      return;
    }
    
    // Validate form
    if (!formData.title || !formData.description || !formData.company || !formData.salary) {
      setError('Please fill in all required fields');
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (!formData.location.country || !formData.location.state || !formData.location.city) {
      setError('Please select a complete location');
      toast.error('Please select a complete location');
      return;
    }
    
    // Validate deadline
    if (!formData.deadline) {
      setError('Please set a deadline for the job');
      toast.error('Please set a deadline for the job');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const reqData = {
        ...formData,
        requirements: formData.requirements ? formData.requirements.split(',').map(req => req.trim()) : []
      };
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      };
      
      const response = await axios.post('http://localhost:5000/api/jobs', reqData, config);
      
      toast.success('Job posted successfully!');
      navigate(`/jobs/${response.data._id}`);
    } catch (err) {
      console.error('Error posting job:', err);
      const message = err.response?.data?.message || 'Failed to post job. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Post a New Job</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-primary text-white py-4 px-6">
          <h2 className="text-xl font-semibold">Job Details</h2>
          <p className="text-blue-100 text-sm">Fill in the details about the job you're offering</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                Job Title*
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g. Frontend Developer"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="company">
                Company Name*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaBuilding className="text-gray-400" />
                </div>
                <input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleChange}
                  className="form-input pl-10"
                  placeholder="e.g. Acme Inc."
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Job Description*
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              rows="5"
              placeholder="Provide a detailed description of the job..."
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="salary">
                Hourly Rate*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaDollarSign className="text-gray-400" />
                </div>
                <input
                  id="salary"
                  name="salary"
                  type="number"
                  min="1"
                  step="0.01"
                  value={formData.salary}
                  onChange={handleChange}
                  className="form-input pl-10"
                  placeholder="e.g. 25.00"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Enter hourly rate in dollars (numbers only)</p>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="jobType">
                Job Type
              </label>
              <select
                id="jobType"
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deadline">
                Application Deadline*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
                <input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="form-input pl-10"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Set a future date when applications close</p>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="requirements">
                Requirements (comma separated)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaList className="text-gray-400" />
                </div>
                <input
                  id="requirements"
                  name="requirements"
                  type="text"
                  value={formData.requirements}
                  onChange={handleChange}
                  className="form-input pl-10"
                  placeholder="e.g. React, 3+ years experience, Bachelor's degree"
                />
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Job Location*
            </label>
            <LocationSelector onChange={handleLocationChange} initialLocation={formData.location} />
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn btn-outline mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin h-5 w-5 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                  Posting...
                </span>
              ) : (
                'Post Job'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob; 