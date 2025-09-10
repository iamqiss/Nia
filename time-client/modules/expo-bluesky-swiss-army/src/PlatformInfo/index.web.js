import { NotImplementedError } from '../NotImplemented';
import { AudioCategory } from './types';
export function getIsReducedMotionEnabled() {
    if (typeof window === 'undefined') {
        return false;
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
export function setAudioActive(active) {
    throw new NotImplementedError({ active });
}
export function setAudioCategory(audioCategory) {
    throw new NotImplementedError({ audioCategory });
}
//# sourceMappingURL=index.web.js.map