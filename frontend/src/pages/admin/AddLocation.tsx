import { useState } from 'react';
import { Camera, MapPin, Plus, Loader2, CheckCircle } from 'lucide-react';

export default function AddLocation({ darkMode }: { darkMode: boolean }) {
  const [name, setName] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [cameraId, setCameraId] = useState(`CAM_${Math.floor(Math.random() * 10000)}`);
  const [videoPath, setVideoPath] = useState('media/carpv.mp4');

  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState({ slots: 0 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !lat || !lng || !cameraId || !videoPath) {
      setMessage('Please fill out all fields.');
      setStatus('error');
      return;
    }

    setStatus('running');
    setMessage('OpenCV window launched on your machine! Please draw boxes for slots and press "q" in the window when done.');

    try {
      const response = await fetch('http://localhost:3001/api/parking-locations/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          gps_lat: lat,
          gps_lng: lng,
          camera_id: cameraId,
          video_path: videoPath
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to setup location');

      setStatus('success');
      setStats({ slots: data.slots });
      setMessage(`Successfully saved ${data.slots} slots for location "${name}"!`);
      setTimeout(() => {
        setName(''); setLat(''); setLng('');
        setCameraId(`CAM_${Math.floor(Math.random() * 10000)}`);
        setStatus('idle');
      }, 5000);

    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setMessage(err.message || 'An error occurred during setup');
    }
  };

  return (
    <div className={`max-w-2xl mx-auto ${darkMode ? 'dark' : ''} animate-fade-in`}>
      <div className="glassmorphism dark:glassmorphism rounded-2xl p-8 box-glow-cyan relative overflow-hidden">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8 border-b border-gray-200 dark:border-gray-800 pb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Add New Location</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Run the Computer Vision pipeline to map slots</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Location Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Location Name
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={status === 'running'}
                  placeholder="e.g. Miramar Beach Parking"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-white transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Latitude */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                disabled={status === 'running'}
                placeholder="15.4989"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-white transition-all disabled:opacity-50"
              />
            </div>

            {/* Longitude */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                disabled={status === 'running'}
                placeholder="73.8278"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-white transition-all disabled:opacity-50"
              />
            </div>

            {/* Camera ID (Auto) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Camera ID / Video Source
              </label>
              <div className="relative">
                <Camera className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={cameraId}
                  onChange={(e) => setCameraId(e.target.value)}
                  disabled={status === 'running'}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-white transition-all disabled:opacity-50 font-mono text-sm"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Auto-generated. Used to link CV bounding boxes to this location.</p>
            </div>

            {/* Video Path */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Media Stream Path
              </label>
              <div className="relative">
                <Camera className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={videoPath}
                  onChange={(e) => setVideoPath(e.target.value)}
                  disabled={status === 'running'}
                  placeholder="e.g. media/carpv.mp4"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-white transition-all disabled:opacity-50 font-mono text-sm"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">The system will extract the very first frame of this video to draw the parking slots on.</p>
            </div>
          </div>

          {/* Status Message */}
          {status !== 'idle' && (
            <div className={`p-4 rounded-xl border flex items-start gap-3 ${status === 'running' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300' :
              status === 'error' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300' :
                'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300'
              }`}>
              {status === 'running' && <Loader2 className="w-5 h-5 animate-spin shrink-0" />}
              {status === 'success' && <CheckCircle className="w-5 h-5 shrink-0" />}
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === 'running'}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {status === 'running' ? 'Running CV Pipeline...' : 'Run Setup & Mark Slots'}
          </button>
        </form>
      </div>
    </div>
  );
}
