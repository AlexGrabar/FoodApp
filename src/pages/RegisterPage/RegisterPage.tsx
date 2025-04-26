import React, { useState, FormEvent, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/store/StoreProvider';
import { useNavigate, Link } from 'react-router-dom';
import Text from '@components/Text';
import Input from '@components/Input';
import Button from '@components/Button';
import s from '../LoginPage/LoginPage.module.scss';

const RegisterPage: React.FC = observer(() => {
    const { authStore } = useStores();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (authStore.isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [authStore.isAuthenticated, navigate]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await authStore.register(email, username, password);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={s.loginPage}>
            <Text tag="h1" view="title" className={s.title}>Register</Text>
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
                    <label htmlFor="username" className={s.label}>Username</label>
                    <Input
                        id="username"
                        type="text"
                        value={username}
                        onChange={setUsername}
                        placeholder="Choose a username"
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
                        placeholder="Create a password"
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
                    Register
                </Button>
            </form>
             <Text className={s.registerLink}>
                  Already have an account?
                  <Link to="/login">Login here</Link>
              </Text>
        </div>
    );
});

export default RegisterPage;