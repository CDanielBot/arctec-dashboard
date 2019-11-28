import { useState, useEffect } from 'react'

export const useTemporaryMessage = () => {
  const [messageTimer, setMessageTimer] = useState(null)
  const [message, setMessage] = useState('')

  const showMessage = message => {
    messageTimer && clearTimeout(messageTimer)

    setMessage(message)
    setMessageTimer(setTimeout(() => setMessage(''), 5000))
  }

  const hideMessage = () => {
    if (messageTimer) {
      clearTimeout(messageTimer)
      setMessage('')
    }
  }

  useEffect(() => {
    return () => {
      messageTimer && clearTimeout(messageTimer)
    }
  }, [messageTimer])

  return [message, showMessage, hideMessage]
}
