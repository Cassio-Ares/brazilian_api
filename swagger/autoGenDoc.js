import mongooseToSwagger from 'mongoose-to-swagger';
import swaggerAutogen from 'swagger-autogen';
import SchemaAdm from '../src/models/adm.model.js';
import SchemaClient from '../src/models/client.model.js';
import SchemaCollaborator from '../src/models/collaborator.model.js';
import SchemaWork from '../src/models/admWork.model.js';

const swaggerGenerator = swaggerAutogen({
  openapi: '3.1.0',
  language: 'pt-BR',
});

const outputFile = './swagger_output.json';

const endPointFiles = [
  '../server.js',
  '../src/routes/adm.routes.js',
  '../src/routes/works.routes.js',
  '../src/routes/authLogin.routes.js',
  '../src/routes/client.routes.js',
  '../src/routes/collaborator.routes.js',
];

// Função para determinar a URL base com base no ambiente
const getBaseUrl = () => {
  return process.env.NODE_ENV === 'production'
    ? 'https://brazilian-api.onrender.com'
    : 'http://localhost:3000';
};

let doc = {
  info: {
    version: '1.0.0',
    title: 'API BRAZILIAN_HANDS',
    description: 'Documentação da API Brazilian Hands',
  },
  servers: [
    {
      url: getBaseUrl(),
      description:
        process.env.NODE_ENV === 'production'
          ? 'Servidor de produção'
          : 'Servidor localhost',
    },
  ],
  consumes: ['application/json'],
  produces: ['application/json'],
  components: {
    schemas: {
      Adm: mongooseToSwagger(SchemaAdm),
      AdmWork: mongooseToSwagger(SchemaWork),
      Client: mongooseToSwagger(SchemaClient),
      Collaborator: mongooseToSwagger(SchemaCollaborator),
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      basicAuth: {
        type: 'http',
        scheme: 'basic',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
      basicAuth: [],
    },
  ],
};

swaggerGenerator(outputFile, endPointFiles, doc)
  .then(async () => {
    console.log(
      'Documentação do Swagger gerada encontra-se no arquivo em: ' + outputFile,
    );
    if (process.env.NODE_ENV !== 'production') {
      await import('../server.js');
    }
  })
  .catch(error => {
    console.error('Erro ao gerar a documentação do Swagger:', error);
  });
