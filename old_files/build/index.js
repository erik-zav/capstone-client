import { REST, Routes, Client, GatewayIntentBits, ChannelType, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { getProfessors, getLibrary } from './scraper.js';
import 'dotenv/config';


const closeButton = new ButtonBuilder()
    .setCustomId('closeChat')
    .setLabel('Close Chat')
    .setStyle(ButtonStyle.Danger);
const row = new ActionRowBuilder()
    .addComponents(closeButton);
const client = new Client({ intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ] });
//const TOKEN = process.env.STARK_BOT_API_KEY;
const TOKEN = 'MTIxMDAyMDQ2NzY3NTc2NjgwNA.GVUfai.x3-XeQ7G1Xiqpi1ApFpJs0mya6Nlr9Ay12b9L4';
let CLIENT_ID = "1210020467675766804";
const professors = await getProfessors();
const libraryInfo = await getLibrary();
const commands = [
    {
        name: 'ping',
        description: 'Replies with Pong!',
    },
    {
        name: 'professors',
        description: 'Lists the current professors',
    },
    {
        name: 'chat',
        description: "createss a chat for u ",
    },
    {
        name: 'library',
        description: 'Lists the library information and links',
    },
];
const rest = new REST({ version: '10' }).setToken(TOKEN);
try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log('Successfully reloaded application (/) commands.');
}
catch (error) {
    console.error(error);
}
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
client.on('messageCreate', async (message) => {
    if (message.channel.name.startsWith('chat-') && message.author.id !== client.user.id) {
        if (message.content.toLowerCase().includes('professor')) {
            await handleProfessorsCommand(message);
        }
        else if (message.content.toLowerCase().includes('library')) {
            await handleLibraryCommand(message);
        }
    }
});
client.on('interactionCreate', async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === 'closeChat') {
            if (interaction.channel.name.startsWith('chat-')) {
                await interaction.channel.delete();
            }
            else {
                await interaction.reply({ content: 'You cannot close this channel.', ephemeral: true });
            }
        }
    }
    if (!interaction.isChatInputCommand())
        return;
    if (interaction.commandName === 'ping') {
        await interaction.reply('Pong!');
    }
    else if (interaction.commandName === 'professors') {
        await handleProfessorsCommand(interaction);
    }
    else if (interaction.commandName === 'library') {
        await handleLibraryCommand(interaction);
    }
    else if (interaction.commandName === 'chat') {
        try {
            const randomDigits = Math.random().toString().slice(2, 7);
            const channelName = `chat-${interaction.user.username}-${randomDigits}`;
            const channel = await interaction.guild.channels.create({
                name: channelName,
                type: ChannelType.GuildText,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionsBitField.Flags.ViewChannel],
                    },
                    {
                        id: interaction.user.id,
                        allow: [PermissionsBitField.Flags.ViewChannel],
                    },
                ],
            });
            await interaction.reply(`Your chat channel has been created: <#${channel.id}>`);
            channel.send({
                content: `Hello <@${interaction.user.id}>! Welcome to your chat channel. Click the button to close this chat.`,
                components: [row]
            });
        }
        catch (error) {
            console.error('Error creating channel:', error);
            await interaction.reply('Sorry, I couldn\'t create the chat channel at this moment.');
        }
    }
});
client.login(TOKEN);
async function handleProfessorsCommand(interaction) {
    try {
        const professors = await getProfessors();
        let replyMessage = 'Current Professors:\n';
        professors.forEach(prof => {
            replyMessage += `Name: ${prof.name}, Title: ${prof.title}, Room: ${prof.room}, Phone: ${prof.phone}, Email: ${prof.email}\n`;
        });
        await interaction.reply(replyMessage);
    }
    catch (error) {
        console.error('Error fetching professors:', error);
        await interaction.reply('Sorry, I couldn\'t fetch the professors information at this moment.');
    }
}
async function handleLibraryCommand(interaction) {
    try {
        const libraryInfo = await getLibrary();
        await interaction.reply(`Library Hours:\n${libraryInfo}`);
    }
    catch (error) {
        console.error('Error fetching library information:', error);
        await interaction.reply('Sorry, I couldn\'t fetch the library information at this moment.');
    }
}
//# sourceMappingURL=index.js.map