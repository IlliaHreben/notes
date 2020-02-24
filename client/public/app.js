import {notes, users, errorHandler} from './requests.js'

const token = window.localStorage.getItem('token')
if (!token) {
  window.location.href = '/authorization'
} else {
  renderNotes(getOrder())
}

function getOrder () {
  return Number.parseInt(window.localStorage.getItem('sortOrder')) || -1 // оптимизировано
}

users.getUser().then(data => {
  document.getElementById('avatarImage').src = data.avatarUrl
  document.getElementById('avatarImage').onclick = () => {
    window.location.replace('https://ru.gravatar.com/' + data.email.split('@')[0])
  }
  document.getElementById('UserEmail').innerHTML = data.email
})

function renderNotes (order) {
  notes.getNotes(order).then(sortedNotes => {
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
  notes.dellAllNotes()
  .then(() => {
    notesList.innerHTML = ''
  })
}

const notesList = document.getElementById('notesList')
document.getElementById('changeOrder').onclick = () => {
  notesList.innerHTML = ''
  renderNotes(toggleOrder())
}

// document.getElementById('globalSettingsIcons').onclick = () => {
//   const note = {
//     themeInput: document.getElementById('noteTheme'),
//     textInput: document.getElementById('textNote')
//   }
//   const noteData = {
//     theme: note.themeInput.value,
//     text: note.textInput.value
//   }
//   if (noteData.theme === '') {
//     noteData.theme = '[WITHOUT TITLE]'
//   }
//   note.themeInput.value = ''
//   note.textInput.value = ''
//
//   notes.sendNote(noteData)
//   .then(result => {
//     const newDiv = createNoteDiv({
//       id: result.id,
//       theme: noteData.theme,
//       text: noteData.text,
//       updatedAt: result.updatedAt
//     })
//     if (getOrder() === -1) {
//       notesList.insertBefore(newDiv, notesList.firstChild)
//     } else {
//       notesList.appendChild(newDiv)
//     }
//   })
// }

document.getElementById('sendNote').onclick = () => {
  const note = {
    themeInput: document.getElementById('noteTheme'),
    textInput: document.getElementById('textNote')
  }
  const noteData = {
    theme: note.themeInput.value,
    text: note.textInput.value
  }

  if (!noteData.text) {
    errorHandler({message: 'You didn\'t enter a subject and note text.'})
    return
  }

  if (!noteData.theme) {
    noteData.theme = '[WITHOUT TITLE]'
  }
  note.themeInput.value = ''
  note.textInput.value = ''

  notes.sendNote(noteData)
  .then(result => {
    const newDiv = createNoteDiv({
      id: result.id,
      theme: noteData.theme,
      text: noteData.text,
      updatedAt: result.updatedAt
    })
    if (getOrder() === -1) {
      notesList.insertBefore(newDiv, notesList.firstChild)
    } else {
      notesList.appendChild(newDiv)
    }
  })
}

const createNoteDiv = (note) => {
  const noteDiv = document.createElement('div')

  const noteTextBoxTheme = document.createElement('input')
  noteTextBoxTheme.type = 'text'
  noteTextBoxTheme.className = 'savedNoteTheme'
  noteTextBoxTheme.value = note.theme
  noteDiv.appendChild(noteTextBoxTheme)

  const noteTextBox = document.createElement('input')
  noteTextBox.type = 'text'
  noteTextBox.className = 'savedNote'
  noteTextBox.value = note.text
  noteDiv.appendChild(noteTextBox)

  const updatedAtContainer = document.createElement('div')
  updatedAtContainer.className = 'updatedAtContainer'
  const updatedAtTime = document.createElement('text')
  updatedAtTime.className = 'updatedAtTime'
  updatedAtContainer.appendChild(updatedAtTime)
  noteDiv.appendChild(updatedAtContainer)

  const updatedAtDate = document.createElement('text')
  updatedAtDate.className = 'updatedAtDate'
  updatedAtContainer.appendChild(updatedAtDate)
  noteDiv.appendChild(updatedAtContainer)

  const dateAndTimeArr = formatDate(note.updatedAt).toUpperCase().split(', ')
  updatedAtTime.innerHTML = dateAndTimeArr[0]
  updatedAtDate.innerHTML = dateAndTimeArr[1]

  // editMenu
  const editMenu = document.createElement('ul')
  editMenu.className = 'menu'

  const editButton = document.createElement('a')
  editButton.className = 'editButton'
  const editButtonContainer = document.createElement('li')
  editButtonContainer.appendChild(editButton)

  const deleteButton = document.createElement('a')
  deleteButton.className = 'deleteButton'
  const deleteButtonContainer = document.createElement('li') //         [noteDiv]
  deleteButtonContainer.appendChild(deleteButton) //                    [editMenu]
  //                                                                   [menuChild]
  const iconSettings = document.createElement('img') //                 /        \
  iconSettings.setAttribute('src', '/pictures/settings_icon.png') //   [iconSettings]  [buttonsContainer]
  const iconSettingsContainer = document.createElement('a')//                  /              \
  iconSettingsContainer.setAttribute('href', '#') //            [editButtonContainer]    [deleteButtonContainer]
  iconSettingsContainer.appendChild(iconSettings) //                 [editButton]             [deleteButton]

  const buttonsContainer = document.createElement('ul')
  buttonsContainer.className = 'submenu'

  buttonsContainer.appendChild(editButtonContainer)
  buttonsContainer.appendChild(deleteButtonContainer)

  const menuChild = document.createElement('li')
  menuChild.appendChild(iconSettingsContainer)
  menuChild.appendChild(buttonsContainer)

  editMenu.appendChild(menuChild)

  noteDiv.appendChild(editMenu)
  // editMenu

  setButtonToSave()

  function setButtonToSave () {
    editButton.innerHTML = 'EDIT'
    noteTextBox.disabled = true
    noteTextBoxTheme.disabled = true
    updatedAtContainer.style.visibility = 'visible'
    editButton.onclick = () => {
      handleNoteEdit()
    }
  }

  function handleNoteSave () {
    setButtonToSave()
    if (!noteTextBoxTheme.value) {
      noteTextBoxTheme.value = '[WITHOUT TITLE]'
    }
    notes.editNote(note.id, noteTextBoxTheme.value, noteTextBox.value)
      .then(updatedNote => {
        const dateAndTimeArr = formatDate(updatedNote.updatedAt).toUpperCase().split(', ')
        updatedAtTime.innerHTML = dateAndTimeArr[0]
        updatedAtDate.innerHTML = dateAndTimeArr[1]
      })
  }

  function handleNoteEdit () {
    editButton.innerHTML = 'SAVE'
    noteTextBox.disabled = false
    noteTextBoxTheme.disabled = false
    updatedAtContainer.style.visibility = 'hidden'
    editButton.onclick = () => {
      handleNoteSave()
    }
  }

  deleteButton.innerHTML = 'DELETE'
  deleteButton.onclick = () => {
    notes.deleteNote(note.id)
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
