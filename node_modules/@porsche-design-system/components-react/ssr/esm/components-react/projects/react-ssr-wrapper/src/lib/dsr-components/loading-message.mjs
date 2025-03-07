import { jsx } from 'react/jsx-runtime';

const loadingId = 'loading';
const LoadingMessage = ({ loading, initialLoading }) => {
    return (jsx("span", { id: loadingId, className: "loading", role: "status", children: loading ? 'Loading' : initialLoading ? 'Loading finished' : '' }));
};

export { LoadingMessage, loadingId };
