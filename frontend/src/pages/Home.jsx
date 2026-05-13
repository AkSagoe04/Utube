import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

// Beginners: This component represents a single video card on the homepage
const VideoCard = ({ video, index }) => {
  const navigate = useNavigate()
  
  if (!video) return null

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index || 0) * 0.05 }}
      className="flex flex-col gap-3 cursor-pointer group"
      onClick={() => video.id && navigate(`/watch/${video.id}`)}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/5 group-hover:border-white/20 transition-all shadow-lg">
        <img 
          src={video.thumbnail_url || `https://picsum.photos/seed/${(video.id || 0) + 123}/640/360`} 
          alt={video.title || 'Video'} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-bold">
          10:00
        </div>
      </div>

      {/* Video Metadata */}
      <div className="flex gap-3 px-1">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex-shrink-0 overflow-hidden border border-white/10">
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${video.channel_id || index || 0}`} alt="Avatar" />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-bold leading-tight line-clamp-2 group-hover:text-accent transition-colors">
            {video.title || 'Untitled Video'}
          </h3>
          <p className="text-xs text-secondary hover:text-white transition-colors">
            Channel {video.channel_id || 'Official'}
          </p>
          <p className="text-[11px] text-secondary">
            {video.views || 0} views • {video.created_at ? new Date(video.created_at).toLocaleDateString() : 'Just now'}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

const MOCK_VIDEOS = [
  {
    id: 'mock-1',
    title: 'Modern Architecture in the Digital Age',
    thumbnail_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
    channel_id: 'ArchDesign',
    views: '1.2M',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'mock-2',
    title: 'The Future of AI: What to Expect in 2026',
    thumbnail_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop',
    channel_id: 'TechPulse',
    views: '850K',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'mock-3',
    title: 'Secret Travel Destinations You Must Visit',
    thumbnail_url: 'https://images.unsplash.com/photo-1506929194767-36a7ae7fd2ec?q=80&w=2070&auto=format&fit=crop',
    channel_id: 'Wanderlust',
    views: '3.4M',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString()
  },
  {
    id: 'mock-4',
    title: 'Deep House Mix 2026 | Summer Vibes',
    thumbnail_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop',
    channel_id: 'SoundWaves',
    views: '520K',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'mock-5',
    title: 'Mastering the Art of Digital Painting',
    thumbnail_url: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=1972&auto=format&fit=crop',
    channel_id: 'CreativeMind',
    views: '210K',
    created_at: new Date(Date.now() - 86400000 * 15).toISOString()
  },
  {
    id: 'mock-6',
    title: 'Exploring the Deep Ocean: New Discoveries',
    thumbnail_url: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?q=80&w=2070&auto=format&fit=crop',
    channel_id: 'OceanX',
    views: '4.1M',
    created_at: new Date(Date.now() - 86400000 * 30).toISOString()
  }
]

const Home = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await api.get('/videos')
        // Ensure we always have an array
        setVideos(Array.isArray(response.data) ? response.data : [])
      } catch (err) {
        console.error("Error fetching videos:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchVideos()
  }, [])

  if (loading) return <div className="p-10 text-center text-secondary">Loading the latest videos...</div>

  // Use mock videos if the database is empty
  const displayVideos = videos.length > 0 ? videos : MOCK_VIDEOS

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-10 gap-x-4 pb-10">
      {displayVideos.map((video, i) => (
        <VideoCard key={video.id || i} video={video} index={i} />
      ))}
    </div>
  )
}

export default Home
