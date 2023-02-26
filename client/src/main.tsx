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
import { SignUp } from './pages/sign_up/sign_up'
import { Register } from './pages/register/register';

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
      path: '/sign_up',
      element: <SignUp />
    }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
