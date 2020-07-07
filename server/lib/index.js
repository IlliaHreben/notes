const express = require('express')
const serveStatic = require('serve-static')
const bodyParser = require('body-parser')
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
const getUser = require('./services/getUser')
const connect = require('./model')

const resToClient = (res, promise) => {
  promise
    .then(data => res.send({ok: true, data}))
    .catch(error => {
      console.warn(error)
      if (error instanceof ServiceError) {
        res
          .status(400)
          .send({
            ok: false,
            error: {message: error.message, code: error.code}
          })
      } else {
        res
          .status(500)
          .send({
            ok: false,
            error: {message: 'unknown server error', code: 'UNKNOWN_ERROR'}
          })
      }
    })
}

function checkUser (req, res, next) {
  checkUserId(req.headers.authorization || req.query.authorization)
    .then(user => {
      req.context = {user}
      next()
    })
}

const notes = express.Router()
  .use(checkUser)
  .post('/', (req, res) => {
    resToClient(res, createNote({
      theme: req.body.theme,
      text: req.body.text,
      userId: req.context.user._id
    }, connect))
  })
  .get('/', (req, res) => {
    const params = {
      order: Number.parseInt(req.query.order),
      userId: req.context.user._id
    }
    resToClient(res, getNotes(params, connect))
  })
  .delete('/:id', (req, res) => {
    resToClient(res, deleteNote({
      id: req.params.id,
      text: req.params.text,
      userId: req.context.user._id
    }, connect))
  })
  .put('/:id', (req, res) => {
    resToClient(res, editNote({
      id: req.params.id,
      theme: req.body.theme,
      text: req.body.text,
      userId: req.context.user._id
    }, connect))
  })
  .delete('/', (req, res) => {
    resToClient(res, dellAllNotes({
      userId: req.context.user._id
    }, connect))
  })

const api = express.Router()
  .use('/notes', notes)
  .post('/registration', (req, res) => {
    resToClient(res, createUser(req.body, connect))
  })
  .post('/authorization', (req, res) => {
    resToClient(res, authUser(req.body, connect))
  })
  .get('/registration/confirm', checkUser, (req, res) => {
    confirmUser(req.context, connect)
      .then(() => res.redirect('/authorization'))
  })
  .get('/user', checkUser, (req, res) => {
    resToClient(res, getUser(req.context))
  })


express()
  .use(serveStatic('../client/public', {extensions: ['html']}))
  .use(bodyParser.json())
  .use('/api', api)
  .listen(config.port)
