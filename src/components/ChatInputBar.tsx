import React, {useEffect, useRef, useState} from "react";

interface ChatInputBarProps {
    onSend: (text: string) => void;
    disabled: boolean;
}

export default function ChatInputBar({onSend, disabled}: ChatInputBarProps) {

    const [value, setValue] = useState<string>("");

    const handleSendMessage = () => {
        if (!value) return
        onSend(value.trim())
        setValue("")
    }

    const focusRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (disabled) return
        focusRef.current?.focus()
    }, [disabled])

    return (
        <footer className="chat-footer">
            <input
                ref = {focusRef}
                className="chat-footer__input"
                type="text"
                placeholder="Enter your message here..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSendMessage()}
                disabled={disabled}
            />
            <button
                className="chat-footer__button"
                onClick={() => {handleSendMessage()}}
                disabled={disabled}>
                    Send
            </button>
        </footer>
    )
}
