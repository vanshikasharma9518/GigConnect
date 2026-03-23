import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaLayerGroup, FaExclamationCircle } from 'react-icons/fa';
import LocationSelector from '../components/LocationSelector';
import { toast } from 'react-toastify';

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    age: '',
    skills: '',
    location: {
      country: '',
      state: '',
      city: '',
    },
    profilePic: '',
    userType: 'freelancer'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const { 
    name, 
    email, 
    password, 
    confirmPassword, 
    phone, 
    age, 
    skills, 
    location,
    profilePic,
    userType
  } = formData;
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleLocationChange = (locationData) => {
    setFormData({
      ...formData,
      location: {
        country: locationData.country,
        state: locationData.state,
        city: locationData.city,
      },
    });
  };
  
  const validateFirstStep = () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields');
      toast.error('Please fill in all required fields');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return false;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      toast.error('Password must be at least 6 characters');
      return false;
    }
    
    return true;
  };
  
  const validateSecondStep = () => {
    if (!phone || !age || !skills) {
      setError('Please fill in all required fields');
      toast.error('Please fill in all required fields');
      return false;
    }
    
    if (isNaN(age) || Number(age) < 18) {
      setError('Age must be a number and at least 18');
      toast.error('Age must be a number and at least 18');
      return false;
    }
    
    return true;
  };
  
  const validateThirdStep = () => {
    if (!location.country || !location.state || !location.city) {
      setError('Please select your complete location');
      toast.error('Please select your complete location');
      return false;
    }
    
    return true;
  };
  
  const nextStep = () => {
    if (step === 1 && validateFirstStep()) {
      setError('');
      setStep(2);
    } else if (step === 2 && validateSecondStep()) {
      setError('');
      setStep(3);
    }
  };
  
  const prevStep = () => {
    setError('');
    setStep(step - 1);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateThirdStep()) {
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    const skillsArray = skills.split(',').map(skill => skill.trim());
    
    const userData = {
      name,
      email,
      password,
      phone,
      age: Number(age),
      skills: skillsArray,
      location,
      profilePic,
      userType
    };
    
    try {
      await register(userData);
      toast.success('Registration successful! Welcome to GigConnect.');
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex justify-center items-center py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-primary text-white py-6 px-8">
            <h2 className="text-2xl font-bold">Create an Account</h2>
            <p className="text-blue-100">Join GigConnect today</p>
            
            {/* Step indicator */}
            <div className="flex justify-between mt-4">
              <div className={`h-1 rounded-full flex-grow mx-1 ${step >= 1 ? 'bg-white' : 'bg-blue-300'}`}></div>
              <div className={`h-1 rounded-full flex-grow mx-1 ${step >= 2 ? 'bg-white' : 'bg-blue-300'}`}></div>
              <div className={`h-1 rounded-full flex-grow mx-1 ${step >= 3 ? 'bg-white' : 'bg-blue-300'}`}></div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="py-6 px-8">
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4 flex items-center">
                <FaExclamationCircle className="mr-2" />
                {error}
              </div>
            )}
            
            {step === 1 && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      className="form-input pl-10"
                      id="name"
                      type="text"
                      name="name"
                      value={name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      className="form-input pl-10"
                      id="email"
                      type="email"
                      name="email"
                      value={email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      className="form-input pl-10"
                      id="password"
                      type="password"
                      name="password"
                      value={password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      className="form-input pl-10"
                      id="confirmPassword"
                      type="password"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>
              </>
            )}
            
            {step === 2 && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FaPhone className="text-gray-400" />
                    </div>
                    <input
                      className="form-input pl-10"
                      id="phone"
                      type="tel"
                      name="phone"
                      value={phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="age">
                    Age
                  </label>
                  <input
                    className="form-input"
                    id="age"
                    type="number"
                    name="age"
                    value={age}
                    onChange={handleChange}
                    placeholder="Enter your age"
                    min="18"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="skills">
                    Skills (comma separated)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FaLayerGroup className="text-gray-400" />
                    </div>
                    <input
                      className="form-input pl-10"
                      id="skills"
                      type="text"
                      name="skills"
                      value={skills}
                      onChange={handleChange}
                      placeholder="React, Node.js, UI/UX Design"
                      required
                    />
                  </div>
                </div>
              </>
            )}
            
            {step === 3 && (
              <>
                <div className="mb-6">
                  <LocationSelector onChange={handleLocationChange} initialLocation={location} />
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="profilePic">
                    Profile Picture URL (optional)
                  </label>
                  <input
                    className="form-input"
                    id="profilePic"
                    type="text"
                    name="profilePic"
                    value={profilePic}
                    onChange={handleChange}
                    placeholder="https://example.com/profile.jpg"
                  />
                </div>
              </>
            )}
            
            <div className="flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn btn-outline"
                >
                  Back
                </button>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn btn-primary ml-auto"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary ml-auto"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin h-5 w-5 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                      Registering...
                    </span>
                  ) : (
                    'Register'
                  )}
                </button>
              )}
            </div>
            
            <div className="text-center mt-6">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register; 