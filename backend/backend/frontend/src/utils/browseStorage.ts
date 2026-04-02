export type SortOrder = 'asc' | 'desc'

export interface BrowseState {
    category: string
    pageNum: number
    pageSize: number
    sortOrder: SortOrder
}

const BROWSE_STORAGE_KEY = 'bookstore-browse'

export function loadBrowseState(): BrowseState | null {
    try {
        const raw = sessionStorage.getItem(BROWSE_STORAGE_KEY)
        if (!raw) return null
        const parsed = JSON.parse(raw) as BrowseState
        if (
            typeof parsed?.pageNum !== 'number' ||
            typeof parsed?.pageSize !== 'number' ||
            (parsed.sortOrder !== 'asc' && parsed.sortOrder !== 'desc')
        ) {
            return null
        }
        return {
            category: typeof parsed.category === 'string' ? parsed.category : '',
            pageNum: parsed.pageNum,
            pageSize: parsed.pageSize,
            sortOrder: parsed.sortOrder,
        }
    } catch {
        return null
    }
}

export function saveBrowseState(state: BrowseState) {
    sessionStorage.setItem(BROWSE_STORAGE_KEY, JSON.stringify(state))
}
