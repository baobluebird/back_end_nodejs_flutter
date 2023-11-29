const mongoose = require('mongoose')

const trackSchema = new mongoose.Schema(
    {
        name: { type: String ,required: true},
        genres: { type: String ,required: true},
        singer: { type: String ,required: true},
        decription: { type: String ,required: true},
        image: { data: Buffer, contentType: String },
    },
    {
        timestamps: true
    }
);


const Track = mongoose.model("Track", trackSchema);
module.exports = Track;
