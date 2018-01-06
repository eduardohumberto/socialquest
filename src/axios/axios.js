import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://socialquest-b5d0d.firebaseio.com/'
})

// instance.defaults.headers.common['SOMETHING'] = 'something'

export default instance
