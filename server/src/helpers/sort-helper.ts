export type SortObject = Record<string, 1 | -1>;

export const processSortObject = (sort: any, defaultSort: SortObject = { created_at: -1 }, validFields: string[]): SortObject => {
    if (typeof sort !== 'object' || sort === null) return defaultSort; // Nếu không phải object, dùng mặc định

    // 🔹 Lọc bỏ các field không hợp lệ
    const validSortFields = Object.keys(sort)
        .filter((field) => sort[field] && (sort[field] === 1 || sort[field] === -1) && validFields.includes(field)) // Chỉ giữ field có `1 | -1` và có trong `validFields`
        .reduce((acc, field) => {
            acc[field] = sort[field];
            return acc;
        }, {} as SortObject);

    return Object.keys(validSortFields).length > 0 ? validSortFields : defaultSort; // Nếu không còn field nào, dùng mặc định
};
