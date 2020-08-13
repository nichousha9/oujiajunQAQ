// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  return localStorage.getItem('smartim-authority') || 'admin';
}

export function setAuthority(authority) {
  return localStorage.setItem('smartim-authority', authority);
}