import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import '../index.css';
import { AppBskyFeedDefs, AtpAgent } from '@atproto/api';
import { h, render } from 'preact';
import logo from '../../assets/logo.svg';
import { applyTheme, initSystemColorMode } from '../color-mode';
import { Container } from '../components/container';
import { Link } from '../components/link';
import { Post } from '../components/post';
import { getRkey } from '../util/rkey';
const root = document.getElementById('app');
if (!root)
    throw new Error('No root element');
const agent = new AtpAgent({
    service: 'https://public.api.bsky.app',
});
const uri = `at://${window.location.pathname.slice('/embed/'.length)}`;
if (!uri) {
    throw new Error('No uri in path');
}
const query = new URLSearchParams(window.location.search);
// theme - default to light mode
const colorMode = query.get('colorMode');
switch (colorMode) {
    case 'dark':
        applyTheme('dark');
        break;
    case 'system':
        initSystemColorMode();
        break;
    case 'light':
    default:
        applyTheme('light');
        break;
}
agent
    .getPostThread({
    uri,
    depth: 0,
    parentHeight: 0,
})
    .then(({ data }) => {
    if (!AppBskyFeedDefs.isThreadViewPost(data.thread)) {
        throw new Error('Expected a ThreadViewPost');
    }
    const pwiOptOut = !!data.thread.post.author.labels?.find(label => label.val === '!no-unauthenticated');
    if (pwiOptOut) {
        render(_jsx(PwiOptOut, { thread: data.thread }), root);
    }
    else {
        render(_jsx(Post, { thread: data.thread }), root);
    }
})
    .catch(err => {
    console.error(err);
    render(_jsx(ErrorMessage, {}), root);
});
function PwiOptOut({ thread }) {
    const href = `/profile/${thread.post.author.did}/post/${getRkey(thread.post)}`;
    return (_jsxs(Container, { href: href, children: [_jsx(Link, { href: href, className: "transition-transform hover:scale-110 absolute top-4 right-4", children: _jsx("img", { src: logo, className: "h-6" }) }), _jsxs("div", { className: "w-full py-12 gap-4 flex flex-col items-center", children: [_jsx("p", { className: "max-w-80 text-center w-full text-textLight dark:text-textDimmed", children: "The author of this post has requested their posts not be displayed on external sites." }), _jsx(Link, { href: href, className: "max-w-80 rounded-lg bg-brand text-white text-center py-1 px-4 w-full mx-auto", children: "View on Bluesky" })] })] }));
}
function ErrorMessage() {
    return (_jsxs(Container, { href: "https://bsky.app/", children: [_jsx(Link, { href: "https://bsky.app/", className: "transition-transform hover:scale-110 absolute top-4 right-4", children: _jsx("img", { src: logo, className: "h-6" }) }), _jsx("p", { className: "my-16 text-center w-full text-textLight dark:text-textDimmed", children: "Post not found, it may have been deleted." })] }));
}
//# sourceMappingURL=post.js.map