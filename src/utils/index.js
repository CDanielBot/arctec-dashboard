const trimEmail = email => {
  const index = email.indexOf('@')
  const trimmedEmail = email.substring(0, index)

  return trimmedEmail
}

export default trimEmail
