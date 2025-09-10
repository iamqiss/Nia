/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { type Lightbox } from '#/state/lightbox';
export default function ImageViewRoot({ lightbox: nextLightbox, onRequestClose, onPressSave, onPressShare, }: {
    lightbox: Lightbox | null;
    onRequestClose: () => void;
    onPressSave: (uri: string) => void;
    onPressShare: (uri: string) => void;
}): any;
//# sourceMappingURL=index.d.ts.map