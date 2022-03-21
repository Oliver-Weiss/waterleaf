// MAIN BOT CODE

const {Collection, Client, Formatters, Intents, Interaction} = require("discord.js");
const config = require("./config.json");
const {Op} = require("sequelize");
const {Users, CurrencyShop} = require('./dbObjects.js');

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});
const currency = new Collection();

// HELPER METHODS
Reflect.defineProperty(currency, 'add', {
    value: async(id, amount) => {
        const user = currency.get(id);

        if (user) {
            user.balance += Number(amount);
            return user.save();
        }

        const newUser = await Users.create({user_id: id, balance: amount});
        currency.set(id, newUser);

        return newUser;
    },
});

Reflect.defineProperty(currency, 'getBalance', {
    value: id => {
        const user = currency.get(id);
        return user ? user.balance: 0;
    },
});

const prefix = "!";

// READY EVENT DATA SYNC
client.once('ready', async () => {
    const storedBalances = await Users.findAll();
    storedBalances.forEach(b => currency.set(b.user_id, b));

    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async message => {
    if (message.author.bot) return;
    currency.add(message.author.id, 1);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
     const command = args.shift().toLowerCase();    

	if (command === 'balance') {
		const target = message.author;

		return message.reply(`${target.tag} has ${currency.getBalance(target.id)}🍰!`);
	}

    if (command == "inventory") {
        const target = message.author;
        const user = await Users.findOne({where: {user_id: target.user}});
        const items = await user.getItems();

        if (!items.length) return message.reply(`${target.tag} has nothing!`);
 
        return message.reply(`${target.tag} currently has ${items.map(i => `${i.amount} ${i.item.name}`).join(' , ')}`);
            }
});

client.login(config.BOT_TOKEN);