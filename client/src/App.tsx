import { Outlet } from 'react-router-dom';
import './App.scss'
import { HeaderBar } from './components/header-bar/header-bar';

function App() {
  return (
    <div className="flex flex-col h-full bg-zinc-700 text-slate-200">
      <HeaderBar />
        <Outlet />
    </div>
  )
}

export default App
