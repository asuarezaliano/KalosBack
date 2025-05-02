interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export class PaginationReturnDto<T> {
    data: T[];
    meta: PaginationMeta;
} 