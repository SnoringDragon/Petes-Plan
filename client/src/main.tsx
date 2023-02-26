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
import { Future_Plan_Study } from './pages/future_plan_study/future_plan_study';
import { Modify_Future_Plan_Study } from './pages/modify_future_plan_study/modify_future_plan_study';
import { Course_Description } from './pages/course_description/course_description';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [{
      index: true,
      element: <Dashboard />
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
    }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
