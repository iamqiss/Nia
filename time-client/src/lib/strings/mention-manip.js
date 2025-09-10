export function getMentionAt(text, cursorPos) {
    let re = /(^|\s)@([a-z0-9.-]*)/gi;
    let match;
    while ((match = re.exec(text))) {
        const spaceOffset = match[1].length;
        const index = match.index + spaceOffset;
        if (cursorPos >= index &&
            cursorPos <= index + match[0].length - spaceOffset) {
            return { value: match[2], index };
        }
    }
    return undefined;
}
export function insertMentionAt(text, cursorPos, mention) {
    const target = getMentionAt(text, cursorPos);
    if (target) {
        return `${text.slice(0, target.index)}@${mention} ${text.slice(target.index + target.value.length + 1)}`;
    }
    return text;
}
//# sourceMappingURL=mention-manip.js.map