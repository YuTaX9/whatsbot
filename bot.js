const qrcode = require('qrcode-terminal');

const { Client } = require('whatsapp-web.js');
const client = new Client();

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('READY!!!');
});

client.initialize();

// منشن للجميع
client.on('message', async (msg) => {
    if (msg.body === "!المكافأة") {
        msg.reply(calculateTimeUntilSalary());
    }
    if (msg.body === '!منشن') {
        const chat = await msg.getChat();

        let text = '';
        let mentions = [];

        for (let participant of chat.participants) {
            const contact = await client.getContactById(participant.id._serialized);

            mentions.push(contact);
            text += `@${participant.id.user} `;
        }

        await chat.sendMessage(text, { mentions });
    }
});

function calculateTimeUntilSalary() {
    const today = new Date();
    const salaryDay = 27;
    let nextSalaryDate = new Date(today.getFullYear(), today.getMonth(), salaryDay);

    // Adjust the next salary date if today is after the 27th
    if (today.getDate() > salaryDay) {
        nextSalaryDate.setMonth(nextSalaryDate.getMonth() + 1);
    }

    // Check if today is the salary day
    if (today.getDate() === salaryDay) {
        nextSalaryDate.setMonth(nextSalaryDate.getMonth() + 1);
    }

    // Adjust next salary date based on day of the week
    if (nextSalaryDate.getDay() === 5) {
        nextSalaryDate.setDate(nextSalaryDate.getDate() - 1);
    } else if (nextSalaryDate.getDay() === 6) {
        nextSalaryDate.setDate(nextSalaryDate.getDate() + 2);
    }

    const timeUntilSalary = nextSalaryDate.getTime() - today.getTime();

    const days = Math.floor(timeUntilSalary / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeUntilSalary % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeUntilSalary % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeUntilSalary % (1000 * 60)) / 1000);

    // Return formatted string
    return `متبقى على المكافاة: ${days} يوم, ${hours} ساعة, ${minutes} دقيقة, ${seconds} ثانية`;
}
