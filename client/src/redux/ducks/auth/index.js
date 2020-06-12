// 1. imports
import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import api from '../../../utils/request'

// 2. action definitions
const LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS'
const LOGOUT = 'auth/LOGOUT'

// 3. initial state
const initialState = {
    example: '',
    isAuthenticated: false
}

// 4. reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
        return {...state, isAuthenticated: true}
    case LOGOUT:
        return {...state, isAuthenticated: false}
    default:
        return state
  }
}

function loginUser(username, password) {
    return dispatch => {
        return api.login(username, password)
        .then(resp => {
            dispatch({
                type: LOGIN_SUCCESS,
            })
        })
    }
}

function logoutUser() {
    return dispatch => {
        return api.logout().then(resp => {
            dispatch({
                type: LOGOUT,
            })
        })
    }
}

function signupUser(username, password) {
    return dispatch => {
        return api.signup(username, password).then(resp => {
            dispatch({
                type: LOGOUT,
            })
        })
    }
}

// 6. custom hook
export function useAuth() {
  const dispatch = useDispatch()
  const isAuthenticated = useSelector(appState => appState.authState.isAuthenticated)
  const login = (username, password) => dispatch(loginUser(username, password))
  const signup = (username, password) => dispatch(signupUser(username, password))
  const logout = () => dispatch(logoutUser())

  return { login, logout, signup, isAuthenticated }
}