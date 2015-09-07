var Parse = require('parse').Parse;
var React = require('react');

global.$ = require('jquery');

Parse.initialize("YXvSIjRRf2csXhdUXSUNpfZ3HeOiNzO1CtTTTa0Q", "F4E6BFoCVg12TD4juam9QeoLBzkenUHlFO9qHQ8O");

// HACK: Conditionally load different apps depending on page
var ClosetApp;
$(document).ready(function() {
  if (window.location.pathname === '/borrowed') {
    ClosetApp = require('./ClosetApp.react.js');
  } else {
    ClosetApp = require('./BorrowedList.react.js');
  }

  React.render(
    <ClosetApp />,
    document.getElementById('content')
  );
});

