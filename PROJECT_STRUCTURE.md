# Project Structure & File Descriptions

## Backend Files

### Configuration Files
- **`backend/package.json`** - Dependencies and scripts
- **`backend/.env`** - Environment variables (MongoDB URL, JWT settings)
- **`backend/.gitignore`** - Git ignore rules
- **`backend/server.js`** - Express server entry point

### Config Directory (`backend/config/`)
- **`database.js`** - MongoDB connection setup using Mongoose
- **`jwt.js`** - JWT token generation and verification utilities

### Models Directory (`backend/models/`)
- **`User.js`** - User schema with roles (student/owner), password hashing
- **`Hostel.js`** - Hostel schema with room types, amenities, images
- **`Booking.js`** - Booking schema with status tracking

### Middleware Directory (`backend/middleware/`)
- **`auth.js`** - JWT verification and role-based authorization middleware

### Controllers Directory (`backend/controllers/`)
- **`authController.js`** - Register, login, get current user
- **`hostelController.js`** - CRUD operations for hostels, search functionality
- **`bookingController.js`** - Booking creation, status updates, cancellations
- **`ownerController.js`** - Owner verification and application handling

### Routes Directory (`backend/routes/`)
- **`authRoutes.js`** - Authentication endpoints
- **`hostelRoutes.js`** - Hostel endpoints with authorization
- **`bookingRoutes.js`** - Booking endpoints with role checks
- **`ownerRoutes.js`** - Owner verification endpoints

## Frontend Files

### Configuration & Setup
- **`frontend/package.json`** - React dependencies and scripts
- **`frontend/.gitignore`** - Git ignore rules
- **`frontend/public/index.html`** - HTML entry point
- **`frontend/src/index.js`** - React app initialization
- **`frontend/src/index.css`** - Global styles
- **`frontend/src/App.js`** - Main app component with routing
- **`frontend/src/App.css`** - App-level styles

### Context & State Management (`frontend/src/context/`)
- **`AuthContext.js`** - Authentication context for managing user state globally

### Utilities (`frontend/src/utils/`)
- **`api.js`** - Axios instance with interceptors for API calls
- **`validation.js`** - Form validation functions

### Components (`frontend/src/components/`)
- **`Navbar.js` & `Navbar.css`** - Navigation bar with user menu
- **`SearchBar.js` & `SearchBar.css`** - Hostel search input
- **`HostelCard.js` & `HostelCard.css`** - Reusable hostel card component

### Pages (`frontend/src/pages/`)
- **`HomePage.js` & `HomePage.css`** - Landing page with hero section
- **`SearchResultsPage.js` & `SearchResultsPage.css`** - Search results with filters
- **`HostelDetailsPage.js` & `HostelDetailsPage.css`** - Detailed hostel view
- **`LoginPage.js` & `AuthPage.css`** - Login page with form validation
- **`SignupPage.js` & `AuthPage.css`** - Registration page for students/owners
- **`StudentDashboard.js` & `StudentDashboard.css`** - Student booking history
- **`OwnerDashboard.js` & `OwnerDashboard.css`** - Owner hostel & booking management

### Root Level Documentation
- **`README.md`** - Complete project documentation
- **`QUICKSTART.md`** - Quick start guide for setup

## Key Features by File

### Authentication & Authorization
- Backend: `auth.js` (middleware), `authController.js`, `User.js` (model)
- Frontend: `AuthContext.js`, `LoginPage.js`, `SignupPage.js`

### Search & Filter
- Backend: `hostelController.js` (advanced filtering with MongoDB)
- Frontend: `SearchBar.js`, `SearchResultsPage.js`

### Booking System
- Backend: `bookingController.js`, `Booking.js` (model)
- Frontend: `HostelDetailsPage.js` (create booking), `StudentDashboard.js` (view bookings)

### Dashboard Management
- Backend: `hostelController.js`, `bookingController.js`
- Frontend: `StudentDashboard.js`, `OwnerDashboard.js`

## Database Schema

### User Collection
```
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'student' | 'owner',
  phone: String,
  profileImage: String,
  isVerified: Boolean,
  isOwnerVerified: Boolean,
  ownerAppliedAt: Date,
  createdAt: Date
}
```

### Hostel Collection
```
{
  owner: ObjectId (User),
  name: String,
  description: String,
  location: String,
  city: String,
  area: String,
  pricePerMonth: Number,
  roomTypes: [{
    type: String,
    pricePerMonth: Number,
    availableRooms: Number,
    totalRooms: Number
  }],
  amenities: [String],
  images: [String],
  rating: Number,
  reviews: Number,
  isActive: Boolean,
  createdAt: Date
}
```

### Booking Collection
```
{
  student: ObjectId (User),
  hostel: ObjectId (Hostel),
  roomType: String,
  price: Number,
  status: 'pending' | 'approved' | 'rejected' | 'cancelled',
  checkInDate: Date,
  checkOutDate: Date,
  message: String,
  rejectionReason: String,
  createdAt: Date
}
```

## API Endpoints Summary

### Authentication (5 endpoints)
- POST `/api/auth/register` - Create account
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Get current user

### Hostels (6 endpoints)
- GET `/api/hostels` - Search/list hostels
- GET `/api/hostels/:id` - Get hostel details
- POST `/api/hostels` - Create hostel (owner)
- PUT `/api/hostels/:id` - Update hostel (owner)
- DELETE `/api/hostels/:id` - Delete hostel (owner)
- GET `/api/hostels/owner/my-hostels` - Owner's hostels

### Bookings (5 endpoints)
- POST `/api/bookings` - Create booking (student)
- GET `/api/bookings/student/my-bookings` - Student's bookings
- GET `/api/bookings/owner/requests` - Owner's booking requests
- PUT `/api/bookings/:id` - Update booking status (owner)
- DELETE `/api/bookings/:id` - Cancel booking (student)

### Owner Verification (3 endpoints)
- POST `/api/owner/apply` - Apply for verification
- GET `/api/owner/status` - Check verification status
- PUT `/api/owner/verify/:userId` - Verify owner

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React.js | UI rendering |
| Frontend | React Router | Page navigation |
| Frontend | Axios | HTTP requests |
| Backend | Node.js | Runtime environment |
| Backend | Express.js | Web framework |
| Backend | MongoDB Atlas | Database |
| Backend | Mongoose | Data modeling |
| Backend | JWT | Authentication |
| Backend | bcryptjs | Password hashing |

## Total Files Created
- Backend: 14 files (config, models, middleware, controllers, routes, server, env, gitignore, package.json)
- Frontend: 37 files (components, pages, utilities, context, index files, HTML)
- Root: 2 documentation files

**Total: 53 files**
