import cron from "node-cron";
import { getWorkByDay } from "../controllers/work.controller.js";
import { sendEmail } from "./sendEmail.js";

//cron.schedule('0 8 * * *', async () => {
cron.schedule('17 * * * *', async () => {
  try {
    // Cria um objeto Date para amanhã
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Formata a data para YYYY-MM-DD
    const formattedDate = tomorrow.toISOString().split('T')[0];

    // Simula uma requisição com a data de amanhã
    const req = {
      query: { date: formattedDate }
    };

    // Simula um objeto de resposta
    const res = {
      status: function(statusCode) {
        this.statusCode = statusCode;
        return this;
      },
      json: function(data) {
        return data;
      }
    };

    // Chama getWorkByDay
    const worksData = await getWorkByDay(req, res);

   if (worksData && worksData.length > 0) {
      worksData.forEach(async (work) => {
        const emailContent = `
        <h1>Olá, ${work.collaborator}!</h1>
      
        <p>Amanhã você tem um serviço agendado. Seguem os detalhes para que tudo corra bem:</p>
      
        <p><strong>Nome do Cliente:</strong> ${work.client}</p>
        <p><strong>Data do Serviço:</strong> ${formattedDate}</p>
        <p><strong>Eircode:</strong> ${work.eircode}</p>
        <p><strong>Serviço Solicitado:</strong> ${work.work}</p>
        <p><strong>Particularidades:</strong> ${work.whichPlaces}</p>
        <p><strong>Valor do Serviço:</strong> ${work.price}</p>
      
        <p>Se tiver alguma dúvida ou ocorrer algo inesperado, por favor, entre em contato com o Marcelo pelo telefone <strong>(XX) XXXX-XXXX</strong>.</p>
      
        <p>Estamos aqui para garantir que tudo saia como planejado. Conte com a gente!</p>
      
        <p>Abraço,</p>
        <p><strong>Equipe da Cooperativa</strong></p>
      `;

        const subject = "Informações de sua agenda de amanhã!";

        // Você precisará obter o email do colaborador de alguma forma
        // Talvez adicionando-o ao objeto work retornado por getWorkByDay
        await sendEmail(work.email, subject, emailContent);
      });
    } else {
      console.log("Nenhum serviço agendado para amanhã.");
    }
  } catch (error) {
    console.error("Erro ao executar o cron job:", error);
  }
});