import {} from '@react-navigation/native';
import {} from './types';
export function getRootNavigation(nav) {
    while (nav.getParent()) {
        nav = nav.getParent();
    }
    return nav;
}
export function getCurrentRoute(state) {
    if (!state) {
        return { name: 'Home' };
    }
    let node = state.routes[state.index || 0];
    while (node.state?.routes && typeof node.state?.index === 'number') {
        node = node.state?.routes[node.state?.index];
    }
    return node;
}
export function isStateAtTabRoot(state) {
    if (!state) {
        // NOTE
        // if state is not defined it's because init is occurring
        // and therefore we can safely assume we're at root
        // -prf
        return true;
    }
    const currentRoute = getCurrentRoute(state);
    return (isTab(currentRoute.name, 'Home') ||
        isTab(currentRoute.name, 'Search') ||
        isTab(currentRoute.name, 'Messages') ||
        isTab(currentRoute.name, 'Notifications') ||
        isTab(currentRoute.name, 'MyProfile'));
}
export function isTab(current, route) {
    // NOTE
    // our tab routes can be variously referenced by 3 different names
    // this helper deals with that weirdness
    // -prf
    return (current === route ||
        current === `${route}Tab` ||
        current === `${route}Inner`);
}
export var TabState;
(function (TabState) {
    TabState[TabState["InsideAtRoot"] = 0] = "InsideAtRoot";
    TabState[TabState["Inside"] = 1] = "Inside";
    TabState[TabState["Outside"] = 2] = "Outside";
})(TabState || (TabState = {}));
export function getTabState(state, tab) {
    if (!state) {
        return TabState.Outside;
    }
    const currentRoute = getCurrentRoute(state);
    if (isTab(currentRoute.name, tab)) {
        return TabState.InsideAtRoot;
    }
    else if (isTab(state.routes[state.index || 0].name, tab)) {
        return TabState.Inside;
    }
    return TabState.Outside;
}
export function buildStateObject(stack, route, params, state = []) {
    if (stack === 'Flat') {
        return {
            routes: [{ name: route, params }],
        };
    }
    return {
        routes: [
            {
                name: stack,
                state: {
                    routes: [...state, { name: route, params }],
                },
            },
        ],
    };
}
//# sourceMappingURL=helpers.js.map