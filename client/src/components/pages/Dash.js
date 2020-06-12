import React from 'react';
import { useAuth } from '../../hooks'

export default (props) => {
  const { signup, logout } = useAuth()
  function handleLogout() {
    logout().then(() => {
      props.history.push('/login')
    })
  }
  return (
    <div className="Dash">
      <h2>dashboard</h2>
      <button onClick={logout}>logout</button>
    </div>
  )
}