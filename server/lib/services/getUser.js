const gravatar = require('gravatar-api')

const getAvatar = ({user}) => {
  return Promise.resolve()
    .then(() => {
      const avatarUrl = gravatar.imageUrl({
        email: user.email,
        parameters: {size: '50'}
      })
      return {
        avatarUrl,
        email: user.email
      }
    })
}

module.exports = getAvatar
