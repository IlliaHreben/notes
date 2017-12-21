import {users, errorHandler} from './requests.js'

document.getElementById('registration').onclick = () => {
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value

  users.registration(email, password)
  .then(data => {
    window.location.href = '/authorization'
  })
  .catch(errorHandler)
}

document.getElementById('goToAuthorization').onclick = () => {
  window.location.href = `/authorization`
}
