import axios from 'axios'
import { API_URL } from '../../helpers/env'

export const REGISTER = (data) => {
    return new Promise((resolve, reject) => {
        axios.post(`${API_URL}register`, data).then((response) => {
            resolve(response.data)
        }).catch((err) => {
            reject(err)
        })
    })
}

export const LOGIN = (data) => {
    return new Promise((resolve, reject) => {
        axios.post(`${API_URL}login`, data).then((response) => {
            resolve(response.data)
        }).catch((err) => {
            reject(err)
        })
    })
}