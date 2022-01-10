const { Pool } = require('pg')
const InvariantError = require('../../exceptions/InvariantError')

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

    await this._pool.query(query)
  }

  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT * FROM authentications WHERE token = $1',
      values: [token],
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new InvariantError('Token tidak valid.')
    }
  }
}

module.exports = AuthenticationsService
