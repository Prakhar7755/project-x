import mongoose, { Schema, model } from "mongoose";

const deviceInfoSchema = new Schema(
  {
    ipAddress: {
      type: String,
    },
    deviceType: {
      type: String,
      enum: ["Mobile", "Desktop"],
    },
    os: {
      type: String,
      enum: ["Android", "iOS", "Windows", "macOS"],
    },
  },
  { _id: false },
);

const userSchema = new Schema(
  {
    // Core Identity Fields
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email"],
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d+$/, "Phone must be numeric"],
    },

    // Financial Fields
    walletBalance: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Account Status Fields
    isBlocked: {
      type: Boolean,
      default: false,
    },
    kycStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    // Device Info
    deviceInfo: deviceInfoSchema,
  },
  {
    timestamps: true, // creates createdAt & updatedAt
  },
);

// 🔥 Indexes (Important)
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ phone: 1 }, { unique: true });

// Bonus Index (optimized for queries like recent users / filtering)
userSchema.index({ createdAt: -1 });
userSchema.index({ isBlocked: 1, kycStatus: 1 }); // compound index

const User = mongoose.models.User || model("User", userSchema);

export default User;
