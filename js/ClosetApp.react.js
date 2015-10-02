var Parse = require('parse').Parse;
var ParseReact = require('parse-react');
var React = require('react');

require('./capitalize.js');

var Clothing = require('./Clothing.react.js');
var FilterButton = require('./FilterButton.react.js');
var Modal = require('./Modal.react.js');

var FILTERS = {
  gender: ['male', 'female', 'any'],
  style: ['latin', 'standard', 'any'],
};

var MAX_RESULTS = 50;

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

    // don't show any results if we're missing a filter
    var limit = state.gender && state.style ? MAX_RESULTS : 0;
    return {
      clothing: clothingQuery.limit(limit),
    };
  },

  getInitialState: function() {
    return {
      gender: null,
      style: null,
      currentClothing: 0,
    };
  },

  _setFilter: function(filter, value) {
    this.setState({[`${filter}`]: value});
  },

  /* Convert Parse Clothing object to props */
  _getClothingProps: function(clothing) {
    var canBorrow =
      clothing.quantityS + clothing.quantityM + clothing.quantityL > 0;

    return {
      name: clothing.name,
      label: clothing.label,
      photos: {
        main: clothing.photo,
        large: clothing.photoBack,
      },
      gender: clothing.gender.capitalize(),
      size: clothing.size,
      status: clothing.status,
      style: clothing.style.capitalize(),
      quantity: {
        'S': clothing.quantityS,
        'M': clothing.quantityM,
        'L': clothing.quantityL,
      },
      /*borrower: clothing.borrower,
      borrowDate: clothing.borrowDate,
      returnDate: clothing.returnDate,*/
      canBorrow: canBorrow,
    };
  },

  _renderClothing: function(clothing, index) {
    var props = this._getClothingProps(clothing);
    return (
      <Clothing
        key={clothing.objectId}
        openModal={this._setClothing.bind(this, index, false)}
        {...props}
      />
    );
  },

  _renderFilterButtons: function(filter) {
    var buttons = FILTERS[filter].map((value, i) =>
      <FilterButton
        key={i}
        active={value === this.state[filter]}
        onClick={this._setFilter.bind(this, filter, value)}>
        {value.capitalize()}
      </FilterButton>
    );

    return (
      <div className="row text-center">
        <h3>Select a {filter}:</h3>
        <div className="btn-group btn-group-lg">
          {buttons}
        </div>
      </div>
    );
  },

  _renderModal: function() {
    var clothing = this.data.clothing[this.state.currentClothing];
    if (!clothing) {
      return null;
    }

    var props = this._getClothingProps(clothing);
    return (
      <Modal
        clothing={clothing}
        nextItem={this._setClothing.bind(this, 1, true)}
        prevItem={this._setClothing.bind(this, -1, true)}
        {...props}
      />
    );
  },

  _setClothing: function(index, increment) {
    var value = index;
    if (increment) {
      var length = this.data.clothing.length;
      value = (this.state.currentClothing + value + length) % length;
    }
    this.setState({currentClothing: value});
  },

  render: function() {
    return (
      <div>
        <section id="filters">
          {this._renderFilterButtons('gender')}
          {this._renderFilterButtons('style')}
        </section>
        <hr />

        <section id="clothes">
          <div className="row">
            {this.data.clothing.map(this._renderClothing)}
          </div>
          {this._renderModal()}

          <div id="footer">
            <h6>{this.data.clothing.length > 0 && 'END OF RESULTS'}</h6>
          </div>
        </section>
      </div>
    );
  },
});

module.exports = ClosetApp;
