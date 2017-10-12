const notesList = document.getElementById('notesList')

document.getElementById('sendNote').onclick = () => {
  const text = document.getElementById('textNote').value


// БЕГИ
// теперь все єто текстбоксы задисабленные и при нажатии они становятся заенабленные и в них короч пишешь
// а потом расфокусишься такой с этого текстбокса и он становиться опять
// задисабленным и изменения такие воу воу воу, ты дерзкий, и изменяются
// или не парься и сделай кнопку изменить
  fetch('/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({text})
  })
  .then(res => res.text())
  .then(JSON.parse)
  .then(result => {
    const newDiv = createNoteDiv({id: result.data.id, text, updatedAt: result.data.updatedAt})
    notesList.appendChild(newDiv)
  })
}


fetch('/notes')
.then(res => res.text())
.then(JSON.parse)
.then(notes => {
  notes.data.forEach(note => {
    const newDiv = createNoteDiv(note)
    notesList.appendChild(newDiv)

  })
})


const deleteNote = (id) => {
  return fetch('/notes/' + id, {
    method : 'DELETE'
  })
  .catch(console.error)
}

const editNote = (id, text) => {
  return fetch('/notes/' + id, {
    method : 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({id, text})
  })
  .then(res => res.text())
  .then(JSON.parse)
  .then(body => body.data)
}

const createNoteDiv = (note) => {

  const noteDiv = document.createElement('div')
  const noteTextBox = document.createElement('input')
  noteTextBox.type = 'text'
  const editButton = document.createElement('button')
  const deleteButton = document.createElement('button')
  const updatedAt = document.createElement('text')

  noteDiv.appendChild(noteTextBox)
  noteDiv.appendChild(editButton)
  noteDiv.appendChild(deleteButton)
  noteDiv.appendChild(updatedAt)
  console.log(note.updatedAt)
  updatedAt.innerHTML = 'Last upd: ' + formatDate(note.updatedAt)

////////////////////////////////////////////////////////
  noteTextBox.value = note.text

  setButtonToSave()

  function setButtonToSave() {
    editButton.innerHTML = 'edit'
    noteTextBox.disabled = true
    editButton.onclick = () => {
      handleNoteEdit()
    }
  }

  function handleNoteSave() {
    setButtonToSave()
    editNote(note.id, noteTextBox.value)
    .then(updatedNote => {
      updatedAt.innerHTML = 'Last upd: ' + formatDate(updatedNote.updatedAt)
    })
  }

  function handleNoteEdit() {
    editButton.innerHTML = 'save'
    noteTextBox.disabled = false
    editButton.onclick = () => {
      handleNoteSave()
    }
  }


////////////////////////////////////////////////////////
  deleteButton.innerHTML = 'x'
  deleteButton.onclick = () => {
    deleteNote(note.id)
    noteDiv.remove()
  }
  return noteDiv

}

function formatDate(dateStr) {
  const dateObj = new Date(dateStr)

  const formatedTime = [
    dateObj.getHours(),
    dateObj.getMinutes(),
    dateObj.getSeconds()
  ].join(':')

  const formatedDate = [
    dateObj.getDate(),
    dateObj.getMonth()+1,
    dateObj.getFullYear()
  ].join('.')

  return `time: ${formatedTime}, date: ${formatedDate}`
}

// function UpdatedAt (id) {
//   return fetch('/notes/' + id})
// }


// const onTextBoxClickEnable = (textbox) => {
//   textbox.onclick = () => {
//     textbox.disabled = 'true'
//   }
// }

// const createTd = (value, mainEl) => {
//   const td = document.createElement('td')
//   td.innerHTML = value
//   mainEl.appendChild(td)
// }


// fetch('/cpu-stats')
// .then(res => res.text())
// .then(JSON.parse)
// .then(loadInfo => {
//   const table = document.createElement('table')
//   document.getElementById('result').appendChild(table)
//   loadInfo.forEach((cpuLoad, i) => {
//     const newTr = document.createElement('tr')
//     table.appendChild(newTr)
//     createTd(i+1, newTr)
//     createTd('Load processor', newTr)
//     createTd(cpuLoad.cpu + '%', newTr)
//   })
// })

// .then(data => {
//   document.getElementById('result').textContent = data
// })

// const olCreate = (mainOl, , i)


// 5:: content type
// body parser npm

//сервер:подключаем многодбб подключаем роут, который будет принимать данные с клиента и записывать их в дб
//клиент: создает поле для ввода, и передает данные на сервер по нажатию кнопки
