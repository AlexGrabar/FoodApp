import React, { useState, FormEvent, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/store/StoreProvider';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Text from '@components/Text';
import Input from '@components/Input';
import Button from '@components/Button';
import s from './LoginPage.module.scss';

const LoginPage: React.FC = observer(() => {
    const { authStore } = useStores();
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const from = location.state?.from?.pathname || '/';
    useEffect(() => {
        if (authStore.isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [authStore.isAuthenticated, navigate, from]);


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await authStore.login(email, password);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={s.loginPage}>
            <Text tag="h1" view="title" className={s.title}>Login</Text>
            <form onSubmit={handleSubmit} className={s.form}>
                <div className={s.inputGroup}>
                    <label htmlFor="email" className={s.label}>Email</label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={setEmail}
                        placeholder="your.email@example.com"
                        required
                        disabled={isLoading}
                        className={s.inputField}
                    />
                </div>
                <div className={s.inputGroup}>
                    <label htmlFor="password" className={s.label}>Password</label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={setPassword}
                        placeholder="Enter your password"
                        required
                        disabled={isLoading}
                        className={s.inputField}
                    />
                </div>

                {error && (
                    <Text className={s.errorMessage}>{error}</Text>
                )}

                <Button
                    type="submit"
                    loading={isLoading}
                    disabled={isLoading}
                    className={s.submitButton}
                >
                    Login
                </Button>
            </form>
            <Text className={s.registerLink}>
                 Don't have an account?
                 <Link to="/register">Register here</Link>
             </Text>
        </div>
    );
});

export default LoginPage;