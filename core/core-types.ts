export type defaultResponseType = {
    data: Array<object> | null;
    error?: string | null;
};

export type BuildDynamicQueryParams = {
    table: string;
    alias?: string | null;
    select?: string[];
    joins?: any[];
    where?: Record<string, any>;
    whereRaw?: string;
    whereIn?: Record<string, any[]>;
    whereBetween?: Record<string, [any, any]>;
    orderBy?: { column: string; direction?: "asc" | "desc" }[];
    limit?: number | null;
    offset?: number | null;
};

export type verifyAccessTokenType = {
    status: number | 400 | 401 | 403 | 404 | 500 ;
    message: string;
    data?: any;
};