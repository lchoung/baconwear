var Parse = require('parse').Parse;
var React = require('react');

Parse.initialize("YXvSIjRRf2csXhdUXSUNpfZ3HeOiNzO1CtTTTa0Q", "F4E6BFoCVg12TD4juam9QeoLBzkenUHlFO9qHQ8O");

var ClosetApp = require('./ClosetApp.react.js');

React.render(
  <ClosetApp />,
  document.getElementById('content')
);
