import {} from '#/alf/types';
export function select(name, options) {
    switch (name) {
        case 'light':
            return options.light;
        case 'dark':
            return options.dark || options.dim;
        case 'dim':
            return options.dim || options.dark;
        default:
            throw new Error(`select(theme, options) received unknown theme ${name}`);
    }
}
//# sourceMappingURL=themeSelector.js.map