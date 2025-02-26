export function convertType(value: string, type: string): any {
    switch (type) {
        case 'number':
          return Number(value);
        case 'string':
          return String(value);
        case 'boolean':
          return Boolean(value);
        case 'date':
          return new Date(value);
        case 'array':
          return Array.isArray(value) ? value : [value];
        case 'object':
          return typeof value === 'object' ? value : {};
        default:
          return value;
      }
}