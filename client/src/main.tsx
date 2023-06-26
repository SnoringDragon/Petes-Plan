import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import App from './App';
import './index.scss';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { AllReq } from './pages/all_req/all_req';
import { AP_Class } from './pages/ap_class/ap_class';
import { ChangePassword } from './pages/change-password/change-password';
import { ClassHistory } from './pages/classhistory/classhistory';
import { CourseInstructorSearch } from './pages/course-search/course-instructor-search';
import { Course_Description } from './pages/course_description/course_description';
import { Dashboard } from './pages/dashboard/dashboard';
import { FuturePlan } from './pages/futureplan/futureplan';
import { GradeCalc } from './pages/grade-calc/grade-calc';
import { GraduationRequirements } from './pages/graduation-reqs/graduation-reqs';
import { Instructor } from './pages/instructor/instructor';
import { Login } from './pages/login/login';
import { Major_Requirements } from './pages/major_requirements/major_requirements';
import { Modify_Profile_Page } from './pages/modify_profile_page/modify_profile_page';
import { PasswordReset } from './pages/password-reset/password-reset';
import { Professor_Page } from './pages/professor_page/professor_page';
import { Profile_Page } from './pages/profile_page/profile_page';
import { Register } from './pages/register/register';
import { Section_Info } from './pages/section-info/section-info';
import { SemesterCalendar } from './pages/semester-calendar/semester-calendar';
import { SharedReq } from './pages/shared_req/shared_req';
import { TotalDeg } from './pages/total_deg/total_deg';
import { Verification } from './pages/verification/verification';
import { VerifyEmail } from './pages/verify-email/verify-email';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [{
      index: true,
      element: <FuturePlan />
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/register',
      element: <Register />
    },
    {
      path: '/verify-email',
      element: <VerifyEmail />
    },
    {
      path: '/dashboard',
      element: <Dashboard />
    },
    {
      path: "/password-reset",
      element: <PasswordReset />
    },
    {
      path: "/verification",
      element: <Verification />
    },
    {
      path: "/change-password",
      element: <ChangePassword />
    },
    {
      path: "/course_description",
      element: <Course_Description />
    },
    {
      path: '/course-search',
      element: <CourseInstructorSearch />
    },
    {
      path: "/profile_page",
      element: <Profile_Page />
    },
    {
      path: "/modify_profile_page",
      element: <Modify_Profile_Page />
    },
    {
      path: "/ap_class",
      element: <AP_Class />
    },
    {
      path: "/major_requirements",
      element: <Major_Requirements />
    },
    {
      path: "/class-history",
      element: <ClassHistory />
    },
    {
      path: "/future-plan",
      element: <FuturePlan />
    },
    {
      path: "/all-req",
      element: <AllReq />
    },
    {
      path: "/grade-calc",
      element: <GradeCalc />
    },
    {
      path: "/section-info",
      element: <Section_Info />
    },
    {
      path: "/instructor",
      element: <Instructor />
    },
    {
      path: "/shared-req",
      element: <SharedReq />
    },
    {
      path: "/total-degree",
      element: <TotalDeg />
    },
    {
      path: "/professor",
      element: <Professor_Page />
    },
    {
      path:'/graduation-requirements',
      element: <GraduationRequirements />
    },
    {
      path: '/admin',
      children: [{
        index: true,
        element: <AdminDashboard />
      }]
    },
    {
      path: '/calendar',
      element: <SemesterCalendar />
    }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
