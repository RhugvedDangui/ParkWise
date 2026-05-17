const mongoose = require('mongoose');

/**
 * ParkingLocation — one per physical parking lot / camera.
 * Slots are stored separately in the ParkingSlot collection,
 * linked by camera_id.
 */
const parkingLocationSchema = new mongoose.Schema({
  location_id:  { type: String, required: true, unique: true },  // e.g. DOWNTOWN_LOT4
  camera_id:    { type: String, required: true, unique: true },   // e.g. CAM_DT_08
  name:         { type: String, required: true },
  gps_lat:      { type: Number, required: true },
  gps_lng:      { type: Number, required: true },
  video_path:   { type: String, default: '' },
  isVerified:   { type: Boolean, default: true },
  lastUpdated:  { type: Date, default: Date.now },
});

module.exports = mongoose.model('ParkingLocation', parkingLocationSchema);

