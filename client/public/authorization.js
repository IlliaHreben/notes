import {users, errorHandler} from './requests.js'

document.getElementById('authorization').onclick = () => {
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value

  if (email === '') {
    window.alert('email was not entered')
    return
  } else if (password === '') {
    window.alert('password was not entered')
  }

  users.authorization(email, password)
  .then(data => {
    window.localStorage.setItem('token', data.token)
    window.location.href = `/`
  })
  .catch(error => errorHandler('emptyDiv', error))
}

document.getElementById('goToRegistration').onclick = () => {
  window.location.href = `/registration`
}
