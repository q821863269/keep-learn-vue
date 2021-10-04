import request from '@/utils/request'

export function page (queryParams) {
  return request({
    url: '/admin/roles',
    method: 'get',
    params: queryParams
  })
}

export function list () {
  return request({
    url: '/admin/roles/list',
    method: 'get'
  })
}

export function detail (id) {
  return request({
    url: '/admin/roles/' + id,
    method: 'get'
  })
}

export function add (data) {
  return request({
    url: '/admin/roles',
    method: 'post',
    data: data
  })
}

export function update (id, data) {
  return request({
    url: '/admin/roles/' + id,
    method: 'put',
    data: data
  })
}

export function patch (id, data) {
  return request({
    url: '/admin/roles/' + id,
    method: 'patch',
    data: data
  })
}

export function del (ids) {
  return request({
    url: '/admin/roles/' + ids,
    method: 'delete'
  })
}

export function roleMenuList (id) {
  return request({
    url: '/admin/roles/' + id + '/menus',
    method: 'get'
  })
}

export function rolePermissionList (id, params) {
  return request({
    url: '/admin/roles/' + id + '/permissions',
    method: 'get',
    params: params
  })
}

export function updateRoleMenu (id, menuIds) {
  return request({
    url: '/admin/roles/' + id + '/menus',
    method: 'put',
    data: { menuIds }
  })
}

export function updateRolePermission (roleId, menuId, permissionIds) {
  return request({
    url: '/admin/roles/' + roleId + '/permissions',
    method: 'put',
    data: { menuId, permissionIds }
  })
}
