var Parse = require('parse').Parse;
var ParseReact = require('parse-react');
var React = require('react');

var Clothing = require('./Clothing.react.js');

var ClosetApp = React.createClass({
  mixins: [ParseReact.Mixin],

  observe: function() {
    var Clothing = Parse.Object.extend('Clothing');
    var clothingQuery = new Parse.Query(Clothing);
    // TODO: sort and filter clothing by state
    return {
      clothing: clothingQuery,
    };
  },

  _renderClothing: function(clothing) {
    var props = {
      name: clothing.name,
      photos: clothing.photos,
      gender: clothing.gender,
      style: clothing.style,
      borrower: clothing.borrower,
      borrowDate: clothing.borrowDate,
      returnDate: clothing.returnDate,
    };
    return (
      <li key={clothing.objectId} className="clothing">
        <Clothing {...props} />
      </li>
    );
  },

  render: function() {
    return (
      <ul>
        {this.data.clothing.map(this._renderClothing)}
      </ul>
    );
  },
});

module.exports = ClosetApp;
