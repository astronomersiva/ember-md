import { module, test } from 'qunit';
import { visit, click, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | markdown rendering', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /', async function(assert) {
    await visit('/');

    assert.equal(currentURL(), '/');
    assert.dom('h2').hasText('counter [Source on GitHub]')
    await click('[data-action="increment"]');
    assert.dom('[data-title="counter"]').hasText('1');
    await click('[data-action="decrement"]');
    assert.dom('[data-title="counter"]').hasText('0');
  });
});
