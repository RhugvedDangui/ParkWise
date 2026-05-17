const mongoose = require('mongoose');

/**
 * ParkingSlot — one document per physical parking slot.
 * Linked to ParkingLocation via camera_id (foreign key).
 *
 * bbox = axis-aligned bounding box in the camera's video frame:
 *   x1, y1 = top-left corner (pixels)
 *   x2, y2 = bottom-right corner (pixels)
 */
const parkingSlotSchema = new mongoose.Schema({
  slot_id:        { type: String, required: true },              // P1, P2, P3 …
  camera_id:      { type: String, required: true, index: true }, // FK → ParkingLocation.camera_id
  status:         { type: String, enum: ['Vacant', 'Occupied', 'Reserved'], default: 'Vacant' },
  spotType:       { type: String, enum: ['standard', 'ev', 'handicap', 'normal'], default: 'standard' },
  bbox: {
    x1: { type: Number, required: true },   // top-left x
    y1: { type: Number, required: true },   // top-left y
    x2: { type: Number, required: true },   // bottom-right x
    y2: { type: Number, required: true },   // bottom-right y
  },
  reserved_by:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  reserved_from:  { type: Date, default: null },
  reserved_until: { type: Date, default: null },
  lastUpdated:    { type: Date, default: Date.now },
});

// Compound unique index: one slot_id per camera
parkingSlotSchema.index({ camera_id: 1, slot_id: 1 }, { unique: true });

module.exports = mongoose.model('ParkingSlot', parkingSlotSchema);
