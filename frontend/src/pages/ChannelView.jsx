import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { Tv, Users, Play, Calendar, Upload } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const ChannelView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [channel, setChannel] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  // Beginners: Check if the person viewing the page is the one who OWNS the channel
  const isOwner = user && channel && user.id === channel.user_id

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        const [channelRes, videosRes] = await Promise.all([
          api.get(`/channels/${id}`),
          api.get(`/channels/${id}/videos`)
        ])
        setChannel(channelRes.data)
        setVideos(videosRes.data)
      } catch (err) {
        console.error('Failed to fetch channel data', err)
      } finally {
        setLoading(false)
      }
    }
    fetchChannelData()
  }, [id])

  if (loading) return <div className="flex justify-center mt-20 text-secondary">Loading channel details...</div>
  if (!channel) return <div className="text-center mt-20 text-red-400">Channel not found</div>

  return (
    <div className="max-w-6xl mx-auto pb-10 px-4 md:px-0">
      {/* Channel Header / Banner Area */}
      <div className="relative group">
        <div className="h-48 md:h-64 bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-purple-900/40 rounded-[2.5rem] overflow-hidden backdrop-blur-sm border border-white/10 shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(37,99,235,0.2),transparent)]"></div>
        </div>
        
        {/* Channel Info Overlay */}
        <div className="flex flex-col md:flex-row items-center gap-6 px-10 -mt-16 relative z-10">
          <div className="w-32 h-32 md:w-44 md:h-44 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-full border-8 border-background flex items-center justify-center text-5xl font-bold shadow-2xl ring-1 ring-white/10">
            {channel.name[0].toUpperCase()}
          </div>
          <div className="text-center md:text-left mt-4 md:mt-16 flex-1">
            <h1 className="text-4xl font-black mb-2 tracking-tight">{channel.name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-xs font-bold text-secondary uppercase tracking-widest">
              <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                <Users size={14} className="text-blue-400" />
                0 subscribers
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                <Play size={14} className="text-red-400" />
                {videos.length} videos
              </span>
              <span className="flex items-center gap-1.5 opacity-60">
                <Calendar size={14} />
                Joined {new Date(channel.created_at).toLocaleDateString()}
              </span>
            </div>
            {channel.description && (
              <p className="mt-4 text-secondary/80 max-w-2xl line-clamp-2 md:line-clamp-none text-sm leading-relaxed">
                {channel.description}
              </p>
            )}
          </div>
          
          <div className="mt-4 md:mt-20">
             {/* Beginners: If it's your channel, you see 'Upload Video' instead of 'Subscribe' */}
             {isOwner ? (
               <button 
                onClick={() => navigate('/upload')}
                className="bg-accent text-white font-bold px-10 py-3 rounded-full hover:bg-accent-hover transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2"
               >
                 <Upload size={18} />
                 Upload Video
               </button>
             ) : (
               <button className="bg-white text-black font-bold px-10 py-3 rounded-full hover:bg-white/90 transition-all shadow-xl hover:scale-105 active:scale-95">
                 Subscribe
               </button>
             )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 mt-16 px-4">
        <button className="px-8 py-4 border-b-2 border-accent font-bold text-sm tracking-widest text-accent">VIDEOS</button>
        <button className="px-8 py-4 text-secondary font-bold text-sm hover:text-white transition-colors tracking-widest uppercase">About</button>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-6">
        {videos.length > 0 ? (
          videos.map(video => (
            <div 
              key={video.id} 
              className="group cursor-pointer"
              onClick={() => navigate(`/watch/${video.id}`)}
            >
              <div className="aspect-video bg-white/5 rounded-2xl overflow-hidden mb-4 border border-white/5 group-hover:border-white/20 transition-all shadow-lg">
                <img 
                  src={video.thumbnail_url || `https://picsum.photos/seed/${video.id}/640/360`} 
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="px-1">
                <h3 className="font-bold line-clamp-2 group-hover:text-accent transition-colors mb-1 text-sm leading-snug">{video.title}</h3>
                <p className="text-[11px] text-secondary font-medium uppercase tracking-wider">
                  {video.views} views • {new Date(video.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-24 text-center text-secondary">
             <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
               <Tv size={32} className="opacity-40" />
             </div>
             <p className="text-xl font-bold text-white mb-2">No videos yet</p>
             <p className="text-sm max-w-xs mx-auto mb-8">This channel hasn't uploaded any content yet. Subscribe to stay updated!</p>
             
             {isOwner && (
               <button 
                onClick={() => navigate('/upload')}
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold px-8 py-2.5 rounded-xl transition-all"
               >
                 Upload your first video
               </button>
             )}
          </div>
        )}
      </div>

    </div>
  )
}

export default ChannelView
