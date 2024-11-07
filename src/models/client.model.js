import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: 'Nome é essencial para o cadastro',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      match: [/.+\@.+\..+/, 'Por favor, insira um e-mail válido.'],
    },
    phone: {
      type: String,
      trim: true,
      required: 'Whats é essencial para cadastro.',
      match: [/^\+?\d{10,15}$/, 'Número de telefone inválido.'],
    },
    eircode: {
      type: String,
      minlength: [7, 'Se não foi colocado espaço o mínimo são 7 caracteres.'],
      maxlength: [8, 'Se foi colocado espaço o máximo são 8 caracteres.'],
    },
    typeOfWork: {
      type: String,
      required: 'Tipo de exercicio é essencial',
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
      required: 'Coloque a data que deseja o serviço.',
      validate: {
        validator: function (date) {
          return date >= Date.now();
        },
      },
      message: 'A data deve ser no futuro.',
    },
    howFindCompany: {
      type: String,
      required: 'Informe por favor como conheceu nossa empresa',
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
      required: 'Aceita os termos de uso? (RGPD)',
      enum: ['sim', 'não'],
    },
    consentDate: {
      type: Date,
      required: function () {
        return this.dataProtection === 'sim';
      }
    }
  },
  {
    timestamps: true,
  },
);

const SchemaClient = mongoose.models.Client || mongoose.model("Client", schema);

export default SchemaClient;
