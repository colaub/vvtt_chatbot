import React, {useEffect, useRef} from "react";
import { motion, AnimatePresence } from "framer-motion"

import type {Message} from "../core/bot.ts";

// animation
const messageVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit:    { opacity: 0, scale: 0.95 }
}

interface ChatWindowProps {
    messages: Message[];
    isTyping: boolean;
}

function TypingIndicator() {
    return (
        <motion.article
            className="message message--bot message--typing"
            id="typing-indicator"
            variants={messageVariants}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.2, ease: "easeOut" }}>
            <span className="typing-dot"></span>
            <span className="typing-dot"></span>
            <span className="typing-dot"></span>
        </motion.article>
    )
}

export default function ChatWindow({messages, isTyping}: ChatWindowProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" })
        }, 100)
        return () => clearTimeout(timeout)
    }, [isTyping, messages])

    return (
        <main className="chat-window">
            <AnimatePresence>
                {
                    messages.map(msg => (
                        <motion.article
                            key={msg.id}
                            className={`message message--${msg.sender}`}
                            variants={messageVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{ duration: 0.2, ease: "easeOut" }}>
                            <p className="message__text">{msg.message}</p>
                        </motion.article>
                    ))
                }
                {isTyping && <TypingIndicator />}
            </AnimatePresence>
            <div ref={bottomRef}/>
        </main>
    )
}

