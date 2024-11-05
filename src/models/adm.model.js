import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: "Nome é essencial para o cadastro",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      match: [/.+\@.+\..+/, "Por favor, insira um e-mail válido."]
    },
    token: {
      type: String,
    },
    tokenExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const SchemaAdm = mongoose.models.Adms || mongoose.model("Adms", schema);

export default SchemaAdm;



//const schema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       trim: true,
//       required: "Nome é essencial para o cadastro",
//     },
//     email: {
//       type: String,
//       lowercase: true,
//       trim: true,
//       unique: true,
//       required: "Email é essencial para seu cadastro",
//       match:[/.+\@.+\..+/, "Por favor, insira um e-mail válido."]
//     },
//     password: {
//       type: String,
//       trim: true,
//       select: false,
//       required: "Senha é essencial para seu cadastro",
//       minlength:[6, "Senha deve ter no minimo 6 caracteres."]
//     },
//   },
//   {
//     timestamps: true,
//   }
// );
