import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  owner: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'User',
      required: true,
       index: true
     },
     
  label: { 
    type: String,
     enum: ['home', 'work', 'other'], 
     default: 'home'
     },

  addressLine1: { 
    type: String,
     required: true,
      trim: true,
       maxlength: 200
     },

  addressLine2: {
     type: String,
      trim: true,
       maxlength: 200,
        default: ''
     },

  city: {
     type: String,
     required: true,
      trim: true,
       maxlength: 100
     },

  state: {
     type: String,
      required: true,
       trim: true,
        maxlength: 100
     },

  pincode: {
     type: String,
      required: true,
       trim: true,
        maxlength: 12
     },

  coordinates: {
     type: [Number],
      validate: (value) => value.length === 0 || value.length === 2 }
},

{ timestamps: true });

export default mongoose.model('Address', addressSchema);