import React from 'react';
import { Routes, Route, Link, NavLink, Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/store/StoreProvider';
import RecipeList from '@pages/RecipeList';
import RecipeDetails from '@pages/RecipeDetails';
import FavoritesPage from '@pages/FavoritesPage';
import RandomRecipePage from '@pages/RandomRecipePage';
import LoginPage from '@pages/LoginPage';
import RegisterPage from '@pages/RegisterPage';
import ProfilePage from '@pages/ProfilePage';
import ShoppingListPage from '@pages/ShoppingListPage';
import PrivateRoute from '@components/PrivateRoute';
import styles from './App.module.scss';
import Button from '@components/Button';
import Loader from '@components/Loader';

const HeartIcon = () => (
  <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M9.50001 3.09586C7.80057 0.863387 4.96079 0.173456 2.8315 2.21773C0.702197 4.26201 0.402421 7.67991 2.07457 10.0977C3.46485 12.1079 7.67232 16.3476 9.0513 17.7199C9.20553 17.8734 9.28269 17.9501 9.3727 17.9803C9.45118 18.0066 9.53712 18.0066 9.6157 17.9803C9.70571 17.9501 9.78277 17.8734 9.9371 17.7199C11.3161 16.3476 15.5235 12.1079 16.9138 10.0977C18.5859 7.67991 18.3227 4.2405 16.1568 2.21773C13.9909 0.194961 11.1994 0.863387 9.50001 3.09586Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const SunIcon = () => <span aria-hidden="true">☀️</span>;
const MoonIcon = () => <span aria-hidden="true">🌙</span>;


const App: React.FC = observer(() => {
  const { themeStore, authStore } = useStores();

  const getNavLinkClass = ({ isActive }: { isActive: boolean }): string =>
    isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink;

  if (authStore.isLoading) {
      return (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              <Loader size="l" />
          </div>
      );
  }

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
                     <NavLink to="/" className={getNavLinkClass} end>Home</NavLink>
                 </li>
                 <li className={styles.navItem}>
                     <NavLink to="/random" className={getNavLinkClass}>Random</NavLink>
                 </li>
                 {authStore.isAuthenticated ? (
                     <>
                         <li className={styles.navItem}>
                             <NavLink to="/favorites" className={getNavLinkClass} title="Favorites">
                                 <HeartIcon />
                             </NavLink>
                         </li>
                         <li className={styles.navItem}>
                             <NavLink to="/shopping-list" className={getNavLinkClass}>Shopping List</NavLink>
                         </li>
                         <li className={styles.navItem}>
                             <NavLink to="/profile" className={getNavLinkClass}>Profile</NavLink>
                         </li>
                          <li className={styles.navItem}>
                               <Button onClick={() => authStore.logout()} className={styles.logoutButton}>Logout</Button>
                          </li>
                     </>
                 ) : (
                     <>
                          <li className={styles.navItem}>
                              <NavLink to="/login" state={{ from: { pathname: '/favorites' } }} className={getNavLinkClass} title="Favorites (Login Required)">
                                   <HeartIcon />
                              </NavLink>
                          </li>
                         <li className={styles.navItem}>
                             <NavLink to="/login" className={getNavLinkClass}>Login</NavLink>
                         </li>
                     </>
                 )}
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
            <Route path="/random" element={<RandomRecipePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/favorites" element={
                <PrivateRoute component={FavoritesPage} />
            }/>
            <Route path="/profile" element={
                <PrivateRoute component={ProfilePage} />
            }/>
            <Route path="/shopping-list" element={
                <PrivateRoute component={ShoppingListPage} />
             }/>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>

      <footer className={styles.footer}>
          <div className={styles.container}>
              <p className={styles.footerText}>
                © 2025 Recipes App. All rights reserved or not.
              </p>
            </div>
      </footer>
    </div>
  );
});

export default App;