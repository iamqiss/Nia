import { type ChatBskyActorDefs, ChatBskyConvoDefs } from '@atproto/api';
import { type ButtonProps } from '#/components/Button';
export declare function RejectMenu({ convo, profile, size, variant, color, label, showDeleteConvo, currentScreen, ...props }: Omit<ButtonProps, 'onPress' | 'children' | 'label'> & {
    label?: string;
    convo: ChatBskyConvoDefs.ConvoView;
    profile: ChatBskyActorDefs.ProfileViewBasic;
    showDeleteConvo?: boolean;
    currentScreen: 'list' | 'conversation';
}): any;
export declare function AcceptChatButton({ convo, size, variant, color, label, currentScreen, onAcceptConvo, ...props }: Omit<ButtonProps, 'onPress' | 'children' | 'label'> & {
    label?: string;
    convo: ChatBskyConvoDefs.ConvoView;
    onAcceptConvo?: () => void;
    currentScreen: 'list' | 'conversation';
}): any;
export declare function DeleteChatButton({ convo, size, variant, color, label, currentScreen, ...props }: Omit<ButtonProps, 'children' | 'label'> & {
    label?: string;
    convo: ChatBskyConvoDefs.ConvoView;
    currentScreen: 'list' | 'conversation';
}): any;
//# sourceMappingURL=RequestButtons.d.ts.map