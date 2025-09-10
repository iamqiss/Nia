import { useEffect, useMemo, useRef } from 'react';
import {} from 'react-native';
import { Platform } from 'react-native';
import { mergeRefs } from '#/lib/merge-refs';
export function useDraggableScroll({ outerRef, cursor = 'grab', } = {}) {
    const ref = useRef(null);
    useEffect(() => {
        if (Platform.OS !== 'web' || !ref.current) {
            return;
        }
        const slider = ref.current;
        let isDragging = false;
        let isMouseDown = false;
        let startX = 0;
        let scrollLeft = 0;
        const mouseDown = (e) => {
            isMouseDown = true;
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
            slider.style.cursor = cursor;
        };
        const mouseUp = () => {
            if (isDragging) {
                slider.addEventListener('click', e => e.stopPropagation(), { once: true });
            }
            isMouseDown = false;
            isDragging = false;
            slider.style.cursor = 'default';
        };
        const mouseMove = (e) => {
            if (!isMouseDown) {
                return;
            }
            // Require n pixels momement before start of drag (3 in this case )
            const x = e.pageX - slider.offsetLeft;
            if (Math.abs(x - startX) < 3) {
                return;
            }
            isDragging = true;
            e.preventDefault();
            const walk = x - startX;
            slider.scrollLeft = scrollLeft - walk;
            if (slider.contains(document.activeElement))
                document.activeElement?.blur?.();
        };
        slider.addEventListener('mousedown', mouseDown);
        window.addEventListener('mouseup', mouseUp);
        window.addEventListener('mousemove', mouseMove);
        return () => {
            slider.removeEventListener('mousedown', mouseDown);
            window.removeEventListener('mouseup', mouseUp);
            window.removeEventListener('mousemove', mouseMove);
        };
    }, [cursor]);
    const refs = useMemo(() => mergeRefs(outerRef ? [ref, outerRef] : [ref]), [ref, outerRef]);
    return {
        refs,
    };
}
//# sourceMappingURL=useDraggableScrollView.js.map