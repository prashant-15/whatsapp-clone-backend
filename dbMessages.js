import mongoose from "mongoose";

const whastappSchema = mongoose.Schema({
  name: String,
  message: String,
  timestamp: String,
  received: Boolean,
})

export default mongoose.model('messageContent', whastappSchema);