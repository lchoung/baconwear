var Parse = require('parse').Parse;
var ParseReact = require('parse-react');
var React = require('react');
var moment = require('moment');

var DATE_FORMAT = 'ddd MMM Do, YYYY';

require('./capitalize.js');

var MAX_RESULTS = 50;

var BorrowedList = React.createClass({
  mixins: [ParseReact.Mixin],

  observe: function(props, state) {
    // Only show borrowed clothing, sorted by date
    var Clothing = Parse.Object.extend('Clothing');
    var clothingQuery = new Parse.Query(Clothing)
      .exists('borrower')
      .ascending('updatedAt');

    // TODO: paginate results
    return {
      clothing: clothingQuery.limit(MAX_RESULTS),
    };
  },

  /* Convert Parse Clothing object to props */
  _getClothingProps: function(clothing) {
    return {
      name: clothing.name,
      photos: {
        main: clothing.photo,
        large: clothing.photoBack,
      },
      gender: clothing.gender.capitalize(),
      size: clothing.size,
      style: clothing.style.capitalize(),
      borrower: clothing.borrower,
      borrowDate: clothing.borrowDate,
      returnDate: clothing.returnDate,
    };
  },

  _renderClothing: function(clothing, index) {
    return (
      <tr key={clothing.objectId}>
        <td>{clothing.label}</td>
        <td>{clothing.name}</td>
        <td>{clothing.gender.capitalize()}</td>
        <td>{clothing.style.capitalize()}</td>
        <td>{clothing.size}</td>
        <td>{clothing.borrower}</td>
        <td>{moment(clothing.borrowDate).format(DATE_FORMAT)}</td>
        <td>{moment(clothing.returnDate).format(DATE_FORMAT)}</td>
      </tr>
    );
  },

  render: function() {
    return (
      <div>
        <section id="clothes">
          <table className="table table-striped">
            <thead>
              <th>Label</th>
              <th>Name</th>
              <th>Gender</th>
              <th>Style</th>
              <th>Size</th>
              <th>Borrower</th>
              <th>Borrow Date</th>
              <th>Return Date</th>
            </thead>
            <tbody>
              {this.data.clothing.map(this._renderClothing)}
            </tbody>
          </table>

          <div id="footer">
            <h4><a href="/baconwear/">Back to Closet</a></h4>
          </div>
        </section>
      </div>
    );
  },
});

module.exports = BorrowedList;
