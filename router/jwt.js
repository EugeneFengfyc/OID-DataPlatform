const jwt = require('express-jwt');
const { PRIVATE_KEY } = require('../utils/constant');

module.exports = jwt({
    secret: PRIVATE_KEY,
    algorithms: ['HS256'],
    credentialsRequired: true
}).unless({
    path: [
        '/',
        '/user/login'
    ]// 设置 jwt 认证白名单
})

