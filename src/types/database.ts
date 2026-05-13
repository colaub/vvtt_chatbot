export interface BotResponse {
    id: number
    pattern: string
    response: string
    response_type: "text" | "yesno"
    is_active: boolean
    created_at: string
    updated_at: string
}

