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

// Define o caminho do arquivo de saída que será gerado com a documentação
const outputFile = './swagger_output.json';

// Define os arquivos de endpoint que serão analisados para gerar a documentação
const endPointFiles = [
  '../server.js',
  '../src/routes/adm.routes.js',
  '../src/routes/works.routes.js',
  '../src/routes/authLogin.routes.js',
  '../src/routes/client.routes.js',
  '../src/routes/collaborator.routes.js',
];

// Define a documentação inicial da API
let doc = {
  info: {
    version: '1.0.0', // Versão da API
    title: 'API BRAZILIAN_HANDS', // Título da API
    description: 'Documentação da API', // Descrição da API
  },
  servers: [
    {
      url: 'http://localhost:3000/', // URL do servidor local
      description: 'Servidor localhost.',
    },
    // Se desejar adicionar um servidor de produção, descomente e configure
    // {
    //     url: process.env.PRODUCTION_URL,
    //     description: "Servidor de produção."
    // }
  ],

  // Tipos de conteúdo que a API consome e produz (recomendado para OpenAPI 2.x)
  consumes: ['application/json'],
  produces: ['application/json'],

  components: {
    schemas: {
      // Converte modelos Mongoose em esquemas Swagger
      Adm: mongooseToSwagger(SchemaAdm),
      AdmWork: mongooseToSwagger(SchemaWork),
      Client: mongooseToSwagger(SchemaClient),
      Collaborator: mongooseToSwagger(SchemaCollaborator),
    },
  },
};

/**
 * Gera a documentação do Swagger chamando o swaggerAutogen.
 * O .then() é usado para garantir que o servidor só inicie após a documentação ser gerada.
 */
swaggerGenerator(outputFile, endPointFiles, doc)
  .then(async () => {
    console.log(
      'Documentação do Swagger gerada encontra-se no arquivo em: ' + outputFile,
    );
    // Verifica se não está em produção antes de iniciar o servidor
    if (process.env.NODE_ENV !== 'production') {
      await import('../server.js');
    }
  })
  .catch(error => {
    // Tratamento de erro caso a documentação não seja gerada corretamente
    console.error('Erro ao gerar a documentação do Swagger:', error);
  });
