import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';
import App from './App';
import './index.scss';
import { Dashboard } from './pages/dashboard/dashboard';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [{
            index: true,
            element: <Dashboard />
        }]
    }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
