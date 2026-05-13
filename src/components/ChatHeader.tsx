import React from "react";

interface ChatHeaderProps {
    avatar?: string;
    name: string;
    isOnline: boolean;
}

export default function ChatHeader({avatar, name, isOnline}: ChatHeaderProps) {
    return (
        <header className="chat-header">
            <div className="chat-header__avatar">{avatar ?? "🤖"}</div>
            <div className="chat-header__info">
                <h1 className="chat-header__name">{name}</h1>
                <span className="chat-header__status">{isOnline ? "🟢 (Active)" : "🔴 (Offline)"}</span>
            </div>
        </header>
    )
}
