document.getElementById('registration').onclick = () => {
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value

  window.fetch('/api/registration', {
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
      window.alert('registration is successful')
      window.location.href = '/authorization'
    } else {
      window.alert(result.error)
    }
  })
}

document.getElementById('goToAuthorization').onclick = () => {
  window.location.href = `/authorization`
}
