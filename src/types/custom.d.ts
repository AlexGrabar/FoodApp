declare module '*.scss' {
    const classes: { [key: string]: string };
    export default classes;
}

declare module '*.css' {
    const classes: { [key: string]: string };
    export default classes;
}

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';

declare module '*.svg' {
  const content: string;
  export default content;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_SPOONACULAR_API_KEY?: string;
      NODE_ENV: 'development' | 'production';
    }
  }
}