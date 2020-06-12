import React from 'react'
import { Route, Redirect } from 'react-router-dom'

import { AuthService } from './request'

export default ({component: Component, ...rest}) => {
    return <Route {...rest} render={(props) => (
        AuthService.isAuthenticated()
          ? <Component {...props} />
          : <Redirect to='/login' />
      )} />
}