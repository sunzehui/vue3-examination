import { MockMethod } from 'vite-plugin-mock'
export default [
  {
    url: '/api/',
    method: 'get',
    response: () => {},
  },
] as MockMethod[]
