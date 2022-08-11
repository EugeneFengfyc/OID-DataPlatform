const db = require('../db')
const debug = require('../utils/constant')

async function getProjectName() {
    const sql = 'select * from projectName'
    const result = await db.querySql(sql)
    const projectNameList = []
    result.forEach(item => {
        projectNameList.push({
            label: item.name,
            value: item.index,
            num: item.num
        })
    })
    return projectNameList
}


async function listHR(query) {
    console.log('listHR query' + query.toString())
    const {
        firstName,
        lastName,
        discipline,
        role,
        university,
        r1_r2,
        projectName,
        page = 1,
        pageSize = 20
    } = query
    //pagination
    const offset = (page - 1) * pageSize
    let HRSql = 'select * from hr_new'
    let where = 'where'

    firstName && (where = db.andLike(where, 'firstName', firstName))
    lastName && (where = db.andLike(where, 'lastName', lastName))
    discipline && (where = db.andLike(where, 'discipline', discipline))
    role && (where = db.andLike(where, 'role', role))
    university && (where = db.andLike(where, 'university', university))
    r1_r2 && (where = db.andLike(where, 'r1_r2', r1_r2))
    projectName && (where = db.and(where, projectName, 1))

    if (where !== 'where') {
        HRSql = `${HRSql} ${where}`
    }

    //pagination
    let countSql = `select count(*) as count from hr_new`
    if (where !== 'where') {
        countSql = `${countSql} ${where}`
    }
    const count = await db.querySql(countSql)
    HRSql = `${HRSql} limit ${pageSize} offset ${offset}`
    const list = await db.querySql(HRSql)
    // return new Promise((resolve, reject) => {
    //     resolve()
    // })
    return { list , count: count[0].count, page, pageSize }
}

module.exports = {
    listHR,
    getProjectName
}
