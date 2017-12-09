import {users, errorHandler} from './requests.js'

document.getElementById('authorization').onclick = () => {
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value

  users.authorization(email, password)
  .then(data => {
    window.localStorage.setItem('token', data.token)
    window.location.href = `/`
  })
  .catch(errorHandler)
}

document.getElementById('goToRegistration').onclick = () => {
  window.location.href = `/registration`
}
