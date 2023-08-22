const mongoose = require('mongoose')
require('dotenv').config();

async function main() {
    try {

        const dbUser = process.env.DB_USER
        const dbPass = process.env.DB_PASS

        mongoose.set('strictQuery', true);
        await mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@cluster0.1msfofi.mongodb.net/`);
        console.log('Conectado ao banco de dados!')
    } catch(error) {
        console.log(`Erro: ${error}`)
    }
}

module.exports = main