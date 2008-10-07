Test.Event.addEvent(window, 'load', function() {
  var editable = document.getElementById('editable-test');
  editable.title = 'Double click to edit';
  var button = document.createElement('input');
  button.type = 'button';
  button.value = 'Run tests';
  button.onclick = function() {
    var ta = document.getElementById('editable-test');
    var code = ta.tagName.toLowerCase() == 'pre' ? ta.getElementsByTagName('code')[0].innerHTML : ta.value;
    var tr = eval(code);
    tr.runTests();
  };
  editable.parentNode.insertBefore(button, editable.nextSibling);
  editable.ondblclick = function() {
    var content = this.getElementsByTagName('code')[0].innerHTML;
    var ta = document.createElement('textarea');
    ta.id = 'editable-test';
    ta.style.width = editable.offsetWidth + 'px';
    ta.style.height = editable.offsetHeight + 'px';
    ta.cols = 40;
    ta.value = content;
    this.parentNode.insertBefore(ta, this);
    this.parentNode.removeChild(this);
  };  
});

