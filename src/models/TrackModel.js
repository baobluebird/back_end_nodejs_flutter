const mongoose = require('mongoose')

const trackSchema = new mongoose.Schema(
    {
        name: { type: String ,required: true},
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        genres: { type: String ,required: true},
        singer: { type: String ,required: true},
<<<<<<< HEAD
        description: {
            type: String,
            required: true
        },
=======
        description: { type: String ,required: true},
>>>>>>> e4eb2bc10e34137c364ecdbdb19509b745db5d89
        image: { data: Buffer, contentType: String },
        music: { data: Buffer, contentType: String },
    },
    {
        timestamps: true
    }
);


const Track = mongoose.model("Track", trackSchema);
module.exports = Track;
