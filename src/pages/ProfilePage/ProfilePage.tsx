import React, { useState, FormEvent } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/store/StoreProvider';
import { Navigate } from 'react-router-dom';
import Text from '@components/Text';
import Button from '@components/Button';
import Input from '@components/Input';
import s from './ProfilePage.module.scss';
import { Eye, EyeOff } from 'react-feather';

const ProfilePage: React.FC = observer(() => {
    const { authStore } = useStores();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [editError, setEditError] = useState<string | null>(null);
    const [editLoading, setEditLoading] = useState(false);

    if (!authStore.isAuthenticated || !authStore.user) {
        return <Navigate to="/login" replace />;
    }

    const handleLogout = () => {
        authStore.logout();
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const handlePasswordChangeSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setEditError('Passwords do not match.');
            return;
        }
        setEditLoading(true);
        setEditError(null);
        try {
            await authStore.changePassword(newPassword);
            setIsEditingPassword(false);
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: unknown) {
            setEditError(err instanceof Error ? err.message : 'Failed to change password.');
        } finally {
            setEditLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setIsEditingPassword(false);
        setNewPassword('');
        setConfirmPassword('');
        setEditError(null);
    }

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

                {!isEditingPassword ? (
                    <div className={s.infoItem}>
                        <Text className={s.label}>Password:</Text>
                        <div className={s.passwordWrapper}>
                            <Text className={s.passwordValue}>
                                {isPasswordVisible ? (authStore.user.password || 'N/A') : '••••••••'}
                            </Text>
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className={s.toggleVisibilityButton}
                                aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                            >
                                {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                         <Button onClick={() => setIsEditingPassword(true)} className={s.editButton}>
                             Change
                         </Button>
                    </div>
                ) : (
                    <form onSubmit={handlePasswordChangeSubmit} className={s.editForm}>
                         <Text tag="h3" view="p-18" weight='medium' className={s.formTitle}>Change Password</Text>
                         <div className={s.inputGroup}>
                             <label htmlFor="newPassword" className={s.label}>New Password</label>
                             <Input
                                 id="newPassword"
                                 type="password"
                                 value={newPassword}
                                 onChange={setNewPassword}
                                 required
                                 minLength={6}
                                 disabled={editLoading}
                                 className={s.inputField}
                             />
                         </div>
                         <div className={s.inputGroup}>
                              <label htmlFor="confirmPassword" className={s.label}>Confirm Password</label>
                              <Input
                                  id="confirmPassword"
                                  type="password"
                                  value={confirmPassword}
                                  onChange={setConfirmPassword}
                                  required
                                  minLength={6}
                                  disabled={editLoading}
                                  className={s.inputField}
                              />
                         </div>
                         {editError && (
                             <Text className={s.errorMessage}>{editError}</Text>
                         )}
                         <div className={s.formButtons}>
                             <Button type="button" onClick={handleCancelEdit} disabled={editLoading}>
                                 Cancel
                             </Button>
                             <Button type="submit" loading={editLoading} disabled={editLoading}>
                                 Save Password
                             </Button>
                         </div>
                    </form>
                )}

            </div>

            <Button onClick={handleLogout} className={s.logoutButton}>
                Logout
            </Button>
        </div>
    );
});

export default ProfilePage;