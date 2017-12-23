const express = require('express')
const serveStatic = require('serve-static')
const bodyParser = require('body-parser')
// const service = require('./service')
const ServiceError = require('./ServiceError')
const config = require('./config')
const authUser = require('./services/authUser')
const checkUserId = require('./services/checkUserId')
const confirmUser = require('./services/confirmUser')
const createNote = require('./services/createNote')
const createUser = require('./services/createUser')
const deleteNote = require('./services/deleteNote')
const dellAllNotes = require('./services/dellAllNotes')
const editNote = require('./services/editNote')
const getNotes = require('./services/getNotes')

const resToClient = (res, promise) => {
  promise
    .then(data => res.send({ok: true, data}))
    .catch(error => {
      console.warn(error)
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
    resToClient(res, createNote({
      theme: req.body.theme,
      text: req.body.text,
      userId: req.context.user._id
    }))
  })
  .get('/', (req, res) => {
    const params = {
      order: Number.parseInt(req.query.order),
      userId: req.context.user._id
    }
    resToClient(res, getNotes(params))
  })
  .delete('/:id', (req, res) => {
    resToClient(res, deleteNote({
      id: req.params.id,
      text: req.params.text,
      userId: req.context.user._id
    }))
  })
  .put('/:id', (req, res) => {
    resToClient(res, editNote({
      id: req.params.id,
      theme: req.body.theme,
      text: req.body.text,
      userId: req.context.user._id
    }))
  })
  .delete('/', (req, res) => {
    resToClient(res, dellAllNotes({
      userId: req.context.user._id
    }))
  })

const api = express.Router()
  .use('/notes', notes)
  .post('/registration', (req, res) => {
    resToClient(res, createUser(req.body))
  })
  .post('/authorization', (req, res) => {
    resToClient(res, authUser(req.body))
  })
  .get('/registration/confirm', checkUser, (req, res) => {
    confirmUser(req.context)
      .then(() => res.redirect('/authorization'))
  })

function checkUser (req, res, next) {
  checkUserId(req.headers.authorization || req.query.authorization)
    .then(user => {
      req.context = {user}
      next()
    })
}

app.use('/api', api)

app.listen(config.port)
