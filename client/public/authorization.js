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
  .then(result => {
    if (result.ok) {
      window.localStorage.setItem('token', result.data.token)
      window.alert('authorization is successful')
      window.location.href = `/`
    } else {
      errorHandler('emptyDiv', result.error)
    }
  })
}

document.getElementById('goToRegistration').onclick = () => {
  window.location.href = `/registration`
}
