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
  sendNote: function (text) {
    return window.fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({text})
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
  editNote: function (id, text) {
    return window.fetch('/api/notes/' + id, {
      method: 'PUT',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id, text})
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
    .then(res => res.text())
    .then(JSON.parse)
  },
  registration: function (email, password) {
    return window.fetch('/api/registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email, password})
    })
    .then(res => res.text())
    .then(JSON.parse)
  }
}

function handleResponse (res) {
  return res.text()
    .then(JSON.parse)
    .then(body => {
      if (body.ok) {
        return body.data
      }
      throw new Error(body.error)
    })
}

export {notes, users}
