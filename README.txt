jShoulda

Description:
    jShoulda is a wrapper for JsUnitTest which allows the developer to write Shoulda-like tests.

Example:
    context('A context', {
      setup: function() {
        // do your setup
        this.something = 1
      },
      teardown: function() {
        // do your cleaning
      }
      },
      should('run its before function', function() {
        this.assertEqual(1, this.something);
      }),
      context('which is an inner context', function() {
        before: function() {
          this.something += 1;
        }
        },
        should('run its own before function too', function() {
          this.assertEqual(2, this.something);
        })
      )
    )();

More information:
    http://jshoulda.scriptia.net
    
Author:
    Choan Galvez, choan.galvez@gmail.com