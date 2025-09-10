import { useEffect, useState } from 'react';
export function useTLDs() {
    const [tlds, setTlds] = useState();
    useEffect(() => {
        // @ts-expect-error - valid path
        import('tldts/dist/index.cjs.min.js').then(tlds => {
            setTlds(tlds);
        });
    }, []);
    return tlds;
}
//# sourceMappingURL=useTLDs.js.map