import { useState } from 'react'
import './App.css'
import { Routes, Route, Link } from 'react-router-dom';
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
  return <div className='p-10 text-2xl'>Welcome Home!</div>;
}

export default App;
