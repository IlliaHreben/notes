const token = window.localStorage.getItem('token')

const notes = {
  getNotes: function (order) {
    return window.fetch(`/api/notes?order=${order}`, {
      headers: {
        'Authorization': token
      }
    })
    .then(handleResponse)
  },
  dellAllNotes: function () {
    return window.fetch('/api/notes', {
      method: 'DELETE',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    })
      .then(handleResponse)
  },
  sendNote: function (noteData) {
    return window.fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(noteData)
    })
    .then(handleResponse)
  },
  deleteNote: function (id) {
    return window.fetch('/api/notes/' + id, {
      method: 'DELETE',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    })
    .then(handleResponse)
  },
  editNote: function (id, theme, text) {
    return window.fetch('/api/notes/' + id, {
      method: 'PUT',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id, theme, text})
    })
    .then(handleResponse)
  }
}
const users = {
  authorization: function (email, password) {
    return window.fetch('/api/authorization', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email, password})
    })
    .then(handleResponse)
  },
  registration: function (email, password) {
    return window.fetch('/api/registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email, password})
    })
    .then(handleResponse)
  },
  getUser: function () {
    return window.fetch(`/api/user`, {
      headers: {
        'Authorization': token
      }
    })
    .then(handleResponse)
  }
}

function errorHandler (errorResult) {
  const errorDiv = document.createElement('div')
  errorDiv.id = 'error'
  errorDiv.className = 'message'
  const errorCloseLink = document.createElement('a')
  errorCloseLink.id = 'close'
  errorCloseLink.title = 'close'
  errorCloseLink.href = '#'
  errorCloseLink.innerHTML = '&times;'
  errorCloseLink.onclick = () => {
    errorDiv.setAttribute('style', 'display: none')
  }
  const errorSpan = document.createElement('span')
  const errorSpanWarningNode = document.createTextNode('Error! ')
  const errorSpanMessageNode = document.createTextNode(errorResult.message)
  errorSpan.appendChild(errorSpanWarningNode)
  errorDiv.appendChild(errorCloseLink)
  errorDiv.appendChild(errorSpan)
  errorDiv.appendChild(errorSpanMessageNode)
  document.body.appendChild(errorDiv)
  const delayRemoveDiv = new Promise((resolve, reject) => { // is it correct?
    setTimeout(() => {
      resolve(errorDiv)
    }, 3000)
  })

  delayRemoveDiv.then(errorDiv => document.body.removeChild(errorDiv))
}

function handleResponse (res) {
  return res.text()
    .then(JSON.parse)
    .then(body => {
      if (body.ok) {
        return body.data
      }
      throw body.error
    })
}

export {notes, users, errorHandler}
