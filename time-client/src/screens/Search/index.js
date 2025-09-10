import { jsx as _jsx } from "react/jsx-runtime";
import {} from '#/lib/routes/types';
import { SearchScreenShell } from './Shell';
export function SearchScreen(props) {
    const queryParam = props.route?.params?.q ?? '';
    return (_jsx(SearchScreenShell, { queryParam: queryParam, testID: "searchScreen", isExplore: true }));
}
//# sourceMappingURL=index.js.map