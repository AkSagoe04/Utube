import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload as UploadIcon, FileVideo, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import api from '../api/axios'

const Upload = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('') // 'idle' | 'uploading' | 'success' | 'error'
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0])
      // Auto-fill title from filename if empty
      if (!title) setTitle(e.target.files[0].name.split('.')[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return
    
    setLoading(true)
    setStatus('uploading')
    setError('')

    // Beginners: When uploading files, we use FormData to package the file and other data
    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', title)
    formData.append('description', description)

    try {
      await api.post('/videos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      setStatus('success')
      // Redirect after a short delay
      setTimeout(() => navigate('/'), 2000)
    } catch (err) {
      setStatus('error')
      setError(err.response?.data?.detail || 'Failed to upload video')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-8 border border-green-500/20 shadow-[0_0_50px_rgba(34,197,94,0.2)]"
        >
          <CheckCircle2 size={56} />
        </motion.div>
        <h2 className="text-4xl font-black mb-4 tracking-tight">Upload Success!</h2>
        <p className="text-secondary text-lg max-w-md mx-auto mb-10">
          Your video has been published and is now visible to the community.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="bg-white text-black font-bold px-10 py-4 rounded-full hover:bg-white/90 transition-all shadow-xl hover:scale-105 active:scale-95"
        >
          Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <div className="bg-surface border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-blue-500 to-purple-600"></div>
        <div className="p-8 border-b border-white/10 flex justify-between items-center">
          <h1 className="text-3xl font-black tracking-tight">Upload Video</h1>
          <button 
            onClick={() => navigate(-1)}
            className="text-secondary hover:text-white transition-colors font-bold text-sm uppercase tracking-widest"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left Column: File Selection */}
          <div className="space-y-6">
            <div 
              className={`border-2 border-dashed rounded-[2rem] p-12 flex flex-col items-center justify-center text-center transition-all ${
                file ? 'border-accent bg-accent/5' : 'border-white/10 hover:border-white/20'
              }`}
            >
              {file ? (
                <>
                  <div className="w-20 h-20 bg-accent/20 rounded-2xl flex items-center justify-center text-accent mb-6 shadow-xl rotate-3">
                    <FileVideo size={40} />
                  </div>
                  <p className="font-bold text-lg truncate max-w-full px-4 mb-1">{file.name}</p>
                  <p className="text-xs text-secondary font-bold uppercase tracking-tighter">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  <button 
                    type="button"
                    onClick={() => setFile(null)}
                    className="mt-6 text-xs text-red-400 font-bold hover:underline uppercase tracking-widest"
                  >
                    Change File
                  </button>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center text-secondary mb-6 border border-white/5">
                    <UploadIcon size={40} />
                  </div>
                  <p className="font-bold text-lg mb-2">Select video file</p>
                  <p className="text-sm text-secondary mb-8">MP4, WebM or MOV recommended</p>
                  <input 
                    type="file" 
                    accept="video/*"
                    onChange={handleFileChange}
                    className="hidden" 
                    id="video-upload"
                  />
                  <label 
                    htmlFor="video-upload"
                    className="bg-white text-black font-black px-10 py-3 rounded-full cursor-pointer hover:bg-white/90 transition-all shadow-lg active:scale-95"
                  >
                    Select File
                  </label>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Metadata */}
          <div className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-sm flex gap-3 animate-shake">
                <AlertCircle size={18} className="shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-secondary uppercase ml-1">Video Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your video a catchy title"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-accent outline-none transition-all text-sm font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-secondary uppercase ml-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this video about?"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-accent outline-none transition-all min-h-[180px] resize-none text-sm leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !file}
              className="w-full bg-accent hover:bg-accent-hover text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-accent/20 mt-4 active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Uploading Content...</span>
                </>
              ) : (
                <>
                  <UploadIcon size={20} />
                  <span>Publish Video</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Upload
