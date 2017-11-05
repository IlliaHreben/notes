document.getElementById('authorization').onclick = () => {
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value

  if (email === '') {
    window.alert('email was not entered')
    return
  } else if (password === '') {
    window.alert('password was not entered')
  }

  window.fetch('/api/authorization', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({email, password})
  })
  .then(res => res.text())
  .then(JSON.parse)
  .then(result => {
    if (result.ok) {
      window.localStorage.setItem('token', result.data.token)
      window.alert('authorization is successful')
      window.location.href = `/`
    } else {
      window.alert(result.error)
    }
  })
}

document.getElementById('goToRegistration').onclick = () => {
  window.location.href = `/registration`
}
