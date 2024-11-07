import express from 'express';
import { connectDB } from './src/configDB/connectDB.js';

import cors from 'cors';
import dotenv from 'dotenv';
import bearerToken from 'express-bearer-token';
import fs from 'fs/promises';
import { authDocAcess } from './src/middleware/authDocAcess.js';

// Importando rotas
import { routerCollaborator } from './src/routes/collaborator.routes.js';
import { routerAdm } from './src/routes/adm.routes.js';
import { routerClient } from './src/routes/client.routes.js';
import { routerLogin } from './src/routes/authLogin.routes.js';
import { workRouter } from './src/routes/works.routes.js';

//automação de e-mail
import './src/utils/informWork.js';

//import doc
import swaggerUi from 'swagger-ui-express';
const swaggerOption = { customCssUrl: '/swagger-ui.css' };

dotenv.config();

// Conectar ao banco de dados ao iniciar o servidor
connectDB().catch(console.error);

const app = express();

// CORS e JSON
app.use(cors());
app.use(bearerToken());
app.use(express.json());

//routes Adm
app.use('/', routerAdm);

//routes client
app.use('/', routerClient);

//routes Collaborator
app.use('/', routerCollaborator);

//login
app.use('/', routerLogin);

//work
app.use('/', workRouter);

//doc

if (process.env.NODE_ENV !== 'test') {
  try {
    const swaggerFile = JSON.parse(
      await fs.readFile(
        new URL('./swagger/swagger_output.json', import.meta.url),
        'utf-8',
      ),
    );

    // Configuração do CSS personalizado para o Swagger UI
    const swaggerOptions = {
      customCssUrl: '/swagger-ui.css',
      explorer: true,
      swaggerOptions: {
        persistAuthorization: true,
      },
    };

    app.get('/', authDocAcess, (_, res) => {
      res.redirect('/doc');
    });

    app.use(
      '/doc',
      authDocAcess, // Middleware de autenticação
      swaggerUi.serve,
      swaggerUi.setup(swaggerFile, swaggerOptions),
    );
  } catch (error) {
    console.error('Erro ao carregar a documentação Swagger:', error);
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


// if (process.env.NODE_ENV !== 'test') {
//   try {
//     const swaggerFile = await import('./swagger/swagger_output.json', {
//       assert: { type: 'json' },
//     });

//     app.get('/', (_, res) => {
//       /*#swagger.ignore = true*/ res.redirect('/doc');
//     });

//     app.use(
//       '/doc' /*, authDocProducao*/,
//       swaggerUi.serve,
//       swaggerUi.setup(swaggerFile.default),
//     ); // Acesse o conteúdo padrão do JSON
//   } catch (error) {
//     console.error('Erro ao importar o arquivo Swagger:', error);
//   }
// }



// if (process.env.NODE_ENV !== 'test') {
//   const swaggerFile = await import('./swagger/swagger_output.json', {
//     assert: { type: 'json' },
//   });
//   app.get('/', (_, res) => {
//     /*#swagger.ignore = true*/ res.redirect('/doc');
//   });
//   app.use(
//     '/doc' /*, authDocProducao*/,
//     swaggerUi.serve,
//     swaggerUi.setup(swaggerFile.default),
//   ); // Acesse o conteúdo padrão do JSON
// }
