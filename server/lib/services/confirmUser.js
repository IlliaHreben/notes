const confirmUser = ({user}, connect) => {
  return connect
    .then(db => {
      const users = db.collection('users')
      return users.update(
        {_id: user._id},
        {'$set': {status: 'ACTIVE'}}
      )
    })
}

module.exports = confirmUser
