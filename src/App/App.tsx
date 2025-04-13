import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/store/StoreProvider';
import RecipeList from '@pages/RecipeList';
import RecipeDetails from '@pages/RecipeDetails';
import FavoritesPage from '@pages/FavoritesPage';
import styles from './App.module.scss';
import Button from '@components/Button';

const HeartIcon = () => (
  <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M9.50001 3.09586C7.80057 0.863387 4.96079 0.173456 2.8315 2.21773C0.702197 4.26201 0.402421 7.67991 2.07457 10.0977C3.46485 12.1079 7.67232 16.3476 9.0513 17.7199C9.20553 17.8734 9.28269 17.9501 9.3727 17.9803C9.45118 18.0066 9.53712 18.0066 9.6157 17.9803C9.70571 17.9501 9.78277 17.8734 9.9371 17.7199C11.3161 16.3476 15.5235 12.1079 16.9138 10.0977C18.5859 7.67991 18.3227 4.2405 16.1568 2.21773C13.9909 0.194961 11.1994 0.863387 9.50001 3.09586Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SunIcon = () => <span aria-hidden="true">☀️</span>;
const MoonIcon = () => <span aria-hidden="true">🌙</span>;

const App: React.FC = observer(() => {
  const { themeStore } = useStores();

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.container}>
          <Link to="/" className={styles.logoLink}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>🍽️</span>
              <h1 className={styles.logoText}>Recipes</h1>
            </div>
          </Link>
          <nav className={styles.nav}>
            <ul className={styles.navList}>
              <li className={styles.navItem}>
                <Link to="/" className={styles.navLink}>Home</Link>
              </li>
              <li className={styles.navItem}>
                <Link to="/favorites" className={styles.navLink} title="Favorites">
                  <HeartIcon />
                </Link>
              </li>
              <li className={styles.navItem}>
                 <Button
                    onClick={themeStore.toggleTheme}
                    title={`Switch to ${themeStore.theme === 'light' ? 'Dark' : 'Light'} Theme`}
                    className={styles.themeToggleButton}
                 >
                    {themeStore.theme === 'light' ? <MoonIcon /> : <SunIcon />}
                 </Button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.container}>
          <Routes>
            <Route path="/" element={<RecipeList />} />
            <Route path="/recipes" element={<RecipeList />} />
            <Route path="/recipes/:id" element={<RecipeDetails />} />
            <Route path="/favorites" element={<FavoritesPage />} />
          </Routes>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <p className={styles.footerText}>
            © 2025 Recipes App. All rights reserved or not. laughter was removed.
          </p>
        </div>
      </footer>
    </div>
  );
});

export default App;