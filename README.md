# Pet Adoption Management System - Frontend

A modern, responsive React frontend application for managing pet adoptions. Users can browse available pets, submit adoption applications, and admins can manage pets and review applications.

## Features

### Visitor Features
- Browse available pets with search and filter functionality
- Filter by species, breed, age, and status
- View detailed pet information with photos
- Responsive pagination for pet listings

### User Features
- User registration and authentication
- Submit adoption applications for available pets
- View personal adoption application status
- Delete own applications

### Admin Features
- Dashboard with comprehensive statistics
- Full CRUD operations for pets (Create, Read, Update, Delete)
- Manage adoption applications (Approve/Reject)
- View all users, pets, and applications statistics
- Upload pet photos via file upload or URL

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and development server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API requests
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form management
- **Yup** - Schema validation
- **React Toastify** - Toast notifications
- **Context API** - State management for authentication

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Backend API server running (see environment setup)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port Vite assigns).

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Footer.jsx
│   ├── Loading.jsx
│   ├── Navbar.jsx
│   ├── PetCard.jsx
│   ├── PetForm.jsx
│   └── ProtectedRoute.jsx
├── context/            # React Context providers
│   └── AuthContext.jsx
├── pages/              # Page components
│   ├── HomePage.jsx
│   ├── PetDetailsPage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── UserDashboard.jsx
│   ├── ProfilePage.jsx
│   ├── AdminDashboard.jsx
│   ├── ManagePets.jsx
│   └── ManageApplications.jsx
├── routes/             # Route configuration files
│   ├── PublicRoutes.jsx
│   ├── UserRoutes.jsx
│   └── AdminRoutes.jsx
├── services/           # API service layers
│   ├── api.js
│   ├── authService.js
│   ├── petService.js
│   ├── applicationService.js
│   └── statisticsService.js
├── utils/              # Utility functions
│   └── imageUtils.js
├── App.jsx             # Main application component
└── main.jsx            # Application entry point
```

## API Integration

The frontend expects a backend API with the following structure:

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Pet Endpoints
- `GET /api/pets` - Get pets with filters and pagination
- `GET /api/pets/:id` - Get pet by ID
- `POST /api/pets` - Create pet (Admin only)
- `PUT /api/pets/:id` - Update pet (Admin only)
- `DELETE /api/pets/:id` - Delete pet (Admin only)

### Adoption Application Endpoints
- `POST /api/adoptions` - Create adoption application
- `GET /api/adoptions/my-applications` - Get user's applications
- `GET /api/adoptions/:id` - Get application by ID
- `DELETE /api/adoptions/:id` - Delete application
- `GET /api/adoptions/admin/all` - Get all applications (Admin only)
- `PUT /api/adoptions/admin/:id/status` - Update application status (Admin only)

### Statistics Endpoints (Admin only)
- `GET /api/statistics/dashboard` - Dashboard overview stats
- `GET /api/statistics/pets` - Pet statistics
- `GET /api/statistics/applications` - Application statistics
- `GET /api/statistics/users` - User statistics

### API Response Format

All API responses follow this structure:
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

## Authentication

The application uses JWT tokens for authentication. Tokens are stored in `localStorage` and automatically included in API requests via the Authorization header.

### User Roles

- **Visitor** - Unauthenticated users (browse only)
- **User** - Registered users (can apply for adoption)
- **Admin** - Administrators (full access to manage pets and applications)

## Protected Routes

- `/user/*` - Requires authentication
- `/admin/*` - Requires admin role

Unauthenticated users are redirected to the login page when accessing protected routes.

## Features in Detail

### Pet Management
- Search pets by name or breed
- Filter by species, age, and status
- Pagination support
- Image upload via file or URL
- Responsive grid layout

### Application Management
- Status tracking (Pending, Approved, Rejected)
- Application deletion by users
- Admin approval/rejection workflow
- Application history

### Statistics Dashboard
- Real-time statistics
- Total pets, available pets count
- Pending and total applications
- User count overview

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Replace with your actual backend API URL.

## Building for Production

1. Update the `.env` file with production API URL
2. Build the project:
```bash
npm run build
```

3. The `dist` folder will contain the production-ready files
4. Preview the production build:
```bash
npm run preview
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@petadoption.com or create an issue in the repository.
