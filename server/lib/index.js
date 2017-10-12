const fs = require('fs')
const path = require('path')
const {promisify} = require('util')
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
  resToClient(res, service.getNotes())
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

// , (err, db) => {
//   assert.equal(null, err);
//   console.log("Connected correctly to server");
//
//   db.close();
// }

// express.get('/cpu-stats', (req, res) => {
//   cpuStats(1000)
//   .then(stats => {
//     // const cpuInput = stats
//     // .reduce((prevLoad, load, i) => {
//     //   return prevLoad + 'Load processor ' + ++i +' = ' + load.cpu + '% \r\n'
//     // }, '')
//
//     res.send(stats)
//   })
//   .catch(console.error)
// })

// cpuStats(1000)
// .then(([stats]) => {
//   console.log(stats.cpu)
//   return Promise.all([cpuStats(1000), writeFile(dirAndName, '')])
// })
// .then(([statUfterLoad]) => console.log(statUfterLoad[0].cpu))
// .catch(console.error)

express.listen(3000)

// кнопка ан хтмл:
// 1. хелло ворд алерт
// 2. что бывызвалься запрос с сервера
// const jsCode = path.resolve('C:\\', 'Users', 'Woll-', 'Desktop', 'network', 'script.js')
//
// const readFile = promisify(fs.readFile)
//
// readFile(htmlCode, 'utf8')
// .then(text => {
//   express.get('/', (req, res) => res.send(text))
//   return readFile(jsCode, 'utf8')
// })
// .then(js => {
//   express.get('/jsCode', (req, res) => res.send(js))
// })
// .catch(console.error)
//



//


// const writeFile = promisify(fs.writeFile)
// const cpuStats = promisify(cpu)
//
// cpuStats(1000)
// .then(([stats]) => {
//   console.log(stats.cpu)
//   return Promise.all([cpuStats(1000), writeFile(dirAndName, '')])
// })
// .then(([statUfterLoad]) => console.log(statUfterLoad[0].cpu))
// .catch(console.error)


// express - вывести на экран какой-нибудь текст с хэдерами либо через файл, либо
//
// скопировать код  хелло ворд с доки экпресса
// запустить и затестить
// создать файл .html, и записать тут текст с хтмл форматированием
// прочитать файл и закинуть его вместо хелло ворда




// const fs = require('fs')
// const path = require('path')
// const {promisify} = require('util')
// const fetch = require('node-fetch')
// const ping = require('ping').promise.probe
//
// const dir = path.resolve('C:\\', 'Users', 'Woll-', 'Desktop', 'network')
// const IPesPath = path.resolve(dir, 'IPes.txt')
// const filesPath = path.resolve(dir, 'IPesBodyes')
//
//
// const readFile = promisify(fs.readFile)
// const writeFile = promisify(fs.writeFile)
//
// readFile(IPesPath, 'utf8')
// .then(text => text.split('\r\n'))
// .then(ipes => Promise.all(ipes.map(ip => ping(ip))))
// .then(chars => {
//   console.log(chars)
//   const promises = chars.map(char => {
//     const fileName = path.resolve(filesPath, char.host + '.txt')
//
//     return writeFile(fileName, char.output)
//   })
//
//   return Promise.all(promises)
// })
// .catch(console.error)

// Найти на нпм модуль, который предоставляет функцию пинг/
// Файл с ип -> одновременно проходимся по ип и пингуем -> ждем пока все пропингуются -> Записываем пофайлово результаты
