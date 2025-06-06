import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    id: { type: String, required: true },
    kid: { type: String, required: true },
    avatar: { type: String, required: true },
    lvl: { type: String, required: true },
    power: { type: Number},
    rallie: { type: Number},
    lvl_content: { type: String}
});


const User = mongoose.model('User', UserSchema);
export default User;
