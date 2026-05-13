import { motion } from 'framer-motion'

// Component for an individual video card with hover animations
const VideoCard = ({ index }) => (
  <motion.div 
    // Animation properties: fade in and slide up when loading
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }} // Staggered delay based on index
    className="flex flex-col gap-3 cursor-pointer group"
  >
    {/* Thumbnail Container */}
    <div className="relative aspect-video rounded-xl overflow-hidden bg-white/5">
      <img 
        src={`https://picsum.photos/seed/${index + 123}/640/360`} 
        alt="Thumbnail" 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      {/* Video Duration Badge */}
      <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-bold">
        12:45
      </div>
    </div>

    {/* Video Metadata (Avatar, Title, Channel, Views) */}
    <div className="flex gap-3">
      {/* Channel Avatar */}
      <div className="w-9 h-9 rounded-full bg-white/10 flex-shrink-0 overflow-hidden">
        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${index}`} alt="Avatar" />
      </div>
      <div className="flex flex-col gap-1">
        {/* Video Title */}
        <h3 className="text-sm font-semibold leading-tight line-clamp-2">
          Modern UI Design in 2026: Creating Premium Experiences with Framer Motion and Tailwind
        </h3>
        {/* Channel Name */}
        <p className="text-xs text-secondary hover:text-white transition-colors">Design Academy</p>
        {/* Statistics */}
        <p className="text-[11px] text-secondary">1.2M views • 2 hours ago</p>
      </div>
    </div>
  </motion.div>
)

// Main Home page component rendering a grid of videos
const Home = () => {
  return (
    // Responsive grid layout (changes column count based on screen size)
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-10 gap-x-4">
      {/* Mocking a list of 20 videos for demonstration */}
      {Array.from({ length: 20 }).map((_, i) => (
        <VideoCard key={i} index={i} />
      ))}
    </div>
  )
}

export default Home
