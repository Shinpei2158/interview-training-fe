# Interview Training Platform - Frontend (React + Vite)

This is the frontend client for the **Interview Training Platform**, built with **React (v19)**, **Vite**, and **Tailwind CSS v4**. It offers a responsive, interactive user interface for practice quizzes, interviewer search, scheduling, and live mock interview calls.

---

## Main Features

1. **Authentication & Access Control**:
   - Clean forms for Login, Registration, Password Recovery, and Email OTP validation.
   - Quick login using **Google OAuth2** via `@react-oauth/google`.
   - Client-side route protection using Route Guards: `ProtectedRoute` (logged-in users), `GuestRoute` (logged-out users), and `AdminRoute` (admins).

2. **Personal Dashboards & Stats**:
   - Beautiful, interactive statistics showing candidate progress, test history, and category strengths using **Recharts**.
   - Specialized dashboards for Candidates, Interviewers, and Admins.

3. **Practice Quiz Engine**:
   - Interactive, timed multiple-choice quiz runner with countdown timers.
   - Immediate grading, detailed score calculation, and explanations for correct/incorrect answers.
   - Interactive features: like quizzes, submit ratings, and bookmark questions to review later.

4. **Search & Schedule Mock Interviews**:
   - Filter interviewers by keywords or specific skills (`SubCategory`).
   - View detailed interviewer profiles, ratings, and resumes.
   - Weekly scheduler interface (`BookingCalendarGrid`) to view free time slots and book a session instantly.

5. **Integrated Video Calling (Virtual Room)**:
   - Built-in video and audio rooms using the **Stringee Web SDK**.
   - Control buttons to mute audio, toggle camera, and monitor connection status directly in your browser.

6. **Post-Interview Assessments**:
   - Interviewers can fill out candidate performance reviews (scores for soft skills, technical expertise, and detailed notes).
   - Candidates can rate their experience with the interviewer.

7. **Real-time Alerts**:
   - A notification bell component (`NotificationBell`) connected to WebSockets.
   - Instant alerts for updates on bookings, reviews, or messages.

8. **Admin Operations**:
   - Management tables for users (block/unblock, edit roles).
   - Quiz and question creators to update the test bank.
   - Panel to review reported bug logs and user disputes.

---

## Tech Stack & Libraries

- **Core Library**: React 19
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS v4, Lucide React, React Icons
- **Data Fetching & State**: React Query (@tanstack/react-query v5), Axios
- **Animations**: Framer Motion (motion v12)
- **Routing**: React Router DOM v7
- **Charts**: Recharts v3
- **Google Auth**: @react-oauth/google v0.13
- **Language**: JavaScript / TypeScript

---

## Source Folder Structure (`src`)

```text
src
├── main.jsx                       # App entry point
├── App.jsx                        # Routing and base setup
├── App.css & index.css            # Global stylesheets (Tailwind v4 imports)
├── api/                           # API request services (Axios client calls)
│   ├── admin.js
│   ├── auth.js
│   ├── quiz.js
│   └── ...
├── components/                    # UI Components
│   ├── booking-calendar/          # Calendars, time slot grids, request panels
│   ├── bookings/                  # Booking tables, detail modals
│   ├── common/                    # Reusable items (BackButton, PageHeader...)
│   ├── dashboard/                 # Candidate & Interviewer dashboards
│   ├── feedback/                  # Evaluation and rating forms
│   └── ...
├── config/                        # API client setup and environment configurations
├── context/                       # Global context (e.g. Toast notifications)
├── hooks/                         # Custom React hooks (useAuth, useQuiz, useNotificationSocket...)
├── layouts/                       # Main layout wrapper (Navbar, Sidebar, Footer)
├── pages/                         # Application Pages
│   ├── admin/                     # Admin dashboard, user management pages
│   └── user/                      # Candidate/Interviewer pages (Scheduler, Room, Quiz...)
├── polyfills/                     # Web compatibility layers
├── styles/                        # Custom CSS/Stylesheets
└── utils/                         # Helper functions (time formatting, errors, validation)
```

---

## Local Development Setup

### 1. Requirements

- **Node.js** (Version **v18** or **v20+** is recommended; compatible with v22).
- **npm** (included with Node.js).

### 2. Environment Setup

Create a `.env` file in the `fe/` directory:

```env
VITE_API_BASE_URL=http://localhost:3333
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

_Note: Make sure your `VITE_GOOGLE_CLIENT_ID` matches your Google Cloud Console credential._

### 3. Installation & Run

Navigate to the `fe/` folder in your terminal:

- **Install dependencies**:

  ```bash
  npm install
  ```

- **Start local development server**:

  ```bash
  npm run dev
  ```

  The app will run locally, usually at: **`http://localhost:5173`**

- **Build production assets**:

  ```bash
  npm run build
  ```

  Compiled, optimized HTML, JS, and CSS files will be output to the `dist/` directory.

- **Preview production build locally**:
  ```bash
  npm run preview
  ```

---

## Docker Deployment

The frontend contains a [Dockerfile](file:///d:/interview-training-platform/fe/Dockerfile) designed for production environments:

1. **Build Stage**: Uses `node:22-alpine` to compile files into `dist/`.
2. **Nginx Web Server**: Serves the static assets.
3. **Reverse Proxy Configuration**: The [nginx.conf](file:///d:/interview-training-platform/fe/nginx.conf) maps paths like `/api` and `/ws-notifications` back to the backend container, preventing CORS issues.

- **Build Docker image**:
  ```bash
  docker build -t interview-frontend .
  ```
- **Run container**:
  ```bash
  docker run -d -p 80:80 --name my-frontend interview-frontend
  ```
