export const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'
export function apiUrl(path){
  if (!path) return API
  return API + (path.startsWith('/') ? path : '/' + path)
}