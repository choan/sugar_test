context('A test', {
  setup: function() {
    this.foo = 1;
  }
  },
  should('run its setup functions', function() {
    this.assertEqual(1, this.foo);
  }),
  context('which is a "nested" test', {
      setup: function() {
        this.foo += 1;
      }
    },
    should('run both setup functions', function() {
      this.assertEqual(2, this.foo);
    })
  )
)();