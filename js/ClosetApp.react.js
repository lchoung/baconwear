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
      photos: {
        main: clothing.photo,
        other: [],
      },
      gender: clothing.gender,
      style: clothing.style,
      borrower: clothing.borrower,
      borrowDate: clothing.borrowDate,
      returnDate: clothing.returnDate,
    };
    return (
      <div key={clothing.objectId} className="panel col-md-5">
        <Clothing className="clothing" {...props} />
      </div>
    );
  },

  render: function() {
    return (
      <div>
        {this.data.clothing.map(this._renderClothing)}
      </div>
    );
  },
});

module.exports = ClosetApp;
