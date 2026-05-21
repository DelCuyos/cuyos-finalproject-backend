import mysql from 'mysql2/promise';
import { Sequelize } from 'sequelize';
import accountModel from '../accounts/account.model';
import refreshTokenModel from '../accounts/refresh-token.model';
 
let fileConfig: any = {};
try {
    fileConfig = require('../config.json');
} catch (e) {
    // config.json not present in production — that's fine
}
 
const db: any = {};
export default db;
 
initialize();
 
async function initialize() {
    const host     = process.env.DB_HOST     || fileConfig.database?.host     || 'localhost';
    const port     = process.env.DB_PORT     ? parseInt(process.env.DB_PORT, 10) : (fileConfig.database?.port || 3306);
    const user     = process.env.DB_USER     || fileConfig.database?.user     || 'root';
    const password = process.env.DB_PASSWORD || fileConfig.database?.password || '';
    const database = process.env.DB_NAME     || fileConfig.database?.database || 'node_mysql_api';
    const ssl      = process.env.DB_SSL === 'true';
 
    // Only auto-create DB in development — managed hosts don't allow it
    if (process.env.NODE_ENV !== 'production') {
        const connection = await mysql.createConnection({ host, port, user, password });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
        await connection.end();
    }
 
    const sequelize = new Sequelize(database, user, password, {
        host,
        port,
        dialect: 'mysql',
        dialectOptions: ssl ? { ssl: { rejectUnauthorized: false } } : undefined,
        logging: false
    });
 
    db.Account = accountModel(sequelize);
    db.RefreshToken = refreshTokenModel(sequelize);
 
    db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
    db.RefreshToken.belongsTo(db.Account);
 
    await sequelize.sync();
}