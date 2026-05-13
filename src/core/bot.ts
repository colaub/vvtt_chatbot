
import { supabase } from "../lib/supabase"
import type {BotResponse} from "../types/database"

export async function fetchResponses(): Promise<BotResponse[]> {
    const { data, error } = await supabase
        .from("responses")
        .select("*")
        .eq("is_active", true)

    if (error) {
        console.error("Erreur Supabase:", error)
        return []
    }

    return data ?? []
}


export async function fetchAllResponses(): Promise<BotResponse[]> {
    const { data, error } = await supabase
        .from("responses")
        .select("*")
    if (error) {
        console.error("Erreur Supabase:", error)
        return []
    }

    return data ?? []
}

export async function createResponse(
    pattern: string,
    response: string,
    response_type: "text" | "yesno" = "text"
): Promise<void> {
    const { error } = await supabase
        .from("responses")
        .insert({ pattern, response, response_type })

    if (error) throw error
}

export async function updateResponse(
    id: number,
    pattern: string,
    response: string,
    response_type: "text" | "yesno" = "text"
): Promise<void> {
    const { error } = await supabase
        .from("responses")
        .update({ pattern, response, response_type, updated_at: new Date().toISOString() })
        .eq("id", id)

    if (error) throw error
}

export async function deleteResponse(id: number): Promise<void> {
    const { error } = await supabase
        .from("responses")
        .delete()
        .eq("id", id)

    if (error) throw error
}

export async function toggleResponse(id: number, is_active: boolean): Promise<void> {
    const { error } = await supabase
        .from("responses")
        .update({ is_active })
        .eq("id", id)

    if (error) throw error
}



export interface Message {
    id: string;
    message: string;
    sender: "bot" | "user";
    timestamp: string;
}

interface BotConfig {
    name: string;
    welcome: string;
    isOnline: boolean;
    maxMessages?: number;
}

interface BotAnswer {
    keywords: string[];
    message: string;
}

const botAnswers: BotAnswer[] = [
    {
        keywords: ["hello", "bonjour", "hi", "salut", "hey", "yoyo", "yo"],
        message: "Hello! How can I help you?",
    },
    {
        keywords: ["drink", "beer"],
        message: "Sure! you have to drink beers!",
    },
    {
        keywords: ["merci", "thanks", "thx"],
        message: "You're welcome!",
    },
    {
        keywords: ["sarko"],
        message: "merci",
    },
]

const defaultBotAnswer = "I don't know what you want... but let's drink a beer!🍻"

export const botConfig: BotConfig = {
    name: "VVTT Chat Bot",
    welcome: "Hello! I am the VVTT Chat Bot!",
    isOnline: true,
}

export function createMessage(message: string, sender: "bot" | "user"): Message {
    return {
        id: crypto.randomUUID(),
        message: message,
        sender: sender,
        timestamp: new Date().toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit"
        })
    }
}

export function getAnswer(input: string, responses: BotResponse[]): string {
    const match = responses.find(r => {
        try {
            const regex = new RegExp(r.pattern, "i")
            return regex.test(input)
        } catch (err) {
            console.error(`Invalid regexp pattern: ${r.pattern}`, err)
            return false
        }
    })

    if (!match) return defaultBotAnswer

    switch (match.response_type) {
        case "yesno":
            return Math.random() > 0.5 ? "Yes" : "No"
        case "text":
        default:
            return match.response
    }
}

export function getTypingDelay(message: string): number {
    const baseDelay: number = 500
    const perCharDelay: number = 30
    const maxDelay: number = 3000

    return Math.min(baseDelay + message.length * perCharDelay, maxDelay)
}

