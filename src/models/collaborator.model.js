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
      unique: true,
      required: 'E-mail é essencial para cadastro',
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please enter a valid email address.',
      ],
    },
    phone: {
      type: String,
      trim: true,
      required: 'Whats é essencial para cadastro.',
      math: [/^\+?\d{10,15}$/, 'Número de telefone inválido.'],
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
      minlength: [7, 'Se não foi colocado espaço o mínimo são 7 caracteres.'],
      maxlength: [8, 'Se foi colocado espaço o máximo são 8 caracteres.'],
    },
    work: {
      type: String,
      trim: true,
      enum: [
        'serviço de limpeza',
        'paisagismo e jardinagem',
        'pintura',
        'manicure e pedicure',
        'costura',
      ],
      required: 'Qual serviço vc pode prestar?',
    },
    equipment: {
      type: Boolean,
      default: false,
      required: 'Marque se possui o não equipamentos',
    },
    whatEquipment: {
      type: String,
      trim: true,
    },
    shapeOfDisplacement: {
      type: String,
      trim: true,
      required: 'Como você pode se deslocar para o serviço?',
      enum: [
        'carro',
        'moto',
        'transporte público',
        'caminhando',
        'carro de aplicativo',
      ],
    },
    dataProtection: {
      type: String,
      required: 'Aceita os termos de uso?',
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

const SchemaCollaborator =
  mongoose.models.Collaborator || mongoose.model('Collaborator', schema);

export default SchemaCollaborator;

/**
 * shape of displacement (onibus, carro, bike, ....)
 */
