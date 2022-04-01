const db = require('../../data/dbConfig')

module.exports = {
    add,
    findById,
    findBy
}

async function add(user) {
    const [id] = await db("users").insert(user)
    return findById(id)
  }

function findById(id) {
    return db("users as u")
      .select("u.id", "u.username", "u.password")
      .where("u.id", id)
      .first()
  }

function findBy(filter) {
    return db('users').where(filter)
  }
  