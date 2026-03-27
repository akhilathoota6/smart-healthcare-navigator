import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({
  symptom_text: String,
  specialty: String,
  hospital_name: String,
  city: String,
  zip: Number,
  latitude: Number,
  longitude: Number,
  rating: Number,
  wait_time_minutes: Number,
  blue_cross_accepted: String
});

export default mongoose.model("Hospital", hospitalSchema);
