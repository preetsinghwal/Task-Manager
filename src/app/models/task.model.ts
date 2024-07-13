export interface Task {
    id: string,
    name: string,
    dueDate: string,
    priority: 'High' | 'Medium' | 'Low',
    notes: string,
    tags?: string[],
    completed: boolean
}
