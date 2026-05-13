import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ThumbsUp, ThumbsDown, Share2, MoreHorizontal, MessageSquare, Play } from 'lucide-react'
import api from '../api/axios'

const Watch = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [video, setVideo] = useState(null)
  const [relatedVideos, setRelatedVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [videoRes, allVideosRes] = await Promise.all([
          api.get(`/videos/${id}`),
          api.get('/videos')
        ])
        setVideo(videoRes.data)
        setRelatedVideos(allVideosRes.data.filter(v => v.id !== parseInt(id)))
      } catch (err) {
        console.error("Failed to fetch video data", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (loading) return <div className="p-10 text-center text-secondary">Loading content...</div>
  if (!video) return <div className="p-10 text-center text-red-400">Content not found</div>

  const videoSrc = `http://localhost:8000/${video.video_url.replace(/\\/g, '/')}`

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-[1700px] mx-auto pb-10 px-4 md:px-0">
      {/* Main Video Section */}
      <div className="flex-1">
        <div className="aspect-video w-full rounded-3xl bg-black overflow-hidden shadow-2xl border border-white/5 relative group">
          <video 
            key={videoSrc}
            className="w-full h-full object-contain" 
            controls 
            autoPlay
            src={videoSrc}
          />
        </div>
        
        <div className="mt-6 space-y-4">
          <h1 className="text-3xl font-black leading-tight tracking-tight">{video.title}</h1>
          
          <div className="flex flex-wrap items-center justify-between gap-6 py-2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-xl shadow-lg">
                {video.channel_id ? 'C' : 'U'}
              </div>
              <div className="flex flex-col">
                <span className="font-black text-base">Channel {video.channel_id || 'Official'}</span>
                <span className="text-[11px] font-bold text-secondary uppercase tracking-widest">0 subscribers</span>
              </div>
              <button className="ml-8 bg-white text-black px-8 py-2.5 rounded-full text-sm font-black hover:bg-white/90 transition-all active:scale-95 shadow-xl">
                Subscribe
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-1 shadow-inner">
                <button className="flex items-center gap-2 px-5 py-2 hover:bg-white/10 rounded-l-full transition-colors border-r border-white/10 group">
                  <ThumbsUp size={20} className="group-active:scale-125 transition-transform" />
                  <span className="text-sm font-bold">0</span>
                </button>
                <button className="px-5 py-2 hover:bg-white/10 rounded-r-full transition-colors group">
                  <ThumbsDown size={20} className="group-active:scale-125 transition-transform" />
                </button>
              </div>
              <button className="flex items-center gap-2 px-6 py-2.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors font-bold text-sm">
                <Share2 size={18} />
                Share
              </button>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/[0.07] transition-all cursor-pointer shadow-sm group">
            <div className="flex gap-4 font-black mb-2 text-sm tracking-tight">
              <span>{video.views || 0} views</span>
              <span className="text-secondary opacity-50">•</span>
              <span>{video.created_at ? new Date(video.created_at).toLocaleDateString() : 'Just now'}</span>
            </div>
            <p className="text-primary/90 whitespace-pre-wrap leading-relaxed text-sm font-medium">
              {video.description || 'No description provided.'}
            </p>
          </div>
        </div>
      </div>

      {/* Sidebar: Related Videos */}
      <div className="lg:w-[420px] space-y-6">
        <h3 className="font-black text-xs uppercase tracking-[0.2em] text-secondary flex items-center gap-3 ml-2">
          <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></div>
          Related Videos
        </h3>
        <div className="space-y-4">
          {relatedVideos.length > 0 ? (
            relatedVideos.map((rv, i) => (
              <div 
                key={rv.id} 
                className="flex gap-4 group cursor-pointer p-2 rounded-2xl hover:bg-white/5 transition-all"
                onClick={() => navigate(`/watch/${rv.id}`)}
              >
                <div className="w-44 h-24 rounded-2xl overflow-hidden bg-white/5 flex-shrink-0 border border-white/5 group-hover:border-white/20 transition-all shadow-md">
                  <img 
                    src={rv.thumbnail_url || `https://picsum.photos/seed/${rv.id + 500}/320/180`} 
                    alt={rv.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="flex flex-col gap-1.5 py-1 flex-1">
                  <h4 className="text-[13px] font-black line-clamp-2 leading-snug group-hover:text-accent transition-colors">
                    {rv.title}
                  </h4>
                  <div>
                    <p className="text-[11px] font-bold text-secondary uppercase tracking-tighter">Channel {rv.channel_id}</p>
                    <p className="text-[10px] font-bold text-secondary/60 uppercase">{rv.views || 0} views</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
              <p className="text-xs text-secondary font-bold uppercase tracking-widest italic">No related videos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Watch
