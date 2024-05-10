const mongoose = require('mongoose');

const UserSchema =  new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: { type: String, required: false },
});

const User = mongoose.model('User', UserSchema);

export default User;
