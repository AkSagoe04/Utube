import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { Tv, Sparkles } from 'lucide-react'

const CreateChannel = () => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { refreshUser } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Beginners: We send the channel name and description to our backend
      const response = await api.post('/channels', { name, description })
      
      // Beginners: After creating the channel, we update the user data in the app
      await refreshUser()
      
      // Redirect to the newly created channel
      navigate(`/channel/${response.data.id}`)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create channel')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-surface border border-white/10 rounded-2xl shadow-2xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-accent/20 rounded-xl text-accent">
          <Tv size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Create your channel</h1>
          <p className="text-secondary">Start your journey as a content creator on Utube</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-secondary">Channel Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. My Awesome Tech Channel"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-secondary">Description (Optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell your viewers what your channel is about..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all min-h-[120px] resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent hover:bg-accent-hover text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {loading ? (
            'Creating...'
          ) : (
            <>
              <Sparkles size={20} className="group-hover:animate-pulse" />
              Create Channel
            </>
          )}
        </button>
      </form>

    </div>
  )
}

export default CreateChannel
