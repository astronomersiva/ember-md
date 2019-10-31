const assert = require('assert');
const mdTransform = require('../lib/md-transformer');

describe('md-transform', function() {
  describe('template only', function() {
    it('should render md only templates', function() {
      assert.strictEqual(
        mdTransform('### Hello\nThis is a test.'),
        '<h3>Hello</h3>\n<p>This is a test.</p>\n'
      );
    });

    it('should render md with block form components', function() {
      assert.strictEqual(
        mdTransform('**You can also invoke components from other components.**\n\n<Greet>\n# wow\n</Greet>\n'),
        '<p><strong>You can also invoke components from other components.</strong></p>\n<Greet>\n# wow\n</Greet>\n'
      );
    });

    it('should render md with non-block form components', function() {
      assert.strictEqual(
        mdTransform('**You can also invoke components from other components.**\n\n<Greet />\n'),
        '<p><strong>You can also invoke components from other components.</strong></p>\n<Greet />\n'
      );
    });

    it('should render md with non-block form components without going into an infinite loop', function() {
      assert.strictEqual(
        mdTransform('**You can also invoke components from other components.**\n<Greet />\n'),
        '<p><strong>You can also invoke components from other components.</strong>\n<Greet /></p>\n'
      );
    });

    it('should render md with block form components without going into an infinite loop', function() {
      assert.strictEqual(
        mdTransform('**You can also invoke components from other components.**\n<Greet ...attributes>\n# wow\n</Greet>'),
        '<p><strong>You can also invoke components from other components.</strong></p><Greet ...attributes>\n<h1>wow</h1>\n</Greet>\n'
      );
    });
  });
});
