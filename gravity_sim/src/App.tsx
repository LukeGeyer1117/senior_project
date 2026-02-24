import './App.css'
import { Routes, Route, Link } from 'react-router-dom'; // 1. Import Link
import About from './pages/About';
import Scene from './pages/Scene';
import GridTest from './pages/GridTest';

function App() {
  return (
    <div className='h-full w-full'>
      {/* Route Definitions */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/scene" element={<Scene />}/>
        <Route path="/gridtest" element={<GridTest />}/>
      </Routes>
    </div>
  )
}

// Simple Home Component for demo
function Home() {
  return (
    <div className='p-10 flex flex-col items-start gap-6'>
      <div className='text-2xl'>Welcome Home!</div>
      
      {/* 2. Add the Link styled as a button */}
      <Link 
        to="/scene" 
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow transition-colors"
      >
        Launch Gravity Simulator
      </Link>
    </div>
  );
}

export default App;
