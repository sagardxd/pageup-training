export interface departmentData {
    id: number,
    name: string
}

export interface departments {
    success: boolean,
    status: number,
    message: string,
    data: departmentData[]
}

export interface department {
    success: boolean,
    status: number,
    message: string,
    data: departmentData
}
export interface postDepartmentResponse {
    success: boolean,
    status: number,
    message: string,
    data: number
}
export interface deleteDepartmentResponse {
    success: boolean,
    status: number,
    message: string,
    data: boolean
}