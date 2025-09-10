import * as React from 'react';
import { GifViewProps } from './GifView.types';
export declare class GifView extends React.PureComponent<GifViewProps> {
    private readonly videoPlayerRef;
    private isLoaded;
    constructor(props: GifViewProps | Readonly<GifViewProps>);
    componentDidUpdate(prevProps: Readonly<GifViewProps>): void;
    static prefetchAsync(_: string[]): Promise<void>;
    private firePlayerStateChangeEvent;
    private onLoad;
    playAsync(): Promise<void>;
    pauseAsync(): Promise<void>;
    toggleAsync(): Promise<void>;
    render(): any;
}
//# sourceMappingURL=GifView.web.d.ts.map