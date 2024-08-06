export interface departmentData {
    id: number,
    name: string,
    createdBy: number
    updatedBy: number | null
    createdOn: Date
    updatedOn: Date | null
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

export interface paginatedBody {
    pageIndex: number,
    pagedItemsCount: number,
    orderKey: string,
    sortedOrder: number,
    search: string
}

export interface paginatedDepartmentData {
    success: boolean,
    status: number,
    message: string,
    data: paginatedData
}

export interface paginatedData {
    data: departmentData[]
    totalPages: number,
    totalItems: number
}
export interface paginatedDepartmentDataList {
    data: paginatedData

}