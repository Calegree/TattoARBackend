
const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['client', 'tattooer'], default: 'client' },
  city: String,
  profileImageUrl: String,
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Design' }],
  socialMedia: {
    instagram: String,
    facebook: String,
    whatsapp: String,
  },
  designs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Design' }],
}, { timestamps: true });


// Hash de contraseña antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar contraseña
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = model('User', userSchema);
