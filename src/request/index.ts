import axios from 'axios'
//@ts-ignore

const request = axios.create()

// response 拦截器
request.interceptors.response.use(
  response => {
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

export default request
