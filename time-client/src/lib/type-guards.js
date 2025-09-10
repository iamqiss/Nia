export function isObj(v) {
    return !!v && typeof v === 'object';
}
export function hasProp(data, prop) {
    return prop in data;
}
export function isStrArray(v) {
    return Array.isArray(v) && v.every(item => typeof item === 'string');
}
//# sourceMappingURL=type-guards.js.map