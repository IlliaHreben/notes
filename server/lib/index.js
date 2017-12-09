const express = require('express')
const serveStatic = require('serve-static')
const bodyParser = require('body-parser')
const service = require('./service')
const ServiceError = require('./ServiceError')

const resToClient = (res, promise) => {
  promise
    .then(data => res.send({ok: true, data}))
    .catch(error => {
      console.log(error)
      if (error instanceof ServiceError) {
        res
          .status(400)
          .send({ok: false, error: {message: error.message, code: error.code}})
      } else {
        res
          .status(500)
          .send({ok: false, error: {message: 'unknown server error', code: 'UNKNOWN_ERROR'}})
      }
    })
}

const app = express()
  .use(serveStatic('../client/public', {extensions: ['html']}))
  .use(bodyParser.json())

const notes = express.Router()
  .use(checkUser)
  .post('/', (req, res) => {
    resToClient(res, service.createNote({
      text: req.body.text,
      userId: req.context.user._id
    }))
  })
  .get('/', (req, res) => {
    const params = {
      order: Number.parseInt(req.query.order),
      userId: req.context.user._id
    }
    resToClient(res, service.getNotes(params))
  })
  .delete('/:id', (req, res) => {
    resToClient(res, service.deleteNote({
      id: req.params.id,
      text: req.params.text,
      userId: req.context.user._id
    }))
  })
  .put('/:id', (req, res) => {
    resToClient(res, service.editNote({
      id: req.params.id,
      text: req.body.text,
      userId: req.context.user._id
    }))
  })
  .delete('/', (req, res) => {
    resToClient(res, service.dellAllNotes({
      userId: req.context.user._id
    }))
  })

const api = express.Router()
  .use('/notes', notes)
  .post('/registration', (req, res) => {
    resToClient(res, service.createUser(req.body))
  })
  .post('/authorization', (req, res) => {
    resToClient(res, service.authUser(req.body))
  })

function checkUser (req, res, next) {
  service.checkUser(req.headers.authorization)
    .then(user => {
      req.context = {user}
      next()
    })
}

app.use('/api', api)

app.listen(process.env.PORT || '3000')
