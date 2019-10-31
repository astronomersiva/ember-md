const unified = require('unified');
const markdown = require('remark-parse');
const remarkHtml = require('remark-html');
const templateRecast = require('ember-template-recast');

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
  let renderedTemplate;
  if (splitElements.length > 1) {
    let [_, ...template] = splitElements;
    renderedTemplate = template.join('<hr>').replace(/&#x3C;/g, '<');
  }

  renderedTemplate = rendered.contents.replace(/&#x3C;/g, '<');

  // This relies on the error message sent by ember-template-recast.
  // A very weird and stupid choice maybe but feels better than trying
  // to write complex regexes to parse templates.
  let isInvalidTemplate = true;
  let attempts = 0;
  // to avoid infinite loops if a pattern other than the ones handled here are encountered
  let MAX_ATTEMPTS = 50;
  while (isInvalidTemplate && attempts < MAX_ATTEMPTS) {
    try {
      templateRecast.parse(renderedTemplate);
      isInvalidTemplate = false;
    } catch({ message }) {
      attempts++;

      let regex = /did not match last open tag `(.*)`/g;
      let matches = regex.exec(message) || [];
      if (!matches.length) {
        break;
      }

      let component = matches[1];
      let replaceRegex = new RegExp(`<p>(<${component}[\\s\\S]*>)<\\/p>`, 'g');
      let replaceAtEndRegex = new RegExp(`\n(<${component}[\\s\\S]*>)<\\/\\s*p>`, 'g');
      renderedTemplate = renderedTemplate
        .replace(replaceRegex, '$1')
        .replace(replaceAtEndRegex, '</p>$1');
    }
  }

  return renderedTemplate;
}
