const express = require('express')
const Result = require("../models/Result");
const boom = require('boom')
const multer = require('multer')
const  { UPLOAD_PATH } = require('../utils/constant');
const HRService = require('../services/HR')

const router = express.Router()

router.post(
    '/upload',
    multer({dest: '${ UPLOAD_PATH }/excel'}).single('file'),
    function (req, res, next) {
        if (!req.file || req.file.length === 0) {
            new Result('Upload failed').fail(res)
        }
        else {
            new Result('Upload succeed').success(res)
        }
})

router.get('/projectName', function (req, res, next) {
    HRService.getProjectName().then(projectName => {
        new Result(projectName,'Getting project name succeed').success(res)
    }).catch(err => {
        next(boom.badImplementation(err))
    })
})

router.get('/list', function (req, res, next) {
    HRService.listHR(req.query).then(({ list, count, page, pageSize}) => {
        new Result({ list, count, page: +page, pageSize: +pageSize },'Getting list succeed ').success(res)
    }).catch(err => {
        next(boom.badImplementation(err))
    })
})


module.exports = router
