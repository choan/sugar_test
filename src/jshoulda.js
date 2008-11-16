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
  function getContextAlias(prefix) {
    if (prefix) prefix += ' ';
    return function (name, config, args) {
      var queue = Array.prototype.slice.call(arguments, 0);
      var cName = '';
      var obj = {};
      // shift arguments if the first one is a string
      if (typeof queue[0] == 'string') {
        if (name) { cName += prefix; }
        cName += queue.shift();
      }
      // shift arguments if the second one is a
      // configuration object
      if (typeof queue[0] === 'object') {
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
        runQueue(queue, [prefix, cName].join(' '), beforeQueue, afterQueue);
        if (is_root) {
          return tr;
        }
        return false; // do not add to the tests queue
      };
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
    var prefix = '';
    if (typeof host == 'string') {
      prefix = host;
      host = arguments[2];
    }
    host = host || window;
    host[name] = getContextAlias(prefix);
    return jShoulda;
  }
  

  return {
    setShouldAlias : setShouldAlias,
    setContextAlias : setContextAlias
  };

}();

jShoulda
  .setShouldAlias('should')
  .setContextAlias('context');  
