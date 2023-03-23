import mongoose from 'mongoose';

const TemplateSchema = mongoose.Schema(
  {
    //Array of all filtered images with filter ID
    images: {
      type: [
        {
          url: String,
          id: String,
          width: Number,
          height: Number,
        },
      ],
    },

    // !Curretly uploaded image
    currentImage: {
      type: {
        url: String,
        id: String,
        width: Number,
        height: Number,
      },
      required: true,
    },

    //!the Image we upload URL
    uploadedImage: {
      type: {
        url: String,
        id: String,
        width: Number,
        height: Number,
        expires_at: String,
      },
      required: true,
    },
    user: {
      type: mongoose.ObjectId,
      ref: 'User',
      required: true,
    },
});

const Template = mongoose.model('Template', TemplateSchema);

export default Template;

