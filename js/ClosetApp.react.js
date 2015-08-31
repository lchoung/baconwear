var Parse = require('parse').Parse;
var ParseReact = require('parse-react');
var React = require('react');

global.jQuery = require('jquery');
require('bootstrap');
require('./capitalize.js');

var Clothing = require('./Clothing.react.js');
var FilterButton = require('./FilterButton.react.js');

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

  _renderClothing: function(clothing, index) {
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
        <Clothing
          className="clothing"
          openModal={this._openModal.bind(this, index)}
          {...props}
          />
      </div>
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
    var imageSource = clothing.photo ? clothing.photo._url : '';

    return (
      <div className="modal fade" id="imageModal" tabIndex={-1}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal">
                &times;
              </button>
              <div className="modal-title">
                <h3>{clothing.name}</h3><h4>({clothing.style}/{clothing.gender})</h4>
              </div>
            </div>
            <div className="modal-body">
              <img className="modal-image" src={imageSource} />
            </div>
          </div>
        </div>
      </div>
    );
  },

  _openModal: function(index) {
    this.setState({currentClothing: index});
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
