// read sql files from ./migrations folder and execute them

const mysql = require('mysql2/promise');
require('dotenv').config({ path: './.env' });
pool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: process.env.DATABASE_PORT || 3306 // Default MySQL port
});

const fs = require('fs');
const path = require('path');

async function migrate() {  
    const migrationsDir = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(migrationsDir);
    for (const file of files) {
        console.log(`Running migration: ${file}`);
        const sql
        = fs.readFileSync(path.join(migrationsDir, file)).toString();
        await
        pool.query(sql);
        console.log(`Migration complete: ${file}`);
    }
}

migrate();