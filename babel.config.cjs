module.exports = (api) => {
    const isDevelopment = process.env.NODE_ENV === 'development';
    api.cache.using(() => process.env.NODE_ENV);
  
    const presets = [
      '@babel/preset-env',
      ['@babel/preset-react', { runtime: 'automatic' }],
      '@babel/preset-typescript',
    ];
  
    const plugins = [
      ['@babel/plugin-transform-runtime', { regenerator: true }],
      isDevelopment && require.resolve('react-refresh/babel'),
    ].filter(Boolean);
  
    return {
      presets,
      plugins,
    };
  };