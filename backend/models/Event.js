const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  eventType: {
    type: String,
    required: [true, 'Please specify event type'],
    enum: ['Academic', 'Cultural', 'Sports', 'Technical', 'Other']
  },
  date: {
    type: Date,
    required: [true, 'Please add event date']
  },
  venue: {
    type: String,
    required: [true, 'Please add venue']
  },
  image: {
    type: String,
    default: 'no-image.jpg'
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', eventSchema); 