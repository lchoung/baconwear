var Parse = require('parse').Parse;
var ParseReact = require('parse-react');
var React = require('react');

var _ = require('./capitalize.js');
var Clothing = require('./Clothing.react.js');
var FilterButton = require('./FilterButton.react.js');

var FILTERS = {
  gender: ['male', 'female', 'any'],
  style: ['latin', 'standard', 'any'],
};

var ClosetApp = React.createClass({
  mixins: [ParseReact.Mixin],

  observe: function(props, state) {
    var Clothing = Parse.Object.extend('Clothing');
    var clothingQuery = new Parse.Query(Clothing);
    // Filter clothing by state
    if (state.gender !== 'any') {
      clothingQuery = clothingQuery.equalTo('gender', state.gender);
    }
    if (state.style !== 'any') {
      clothingQuery = clothingQuery.equalTo('style', state.style);
    }

    return {
      clothing: clothingQuery,
    };
  },

  getInitialState: function() {
    return {
      gender: 'any',
      style: 'any',
    };
  },

  _setFilter: function(filter, value) {
    this.setState({[`${filter}`]: value});
  },

  _renderClothing: function(clothing) {
    var props = {
      name: clothing.name,
      photos: {
        main: clothing.photo,
        other: [],
      },
      gender: clothing.gender.capitalize(),
      style: clothing.style.capitalize(),
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

  _renderFilterButtons: function(filter) {
    return FILTERS[filter].map((value, i) =>
      <FilterButton
        key={i}
        active={value === this.state[filter]}
        onClick={this._setFilter.bind(this, filter, value)}>
        {value.capitalize()}
      </FilterButton>
    );
  },

  render: function() {
    return (
      <div>
        <section id="filters">
          <div className="row">
            <div className="btn-group btn-group-lg btn-group-justified">
              {this._renderFilterButtons('gender')}
            </div>
            <div className="btn-group btn-group-lg btn-group-justified">
              {this._renderFilterButtons('style')}
            </div>
          </div>
        </section>

        <section id="clothes">
          {this.data.clothing.map(this._renderClothing)}
        </section>
      </div>
    );
  },
});

module.exports = ClosetApp;
