export interface departmentData {
    id: number,
    name: string
}

export interface department {
    success: boolean,
    status: number,
    message: string,
    data: departmentData[]
}