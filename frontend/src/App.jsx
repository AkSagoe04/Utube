import { Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Home from './pages/Home'
import Watch from './pages/Watch'
import Login from './pages/Login'
import SchemaView from './pages/SchemaView'
import CreateChannel from './pages/CreateChannel'
import Upload from './pages/Upload'
import ChannelView from './pages/ChannelView'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

function App() {
  const { loading, user } = useAuth()

  // Simplified loading view
  if (loading) {
    return (
      <div style={{ height: '100vh', backgroundColor: '#0f0f0f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
        Loading...
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/watch/:id" element={<Watch />} />
            <Route path="/login" element={<Login />} />
            <Route path="/schema" element={<SchemaView />} />
            <Route path="/create-channel" element={<CreateChannel />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/channel/:id" element={<ChannelView />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
