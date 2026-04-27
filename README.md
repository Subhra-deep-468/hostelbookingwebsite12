# Student Hostel Booking Web Application

A full-stack MERN application for students to search and book hostels, and for hostel owners to manage their properties.

## Features

### For Students
- 🔍 Search hostels by location
- 💰 Filter by price range, room type, and amenities
- ⭐ View detailed hostel information
- 📱 Send booking requests
- 📋 View booking history and status
- 🎫 Cancel pending bookings

### For Hostel Owners
- 🏨 Add and manage hostels
- 📑 View booking requests
- ✅ Approve or reject bookings
- 📊 Dashboard for management

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React.js** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **CSS** - Styling

## Project Structure

```
student-hostel/
├── backend/
│   ├── config/
│   │   ├── database.js
│   │   └── jwt.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── hostelController.js
│   │   ├── bookingController.js
│   │   └── ownerController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Hostel.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── hostelRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── ownerRoutes.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── SearchBar.js
    │   │   └── HostelCard.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── HomePage.js
    │   │   ├── SearchResultsPage.js
    │   │   ├── HostelDetailsPage.js
    │   │   ├── LoginPage.js
    │   │   ├── SignupPage.js
    │   │   ├── StudentDashboard.js
    │   │   └── OwnerDashboard.js
    │   ├── utils/
    │   │   ├── api.js
    │   │   └── validation.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── .gitignore
    ├── package.json
    └── public/index.html
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB account (we're using MongoDB Atlas)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```env
PORT=5000
MONGODB_URL=mongodb+srv://student:student@cluster0.zzgad9z.mongodb.net/studenthostel
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=7d
```

4. Start the backend server:
```bash
npm run dev
```

The backend will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will open on `http://localhost:3000`

## API Documentation

### Authentication Routes

#### Register
- **POST** `/api/auth/register`
- **Body**: `{ name, email, password, role }`
- **Response**: `{ success, token, user }`

#### Login
- **POST** `/api/auth/login`
- **Body**: `{ email, password }`
- **Response**: `{ success, token, user }`

#### Get Current User
- **GET** `/api/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ success, user }`

### Hostel Routes

#### Get All Hostels (with filters)
- **GET** `/api/hostels`
- **Query Params**: `city, area, minPrice, maxPrice, roomType, amenity, sort`
- **Response**: `{ success, count, hostels }`

#### Get Single Hostel
- **GET** `/api/hostels/:id`
- **Response**: `{ success, hostel }`

#### Create Hostel (Owner only)
- **POST** `/api/hostels`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ name, description, location, city, area, pricePerMonth, roomTypes, amenities, images }`
- **Response**: `{ success, hostel }`

#### Update Hostel (Owner only)
- **PUT** `/api/hostels/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ success, hostel }`

#### Delete Hostel (Owner only)
- **DELETE** `/api/hostels/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ success, message }`

#### Get Owner's Hostels
- **GET** `/api/hostels/owner/my-hostels`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ success, count, hostels }`

### Booking Routes

#### Create Booking (Student only)
- **POST** `/api/bookings`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ hostelId, roomType, checkInDate, checkOutDate, message }`
- **Response**: `{ success, booking }`

#### Get Student Bookings
- **GET** `/api/bookings/student/my-bookings`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ success, count, bookings }`

#### Get Owner Booking Requests
- **GET** `/api/bookings/owner/requests`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ success, count, bookings }`

#### Update Booking Status (Owner only)
- **PUT** `/api/bookings/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ status: 'approved' | 'rejected', rejectionReason (optional) }`
- **Response**: `{ success, message, booking }`

#### Cancel Booking (Student only)
- **DELETE** `/api/bookings/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ success, message, booking }`

### Owner Verification Routes

#### Apply for Owner Verification
- **POST** `/api/owner/apply`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ success, message, user }`

#### Get Owner Status
- **GET** `/api/owner/status`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ success, isOwnerVerified, ownerAppliedAt }`

#### Verify Owner (Admin/Demo)
- **PUT** `/api/owner/verify/:userId`
- **Response**: `{ success, message, user }`

## User Roles

### Student
- Can search and browse hostels
- Can view hostel details
- Can send booking requests
- Can view their booking history
- Can cancel pending bookings

### Hostel Owner
- Can add new hostels
- Can update hostel details
- Can delete hostels
- Can view booking requests for their hostels
- Can approve or reject booking requests
- Can apply for verification

## Sample Data

### Create Student Account
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

### Create Owner Account
```json
{
  "name": "Jane Smith",
  "email": "owner@example.com",
  "password": "password123",
  "role": "owner"
}
```

### Add Hostel
```json
{
  "name": "Downtown Hostel",
  "description": "A comfortable hostel located in the heart of the city",
  "location": "123 Main Street, Downtown",
  "city": "Mumbai",
  "area": "Bandra",
  "pricePerMonth": 5000,
  "roomTypes": [
    {
      "type": "Single Bed",
      "pricePerMonth": 5000,
      "availableRooms": 5,
      "totalRooms": 5
    }
  ],
  "amenities": ["WiFi", "Food", "AC", "Laundry"],
  "images": ["image_url_1", "image_url_2"]
}
```

## Features Implemented

✅ User Authentication (JWT)
✅ Role-based Authorization (Student/Owner)
✅ Hostel Search with Filters
✅ Hostel Sorting (Price, Rating)
✅ Booking System
✅ Student Dashboard
✅ Owner Dashboard
✅ Owner Verification (Simple Flag)
✅ Form Validation
✅ Error Handling
✅ Loading States
✅ Responsive Design

## Future Enhancements

- ⭐ Rating and Reviews System
- 📸 Image Upload Functionality
- 💳 Payment Integration
- 📧 Email Notifications
- 📱 Mobile App
- 🗺️ Map Integration
- 🔔 Push Notifications
- 👨‍💼 Admin Panel

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For support, email support@studenthostel.com or open an issue on GitHub.

---

**Happy Hosting! 🎉**
