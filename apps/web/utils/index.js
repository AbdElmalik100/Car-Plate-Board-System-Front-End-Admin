import { format, parse } from 'date-fns'
import { Timestamp } from 'firebase/firestore'


export const formatAvatarFallbackText = (text) => {
    const formattedText = text?.split(" ")
    const result = formattedText.length > 1 ? formattedText[0].charAt(0) + formattedText[1].charAt(0) : formattedText[0].charAt(0)
    return result.toUpperCase()
}

export const normalizePathname = (pathname = '') => {
    // remove query string and trailing slashes, keep root as '/'
    const noQuery = String(pathname).split('?')[0]
    const trimmed = noQuery.replace(/\/+$/, '')
    return trimmed === '' ? '/' : trimmed
}

export const canonicalPlateKey = (raw) => {
    const letters = raw.split('').filter((c) => /[\u0621-\u064A]/.test(c)).join('');
    const digits = raw.split('').filter((c) => /[0-9]/.test(c)).join('');
    return `${letters}|${digits}`;
}

export const formatExcelDate = (value) => {
    if (!value) return ""
    const date = parse(
        String(value).replaceAll("م", "/"),
        "dd/MM/yyyy",
        new Date()
    )
    return Timestamp.fromDate(date)
}

export const formatDate = (timestamp) => {    
    if (!timestamp) return ""
    return format(timestamp.toDate(), "dd/MM/yyyy")
}

export const generateLoginCode = (maxLength = 6) => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let username = ''
    for (let index of Array(maxLength).keys()) {
        const randomIndex = Math.floor(Math.random() * chars.length)
        username += chars[randomIndex]
    }
    return username
}