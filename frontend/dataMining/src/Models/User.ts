export type UserProfileToken = {
    user: string
    expires_at: number
    id: number
    refresh_token: string
    token: string
    training: boolean
}

export type UserProfile = {
    email: string
}