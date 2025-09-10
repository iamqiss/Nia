import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { GifViewProps } from './GifView.types';
export class GifView extends React.PureComponent {
    videoPlayerRef = React.createRef();
    isLoaded = false;
    constructor(props) {
        super(props);
    }
    componentDidUpdate(prevProps) {
        if (prevProps.autoplay !== this.props.autoplay) {
            if (this.props.autoplay) {
                this.playAsync();
            }
            else {
                this.pauseAsync();
            }
        }
    }
    static async prefetchAsync(_) {
        console.warn('prefetchAsync is not supported on web');
    }
    firePlayerStateChangeEvent = () => {
        this.props.onPlayerStateChange?.({
            nativeEvent: {
                isPlaying: !this.videoPlayerRef.current?.paused,
                isLoaded: this.isLoaded,
            },
        });
    };
    onLoad = () => {
        // Prevent multiple calls to onLoad because onCanPlay will fire after each loop
        if (this.isLoaded) {
            return;
        }
        this.isLoaded = true;
        this.firePlayerStateChangeEvent();
    };
    async playAsync() {
        this.videoPlayerRef.current?.play();
    }
    async pauseAsync() {
        this.videoPlayerRef.current?.pause();
    }
    async toggleAsync() {
        if (this.videoPlayerRef.current?.paused) {
            await this.playAsync();
        }
        else {
            await this.pauseAsync();
        }
    }
    render() {
        return (_jsx("video", { src: this.props.source, autoPlay: this.props.autoplay ? 'autoplay' : undefined, preload: this.props.autoplay ? 'auto' : undefined, playsInline: true, loop: "loop", muted: "muted", style: StyleSheet.flatten(this.props.style), onCanPlay: this.onLoad, onPlay: this.firePlayerStateChangeEvent, onPause: this.firePlayerStateChangeEvent, "aria-label": this.props.accessibilityLabel, ref: this.videoPlayerRef }));
    }
}
//# sourceMappingURL=GifView.web.js.map