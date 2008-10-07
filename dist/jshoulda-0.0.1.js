/*  Jshoulda, version 0.0.1
 *  (c) 2008 Choan Galvez
 *
 *  Jshoulda is freely distributable under
 *  the terms of an MIT-style license.
 *  For details, see the web site: http://jshoulda.scriptia.net
 *
 *--------------------------------------------------------------------------*/

var context, should;
(function() {
  // the test runner
  var tr;

  function dummy() {
  };

  function runQueue(queue, name, before, after) {
    var i, tests;
    for (i = 0; i < queue.length; i += 1) {
      tests = queue[i](name, before, after);
      if (tests)
        tr.tests.push(tests);
    }
    before.pop();
    after.pop();
  }

  function makeBatch(fn_a) {
    var copy = fn_a.slice(0);
    return function() {
      for (var i = 0; i < copy.length; i += 1) {
        copy[i].call(this);
      }
    };
  }

  context = function(name, obj) {
    obj.before = obj.before || dummy;
    obj.after = obj.after || dummy;
    var queue = Array.prototype.slice.call(arguments, 2);
    var beforeQueue;
    var afterQueue;
    tr = tr || new JsUnitTest.Unit.Runner({}, {testLog: 'testlog'});
    return function(outerName, before, after) {
      beforeQueue = before ? before.push(obj.before) && before : [obj.before];
      afterQueue = after ? after.push(obj.after) && after : [obj.after];
      runQueue(queue, [outerName, name].join(' '), beforeQueue, afterQueue);
      return false; // do not add to the tests queue
    };
  };

  should = function(name, fn) {
    return function(prefix, before, after) {
      var beforeBatch = makeBatch(before);
      var afterBatch = makeBatch(after);
      return new JsUnitTest.Unit.Testcase([prefix, name].join(' should '), fn, beforeBatch, afterBatch);
    };
  };


})();