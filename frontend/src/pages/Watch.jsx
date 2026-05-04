import { useParams } from 'react-router-dom'
import { ThumbsUp, ThumbsDown, Share2, MoreHorizontal, MessageSquare } from 'lucide-react'

const Watch = () => {
  const { id } = useParams()

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-[1700px] mx-auto">
      <div className="flex-1">
        <div className="aspect-video w-full rounded-2xl bg-black overflow-hidden shadow-2xl">
          <video 
            className="w-full h-full object-contain" 
            controls 
            autoPlay
            src="https://www.w3schools.com/html/mov_bbb.mp4"
          />
        </div>
        
        <div className="mt-4 space-y-4">
          <h1 className="text-xl font-bold leading-tight">
            Big Buck Bunny - An Open Source Short Movie
          </h1>
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Blender" alt="Channel" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm">Blender Foundation</span>
                <span className="text-xs text-secondary">1.5M subscribers</span>
              </div>
              <button className="ml-4 bg-white text-black px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-white/90 transition-colors">
                Subscribe
              </button>
            </div>

            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full p-1">
              <div className="flex items-center gap-2 px-3 py-1 hover:bg-white/10 rounded-l-full cursor-pointer transition-colors border-r border-white/10">
                <ThumbsUp size={18} />
                <span className="text-sm font-medium">124K</span>
              </div>
              <div className="px-3 py-1 hover:bg-white/10 rounded-r-full cursor-pointer transition-colors">
                <ThumbsDown size={18} />
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 text-sm">
            <div className="flex gap-3 font-semibold mb-2">
              <span>1.2M views</span>
              <span>2 years ago</span>
            </div>
            <p className="text-primary/90 whitespace-pre-wrap">
              Big Buck Bunny tells the story of a giant rabbit with a heart bigger than himself. 
              When one sunny day three rodents rudely harass him, something snaps... and the rabbit takes the situation into his own hands!
            </p>
          </div>
        </div>
      </div>

      <div className="lg:w-[400px] space-y-4">
        <h3 className="font-bold text-sm">Related Videos</h3>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex gap-2 group cursor-pointer">
            <div className="w-40 h-24 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
              <img 
                src={`https://picsum.photos/seed/${i + 500}/320/180`} 
                alt="Thumbnail" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-semibold line-clamp-2 leading-tight">
                Epic Blender Animation: How Big Buck Bunny Was Made
              </h4>
              <p className="text-xs text-secondary">Tech Insider</p>
              <p className="text-[11px] text-secondary">450K views • 1 year ago</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Watch
