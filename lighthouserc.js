module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      url: ['/de/', '/de/prozentwert/'],
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 1 }],
        'categories:seo': ['error', { minScore: 1 }],
      },
    },
  },
};
