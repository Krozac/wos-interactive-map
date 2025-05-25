import mongoose from 'mongoose';

const GuildSchema = new mongoose.Schema({
    Nom: { type: String, required: true},
    acronym: { type: String, required: true},
    color: { type : String, required: true}
});

const Guild = mongoose.model('Guild', GuildSchema);
export default Guild;
