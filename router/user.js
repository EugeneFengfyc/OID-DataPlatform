const express = require('express')
const Result = require('../models/Result')
const router = express.Router()
const { login, findUser } = require('../services/user')
const { decoded } = require('../utils')
const { body, validationResult } = require('express-validator')
const boom = require('boom')
const jwt = require('jsonwebtoken')
const { PRIVATE_KEY, JWT_EXPIRED } = require('../utils/constant')

router.post(

    '/login',
    [
        body('username').isString().withMessage('username format error'),
        body('password').isString().withMessage('password format error')
    ],
    function(req, res, next) {
        const err = validationResult(req)
        if (!err.isEmpty()) {
            const [{ msg }] = err.errors
            next(boom.badRequest(msg))
        }
        else {
            console.log('/user/login', req.body)
            const {username, password} = req.body

            login(username, password).then(user => {
                if (!user || user.length ===0) {
                    new Result('Login Failed').fail(res)
                }
                else {
                    const token = jwt.sign(
                        { username },
                        PRIVATE_KEY,
                        { expiresIn: JWT_EXPIRED }
                    )
                    new Result({token},'Login Success').success(res)
                }
            })
        }



    // res.json({
    //     code: 0,
    //     msg: 'Login Success'
    // })
})


router.get('/info', function(req, res) {
    const decode = decoded(req)
    //res.json('user info...')
    findUser('admin').then(user => {

        console.log(user)
        if (user) {
            user.roles = ['admin']
            new Result(user, 'User Info Request Succeed').success(res)
        }
        else {
            new Result(user, 'User Info Request Failed').fail(res)
        }

    })

})

module.exports = router
