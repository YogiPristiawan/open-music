const { Pool } = require('pg')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')
const InvariantError = require('../../exceptions/InvariantError')
const AuthenticationError = require('../../exceptions/AuthenticationError')
const NotFoundError = require('../../exceptions/NotFoundError')

class UsersService {
  constructor() {
    this._pool = new Pool({
      host: process.env.PGHOST || 'localhost',
      port: process.env.PGPORT || '5432',
      database: process.env.PGDATABASE,
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD,
    })
  }

  async addUser({ username, password, fullname }) {
    const id = uuidv4()
    const hashedPassword = await bcrypt.hash(password, 10)

    const query = {
      text: 'INSERT INTO users (id, username, password, fullname) VALUES ($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname],
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new InvariantError('User gagal ditambahkan')
    }

    return result.rows[0].id
  }

  async verifyUsername(username) {
    const query = {
      text: 'SELECT * FROM users WHERE username = $1',
      values: [username],
    }

    const result = await this._pool.query(query)

    if (result.rows.length > 0) {
      throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.')
    }
  }

  async verifyUserCredentials({ username, password }) {
    const query = {
      text: 'SELECT * FROM users WHERE username = $1',
      values: [username],
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new AuthenticationError('Username tidak ditemukan')
    }

    const hashedPassword = result.rows[0].password

    const match = await bcrypt.compare(password, hashedPassword)

    if (!match) {
      throw new AuthenticationError('Password yang anda masukkan salah')
    }

    return result.rows[0].id
  }

  async verifyUserExist(userId) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [userId],
    }

    const result = await this._pool.query(query)

    if (!(result.rows.length > 0)) {
      throw new NotFoundError('User tidak ditemukan.')
    }
  }
}

module.exports = UsersService
