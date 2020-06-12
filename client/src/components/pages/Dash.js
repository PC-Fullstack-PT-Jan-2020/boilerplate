import React from 'react';
import { useAuth } from '../../hooks'

export default (props) => {
  const { logout } = useAuth()
  return (
    <div className="Dash">
      <h2>dashboard</h2>
      <button onClick={logout}>logout</button>
    </div>
  )
}