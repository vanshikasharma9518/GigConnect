import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaStar, 
  FaCoins,
  FaEdit,
  FaExchangeAlt,
  FaHistory,
  FaPlus
} from 'react-icons/fa';
import LocationSelector from '../components/LocationSelector';
import TransactionHistory from '../components/TransactionHistory';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateProfile, logout, convertRatingsToCoins, addTestRating } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    skills: [],
    profilePic: '',
    location: {
      country: '',
      state: '',
      city: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [convertingRatings, setConvertingRatings] = useState(false);
  
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        age: user.age || '',
        skills: user.skills || [],
        profilePic: user.profilePic || '',
        location: {
          country: user.location?.country || '',
          state: user.location?.state || '',
          city: user.location?.city || ''
        }
      });
    }
  }, [user]);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleLocationChange = (locationData) => {
    setFormData({
      ...formData,
      location: locationData
    });
  };
  
  const addSkill = () => {
    if (skillInput.trim() === '') return;
    
    if (!formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()]
      });
    }
    
    setSkillInput('');
  };
  
  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setError('');
    
    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleConvertRatings = async () => {
    if (convertingRatings) return;
    
    setConvertingRatings(true);
    try {
      await convertRatingsToCoins();
      toast.success('Ratings converted to coins successfully!');
    } catch (error) {
      console.error('Error converting ratings:', error);
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || 'Failed to convert ratings to coins');
      } else {
        toast.error(error.message || 'Failed to convert ratings to coins');
      }
    } finally {
      setConvertingRatings(false);
    }
  };
  
  const handleAddTestRating = async () => {
    try {
      const result = await addTestRating();
      toast.success(`Test rating added: ${result.rating.toFixed(1)}`);
    } catch (error) {
      console.error('Error adding test rating:', error);
    }
  };
  
  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please log in to view your profile.</p>
      </div>
    );
  }
  
  const renderRatingStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={`${
              i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
            } text-xl mr-1`}
          />
        ))}
        <span className="ml-2 text-gray-700">{rating.toFixed(1)}</span>
      </div>
    );
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'profile'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('profile')}
        >
          Profile Information
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'transactions'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('transactions')}
        >
          <FaHistory className="inline mr-1" /> Transaction History
        </button>
      </div>
      
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-primary text-white p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Profile Information</h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn btn-sm bg-white text-primary hover:bg-gray-100"
                    >
                      <FaEdit className="mr-1" /> Edit Profile
                    </button>
                  )}
                </div>
              </div>
              
              {isEditing ? (
                <form onSubmit={handleSubmit} className="p-6">
                  {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                      {error}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Full Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-input"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-input"
                        disabled
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="age">
                        Age
                      </label>
                      <input
                        id="age"
                        name="age"
                        type="number"
                        value={formData.age}
                        onChange={handleChange}
                        className="form-input"
                        min="18"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="profilePic">
                      Profile Picture URL
                    </label>
                    <input
                      id="profilePic"
                      name="profilePic"
                      type="text"
                      value={formData.profilePic}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="https://example.com/profile.jpg"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Skills
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        className="form-input flex-grow mr-2"
                        placeholder="Add a skill"
                      />
                      <button
                        type="button"
                        onClick={addSkill}
                        className="btn btn-primary"
                      >
                        Add
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="bg-blue-100 text-primary px-3 py-1 rounded-full flex items-center"
                        >
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="ml-2 text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Location
                    </label>
                    <LocationSelector onChange={handleLocationChange} initialLocation={formData.location} />
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
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
                          Saving...
                        </span>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-6">
                  <div className="flex items-center mb-6">
                    <img
                      src={user.profilePic || 'https://via.placeholder.com/100?text=User'}
                      alt={user.name}
                      className="w-24 h-24 rounded-full object-cover mr-6"
                    />
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-800">{user.name}</h3>
                      <p className="text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
                      <ul className="space-y-3">
                        <li className="flex items-center">
                          <FaPhone className="text-gray-400 mr-3" />
                          <span className="text-gray-700">
                            {user.phone || 'No phone number added'}
                          </span>
                        </li>
                        <li className="flex items-center">
                          <FaUser className="text-gray-400 mr-3" />
                          <span className="text-gray-700">
                            {user.age ? `${user.age} years old` : 'Age not specified'}
                          </span>
                        </li>
                        <li className="flex items-start">
                          <FaMapMarkerAlt className="text-gray-400 mr-3 mt-1" />
                          <span className="text-gray-700">
                            {user.location?.city && user.location?.state
                              ? `${user.location.city}, ${user.location.state}, ${user.location.country}`
                              : 'Location not specified'}
                          </span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Account Information</h3>
                      <ul className="space-y-3">
                        <li className="flex items-center">
                          <FaEnvelope className="text-gray-400 mr-3" />
                          <span className="text-gray-700">{user.email}</span>
                        </li>
                        <li className="flex items-center">
                          <FaStar className="text-yellow-400 mr-3" />
                          <span className="text-gray-700">
                            Average Rating: {renderRatingStars(user.averageRating)}
                          </span>
                        </li>
                        <li className="flex items-center">
                          <FaCoins className="text-secondary mr-3" />
                          <span className="text-gray-700">
                            {user.coins} coins available
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {user.skills && user.skills.length > 0 ? (
                        user.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-primary px-3 py-1 rounded-full"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500">No skills added yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Statistics Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Account Statistics</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-primary mb-1">Ratings</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {renderRatingStars(user.averageRating)}
                      <span className="text-gray-500 text-sm ml-2">
                        ({user.ratings?.length || 0} reviews)
                      </span>
                    </div>
                    {/* For testing only */}
                    <button
                      onClick={handleAddTestRating}
                      className="text-xs px-2 py-1 rounded flex items-center bg-gray-500 text-white hover:bg-gray-600"
                      title="Add a test rating (for testing only)"
                    >
                      <FaPlus className="mr-1" />
                      Test Rating
                    </button>
                  </div>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h3 className="font-semibold text-secondary mb-1">Coins</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaCoins className="text-secondary mr-2" />
                      <span className="text-xl font-semibold">{user.coins}</span>
                    </div>
                    <div className="relative group">
                      <button
                        onClick={handleConvertRatings}
                        disabled={convertingRatings || !user.ratings || user.ratings?.length === 0}
                        className={`text-xs px-2 py-1 rounded flex items-center ${
                          convertingRatings || !user.ratings || user.ratings?.length === 0
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-secondary text-white hover:bg-secondary-dark'
                        }`}
                      >
                        <FaExchangeAlt className="mr-1" />
                        {convertingRatings ? 'Converting...' : 'Convert Ratings'}
                      </button>
                      {(!user.ratings || user.ratings?.length === 0) && (
                        <div className="absolute hidden group-hover:block bottom-full right-0 mb-2 p-2 bg-gray-800 text-white text-xs rounded w-48 z-10">
                          You need to be rated by other users before you can convert ratings to coins.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-green-600 mb-1">Jobs Posted</h3>
                    <p className="text-xl font-semibold">{user.jobsPosted || 0}</p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h3 className="font-semibold text-purple-600 mb-1">Applications</h3>
                    <p className="text-xl font-semibold">{user.jobsApplied || 0}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Account Actions</h2>
              
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/change-password')}
                  className="btn btn-outline w-full justify-start"
                >
                  Change Password
                </button>
                
                <button
                  onClick={handleLogout}
                  className="btn btn-outline btn-error w-full justify-start"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'transactions' && (
        <TransactionHistory />
      )}
    </div>
  );
};

export default Profile; 