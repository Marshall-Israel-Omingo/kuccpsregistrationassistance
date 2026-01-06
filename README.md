# Course Connect Pro

A comprehensive course registration and application management system inspired by KUCCPS (Kenya Universities and Colleges Central Placement Service), built with React, TypeScript, and Supabase.

## Overview

Course Connect Pro is a dual-platform system consisting of:
- **Student Portal** - For browsing courses, submitting applications, and tracking progress
- **Admin Panel** - For processing applications, managing users, and system administration

## Features

### Student Portal
- **Course Discovery**
  - Browse courses by academic principles/categories
  - Detailed course information with requirements and career paths
  - Institution listings and program details
  - Search and filter functionality

- **Application Management**
  - Up to 4 course selections with priority ranking
  - Real-time eligibility checking based on KCSE results
  - Application status tracking (draft → payment pending → submitted → in progress → completed)
  - Document upload system

- **User Profile**
  - Personal information management
  - KCSE results recording with subject grades
  - Academic qualifications tracking

- **Payment Integration**
  - M-Pesa payment tracking
  - Payment history and receipts
  - Application fee processing (KES 500)

- **Support System**
  - In-app support ticket creation
  - Real-time notification system
  - FAQ and help resources

### Admin Panel
- **Dashboard Overview**
  - Real-time statistics and metrics
  - Application status distribution
  - Payment tracking summaries

- **Application Processing**
  - View and process student applications
  - Update application status with confirmation dialogs
  - Review course selections and documents
  - Detailed applicant information

- **User Management**
  - View all registered students
  - Role-based access control (Admin, Moderator, Support, User)
  - Promote/demote user roles
  - User activity monitoring

- **Payment Management**
  - Track all payments and transactions
  - Verify M-Pesa receipts
  - Payment status updates

- **Support Ticket System**
  - View and respond to student queries
  - Ticket categorization and prioritization
  - Status management

- **System Settings**
  - Notification templates management
  - Email and SMS configuration
  - Security policy settings
  - System maintenance mode

- **Audit Logs**
  - Complete system activity tracking
  - User action monitoring
  - Security event logging

## Design System

### Color Palette
- **Primary (Coral Orange)**: `#FF9B7F` - Headers and accent elements
- **Secondary (Teal)**: `#00BFA5` - CTAs and statistics
- **Navigation (Dark Charcoal)**: `#3E4551` - Navigation bars
- **Background**: Clean white with subtle gray tones

### UI Components
- Card-based layouts with subtle shadows
- Smooth animations and hover effects
- Responsive design for mobile and desktop
- Custom button variants (hero, teal, coral-outline)
- Toast notifications for user feedback

## Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **React Router** - Navigation
- **Lucide React** - Icon library
- **Sonner** - Toast notifications
- **Recharts** - Data visualization

### Backend
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Row Level Security (RLS)
  - Authentication
  - Real-time subscriptions
  - Storage

### Authentication
- Email/password authentication
- Auto-confirmation for development
- Protected routes with role-based access
- Session management

## Database Schema

### Core Tables
- `profiles` - Student personal information
- `applications` - Application records with status
- `course_selections` - Course choices (up to 4 per student)
- `subject_grades` - KCSE subject results
- `payments` - Payment transactions
- `documents` - Uploaded files
- `notifications` - User notifications
- `support_tickets` - Help desk tickets
- `ticket_messages` - Ticket conversation threads

### Admin Tables
- `user_roles` - Role-based access control
- `system_settings` - Application configuration
- `audit_logs` - System activity tracking
- `notification_templates` - Email/SMS templates

### Data Types
- `application_status`: draft | payment_pending | submitted | in_progress | completed | rejected
- `payment_status`: pending | processing | completed | failed | refunded
- `app_role`: admin | moderator | support | user

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd course-connect-pro
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run database migrations:
- Use the provided SQL scripts in the Supabase dashboard
- Ensure all tables, functions, and triggers are created

5. Start the development server:
```bash
npm run dev
```

### Creating the First Admin

1. Register a new account at `/register`
2. Run the following SQL in Supabase to promote the user to admin:
```sql
INSERT INTO public.user_roles (user_id, role) 
VALUES ('user_id_here', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

## User Roles and Permissions

### Admin
- Full system access
- Manage all applications and users
- Update system settings
- View audit logs
- Manage roles

### Moderator
- Process applications
- View user data
- Respond to support tickets
- Limited settings access

### Support
- View applications
- Respond to support tickets
- Limited user data access

### User (Student)
- Browse courses
- Submit applications
- Track application status
- Upload documents
- Contact support

## Security Features

- Row Level Security (RLS) policies on all tables
- Role-based access control
- Secure password policies
- Session management
- Audit logging
- Protected API routes

## Pages and Routes

### Public Routes
- `/` - Home page
- `/browse-courses` - Course catalog
- `/courses/principle/:id` - Courses by principle
- `/courses/:id` - Course details
- `/how-it-works` - Process guide
- `/about` - About us
- `/contact` - Contact form
- `/login` - Sign in
- `/register` - Sign up

### Student Dashboard
- `/dashboard` - Dashboard home
- `/dashboard/profile` - Edit profile
- `/dashboard/browse` - Browse courses
- `/dashboard/application` - Application management
- `/dashboard/payments` - Payment history
- `/dashboard/notifications` - Notifications

### Admin Panel
- `/admin` - Admin dashboard
- `/admin/applications` - All applications
- `/admin/applications/:id` - Application details
- `/admin/students` - Student management
- `/admin/payments` - Payment tracking
- `/admin/tickets` - Support tickets
- `/admin/reports` - Analytics
- `/admin/settings` - System settings
- `/admin/users` - User role management

## Testing

### Test Accounts
**Admin Account:**
- Email: marshallisrael@gmail.com
- Password: leshram1234

## Future Enhancements

- [ ] Real M-Pesa API integration
- [ ] Email notification service
- [ ] SMS notifications
- [ ] Advanced analytics dashboard
- [ ] Bulk application processing
- [ ] Export reports (PDF/Excel)
- [ ] Mobile app version
- [ ] Multi-language support
- [ ] Advanced search filters
- [ ] Course recommendation engine

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License.

## Support

For support and queries:
- Email: support@courseconnectpro.com
- Phone: +254 700 000 000
- In-app support tickets

## Acknowledgments

- Inspired by KUCCPS (Kenya Universities and Colleges Central Placement Service)
- Built with Lovable.dev
- Powered by Supabase

---

**Note**: This is a demonstration project. For production use, additional security measures, testing, and compliance checks are required.
