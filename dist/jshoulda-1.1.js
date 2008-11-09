/*  jShoulda, version 1.1
 *  (c) 2008 Choan Galvez
 *
 *  jShoulda is freely distributable under
 *  the terms of an MIT-style license.
 *  For details, see the web site: http://jshoulda.scriptia.net
 *
 *--------------------------------------------------------------------------*/

var jShoulda = function() {
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

  function context(name) {
    var queue = Array.prototype.slice.call(arguments, 1);
    var obj = {};
    // shift arguments if the second one is a
    // configuration object
    if (typeof arguments[1] === 'object') {
      obj = queue.shift();
    }
    obj.before = obj.setup || obj.before || dummy;
    obj.after = obj.teardown || obj.after || dummy;
    var beforeQueue;
    var afterQueue;
    return function(outerName, before, after) {
      // the root context gets no outerName or a configuration object
      // as its first argument
      var prefix = outerName;
      var is_root = !!(outerName == undefined || typeof outerName == 'object');
      if (is_root) {
        tr = new Test.Unit.Runner({}, outerName || {});
        prefix = '';
      }
      beforeQueue = before ? before.push(obj.before) && before : [obj.before];
      afterQueue = after ? after.push(obj.after) && after : [obj.after];
      runQueue(queue, [prefix, name].join(' '), beforeQueue, afterQueue);
      if (is_root) {
        return tr;
      }
      return false; // do not add to the tests queue
    };
  };


  function getShouldAlias(connector) {
    return function (name, fn) {
      return function(prefix, before, after) {
        var beforeBatch = makeBatch(before);
        var afterBatch = makeBatch(after);
        return new Test.Unit.Testcase([prefix, name].join(' ' + connector + ' '), fn, beforeBatch, afterBatch);
      };
    };
  }

  function setShouldAlias(name, host) {
    var connector = name;
    if (typeof host == 'string') {
      connector = host;
      host = arguments[2];
    }
    host = host || window;
    host[name] = getShouldAlias(connector);
    return jShoulda;
  }

  function setContextAlias(name, host) {
    host = host || window;
    host[name] = getContextAlias();
    return jShoulda;
  }

  function getContextAlias() {
    return context;
  }


  return {
    setShouldAlias : setShouldAlias,
    setContextAlias : setContextAlias,
  }

}();

jShoulda
  .setShouldAlias('should')
  .setContextAlias('context');