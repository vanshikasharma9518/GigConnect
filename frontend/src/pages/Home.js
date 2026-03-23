import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import JobCard from '../components/JobCard';
import { FaSearch, FaBriefcase, FaGraduationCap, FaMapMarkedAlt } from 'react-icons/fa';

const Home = () => {
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentJobs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/jobs');
        // Get only the most recent 3 jobs
        setRecentJobs(response.data.slice(0, 3));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recent jobs:', error);
        setLoading(false);
      }
    };

    fetchRecentJobs();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-blue-600 text-white py-16 rounded-lg">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Connect with the Perfect Gig
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Post jobs, apply for work, earn ratings, and redeem coins for courses.
            All in one place!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn bg-white text-primary hover:bg-gray-100">
              Get Started
            </Link>
            <Link to="/radar" className="btn bg-secondary text-white hover:bg-amber-600">
              Explore Map
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How GigConnect Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <FaBriefcase className="text-primary text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Post or Find Jobs</h3>
              <p className="text-gray-600">
                Easily post jobs or browse available gigs that match your skills
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <FaMapMarkedAlt className="text-primary text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Radar View</h3>
              <p className="text-gray-600">
                Discover jobs and applicants near you with our interactive map
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <FaGraduationCap className="text-primary text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Learn and Grow</h3>
              <p className="text-gray-600">
                Convert your ratings to coins and redeem them for courses
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Jobs Section */}
      <section className="py-12 bg-gray-50 rounded-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Recent Jobs</h2>
            <Link to="/jobs" className="text-primary hover:underline">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading recent jobs...</p>
            </div>
          ) : recentJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg shadow-sm">
              <p className="text-gray-600">No jobs found. Be the first to post a job!</p>
              <Link to="/post-job" className="btn btn-primary mt-4">
                Post a Job
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join GigConnect today and start your journey towards better gig work.
          </p>
          <Link to="/register" className="btn btn-primary text-lg px-8 py-3">
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 