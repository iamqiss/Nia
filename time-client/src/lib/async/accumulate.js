export async function accumulate(fn, pageLimit = 100) {
    let cursor;
    let acc = [];
    for (let i = 0; i < pageLimit; i++) {
        const res = await fn(cursor);
        cursor = res.cursor;
        acc = acc.concat(res.items);
        if (!cursor) {
            break;
        }
    }
    return acc;
}
//# sourceMappingURL=accumulate.js.map