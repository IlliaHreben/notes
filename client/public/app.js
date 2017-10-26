const token = window.localStorage.getItem('token')
if (!token) {
  window.location.href = '/authorization'
} else {
  renderNotes(getOrder())
}

function toggleOrder () {
  let sortOrder = getOrder()
  sortOrder = -sortOrder
  window.localStorage.setItem('sortOrder', sortOrder)
  return sortOrder
}

function getOrder () {
  return Number.parseInt(window.localStorage.getItem('sortOrder') || '-1')
}

document.getElementById('exit').onclick = () => {
  window.localStorage.removeItem('token')
  window.location.href = '/authorization'
}

const notesList = document.getElementById('notesList')
document.getElementById('changeOrder').onclick = () => {
  notesList.innerHTML = ''
  renderNotes(toggleOrder())
}

document.getElementById('sendNote').onclick = () => {
  const text = document.getElementById('textNote').value

  window.fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({text})
  })
  .then(res => res.text())
  .then(JSON.parse)
  .then(result => {
    const newDiv = createNoteDiv({id: result.data.id, text, updatedAt: result.data.updatedAt})
    if (getOrder() === -1) {
      notesList.insertBefore(newDiv, notesList.firstChild)
    } else {
      notesList.appendChild(newDiv)
    }
  })
}

function getNotes (order) {
  return window.fetch(`/api/notes?order=${order}`, {
    headers: {
      'Authorization': token
    }
  })
  .then(res => res.text())
  .then(JSON.parse)
  .then(notes => notes.data)
}

function renderNotes (order) {
  getNotes(order).then(sortedNotes => {
    sortedNotes.forEach(note => {
      const newDiv = createNoteDiv(note)
      notesList.appendChild(newDiv)
    })
  })
}

const deleteNote = (id) => {
  return window.fetch('/api/notes/' + id, {
    method: 'DELETE',
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json'
    }
  })
  .catch(console.error)
}

const editNote = (id, text) => {
  return window.fetch('/api/notes/' + id, {
    method: 'PUT',
    headers: {
      'Authorization': token,
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
    editNote(note.id, noteTextBox.value)
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
    deleteNote(note.id)
    noteDiv.remove()
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
