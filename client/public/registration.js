import {users} from './requests.js'

document.getElementById('registration').onclick = () => {
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value

  users.registration(email, password)
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
