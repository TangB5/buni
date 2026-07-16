export declare const apiClient: import("axios").AxiosInstance;
export declare function get<T>(url: string, params?: Record<string, unknown>): Promise<T>;
export declare function post<T, D = unknown>(url: string, data?: D): Promise<T>;
export declare function put<T, D = unknown>(url: string, data?: D): Promise<T>;
export declare function patch<T, D = unknown>(url: string, data?: D): Promise<T>;
export declare function del<T>(url: string): Promise<T>;
//# sourceMappingURL=index.d.ts.map