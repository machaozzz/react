import React, { createContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }){
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(()=>{
    const t = localStorage.getItem('token')
    const u = localStorage.getItem('user')
    if (t){ setToken(t); try{ setUser(JSON.parse(u)) }catch(e){ setUser(null) } }
  }, [])

  function saveAuth(t, u){
    setToken(t); setUser(u);
    localStorage.setItem('token', t);
    localStorage.setItem('user', JSON.stringify(u));
  }

  function logout(){ setToken(null); setUser(null); localStorage.removeItem('token'); localStorage.removeItem('user'); }

  return (
    <AuthContext.Provider value={{ user, token, saveAuth, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
