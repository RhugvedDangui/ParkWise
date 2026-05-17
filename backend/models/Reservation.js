const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user_id:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username:     { type: String },
  location_id:  { type: String, required: true },
  location_name:{ type: String },
  slot_id:      { type: String, required: true },
  start_time:   { type: Date, required: true },
  end_time:     { type: Date, required: true },
  vehicle_type: { type: String, enum: ['standard', 'ev', 'handicap'], default: 'standard' },
  status:       { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
  created_at:   { type: Date, default: Date.now },
});

module.exports = mongoose.model('Reservation', reservationSchema);
