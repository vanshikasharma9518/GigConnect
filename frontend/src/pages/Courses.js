import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaStar, FaCoins, FaClock, FaSearch, FaFilter } from 'react-icons/fa';

const Courses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/courses');
        setCourses(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError('Failed to load courses. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, []);
  
  // Filter and search courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'affordable' && course.coinCost <= 100) return matchesSearch;
    if (filter === 'premium' && course.coinCost > 100) return matchesSearch;
    
    return false;
  });
  
  // For demo purposes, we'll create some mock courses
  const demoCoursesData = [
    {
      _id: '1',
      title: 'Web Development Fundamentals',
      description: 'Learn the basics of HTML, CSS, and JavaScript to build modern websites.',
      instructor: 'John Smith',
      coinCost: 50,
      duration: '4 weeks',
      rating: 4.5,
      enrolled: 342,
      image: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
    },
    {
      _id: '2',
      title: 'Advanced React Development',
      description: 'Master React hooks, context API, and state management for complex applications.',
      instructor: 'Emily Chen',
      coinCost: 120,
      duration: '6 weeks',
      rating: 4.7,
      enrolled: 218,
      image: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
    },
    {
      _id: '3',
      title: 'Node.js Backend Development',
      description: 'Create scalable backend systems with Node.js, Express, and MongoDB.',
      instructor: 'Michael Johnson',
      coinCost: 80,
      duration: '5 weeks',
      rating: 4.3,
      enrolled: 156,
      image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
    },
    {
      _id: '4',
      title: 'UI/UX Design Principles',
      description: 'Learn the fundamental principles of creating user-friendly interfaces.',
      instructor: 'Sarah Williams',
      coinCost: 65,
      duration: '3 weeks',
      rating: 4.8,
      enrolled: 289,
      image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
    },
    {
      _id: '5',
      title: 'Mobile App Development with React Native',
      description: 'Build cross-platform mobile applications using React Native.',
      instructor: 'David Lee',
      coinCost: 150,
      duration: '8 weeks',
      rating: 4.6,
      enrolled: 176,
      image: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
    },
    {
      _id: '6',
      title: 'Data Science Fundamentals',
      description: 'Learn the basics of data analysis, visualization, and machine learning.',
      instructor: 'Jennifer Brown',
      coinCost: 200,
      duration: '10 weeks',
      rating: 4.9,
      enrolled: 312,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
    }
  ];
  
  // Using demo data instead of the fetched data for now
  const displayCourses = demoCoursesData.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'affordable' && course.coinCost <= 100) return matchesSearch;
    if (filter === 'premium' && course.coinCost > 100) return matchesSearch;
    
    return false;
  });
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Courses</h1>
        {user && (
          <div className="flex items-center bg-blue-50 px-4 py-2 rounded-lg">
            <FaCoins className="text-secondary mr-2" />
            <span className="font-semibold">{user.coins} Coins Available</span>
          </div>
        )}
      </div>
      
      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="form-input w-full pl-10"
              placeholder="Search for courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <select
              className="form-select pl-8 appearance-none"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Courses</option>
              <option value="affordable">Affordable (≤ 100 coins)</option>
              <option value="premium">Premium ({'>'}100 coins)</option>
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFilter className="text-gray-400" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Courses Grid */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading courses...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 p-4 rounded-lg text-red-700">
          <p>{error}</p>
        </div>
      ) : displayCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCourses.map((course) => (
            <div key={course._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src={course.image} 
                alt={course.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span>{course.rating}</span>
                    <span className="text-gray-500 text-sm ml-1">({course.enrolled} enrolled)</span>
                  </div>
                  <div className="flex items-center">
                    <FaClock className="text-gray-400 mr-1" />
                    <span className="text-gray-600 text-sm">{course.duration}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <FaCoins className="text-secondary mr-1" />
                    <span className="font-semibold">{course.coinCost} Coins</span>
                  </div>
                  <Link 
                    to={`/courses/${course._id}`}
                    className="btn btn-primary btn-sm"
                  >
                    View Course
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-white rounded-lg shadow-sm">
          <p className="text-gray-600">No courses found matching your search.</p>
        </div>
      )}
      
      {/* How to Earn Coins Section */}
      <div className="bg-blue-50 p-6 rounded-lg mt-10">
        <h2 className="text-xl font-semibold mb-4">How to Earn More Coins</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start">
            <div className="bg-primary text-white p-3 rounded-full mr-4">
              <FaStar />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Complete Jobs Successfully</h3>
              <p className="text-gray-600 text-sm">
                Earn high ratings on completed jobs to receive coins.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-primary text-white p-3 rounded-full mr-4">
              <FaCoins />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Convert Ratings to Coins</h3>
              <p className="text-gray-600 text-sm">
                Visit your dashboard to convert your job ratings into coins.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses; 