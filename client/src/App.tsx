import { Outlet } from 'react-router-dom';
import './App.scss'
import { Sidebar } from './components/sidebar/sidebar';
import { HeaderBar } from './components/header-bar/header-bar';

function App() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col w-full  ">
        <HeaderBar />
        <div className="h-100 p-4 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default App
