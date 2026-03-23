import { Link } from 'react-router-dom';
import { FaCoins, FaUsers } from 'react-icons/fa';

const CourseCard = ({ course }) => {
  return (
    <div className="card hover:shadow-lg transition-shadow">
      <img
        src={course.thumbnailUrl || 'https://via.placeholder.com/400x200?text=Course'}
        alt={course.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-5">
        <div className="flex justify-between items-center mb-2">
          <span className="bg-blue-100 text-primary px-2 py-1 rounded text-xs font-medium">
            {course.category}
          </span>
          <div className="flex items-center text-secondary">
            <FaCoins className="mr-1" />
            <span>{course.cost} coins</span>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-primary mb-2">
          {course.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {course.description}
        </p>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            <FaUsers className="inline mr-1" />
            {course.enrollmentCount || 0} enrolled
          </div>
          <Link
            to={`/courses/${course._id}`}
            className="btn btn-outline hover:bg-primary hover:text-white transition-colors"
          >
            View Course
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard; 