import path from 'path';

import pluginTester from 'babel-plugin-tester';
import plugin from '../src';

pluginTester({
  plugin,
  fixtures: path.join(__dirname, 'fixtures'),

  // tests: [
  //   {
  //     fixture: path.join(__dirname, 'fixtures/static/scope/code.js'),
  //     outputFixture: path.join(__dirname, 'fixtures/static/scope/output.js'),
  //   },
  //   // {
  //   //   fixture: path.join(__dirname, 'fixtures/static/attributes-preset-options/code.js'),
  //   //   outputFixture: path.join(__dirname, 'fixtures/static/attributes-preset-options/output.js'),
  //   //   pluginOptions: {
  //   //     tag: 'html',
  //   //     attributes: [
  //   //       {
  //   //         preset: 'lit-html',
  //   //       },
  //   //     ],
  //   //   },
  //   // },
  // ],
});
