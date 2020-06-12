import axios from 'axios'

class Storage {
    static getItem(key) {
        return localStorage.getItem(key)
    }

    static setItem(key, value) {
        return localStorage.setItem(key, value)
    }

    static removeItem(key) {
        return localStorage.removeItem(key)
    }
}

class Request {
    constructor(config = {}) {
        this.prefix = config.prefix || '/api'
    }

    request = (url, method, data) => {
        const urlPath = this.prefix + url
        let prom
        if (data) {
            prom = axios[method](urlPath, data)
        } else {
            prom = axios[method](urlPath)
        }
        return new Promise((res, rej) => {
            prom.then(resp => {
                res(resp.data)
            }).catch(err => {
                rej(err.response)
            })
        })
    }

    get = (url) => {
        return this.request(url, 'get')
    }

    put = (url, data) => {
        return this.request(url, 'put', data)
    }

    patch = (url, data) => {
        return this.request(url, 'patch', data)
    }

    post = (url, data) => {
        return this.request(url, 'post', data)
    }
}

class AuthService {
    static login = (username, password) => {
        const userToLogin = {
            username: username,
            password: password
        }
        return api.post('/login', userToLogin)
        .then(resp => {
            Storage.setItem('authToken', resp.token)
            return resp
        })
    }

    static signup = (username, password) => {
        const userToRegister = {
            username: username,
            password: password
        }
        return api.post('/registration', userToRegister)
    }

    static logout = () => {
        return new Promise((res, rej) => {
            Storage.removeItem('authToken')
            res(true)
        })
    }
}

const api = new Request()
api.login = AuthService.login
api.signup = AuthService.signup
api.logout = AuthService.logout

export default api