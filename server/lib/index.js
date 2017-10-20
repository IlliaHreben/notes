const express = require('express')
const serveStatic = require('serve-static')
const bodyParser = require('body-parser')
const service = require('./service')

const resToClient = (res, promise) => {
  promise
    .then(data => res.send({ok: true, data}))
    .catch(error => {
      console.error(error)
      res
        .status(500)
        .send({ok: false, error: 'unknown error'})
    })
}

const app = express()
  .use(serveStatic('../client/public', {extensions: ['html']}))
  .use(bodyParser.json())

const api = express.Router()
  .post('/notes', (req, res) => {
    resToClient(res, service.createNote(req.body))
  })
  .get('/notes', (req, res) => {
    const params = {
      order: Number.parseInt(req.query.order),
      email: req.query.email,
      password: req.query.password
    }
    resToClient(res, service.getNotes(params))
  })
  .delete('/notes/:id', (req, res) => {
    resToClient(res, service.deleteNote({
      id: req.params.id,
      text: req.params.text,
      email: req.body.email,
      password: req.body.password
    }))
  })
  .put('/notes/:id', (req, res) => {
    resToClient(res, service.editNote({
      id: req.params.id,
      text: req.body.text,
      email: req.body.email,
      password: req.body.password
    }))
  })
  .post('/registration', (req, res) => {
    resToClient(res, service.createUser(req.body))
  })
  .post('/authorization', (req, res) => {
    resToClient(res, service.authUser(req.body))
  })

app.use('/api', api)
app.listen(3000)
