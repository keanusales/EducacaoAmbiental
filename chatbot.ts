import { Client, Chat, Contact, Message } from 'whatsapp-web.js';
import { generate } from 'qrcode-terminal'; // leitor de qr code

// Inicialização do cliente
const client: Client = new Client({
    puppeteer: {
        headless: true, // Set to false if you want to see the browser
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// Função utilitária para delay
const delay = (ms: number): Promise<void> => new Promise(res => setTimeout(res, ms));

// Função para simular digitação com delay
const simulateTyping = async (chat: Chat, ms: number): Promise<void> => {
    await chat.sendStateTyping();
    await delay(ms);
};

// Mensagens fixas
const MESSAGES = {
    greeting: (name: string) =>
        `Olá! ${name.split(" ")[0]} Sou o assistente virtual da empresa tal. Como posso ajudá-lo hoje? Por favor, digite uma das opções abaixo:\n\n1 - Como funciona\n2 - Valores dos planos\n3 - Benefícios\n4 - Como aderir\n5 - Outras perguntas`,
    option1: `Nosso serviço oferece consultas médicas 24 horas por dia, 7 dias por semana, diretamente pelo WhatsApp.\n\nNão há carência, o que significa que você pode começar a usar nossos serviços imediatamente após a adesão.\n\nOferecemos atendimento médico ilimitado, receitas\n\nAlém disso, temos uma ampla gama de benefícios, incluindo acesso a cursos gratuitos`,
    option2: `*Plano Individual:* R$22,50 por mês.\n\n*Plano Família:* R$39,90 por mês, inclui você mais 3 dependentes.\n\n*Plano TOP Individual:* R$42,50 por mês, com benefícios adicionais como\n\n*Plano TOP Família:* R$79,90 por mês, inclui você mais 3 dependentes`,
    option3: `Sorteio de prêmios todo ano.\n\nAtendimento médico ilimitado 24h por dia.\n\nReceitas de medicamentos`,
    option4: `Você pode aderir aos nossos planos diretamente pelo nosso site ou pelo WhatsApp.\n\nApós a adesão, você terá acesso imediato`,
    option5: `Se você tiver outras dúvidas ou precisar de mais informações, por favor, fale aqui nesse WhatsApp ou visite nosso site: https://site.com`,
    defaultError: "Desculpe, não entendi sua mensagem. Por favor, escolha uma das opções abaixo:",
    link: `Link para cadastro: https://site.com`
};

// Lista de palavras-chave para correspondência
const KEYWORDS = ['menu', 'oi', 'olá', 'ola', 'dia', 'tarde', 'noite'];

// Gerar expressão regular dinamicamente
const keywordRegex = new RegExp(`\\b(${KEYWORDS.join('|')})\\b`, 'i');

// Inicialização do cliente
client.on('qr', (qr: string) => generate(qr, { small: true }));
client.on('ready', () => console.log('Tudo certo! WhatsApp conectado.'));
client.initialize();

// Função para lidar com mensagens
client.on('message', async (msg: Message) => {
    const chat: Chat = await msg.getChat();
    const contact: Contact = await msg.getContact();
    const name: string = contact.pushname || 'Usuário';

    // Verificar correspondência com palavras-chave
    if (keywordRegex.test(msg.body.toLowerCase()) && msg.from.endsWith('@c.us')) {
        await simulateTyping(chat, 3000);
        await client.sendMessage(msg.from, MESSAGES.greeting(name));
    }

    switch (msg.body) {
        case '1':
            await simulateTyping(chat, 3000);
            await client.sendMessage(msg.from, MESSAGES.option1);
            await simulateTyping(chat, 3000);
            await client.sendMessage(msg.from, MESSAGES.link);
            break;

        case '2':
            await simulateTyping(chat, 3000);
            await client.sendMessage(msg.from, MESSAGES.option2);
            await simulateTyping(chat, 3000);
            await client.sendMessage(msg.from, MESSAGES.link);
            break;

        case '3':
            await simulateTyping(chat, 3000);
            await client.sendMessage(msg.from, MESSAGES.option3);
            await simulateTyping(chat, 3000);
            await client.sendMessage(msg.from, MESSAGES.link);
            break;

        case '4':
            await simulateTyping(chat, 3000);
            await client.sendMessage(msg.from, MESSAGES.option4);
            await simulateTyping(chat, 3000);
            await client.sendMessage(msg.from, MESSAGES.link);
            break;

        case '5':
            await simulateTyping(chat, 3000);
            await client.sendMessage(msg.from, MESSAGES.option5);
            break;

        default:
            await simulateTyping(chat, 3000);
            await client.sendMessage(msg.from, MESSAGES.defaultError);
            await simulateTyping(chat, 3000);
            await client.sendMessage(msg.from, MESSAGES.greeting(name));
            break;
    }
});