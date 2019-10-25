'use strict';

const stew = require('broccoli-stew');
const mdTransformer = require('./md-transformer');

module.exports = class EMDTemplateRenderer {
  constructor() {
    this.name = 'emd-template-renderer';
  }

  toTree(tree) {
    let compiled = stew.map(
      tree,
      `**/*.emd`,
      string => mdTransformer(string)
    );

    return stew.rename(compiled, '.emd', '.hbs');
  }
};
