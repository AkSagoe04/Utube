import { useState, useEffect } from 'react'
import api from '../api/axios'
import { motion } from 'framer-motion'
import { Database, Shield, Video, MessageSquare, ThumbsUp } from 'lucide-react'

function SchemaView() {
  const [schema, setSchema] = useState('')
  const [dbStatus, setDbStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schemaRes, dbRes] = await Promise.all([
          api.get('/api/schema'),
          api.get('/api/check-db')
        ])
        
        if (schemaRes.data.schema) {
          setSchema(schemaRes.data.schema)
        } else {
          setError(schemaRes.data.error || 'Failed to load schema')
        }
        
        setDbStatus(dbRes.data)
      } catch (err) {
        setError('Error connecting to backend')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      <p className="text-secondary animate-pulse">Loading Architecture...</p>
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-center">
        <p className="text-red-400 font-medium">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 text-xs bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">Retry</button>
      </div>
    </div>
  )

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto p-4 md:p-8"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Database Status</h1>
          <p className="text-secondary text-sm">Real-time connectivity & schema architecture</p>
        </div>
        <div className="flex items-center gap-3">
          {dbStatus && (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${
              dbStatus.status === 'online' 
                ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                dbStatus.status === 'online' ? 'bg-green-400' : 'bg-red-400'
              }`} />
              {dbStatus.status}
            </div>
          )}
          <div className="flex gap-2">
            <span className="px-4 py-1.5 bg-accent/10 text-accent rounded-full text-xs font-bold border border-accent/20">SQLModel</span>
            <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 rounded-full text-xs font-bold border border-blue-500/20">PostgreSQL</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Code View */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-[#121212] rounded-2xl border border-white/5 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                </div>
                <span className="text-[10px] font-mono text-secondary uppercase tracking-widest">schema.sql</span>
              </div>
              <pre className="p-6 overflow-x-auto text-sm font-mono leading-relaxed scrollbar-thin scrollbar-thumb-white/10">
                <code className="text-zinc-300">
                  {schema}
                </code>
              </pre>
            </div>
          </div>
        </div>

        {/* Breakdown Cards */}
        <div className="space-y-4">
          <BreakdownCard 
            icon={<Shield size={20} className="text-red-400" />}
            title="Authentication"
            desc="Encrypted password hashing and unique user constraints."
          />
          <BreakdownCard 
            icon={<Video size={20} className="text-blue-400" />}
            title="Video Storage"
            desc="Metadata mapping for video files, thumbnails, and ownership."
          />
          <BreakdownCard 
            icon={<MessageSquare size={20} className="text-green-400" />}
            title="Interactions"
            desc="Relational mapping for comments and user-video engagement."
          />
          <BreakdownCard 
            icon={<ThumbsUp size={20} className="text-orange-400" />}
            title="Engagement"
            desc="Optimized indexing for likes, dislikes, and view counts."
          />
        </div>
      </div>
    </motion.div>
  )
}

const BreakdownCard = ({ icon, title, desc }) => (
  <div className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
    <div className="mb-3">{icon}</div>
    <h3 className="font-semibold text-sm mb-1 group-hover:text-accent transition-colors">{title}</h3>
    <p className="text-xs text-secondary leading-relaxed">{desc}</p>
  </div>
)

export default SchemaView
