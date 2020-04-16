module.exports = {
  presets: [
    [
      '@babel/preset-typescript'
    ],
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        },
        useBuiltIns: 'usage',
        corejs: { version: 3, proposals: true }
      }
    ]
  ]
};
