import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Watch from './pages/Watch'
import Login from './pages/Login'
import SchemaView from './pages/SchemaView'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

// Main application component that defines the overall layout and routing
function App() {
  return (
    // Top-level container with flexbox layout (column for navbar + content)
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Persistent Navigation Bar at the top */}
      <Navbar />
      
      {/* Sidebar and Main Content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Persistent Sidebar on the left */}
        <Sidebar />
        
        {/* Main scrollable area where pages are rendered */}
        <main className="flex-1 overflow-y-auto p-4 bg-background">
          <Routes>
            {/* Route definitions for different pages */}
            <Route path="/" element={<Home />} />           {/* Homepage with video grid */}
            <Route path="/watch/:id" element={<Watch />} />   {/* Video playback page */}
            <Route path="/login" element={<Login />} />       {/* User login/signup page */}
            <Route path="/schema" element={<SchemaView />} /> {/* Database schema visualization */}
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
