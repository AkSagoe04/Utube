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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-10 gap-x-4 pb-10">
      {videos && videos.length > 0 ? (
        videos.map((video, i) => (
          <VideoCard key={video.id || i} video={video} index={i} />
        ))
      ) : (
        <div className="col-span-full py-20 text-center">
          <p className="text-secondary text-lg">No videos found. Be the first to upload one!</p>
        </div>
      )}
    </div>
  )
}

export default Home
