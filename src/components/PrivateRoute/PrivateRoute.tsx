import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/store/StoreProvider';
import Loader from '@components/Loader';
import s from './PrivateRoute.module.scss';

type PrivateRouteProps = {
    component: React.ComponentType<any>;
};

const PrivateRoute: React.FC<PrivateRouteProps> = observer(({ component: Component }) => {
    const { authStore } = useStores();
    const location = useLocation();

    if (authStore.isLoading) {
        return (
            <div className={s.loadingContainer}>
                <Loader size="l" />
            </div>
        );
    }

    if (!authStore.isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return <Component />;
});

export default PrivateRoute;