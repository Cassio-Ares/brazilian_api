import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Types.ObjectId,
      trim: true,
      ref: "Client",
      required:
        "Para gerar um serviço é nescessario o nome completo do cliente",
    },
    work: {
      type: String,
      enum: ["serviço de limpeza", "paisagismo e jardinagem", "pintura", "manicure e pedicure", "costura"],
      required: "Escolha o modelo de serviço que será executado",
    },
    collaborator: {
      type: mongoose.Types.ObjectId,
      trim: true,
      ref: "Collaborator",
      required:
        "Para gerar um serviço é nescessario o nome completo do colaborador",
    },
    whichPlaces: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: [1, "Preço deve ser maior ou igual a 1"],
    },
    date: {
      type: Date,
      required: "Coloque a data que o serviço será executado.",
      validator: {
        validate: function (date) {
          return date >= new Date();
        },
      },
    },
    status: {
      type: String,
      enum: ["Agendado", "Em andamento", "Concluído", "Cancelado"],
      default: "Agendado",
    },
  },
  {
    timestamps: true,
  }
);

// Adiciona o índice para o campo 'date'
schema.index({ date: 1 });

const SchemaWork = mongoose.models.Works || mongoose.model("Works", schema);

export default SchemaWork;
