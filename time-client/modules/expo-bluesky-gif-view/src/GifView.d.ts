import React from 'react';
import { GifViewProps } from './GifView.types';
export declare class GifView extends React.PureComponent<GifViewProps> {
    private nativeRef;
    constructor(props: GifViewProps | Readonly<GifViewProps>);
    static prefetchAsync(sources: string[]): Promise<void>;
    playAsync(): Promise<void>;
    pauseAsync(): Promise<void>;
    toggleAsync(): Promise<void>;
    render(): any;
}
//# sourceMappingURL=GifView.d.ts.map