const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favouritedishes = new Schema({
    dish: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dish'
    }
},{
    timestamps: true
});


const FavouriteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes: [favouritedishes]
},{
    timestamps: true
});

module.exports = mongoose.model('favourite',FavouriteSchema);
