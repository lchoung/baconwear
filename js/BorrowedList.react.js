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

  _onConfirm: function(clothing) {
    if (!confirm('Are you sure you wish to mark this as loaned?')) {
      return;
    }

    ParseReact.Mutation.Set(clothing, {
      status: 'loaned',
    }).dispatch();
  },

  _onCancel: function(clothing) {
    if (!confirm('Are you sure you wish to cancel this loan?')) {
      return;
    }

    ParseReact.Mutation.Set(clothing, {
      status: 'canceled',
    }).dispatch();
  },

  _onReturn: function(clothing) {
    if (!confirm('Are you sure you wish to mark this as returned?')) {
      return;
    }

    ParseReact.Mutation.Set(clothing, {
      status: 'returned',
    }).dispatch();
  },

  _renderClothing: function(clothing, index) {
    var actions = clothing.status === 'pending'
      ? <td>
          <button
            type="button"
            className="btn btn-xs btn-success"
            title="Mark as loaned"
            onClick={this._onConfirm.bind(this, clothing)}>
            <span className="glyphicon glyphicon-ok" />
          </button>
          <button
            type="button"
            className="btn btn-xs btn-danger"
            title="Cancel loan"
            onClick={this._onCancel.bind(this, clothing)}>
            <span className="glyphicon glyphicon-remove" />
          </button>
        </td>
      : clothing.status === 'loaned'
      ? <td>
          <button
            type="button"
            className="btn btn-xs btn-success"
            title="Mark as returned"
            onClick={this._onReturn.bind(this, clothing)}>
            <span className="glyphicon glyphicon-sunglasses" />
          </button>
        </td>
      : <td/>;

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
        <td>{clothing.status.capitalize()}</td>
        {actions}
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
              <th>Status</th>
              <th>Action</th>
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
