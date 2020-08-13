// use localStorage to store the user info, which might be sent from server in actual project.
// 用户信息
export function getUserInfo() {
  return JSON.parse(localStorage.getItem('smartim-user') || '{}');
}

export function setUserInfo(user) {
  return localStorage.setItem('smartim-user', JSON.stringify(user || {}));
}

export function getUserMenu() {
  return JSON.parse(localStorage.getItem('smartim-menu') || '{}');
}

export function setUserMenu(menu) {
  return localStorage.setItem('smartim-menu', JSON.stringify(menu || {}));
}
// 当前租户信息
export function getCurrentOwer() {
  return JSON.parse(localStorage.getItem('smartim-curr-ower'));
}

export function setCurrentOwer(ower) {
  return localStorage.setItem('smartim-curr-ower', JSON.stringify(ower));
}
