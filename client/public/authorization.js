document.getElementById('authorization').onclick = () => {
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value

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
      window.alert('authorization is successful')
      window.location.href = `/?email=${email}&password=${password}`
    } else {
      window.alert(result.error)
    }
  })
}
