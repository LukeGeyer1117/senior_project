import { useState } from 'react'
import './App.css'
import { Routes, Route, Link } from 'react-router-dom';
import About from './pages/About';
import Scene from './pages/Scene';

function App() {
  return (
    <div className='h-full w-full'>
      {/* Navigation Menu */}
      <nav className="p-4 bg-base-200">
        <Link to="/" className="mr-4 btn btn-ghost">Home</Link>
        <Link to="/about" className="btn btn-ghost">About</Link>
        <Link to="/scene" className='btn btn-ghost'>Simulator</Link>
      </nav>

      {/* Route Definitions */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/scene" element={<Scene />}/>
      </Routes>
    </div>
  )
}

// Simple Home Component for demo
function Home() {
  return <div className='p-10 text-2xl'>Welcome Home!</div>;
}

export default App;
