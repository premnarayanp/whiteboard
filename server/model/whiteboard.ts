import mongoose from 'mongoose';

const WhiteboardSessionSchema = new mongoose.Schema({
    sessionId: String,
    actions: Array,
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const WhiteboardSession = mongoose.model('WhiteboardSession', WhiteboardSessionSchema);

export default WhiteboardSession;
