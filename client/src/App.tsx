import { Outlet } from 'react-router-dom';
import './App.scss'
import { HeaderBar } from './components/header-bar/header-bar';

function App() {
  return (
    <div className="flex flex-col h-full">
      <HeaderBar />
        <Outlet />
    </div>
  )
}

export default App
