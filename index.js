'use strict';

// Much of this code is ¯\_(ツ)_/¯

const writeFile = require('broccoli-file-creator');
const MergeTrees = require('broccoli-merge-trees');
const mdTransformer = require('./lib/md-transformer');
const path = require('path');
const fs = require('fs');
const globby = require('globby');

module.exports = {
  name: require('./package').name,

  // TODO this needs to be moved elsewhere, similar to `setupPreprocessorRegistry`
  // to enable rebuilds for js files as well. For now, only the template parts
  // trigger a rebuild.
  treeForApp(appTree) {
    let mdFiles = globby.sync(path.join(process.cwd(), '**/*.emd'));
    let compiledJSTrees = mdFiles.map((mdFile) => {
      let componentName = path.basename(mdFile);
      return writeFile(
        // should probably not hardcode like this
        `components/${componentName.replace('.emd', '')}.js`,
        mdTransformer(fs.readFileSync(mdFile).toString(), 'js')
      );
    });

    return new MergeTrees([appTree, ...compiledJSTrees].filter(Boolean));
  },

  setupPreprocessorRegistry(type, registry) {
    if (type === 'parent') {
      let EMDTemplateRenderer = require('./lib/emd-template-renderer');
      registry.add('template', new EMDTemplateRenderer());
    }
  }
};
