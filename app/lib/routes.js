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

// multipart upload handler middleware
var multer = require('multer')
const upload = multer({dest: 'uploads/'})

const apicache = require('apicache').middleware

///// Routes for managing /////

// login endpoint
router.post('/login', validation.validateRequest({
  body: {
    username: rule.string().required(),
    password: rule.string().required()
  },
}), auth.login)

// upload image endpoint
router.post('/upload',
  jwtAuth.checkScope('admin'),
  upload.fields([{ name: 'fileName', maxCount: 1 },{ name: 'fileData', maxCount: 1 }]),
  validation.validateRequest({files: {fileData: rule.required()}}),
  imageManage.upload
)
// delete image endpoint
router.delete('/images/:id',
  jwtAuth.checkScope('admin'),
  validation.validateRequest({params: {id: rule.number().integer().required()}}),
  imageManage.remove
)

///// Routes for serving /////

// get list
router.get('/images', validation.validateRequest({
  query: {
    limit: rule.number().integer(),
    offset: rule.number().integer()
  }
}),imageServe.list)
// get one image object
router.get('/images/:id',
  validation.validateRequest({params: {id: rule.number().integer().required()}}),
  imageServe.getOne
)
// get image
router.get('/images/:id/image',
  validation.validateRequest({params: {id: rule.number().integer().required()}}),
  imageServe.renderOneImage
)
// resize image
router.get('/resize/:id',
  apicache('100 minutes'),
  validation.validateRequest({
    params: {id: rule.number().integer().required()},
    query: {
      width: rule.number().integer().required(),
      height: rule.number().integer().required(),
      rotate: rule.number().integer().allow('', 90, 180, 270)
    }
  }),
  imageServe.resizeOneImage
)


module.exports = router
