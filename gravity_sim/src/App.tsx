import './App.css'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
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

export default App;
