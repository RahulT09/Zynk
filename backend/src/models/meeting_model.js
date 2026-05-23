import { Schema } from "mongoose";

const meetSchema = new Schema({
  user_id: { type: String, required: true },
  meetingCode: { type: String, required: true },
  date: { type: Date, default: Date.now, required: true },
});

const Meeting = mongoose.model("Meeting", meetSchema);

export { meetSchema };
