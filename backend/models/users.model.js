const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// define schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
// Hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});
// Add a method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
// Method to calculate the total value of the cart
userSchema.methods.calculateCartTotal = function () {
  return this.cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
};
//
userSchema.virtual("id").get(function () {
  return this._id;
});
userSchema.set("toJSON", {
  virtuals: true,
});
// Export the model
module.exports = mongoose.model("User", userSchema);
