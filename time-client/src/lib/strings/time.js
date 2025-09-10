import {} from '@lingui/core';
export function niceDate(i18n, date) {
    const d = new Date(date);
    return i18n.date(d, {
        dateStyle: 'long',
        timeStyle: 'short',
    });
}
export function getAge(birthDate) {
    var today = new Date();
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}
/**
 * Get a Date object that is N years ago from now
 * @param years number of years
 * @returns Date object
 */
export function getDateAgo(years) {
    const date = new Date();
    date.setFullYear(date.getFullYear() - years);
    return date;
}
/**
 * Compares two dates by year, month, and day only
 */
export function simpleAreDatesEqual(a, b) {
    return (a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate());
}
//# sourceMappingURL=time.js.map