import React from "react"
import { useState } from "react"

const ADMIN_PASSWORD = "vvtt-sept"  // ← ton mot de passe hardcodé

interface ProtectedRouteProps {
    children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [password, setPassword] = useState<string>("")
    const [error, setError] = useState<string | null>(null)

    function handleLogin() {
        if (password === ADMIN_PASSWORD) {
            setIsAuthenticated(true)
            setError(null)
        } else {
            setError("Incorrect password")
            setPassword("")
        }
    }

    if (isAuthenticated) return <>{children}</>

    return (
        <div className="login">
            <div className="login-card">
                <h1 className="login-card__title">Admin Access</h1>
                <p className="login-card__subtitle">Enter your password to continue</p>
                {error && <div className="login-card__error">{error}</div>}
                <input
                    className="admin-input"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleLogin()}
                    autoFocus
                />
                <button className="admin-btn admin-btn--primary" onClick={handleLogin}>
                    Login
                </button>
            </div>
        </div>
    )
}
