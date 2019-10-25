const unified = require('unified');
const markdown = require('remark-parse');
const remarkHtml = require('remark-html');

// todo memoize this
module.exports = function(contents, mode) {
  let mdRenderer = unified()
  .use(markdown)
  .use(remarkHtml, {
    sanitize: false
  });

  let rendered = mdRenderer.processSync(contents);
  let splitElements = rendered.contents.split('<hr>');

  // handle JS
  if (mode === 'js') {
    if (splitElements.length > 1) {
      let [componentClass] = splitElements;
      return componentClass
        .replace('<pre><code>', '')
        .replace('</code></pre>', '')
        .replace('<pre><code class="language-javascript">', '');
    }

    return `
      import Component from '@glimmer/component';
      export default class DummyComponent extends Component {}
    `;
  }


  // handle template
  if (splitElements.length > 1) {
    let [_, ...template] = splitElements;
    
    return template.join('<hr>').replace(/&#x3C;/g, '<');
  }

  return rendered.contents.replace(/&#x3C;/g, '<');
}
