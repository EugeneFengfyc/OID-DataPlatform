const express = require('express')
const boom = require('boom')
const userRouter = require('./user')
const HRRouter = require('./HR')
const jwtAuth = require('./jwt')
const Result = require('../models/Result')


// register router
const router = express.Router()
router.use(jwtAuth)
router.get('/', function(req, res) {
    res.send('Welcome to the Virginia Tech OID Data Platform')
})

// 通过 userRouter 来处理 /user 路由，对路由处理进行解耦
router.use('/user', userRouter)
router.use('/HR', HRRouter)

router.use((req, res, next) => {
    next(boom.notFound('Cannot find this API'))
})

/**
 * 自定义路由异常处理中间件
 * 注意两点：
 * 第一，方法的参数不能减少
 * 第二，方法的必须放在路由最后
 */
router.use((err, req, res, next) => {
    console.log(err)
    if (err.name && err.name === 'UnauthorizedError') {
        const{ status = 401} = err
        new Result(null, 'token invalid', {
            error:status,
            errorMsg: err.name
        }).expired(res.status(err.status))
    }else {
        const msg = (err && err.message) || 'System Error'
        const statusCode = (err.output && err.output.statusCode) || 500;
        const errorMsg = (err.output && err.output.payload && err.output.payload.error) || err.message
        new Result(null, msg, {
            error: statusCode,
            errorMsg
        }).fail(res.status(statusCode))
    }

})

module.exports = router
