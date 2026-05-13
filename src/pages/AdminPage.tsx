import React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import type {BotResponse} from "../types/database"
import { fetchAllResponses, createResponse, updateResponse, deleteResponse, toggleResponse } from "../core/bot"

export default function AdminPage() {
    const [responses, setResponses] = useState<BotResponse[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    // Form state
    const [pattern, setPattern] = useState<string>("")
    const [response, setResponse] = useState<string>("")
    const [editingId, setEditingId] = useState<number | null>(null)
    const [responseType, setResponseType] = useState<"text" | "yesno">("text")

    useEffect(() => {
        loadResponses()
    }, [])

    async function loadResponses() {
        try {
            setLoading(true)
            const data = await fetchAllResponses()
            setResponses(data)
        } catch (err) {
            setError("Failed to load responses")
        } finally {
            setLoading(false)
        }
    }

    function isValidRegex(pattern: string): boolean {
        try {
            new RegExp(pattern)
            return true
        } catch {
            return false
        }
    }

    async function handleSubmit() {
        if (!pattern.trim()) return
        if (responseType === "text" && !response.trim()) return
        if (!isValidRegex(pattern)) {
            setError("Invalid regexp pattern — please check your syntax")
            return
        }

        try {
            if (editingId) {
                await updateResponse(editingId, pattern, response, responseType)
            } else {
                await createResponse(pattern, response, responseType)
            }
            setPattern("")
            setResponse("")
            setResponseType("text")
            setEditingId(null)
            setError(null)
            await loadResponses()
        } catch (err) {
            setError("Failed to save response")
        }
    }

    function handleEdit(r: BotResponse) {
        setEditingId(r.id)
        setPattern(r.pattern)
        setResponse(r.response)
        setResponseType(r.response_type)
    }

    function handleCancel() {
        setEditingId(null)
        setPattern("")
        setResponse("")
    }

    async function handleDelete(id: number) {
        if (!confirm("Delete this response?")) return
        try {
            await deleteResponse(id)
            await loadResponses()
        } catch (err) {
            setError("Failed to delete response")
        }
    }

    async function handleToggle(id: number, is_active: boolean) {
        try {
            await toggleResponse(id, !is_active)
            await loadResponses()
        } catch (err) {
            setError("Failed to update response")
        }
    }

    if (loading) return <div className="admin-loading">Loading...</div>

    return (
        <div className="admin">

            {/* HEADER */}
            <header className="admin-header">
                <h1>Admin — Response Manager</h1>
                <Link to="/" className="admin-header__back">← Back to chat</Link>
            </header>

            {/* ERROR */}
            {error && <div className="admin-error">{error}</div>}

            {/* FORM */}
            <section className="admin-form">
                <h2>{editingId ? "Edit response" : "Add a response"}</h2>

                <input
                    className="admin-input"
                    type="text"
                    placeholder="Pattern (e.g. hello|hi|hey)"
                    value={pattern}
                    onChange={e => setPattern(e.target.value)}
                />

                <select
                    className="admin-input"
                    value={responseType}
                    onChange={e => setResponseType(e.target.value as "text" | "yesno")}
                >
                    <option value="text">Text response</option>
                    <option value="yesno">Yes / No</option>
                </select>

                {responseType === "text" && (
                    <textarea
                        className="admin-textarea"
                        placeholder="Bot response"
                        value={response}
                        onChange={e => setResponse(e.target.value)}
                    />
                )}

                {responseType === "yesno" && (
                    <p className="admin-form__hint">
                        The bot will randomly answer <strong>Yes</strong> or <strong>No</strong>.
                    </p>
                )}

                <div className="admin-form__actions">
                    <button className="admin-btn admin-btn--primary" onClick={handleSubmit}>
                        {editingId ? "Save changes" : "Add response"}
                    </button>
                    {editingId && (
                        <button className="admin-btn admin-btn--secondary" onClick={handleCancel}>
                            Cancel
                        </button>
                    )}
                </div>
            </section>

            {/* LIST */}
            <section className="admin-list">
                <h2>Responses ({responses.length})</h2>
                {responses.map(r => (
                    <article key={r.id} className={`admin-card ${!r.is_active ? "admin-card--inactive" : ""}`}>
                        <div className="admin-card__content">
                            <code className="admin-card__pattern">{r.pattern}</code>
                            <p className="admin-card__response">
                                {r.response_type === "yesno" ? "🎲 Yes / No" : r.response}
                            </p>
                            <div className="admin-card__badges">
                <span className={`admin-card__badge admin-card__badge--type`}>
                  {r.response_type === "yesno" ? "Yes/No" : "Text"}
                </span>
                                {!r.is_active && (
                                    <span className="admin-card__badge admin-card__badge--inactive">Inactive</span>
                                )}
                            </div>
                        </div>
                        <div className="admin-card__actions">
                            <button
                                className="admin-btn admin-btn--small"
                                onClick={() => handleToggle(r.id, r.is_active)}
                            >
                                {r.is_active ? "Disable" : "Enable"}
                            </button>
                            <button
                                className="admin-btn admin-btn--small"
                                onClick={() => handleEdit(r)}
                            >
                                Edit
                            </button>
                            <button
                                className="admin-btn admin-btn--small admin-btn--danger"
                                onClick={() => handleDelete(r.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </article>
                ))}
            </section>

        </div>
    )
}
