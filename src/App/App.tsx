import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RecipeList from '@pages/RecipeList';
import RecipeDetails from '@pages/RecipeDetails'; 
import styles from './App.module.scss';

const App: React.FC = () => {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🍽️</span>
            <h1 className={styles.logoText}>Recipes</h1>
          </div>
          <nav className={styles.nav}>
            <ul className={styles.navList}>
              <li className={styles.navItem}>
                <a href="/" className={styles.navLink}>Home</a>
              </li>
              <li className={styles.navItem}>
                <a href="/recipes" className={styles.navLink}>Recipes</a>
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
          </Routes>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <p className={styles.footerText}>© 2023 Recipes App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;