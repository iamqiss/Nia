import { jsx as _jsx } from "react/jsx-runtime";
import { Component } from 'react';
import {} from 'react-native';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { logger } from '#/logger';
import { ErrorScreen } from './error/ErrorScreen';
import { CenteredView } from './Views';
export class ErrorBoundary extends Component {
    state = {
        hasError: false,
        error: undefined,
    };
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        logger.error(error, { errorInfo });
    }
    render() {
        if (this.state.hasError) {
            if (this.props.renderError) {
                return this.props.renderError(this.state.error);
            }
            return (_jsx(CenteredView, { style: [{ height: '100%', flex: 1 }, this.props.style], children: _jsx(TranslatedErrorScreen, { details: this.state.error.toString() }) }));
        }
        return this.props.children;
    }
}
function TranslatedErrorScreen({ details }) {
    const { _ } = useLingui();
    return (_jsx(ErrorScreen, { title: _(msg `Oh no!`), message: _(msg `There was an unexpected issue in the application. Please let us know if this happened to you!`), details: details }));
}
//# sourceMappingURL=ErrorBoundary.js.map