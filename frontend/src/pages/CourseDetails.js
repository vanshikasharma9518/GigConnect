import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  FaStar, 
  FaCoins, 
  FaClock, 
  FaUser, 
  FaCalendarAlt,
  FaCheck,
  FaLock,
  FaArrowLeft,
  FaPlay
} from 'react-icons/fa';

const CourseDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
       
        const demoData = {
          _id: id,
          title: 'Advanced React Development',
          description: 'Master React hooks, context API, and state management for complex applications. This comprehensive course covers everything from the fundamentals of React to advanced patterns and best practices used in production applications. You will build multiple projects and gain hands-on experience with the latest React features.',
          instructor: 'Emily Chen',
          instructorBio: 'Senior Frontend Developer with 8+ years of experience building React applications at top tech companies.',
          coinCost: 120,
          duration: '6 weeks',
          rating: 4.7,
          enrolled: 218,
          image: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          lastUpdated: '2023-06-15',
          modules: [
            {
              title: 'Introduction to Modern React',
              lessons: ['React Fundamentals Refresher', 'Setting up Your Development Environment', 'Understanding JSX and Components'],
              duration: '1 week'
            },
            {
              title: 'React Hooks in Depth',
              lessons: ['useState and useEffect', 'useContext for State Management', 'Custom Hooks', 'Performance Optimization with useMemo and useCallback'],
              duration: '2 weeks'
            },
            {
              title: 'Advanced State Management',
              lessons: ['Context API vs Redux', 'Implementing Redux Toolkit', 'Server State Management with React Query'],
              duration: '1.5 weeks'
            },
            {
              title: 'Testing and Deployment',
              lessons: ['Unit Testing with Jest and RTL', 'Integration Testing', 'CI/CD and Deployment Strategies'],
              duration: '1.5 weeks'
            }
          ],
          objectives: [
            'Build complex React applications using hooks and functional components',
            'Implement efficient state management strategies',
            'Create reusable custom hooks for complex logic',
            'Write comprehensive tests for React applications',
            'Deploy and optimize React applications for production'
          ]
        };
        
        setCourse(demoData);
        
        // Check if user is enrolled
        if (user) {
          // In a real app, you would check if user is enrolled from backend
          // For demo, we'll randomly set it
          setEnrolled(Math.random() > 0.5);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching course details:', error);
        setError('Failed to load course details. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchCourseDetails();
  }, [id, user]);
  
  const handleEnroll = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/courses/${id}` } });
      return;
    }
    
    if (user.coins < course.coinCost) {
      setError('Insufficient coins. Please earn more coins to enroll in this course.');
      return;
    }
    
    setEnrolling(true);
    setError('');
    
    try {
      // In a real app, you would call the backend to enroll
      // await axios.post(`http://localhost:5000/api/courses/${id}/enroll`, {}, {
      //   headers: {
      //     Authorization: `Bearer ${user.token}`
      //   }
      // });
      
      // Redirect to YouTube playlist
      window.open('https://www.youtube.com/playlist?list=PL6dw1BPCcLC4n-4o-t1kQZH0NJeZtpmGp', '_blank');
      
      // Update enrollment status
      setEnrolled(true);
      setEnrolling(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to enroll in course. Please try again.');
      setEnrolling(false);
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
        <Link to="/courses" className="text-primary hover:underline mt-2 inline-block">
          Back to Courses
        </Link>
      </div>
    );
  }
  
  if (!course) {
    return (
      <div className="bg-yellow-100 p-4 rounded-lg text-yellow-700">
        <p>Course not found.</p>
        <Link to="/courses" className="text-primary hover:underline mt-2 inline-block">
          Back to Courses
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      <button 
        onClick={() => navigate('/courses')} 
        className="flex items-center text-primary hover:underline mb-4"
      >
        <FaArrowLeft className="mr-2" /> Back to Courses
      </button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Info Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <img 
              src={course.image} 
              alt={course.title} 
              className="w-full h-64 object-cover"
            />
            
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
              
              <div className="flex flex-wrap items-center text-gray-600 mb-6">
                <div className="flex items-center mr-6 mb-2">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span>{course.rating}</span>
                  <span className="text-gray-500 text-sm ml-1">({course.enrolled} enrolled)</span>
                </div>
                <div className="flex items-center mr-6 mb-2">
                  <FaClock className="text-gray-400 mr-1" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center mr-6 mb-2">
                  <FaUser className="text-gray-400 mr-1" />
                  <span>{course.instructor}</span>
                </div>
                <div className="flex items-center mb-2">
                  <FaCalendarAlt className="text-gray-400 mr-1" />
                  <span>Last updated: {new Date(course.lastUpdated).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">About This Course</h2>
                <p className="text-gray-700 whitespace-pre-line">{course.description}</p>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">What You'll Learn</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {course.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <FaCheck className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Course Content</h2>
                <div className="space-y-3">
                  {course.modules.map((module, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg">
                      <div className="bg-gray-50 p-4 flex justify-between items-center">
                        <h3 className="font-semibold">{module.title}</h3>
                        <div className="text-gray-500 text-sm">{module.duration}</div>
                      </div>
                      <ul className="p-4 space-y-2">
                        {module.lessons.map((lesson, lIndex) => (
                          <li key={lIndex} className="flex items-center">
                            {enrolled ? (
                              <FaPlay className="text-primary mr-3 text-xs" />
                            ) : (
                              <FaLock className="text-gray-400 mr-3 text-xs" />
                            )}
                            <span className={!enrolled ? 'text-gray-500' : ''}>{lesson}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3">Instructor</h2>
                <div className="flex items-start">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructor)}&background=random`} 
                    alt={course.instructor} 
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-semibold">{course.instructor}</h3>
                    <p className="text-gray-600 mt-1">{course.instructorBio}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enrollment Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <div className="flex items-center justify-center mb-4">
              <FaCoins className="text-2xl text-secondary mr-2" />
              <span className="text-3xl font-bold">{course.coinCost}</span>
              <span className="ml-1 text-gray-600">Coins</span>
            </div>
            
            {enrolled ? (
              <div className="mb-6">
                <div className="bg-green-100 text-green-700 p-3 rounded-lg flex items-center justify-center mb-4">
                  <FaCheck className="mr-2" />
                  You are enrolled in this course
                </div>
                <a 
                  href="https://www.youtube.com/playlist?list=PL6dw1BPCcLC4n-4o-t1kQZH0NJeZtpmGp" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-primary w-full"
                >
                  Start Learning
                </a>
              </div>
            ) : (
              <div className="mb-6">
                {user && user.coins < course.coinCost && (
                  <div className="bg-yellow-100 text-yellow-700 p-3 rounded-lg mb-4 text-sm">
                    You need {course.coinCost - user.coins} more coins to enroll
                  </div>
                )}
                
                <button 
                  onClick={handleEnroll}
                  disabled={enrolling || (user && user.coins < course.coinCost)}
                  className={`btn w-full ${
                    user && user.coins < course.coinCost
                      ? 'btn-disabled'
                      : 'btn-primary'
                  }`}
                >
                  {enrolling ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin h-5 w-5 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                      Enrolling...
                    </span>
                  ) : (
                    'Enroll Now'
                  )}
                </button>
              </div>
            )}
            
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold mb-3">This course includes:</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-sm">
                  <FaCheck className="text-green-500 mr-2" />
                  Full lifetime access
                </li>
                <li className="flex items-center text-sm">
                  <FaCheck className="text-green-500 mr-2" />
                  {course.modules.reduce((total, module) => total + module.lessons.length, 0)} lessons
                </li>
                <li className="flex items-center text-sm">
                  <FaCheck className="text-green-500 mr-2" />
                  Certificate of completion
                </li>
                <li className="flex items-center text-sm">
                  <FaCheck className="text-green-500 mr-2" />
                  Projects and assignments
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails; 