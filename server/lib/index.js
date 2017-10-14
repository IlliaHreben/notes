const express = require('express')()
const serveStatic = require('serve-static')
const bodyParser = require('body-parser')

const service = require('./service')

express.use(serveStatic('../client/public'))
express.use(bodyParser.json())

express.post('/notes', (req, res) => {
  resToClient(res, service.createNote(req.body))
})

express.get('/notes', (req, res) => {
  const params = {order: Number.parseInt(req.query.order)}
  resToClient(res, service.getNotes(params))
})

express.delete('/notes/:id', (req, res) => {
  resToClient(res, service.deleteNote(req.params))
})

express.put('/notes/:id', (req, res) => {
  resToClient(res, service.editNote({id: req.params.id, text: req.body.text}))
})

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

express.listen(3000)
