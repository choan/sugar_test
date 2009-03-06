var jShoulda = function(opts) {
  
  opts = opts || {};
  
  var tr = opts.runner || new Test.Unit.Runner({});
  
  function describe(name, parent) {
    name = name || '';
    var children = [];
    var beforeQueue = [], afterQueue = [];
    
    return {
      it : function(name, fn) {
        children.push(it(name, fn));
        return this;
      },
      end : function() {
        return parent;
      },
      before : function(fn) {
        beforeQueue.push(fn);
        return this;
      },
      after: function(fn) {
        afterQueue.unshift(fn);
        return this;
      },
      describe : function(name) {
        var d = describe(name, this);
        children.push(d);
        return d;
      },
      _setup : function(prefix, before, after) {
        if (before) beforeQueue.unshift(before);
        if (after) afterQueue.push(after);
        runQueue(children, [prefix || '' , name].join(' '), makeBatch(beforeQueue), makeBatch(afterQueue));
      }
    };
  };
  
  function it(name, fn) {
    return {
      _setup : function(prefix, before, after) {
        tr.tests.push(new Test.Unit.Testcase([prefix, name].join(' '), fn, before, after));
      }
    };
  };

  function makeBatch(fn_a) {
    var copy = fn_a.slice(0);
    return function() {
      for (var i = 0; i < copy.length; i += 1) {
        copy[i].call(this);
      }
    };
  }
  
  function merge(sub, sup) {
    for (var i in sup) {
      if (sup.hasOwnProperty(i)) {
        sub[i] = sup[i];
      }
    }
    return sub;
  }

  function runQueue(queue) {
    for (var i = 0, it; i < queue.length; i += 1) {
      it = queue[i];
      if (typeof it._setup == 'function') {
        it._setup.apply(it, [].slice.call(arguments, 1));
      }
    }
  }

  return merge(describe(''), {
    run : function() {
      this._setup();
      return this;
    },
    runner : tr
  });
};
