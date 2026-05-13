import React from "react"
import { Routes, Route } from "react-router-dom"
import ChatBot from "./pages/ChatBot"
import AdminPage from "./pages/AdminPage"
import ProtectedRoute from "./components/ProtectedRoute"

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<ChatBot />} />
            <Route path="/admin" element={
                <ProtectedRoute> <AdminPage /> </ProtectedRoute>
            } />
        </Routes>
    )
}
