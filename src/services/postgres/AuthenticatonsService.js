const { Pool } = require('pg')

class AuthenticationsService {
  constructor() {
    this._pool = new Pool({
      host: process.env.PGHOST || 'localhost',
      port: process.env.PGPORT || '5432',
      database: process.env.PGDATABASE,
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD,
    })
  }

  async addRefreshToken(token) {
    const query = {
      text: 'INSERT INTO authentications (token) VALUES ($1)',
      values: [token],
    }

    console.log(await this._pool.query(query))
  }
}

module.exports = AuthenticationsService
