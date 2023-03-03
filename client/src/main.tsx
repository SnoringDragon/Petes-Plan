import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import App from './App';
import './index.scss';
import { Dashboard } from './pages/dashboard/dashboard';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Homepage } from './pages/homepage/homepage';
import { PasswordReset } from './pages/password-reset/password-reset';
import { Verification } from './pages/verification/verification';
import { ChangePassword } from './pages/change-password/change-password';
import { Future_Plan_Study } from './pages/future_plan_study/future_plan_study';
import { Modify_Future_Plan_Study } from './pages/modify_future_plan_study/modify_future_plan_study';
import { Course_Description } from './pages/course_description/course_description';
import { Modify_Profile_Page } from './pages/modify_profile_page/modify_profile_page';
import { Profile_Page } from './pages/profile_page/profile_page';
import { AP_Class } from './pages/ap_class/ap_class';
import { Major_Requirements } from './pages/major_requirements/major_requirements';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [{
      index: true,
      element: <Homepage />
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
      path: '/future_plan_study',
      element: <Future_Plan_Study />
    },
    {
      path: "/modify_future_plan_study",
      element: <Modify_Future_Plan_Study />
    },
    {
      path: "/course_description",
      element: <Course_Description />
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
    }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
