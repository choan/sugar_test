var SugarTest = function() {

var tr, unify = true;

function describe(name, parent) {
  name = name || '';
  var children = [];
  var beforeQueue = [], afterQueue = [];
  
  return merge(new Describe(), {
    _it : function(name, fn) {
      children.push(it(name, fn));
      return this;
    },
    end : function() {
      return parent;
    },
    root : function() {
      var cur = this, p;
      while (p = cur.end()) {
        cur = p;
      }
      return cur;
    },
    before : function(fn) {
      beforeQueue.push(fn);
      return this;
    },
    after: function(fn) {
      afterQueue.unshift(fn);
      return this;
    },
    _describe : function(name, fn) {
      var d = describe(name, this);
      if (fn) d.before(fn);
      children.push(d);
      return d;
    },
    _setup : function(prefix, before, after) {
      if (before) beforeQueue.unshift(before);
      if (after) afterQueue.push(after);
      runQueue(children, name.replace('%parent', prefix || ''), makeBatch(beforeQueue), makeBatch(afterQueue));
      return this;
    }
  });
};

function Describe() {};

function it(name, fn) {
  return {
    _setup : function(prefix, before, after) {
      tr.tests.push(new Test.Unit.Testcase(name.replace('%context', prefix), fn, before, after));
    }
  };
}

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


function root(name, opts) {
  name = typeof arguments[0] == 'string' ? name : '';
  var check = arguments[arguments.length - 1];
  if (check && typeof check == 'object') opts = check;
  else opts = {};
  
  var runnerOpts = {};
  if (opts.testLog) runnerOpts.testLog = opts.testLog;
  
  if (!tr || !unify) {
    tr = opts.runner || new Test.Unit.Runner({}, runnerOpts);
  }  

  return merge(describe(name), {
    run : function() {
      this._setup();
      return this;
    },
    runner : tr
  });
};


merge(root, {
  unifyRunners : function(b) {
    if (b === false) unify = false;
    else unify = true;
    return this;
  },
  setContextAlias : function(name, template) {
    template = template || '%parent %context';
    Describe.prototype[name] = function(name, fn) {
      return this._describe(template.replace('%context', name), fn);
    };
    return this;
  },
  setUnitAlias : function(name, template) {
    template = template || '%context %example';
    Describe.prototype[name] = function(name, fn) {
      return this._it(template.replace('%example', name), fn);
    };
    return this;
  }
});

root
  .setContextAlias('describe')
  .setUnitAlias('it')
  .setContextAlias('context')
  .setUnitAlias('should', '%context should %example');

return root;

}();