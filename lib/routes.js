const router = require('express').Router()

// validation module
const validation = require('./components/validation')
const rule = require('./components/validation').rule
// jwt auth
const jwtAuth = require('./components/jwt-auth')

// auth controller
const auth = require('./controllers/auth')
// images manage controller
const imageManage = require('./controllers/image-manage')
// images serve controller
const imageServe = require('./controllers/image-serve')

// index, login page
router.post('/login', validation.validateRequest({
  body: {
    username: rule.string().required(),
    password: rule.string().required()
  },
}), auth.login)

// index, login page
router.post('/images', jwtAuth.checkScope('admin') ,imageManage.upload)


module.exports = router
