const { querySql, queryOne} = require('../db')

function login(username, password) {
    const sql = `select * from admin where username='${username}' and password='${password}'`
    return querySql(sql)
}

function findUser(username) {
    return queryOne(`select * from admin where username='${username}'`)
}
module.exports = {
    login,
    findUser
}
