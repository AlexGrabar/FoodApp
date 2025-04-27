import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/store/StoreProvider';
import { Navigate } from 'react-router-dom';
import Text from '@components/Text';
import Button from '@components/Button';
import s from './ProfilePage.module.scss';

const ProfilePage: React.FC = observer(() => {
    const { authStore } = useStores();
    if (!authStore.isAuthenticated || !authStore.user) {
        return <Navigate to="/login" replace />;
    }

    const handleLogout = () => {
        authStore.logout();
    };

    return (
        <div className={s.profilePage}>
            <Text tag="h1" view="title" className={s.title}>Your Profile</Text>

            <div className={s.infoSection}>
                <div className={s.infoItem}>
                    <Text className={s.label}>Username:</Text>
                    <Text className={s.value}>{authStore.user.username}</Text>
                </div>
                <div className={s.infoItem}>
                    <Text className={s.label}>Email:</Text>
                    <Text className={s.value}>{authStore.user.email}</Text>
                </div>
            </div>

            <Button onClick={handleLogout} className={s.logoutButton}>
                Logout
            </Button>
        </div>
    );
});

export default ProfilePage;