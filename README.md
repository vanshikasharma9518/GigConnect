# GigConnect

GigConnect is a gig-based platform where users can register, post and apply for jobs, earn ratings, convert them to coins, and redeem coins for online courses. It also features a radar-style live map interface for job activity tracking.

## Features

- User authentication (signup/login)
- Job posting and application system
- Rating system with coin conversion
- Course marketplace with coin redemption
- Radar map view for job/application activity
- Profile management
- Location-based job searching

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router
- Axios for API integration
- React Leaflet for maps

### Backend
- Node.js with Express.js
- MongoDB for database
- JWT for authentication
- RESTful API architecture

## Project Structure

```
gigconnect/
├── backend/             # Backend server code
│   ├── config/          # Database configuration
│   ├── controllers/     # API controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   └── server.js        # Entry point
├── frontend/            # React frontend
│   ├── public/          # Public assets
│   └── src/             # React source code
│       ├── assets/      # Image assets
│       ├── components/  # React components
│       ├── context/     # Context providers
│       ├── pages/       # Page components
│       ├── App.js       # Main App component
│       └── index.js     # Entry point
├── .env                 # Environment variables
├── package.json         # Project dependencies
└── README.md            # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB installed locally or MongoDB Atlas account
- npm or yarn package manager

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/gigconnect.git
   cd gigconnect
   ```

2. Install dependencies
   ```
   npm install
   npm run install-all
   ```

3. Set up environment variables
   Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/gigconnect
   JWT_SECRET=yoursecretkey
   JWT_EXPIRES_IN=30d
   ```

4. Start the development server
   ```
   npm run dev
   ```

## API Endpoints

### Users
- `POST /api/users` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/:id/rate` - Rate a user
- `POST /api/users/convert-ratings` - Convert ratings to coins

### Jobs
- `POST /api/jobs` - Create a new job
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get job by ID
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job
- `POST /api/jobs/:id/apply` - Apply for job
- `PUT /api/jobs/:id/applicants/:userId` - Update applicant status
- `GET /api/jobs/user/jobs` - Get user's posted jobs
- `GET /api/jobs/user/applied` - Get user's applied jobs

### Courses
- `POST /api/courses` - Create a new course
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course
- `POST /api/courses/:id/enroll` - Enroll in course
- `GET /api/courses/user/enrolled` - Get user's enrolled courses 