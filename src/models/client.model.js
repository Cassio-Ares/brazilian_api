import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: 'Name is essential for registration',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please enter a valid email address.',
      ],
    },
    phone: {
      type: String,
      trim: true,
      required: 'Phone number is essential for registration.',
      match: [/^\+?\d{10,15}$/, 'Invalid phone number.'],
    },
    address: {
      city: {
        type: String,
        required: false,
      },
      street: {
        type: String,
        required: false,
      },
      district: {
        type: String,
      },
      houseNumber: {
        type: String,
      },
    },
    eircode: {
      type: String,
      minlength: [7, 'If no space was placed, the minimum is 7 characters.'],
      maxlength: [8, 'If space was placed, the maximum is 8 characters.'],
    },
    typeOfWork: {
      type: String,
      required: 'Tipo de serviço é essencial',
      enum: [
        'serviço de limpeza',
        'paisagismo e jardinagem',
        'pintura',
        'manicure e pedicure',
        'costura',
      ],
    },
    dateOfService: {
      type: Date,
      required: 'Please specify the desired service date.',
      validate: {
        validator: function (date) {
          return date >= Date.now();
        },
      },
      message: 'The date must be in the future.',
    },
    howFindCompany: {
      type: String,
      required: 'Please inform how you found our company',
      enum: ['facebook', 'instagram', 'google', 'indicação'],
    },
    indicatorName: {
      type: String,
    },
    particularities: {
      type: String,
      //ex: serviço silencioso, ....
    },
    dataProtection: {
      type: String,
      required: 'Do you accept the terms of use? (GDPR)',
      enum: ['sim', 'não'],
    },
    consentDate: {
      type: Date,
      required: function () {
        return this.dataProtection === 'sim';
      },
    },
  },
  {
    timestamps: true,
  },
);

const SchemaClient = mongoose.models.Client || mongoose.model('Client', schema);

export default SchemaClient;
