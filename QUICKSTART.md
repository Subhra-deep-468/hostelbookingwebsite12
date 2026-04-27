# Quick Start Guide

## 🚀 Getting Started

This guide will help you set up and run the Student Hostel Booking Application.

## Prerequisites

Make sure you have the following installed:
- **Node.js** (v14+) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional)
- **MongoDB Account** (Already provided: mongodb+srv://student:student@cluster0.zzgad9z.mongodb.net/studenthostel)

## Step-by-Step Setup

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the server
npm run dev
```

✅ Backend will start on **http://localhost:5000**

### 2. Frontend Setup (in a new terminal)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the React app
npm start
```

✅ Frontend will open on **http://localhost:3000**

## Test the Application

### Create Accounts

1. **Student Account**
   - Go to http://localhost:3000/signup
   - Fill in details and select "Student" role
   - Click "Sign Up"

2. **Owner Account**
   - Go to http://localhost:3000/signup
   - Fill in details and select "Hostel Owner" role
   - Click "Sign Up"

### As Student
1. Search for hostels by city (e.g., "Mumbai")
2. Filter by price, room type, and amenities
3. Click "View Details" on any hostel
4. Select room type and send booking request
5. Go to "My Bookings" to view status

### As Owner
1. Go to "Manage Hostels" (Owner Dashboard)
2. Click "+ Add New Hostel"
3. Fill in hostel details and submit
4. View booking requests in the "Booking Requests" tab
5. Approve or reject requests

## Environment Variables

Backend `.env` file:
```
PORT=5000
MONGODB_URL=mongodb+srv://student:student@cluster0.zzgad9z.mongodb.net/studenthostel
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=7d
```

Frontend automatically connects to `http://localhost:5000/api`

## API Endpoints Summary

- **Auth**: `/api/auth/register`, `/api/auth/login`
- **Hostels**: `/api/hostels` (GET with filters), `/api/hostels/:id` (GET)
- **Bookings**: `/api/bookings` (POST), `/api/bookings/student/my-bookings` (GET)
- **Owner**: `/api/owner/apply`, `/api/owner/verify/:userId`

## Troubleshooting

### Backend won't start
- Check if port 5000 is available: `netstat -ano | findstr :5000`
- Verify MongoDB connection string in `.env`
- Make sure all dependencies are installed: `npm install`

### Frontend won't connect to backend
- Ensure backend is running on port 5000
- Check browser console for CORS errors
- Clear browser cache and try again

### MongoDB connection fails
- Verify the connection string in `.env`
- Check MongoDB Atlas IP whitelist (add 0.0.0.0/0 for development)
- Ensure network access is allowed

## Features Checklist

✅ User Registration & Login
✅ Search Hostels with Filters
✅ Sort Hostels by Price
✅ View Hostel Details
✅ Book Hostel
✅ Student Dashboard
✅ Owner Dashboard
✅ Approve/Reject Bookings
✅ JWT Authentication
✅ Role-based Authorization

## Next Steps

1. Customize the theme colors in CSS files
2. Add image upload functionality
3. Integrate payment gateway
4. Add email notifications
5. Implement rating and reviews
6. Deploy to production (Netlify/Vercel for frontend, Heroku for backend)

## Support

For issues or questions, check the main README.md or create an issue on GitHub.

**Happy Hosting! 🎉**
