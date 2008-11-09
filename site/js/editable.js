Test.Event.addEvent(window, 'load', function() {
  var editable = document.getElementById('editable-test');
  editable.title = 'Double click to edit';
  var button = document.createElement('input');
  button.type = 'button';
  button.value = 'Run tests';
  button.onclick = function() {
    var ta = document.getElementById('editable-test');
    var is_textarea = ta.tagName.toLowerCase() == 'textarea';
    var code;
    if (is_textarea) {
      code = ta.value;
    }
    else {
      code = stripTags(ta.getElementsByTagName('code')[0].innerHTML);
    }
    try {
      var tr = eval(code);      
      tr.runTests();
    } catch(ex) {
      alert(ex.name + ': ' + ex.message);
    }
  };
  editable.parentNode.insertBefore(button, editable.nextSibling);
  editable.ondblclick = function() {
    var content = this.getElementsByTagName('code')[0].innerHTML;
    content = stripTags(content);
    var ta = document.createElement('textarea');
    ta.id = 'editable-test';
    ta.style.width = editable.offsetWidth + 'px';
    ta.style.height = editable.offsetHeight + 'px';
    ta.cols = 40;
    ta.value = content;
    this.parentNode.insertBefore(ta, this);
    this.parentNode.removeChild(this);
  };
  
  function stripTags(input) {
    return input.replace(/<\/?[^>]*>/g, '')
  }
});

