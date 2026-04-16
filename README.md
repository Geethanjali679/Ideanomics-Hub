IDEANOMICS HUB
INNOVATION & INVESTOR COLLABORATION PLATFORM
========================================================

Project Name:
Ideanomics Hub

Project Type:
MERN Stack Web Application for Idea Sharing and Investment

Developed Using:
MongoDB, Express.js, React.js, Node.js, Material-UI (MUI), 
JSON Web Tokens (JWT), Bcrypt.js, Axios

========================================================
1. PROJECT OVERVIEW
========================================================

Ideanomics Hub is a web-based platform designed to connect idea generators (creators) 
and investors. The system facilitates idea sharing, collaboration, and investment 
opportunities by providing a space where innovative concepts can meet funding.

The system provides multiple core modules matching the physical codebase:

1. Authentication Module (Login, Register, Forgot Password, Reset Password)
2. Public Module (Home Page, Browse Ideas, Idea Details)
3. Creator/Generator Module (Dashboard, Submit Idea, My Ideas, Edit Idea)
4. Investor Module (Dashboard, Submit Idea, My Ideas, Edit Idea, Payments)
5. Admin Module (Dashboard, Manage Users, Manage Ideas, Manage Payments, System Warnings)
6. Interaction Module (Likes, Comments, Notifications)

This project allows users to post ideas, interact through comments and likes, 
manage secure investments via defined payment structures, and keep track of 
platform notifications.

========================================================
2. MAIN OBJECTIVE
========================================================

The main objective of Ideanomics Hub is to seamlessly bridge the gap between creative 
creators who submit innovative ideas and investors looking for promising new 
ventures to fund, backed by a robust administrative moderation backbone.

========================================================
3. FEATURES OF THE PROJECT
========================================================

User & Authentication System:
- Role-based Login and Registration (Creator, Investor, Admin)
- Secure Authentication with JWT and Bcrypt
- Forgot / Reset Password functionality

Content Generation & Management:
- Creator & Investor Dashboards for customized experiences
- Submit, View, Edit, and Delete Ideas
- Browse and Explore feed for discovering innovations
- Idea Detail Views with extensive descriptions

Interaction Ecosystem:
- Users can "Like" ideas to show interest
- Nested "Comments" system for collaboration and feedback
- "Notification" tracking to keep users engaged

Investment & Moderation:
- "Payment" processing views and models for recording investments
- Comprehensive "Admin" views to monitor Users, Ideas, and Payments
- "Warning" system to moderate users breaching platform guidelines

UI / UX:
- Fully responsive and modern layout utilizing Material-UI
- State-driven React components managing user states automatically

========================================================
4. TECHNOLOGIES USED
========================================================

Frontend:
- React.js (v18)
- React Router DOM (v6)
- Material-UI (MUI) & Emotion
- Axios
- SweetAlert2 & Notistack

Backend:
- Node.js & Express.js
- JSON Web Token (JWT)
- Bcryptjs (Cryptography)
- Nodemailer

Database:
- MongoDB (via Mongoose ORM)
- Local installation or MongoDB Atlas compatible

========================================================
5. PROJECT FOLDER PURPOSE
========================================================

Important folders matching your exact repository structure:

1. backend/server.js
   Entry point for Express and MongoDB connection.

2. backend/routes/ (admin.js, auth.js, comments.js, ideas.js, likes.js, notifications.js, payments.js, users.js)
   Express Routers separating API responsibilities cleanly.

3. backend/controllers/ & backend/middleware/
   Business logic and custom middleware (e.g., auth verifiers, role checkers).

4. backend/models/
   Mongoose schemas corresponding exactly to: Comment, Idea, Like, Notification, Payment, User, Warning.

5. frontend/src/pages/
   Subdivided perfectly by role: 
   - admin/ (Dashboards, Manage Users/Ideas/Payments/Warnings)
   - auth/ (Logins, Registration, Passwords)
   - creator/ (Creator Dashboards and Idea CRUD)
   - investor/ (Investor Dashboards, Idea CRUD, Payment tracking)
   - public/ (Home, Browse Ideas, Details)

6. frontend/src/components/ & frontend/src/contexts/ & frontend/src/theme/
   Reusable UI pieces, React Context API layers (e.g. AuthContext), and MUI Theme styling.

========================================================
6. SOFTWARE REQUIREMENTS
========================================================

- Node.js (v18+ recommended)
- MongoDB Server (Local or Atlas)
- Git (optional)
- Modern web browser

========================================================
7. HOW TO RUN THE PROJECT
========================================================

Follow these exact steps:

STEP 1:
Open `ideanomics-v5` in your IDE. Make sure MongoDB is running.

STEP 2 - Backend Setup:
Open a terminal and navigate to the backend directory:
cd backend
npm install

STEP 3:
Review backend/.env. Ensure MONGO_URI, PORT, and JWT_SECRET are set.

STEP 4:
Start the Express server:
npm run dev

STEP 5 - Frontend Setup:
Open a NEW terminal and navigate to the frontend directory:
cd frontend
npm install

STEP 6:
Start the React app:
npm start

STEP 7:
The platform opens automatically at http://localhost:3000

========================================================
8. HOW TO USE THE PROJECT
========================================================

--------------------------------------------------------
A. CREATOR / INVESTOR FLOW
--------------------------------------------------------

STEP 1: Landing Page
- Navigate to the Home Page and explore initial offerings.

STEP 2: Authentication
- Go to "Sign Up" and select your specific role (Creator or Investor).
- Follow up by logging in.

STEP 3: Dashboard Navigation
- You are strictly routed to either creator/CreatorDashboard or investor/InvestorDashboard based on your User model role.
- From here, view your active insights and notifications.

STEP 4: Manage Ideas
- Use "Submit Idea" to draft new content.
- Navigate to "Browse" to find ideas, click an idea to view IdeaDetailPage and leave "Comments" or "Likes".

STEP 5: Investments
- Investors can interact with the Payment subsystem to fund Creator ideas. Payment workflows are tracked natively in the platform.

--------------------------------------------------------
B. ADMIN FLOW
--------------------------------------------------------

STEP 1: Admin Privileges
- Log in with a user configured with an 'admin' role in MongoDB.
- You are routed to admin/AdminDashboard.

STEP 2: Overview & Moderation
- Access "Manage Users" to review or suspend profiles.
- Access "Manage Ideas" to moderate public content.
- Send "Warnings" to users violating terms of service.
- Audit the "Payments" ledger to ensure investment transactional integrity.

========================================================
9. DATABASE COLLECTIONS
========================================================

Based directly on backend/models:
- Users: Credentials, strict role designations, profile data.
- Ideas: Target amounts, raised amounts, active status, creator referencing.
- Comments & Likes: Social engagement linking Users to Ideas.
- Payments: Investment history linking Investors, Creators, and Ideas.
- Notifications: System alerts sent dynamically to Users.
- Warnings: Red flags administered by Admins.

========================================================
10. TROUBLESHOOTING
========================================================

Common issues resolved:
- "User Not Found / Auth Failed": Clear local browser storage, tokens might be expired. Database wipes mean you must re-register.
- "CORS Errors / proxy issues": Ensure React proxy ("proxy": "http://localhost:5000") matches backend .env PORT.
- "Missing Modules": Verify npm install completed successfully in BOTH frontend/ and backend/.

========================================================
CONCLUSION
========================================================

Ideanomics Hub perfectly partitions experiences for Creators, Investors, and Admins.
Through separated dashboards and cleanly architected MERN stack data models,
it provides an intelligent space for idea discovery, capital injection,
and long-term collaborative business growth.

========================================================
END OF README
========================================================
