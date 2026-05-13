import ChatHeader from "../components/ChatHeader.tsx";
import ChatWindow from "../components/ChatWindow.tsx";
import ChatInputBar from "../components/ChatInputBar.tsx";
import {getTypingDelay, botConfig, createMessage, getAnswer, type Message} from "../core/bot.ts";
import React, {useEffect, useState} from "react";
import type {BotResponse} from "../types/database";
import { fetchResponses } from "../core/bot"

export default function App() {

    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [responses, setResponses] = useState<BotResponse[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)


    useEffect(() => {
        async function loadResponses() {
            try {
                setLoading(true)
                const data = await fetchResponses()
                setResponses(data)
            } catch (err) {
                setError("Failed to fetch responses.")
            } finally {
                setLoading(false)
            }
        }
        loadResponses()
        setMessages([createMessage(botConfig.welcome, "bot")])
    }, [])

    const handleSendMessage = (message: string) => {
        setMessages(prev => [...prev, createMessage(message, "user")])
        setIsTyping(true);

        const botAnswer = getAnswer(message, responses);
        setTimeout(() => {
            setIsTyping(false)
            setMessages(prev => [...prev, createMessage(botAnswer, "bot")])
        }, getTypingDelay(botAnswer))
    }

    if (loading) return <div className="app-loading">Loading...</div>
    if (error) return <div className="app-error">{error}</div>

    return (
        <div className="chat-wrapper">
            <div className="app">
                <ChatHeader name={botConfig.name} isOnline={botConfig.isOnline} />
                <ChatWindow messages={messages} isTyping={isTyping} />
                <ChatInputBar onSend={handleSendMessage} disabled={isTyping} />
            </div>
        </div>
    )
}

