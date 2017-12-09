import {notes as requests} from './requests.js'

const token = window.localStorage.getItem('token')
if (!token) {
  window.location.href = '/authorization'
} else {
  renderNotes(getOrder())
}

function getOrder () {
  return Number.parseInt(window.localStorage.getItem('sortOrder') || '-1') // оптимизировать
}

function renderNotes (order) {
  requests.getNotes(order).then(sortedNotes => {
    sortedNotes.forEach(note => {
      const newDiv = createNoteDiv(note)
      notesList.appendChild(newDiv)
    })
  })
}

function toggleOrder () {
  let sortOrder = getOrder()
  sortOrder = -sortOrder
  window.localStorage.setItem('sortOrder', sortOrder)
  return sortOrder
}

document.getElementById('exit').onclick = () => {
  window.localStorage.removeItem('token')
  window.location.href = '/authorization'
}

document.getElementById('dellAllNotes').onclick = () => {
  requests.dellAllNotes()
  .then(() => {
    notesList.innerHTML = ''
  })
}

const notesList = document.getElementById('notesList')
document.getElementById('changeOrder').onclick = () => {
  notesList.innerHTML = ''
  renderNotes(toggleOrder())
}

document.getElementById('sendNote').onclick = () => {
  const note = document.getElementById('textNote')
  const text = note.value
  note.value = ''

  requests.sendNote(text)
  .then(result => {
    const newDiv = createNoteDiv({id: result.id, text, updatedAt: result.updatedAt})
    if (getOrder() === -1) {
      notesList.insertBefore(newDiv, notesList.firstChild)
    } else {
      notesList.appendChild(newDiv)
    }
  })
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
  updatedAt.innerHTML = 'Last upd: ' + formatDate(note.updatedAt)

  noteTextBox.value = note.text

  setButtonToSave()

  function setButtonToSave () {
    editButton.innerHTML = 'edit'
    noteTextBox.disabled = true
    editButton.onclick = () => {
      handleNoteEdit()
    }
  }

  function handleNoteSave () {
    setButtonToSave()
    requests.editNote(note.id, noteTextBox.value)
      .then(updatedNote => {
        updatedAt.innerHTML = 'Last upd: ' + formatDate(updatedNote.updatedAt)
      })
  }

  function handleNoteEdit () {
    editButton.innerHTML = 'save'
    noteTextBox.disabled = false
    editButton.onclick = () => {
      handleNoteSave()
    }
  }

  deleteButton.innerHTML = 'x'
  deleteButton.onclick = () => {
    requests.deleteNote(note.id)
    .then(() => noteDiv.remove())
  }
  return noteDiv
}

function formatDate (dateStr) {
  const dateObj = new Date(dateStr)

  const formatedTime = [
    dateObj.getHours(),
    dateObj.getMinutes(),
    dateObj.getSeconds()
  ].join(':')

  const formatedDate = [
    dateObj.getDate(),
    dateObj.getMonth() + 1,
    dateObj.getFullYear()
  ].join('.')

  return `time: ${formatedTime}, date: ${formatedDate}`
}
