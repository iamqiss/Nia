import { StackActions, useNavigation } from '@react-navigation/native';
import {} from '#/lib/routes/types';
import { router } from '#/routes';
export function useGoBack(onGoBack) {
    const navigation = useNavigation();
    return () => {
        onGoBack?.();
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
        else {
            navigation.navigate('HomeTab');
            // Checking the state for routes ensures that web doesn't encounter errors while going back
            if (navigation.getState()?.routes) {
                navigation.dispatch(StackActions.push(...router.matchPath('/')));
            }
            else {
                navigation.navigate('HomeTab');
                navigation.dispatch(StackActions.popToTop());
            }
        }
    };
}
//# sourceMappingURL=useGoBack.js.map