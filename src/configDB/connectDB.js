import mongoose from 'mongoose';

const connectOptions = {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 30000,
  retryWrites: true,
  w: 'majority',
  ssl: true,
  tls: true,
  tlsAllowInvalidCertificates: false,
  tlsAllowInvalidHostnames: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let isConnected = false;

export const connectDB = async (req = null, res = null, next = null) => {
  try {
    // Verifica se já está conectado
    if (isConnected && mongoose.connection.readyState === 1) {
      console.log('Usando conexão existente com o MongoDB');
      if (typeof next === 'function') next();
      return mongoose.connection;
    }

    // Força a desconexão se houver uma conexão pendente
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    // Verifica ambiente
    const environment = process.env.NODE_ENV || 'development';
    console.log(`Ambiente atual: ${environment}`);

    // Verifica se a URI está presente
    if (!process.env.MONGODB_URI) {
      throw new Error(
        'MONGODB_URI não está definida nas variáveis de ambiente',
      );
    }

    // Configura listeners de eventos
    mongoose.connection.on('connected', () => {
      console.log('MongoDB conectado com sucesso');
      isConnected = true;
    });

    mongoose.connection.on('error', err => {
      console.error('Erro na conexão com o MongoDB:', err);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB desconectado');
      isConnected = false;
    });

    // Tenta estabelecer a conexão
    console.log('Iniciando conexão com MongoDB...');
    const connection = await mongoose.connect(
      process.env.MONGODB_URI,
      connectOptions,
    );

    console.log(
      `MongoDB conectado com sucesso ao banco: ${connection.connection.name}`,
    );
    isConnected = true;

    if (typeof next === 'function') next();
    return connection;
  } catch (error) {
    console.error('Erro detalhado na conexão:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack,
    });

    if (res) {
      return res.status(500).json({
        message: 'Erro ao conectar ao banco de dados',
        error:
          process.env.NODE_ENV === 'development'
            ? error.message
            : 'Erro interno',
      });
    }
    throw error;
  }
};

// Função para reconexão automática
const attemptReconnection = async () => {
  if (!isConnected) {
    try {
      await connectDB();
    } catch (error) {
      console.error('Falha na tentativa de reconexão:', error.message);
    }
  }
};

// Tenta reconectar a cada 30 segundos se desconectado
setInterval(attemptReconnection, 30000);

// let isConnected = false; // Variável para rastrear o estado da conexão

// export const connectDB = async (req = null, res = null, next = null) => {
//   if (isConnected) {
//     console.log("Usando conexão existente com o MongoDB");
//     if (typeof next === "function") {
//       next();
//     }
//     return;
//   }

//   try {
//     const db = await mongoose.connect(process.env.MONGODB_URI, {
//       serverSelectionTimeoutMS: 30000, // Aumenta o timeout para 30 segundos
//     });

//     isConnected = true;
//     console.log("Nova conexão estabelecida com o MongoDB");

//     // Configurar listeners de eventos para a conexão
//     mongoose.connection.on("error", (err) => {
//       console.error("Erro na conexão com o MongoDB:", err);
//       isConnected = false;
//     });

//     mongoose.connection.on("disconnected", () => {
//       console.log("MongoDB desconectado");
//       isConnected = false;
//     });

//     if (typeof next === "function") {
//       next();
//     }

//     return db;
//   } catch (error) {
//     console.error("Erro ao conectar ao MongoDB:", error);
//     if (res) {
//       return res
//         .status(500)
//         .json({ message: "Erro ao conectar ao banco de dados" });
//     } else {
//       throw error; // Propaga o erro se não houver objeto de resposta
//     }
//   }
// };

/**
 * no index ou server:
 *
 * import { connectDB } from './path/to/db.js';
 *
 *  Conectar ao banco de dados ao iniciar o servidor
 *     connectDB().catch(console.error);
 *
 *  ... resto do seu código de configuração do servidor
 */

// import mongoose from "mongoose";
// import './dotenv.config'

// import mongoose from "mongoose";

// export const connectDB = async (req = null, res = null, next = null) => {
//   const uri = process.env.MONGODB_URI;

//   if (!uri) {
//     console.error("MONGODB_URI não está definida nas variáveis de ambiente");
//     if (res) {
//       return res.status(500).json({ message: "Erro de configuração do banco de dados" });
//     }
//     throw new Error("MONGODB_URI não está definida");
//   }

//   if (mongoose.connection.readyState === 1) {
//     console.log('Usando conexão existente com o MongoDB');
//     if (typeof next === "function") {
//       next();
//     }
//     return mongoose;
//   }

//   try {
//     await mongoose.connect(uri, {
//       serverSelectionTimeoutMS: 30000, // Aumenta o timeout para 30 segundos
//     });
//     console.log("Conectado ao banco de dados");

//     if (typeof next === "function") {
//       next();
//     }

//     return mongoose;
//   } catch (error) {
//     console.error("Erro ao conectar ao banco de dados:", error);
//     if (res) {
//       return res.status(500).json({ message: "Erro ao conectar ao banco de dados" });
//     }
//     throw error;
//   }
// };

// export const connectDB = async (req = null, res = null, next = null) => {
//   if (mongoose.connect.readyState === 1) {
//     if (typeof next === "function") {
//       next();
//     }
//     return mongoose;
//   }

//   try {
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log("Conectado ao banco de dados");

//     if (typeof next === "function") {
//       next();
//     }

//     return mongoose;
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json({ message: "Erro ao conectar ao banco de dados" });
//   }
// };
