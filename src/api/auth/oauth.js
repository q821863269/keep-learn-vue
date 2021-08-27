import request from '@/utils/request'
import { Base64 } from 'js-base64'
import { clientId, clientSecret } from '@/settings'

export function login (data) {
  const authorization = 'Basic ' + Base64.encode(`${clientId}:${clientSecret}`)
  return request({
    url: '/auth/oauth/token',
    method: 'post',
    params: data,
    headers: {
      'Authorization': authorization
    }
  })
}

export function logout () {
  return request({
    url: '/auth/oauth/logout',
    method: 'delete'
  })
}
