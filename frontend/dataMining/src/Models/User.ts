export type UserProfileToken = {
    id: number
    email: string,
    access_token: string,
    age: number,
    department: string,
    branch: string
}

export type UserProfile = {
    email: string,
    id: string
}