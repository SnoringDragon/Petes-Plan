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
import { ClassHistory } from './pages/classhistory/classhistory';

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
        path: "/class-history",
        element: <ClassHistory />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
