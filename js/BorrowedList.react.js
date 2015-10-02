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
    // Show borrowed clothing, sorted by date
    var Loan = Parse.Object.extend('Loan');
    var loanQuery = new Parse.Query(Loan)
      .ascending('updatedAt');

    // TODO: paginate results
    return {
      loans: loanQuery.limit(MAX_RESULTS),
    };
  },

  // Add 1 to borrowed clothing quantity
  _incrementSize: function(loan) {
    var {label, size} = loan;
    var Clothing = Parse.Object.extend('Clothing');
    new Parse.Query(Clothing).equalTo('label', label).find({
      success: function(clothings) {
        if (clothings.length === 0) {
          console.log('no clothing matching label found!');
          return;
        }

        var clothing = clothings[0];
        var quantityS = clothing.get('quantityS') + (size === 'S' ? 1 : 0);
        var quantityM = clothing.get('quantityM') + (size === 'M' ? 1 : 0);
        var quantityL = clothing.get('quantityL') + (size === 'L' ? 1 : 0);
        clothing.set('quantityS', quantityS);
        clothing.set('quantityM', quantityM);
        clothing.set('quantityL', quantityL);
        clothing.save();
      },
      error: () => console.log('uh oh, failed to increment quantity')
    });
  },

  _onConfirm: function(loan) {
    if (!confirm('Are you sure you wish to mark this as loaned?')) {
      return;
    }

    ParseReact.Mutation.Set(loan, {
      status: 'loaned',
    }).dispatch();
  },

  _onCancel: function(loan) {
    if (!confirm('Are you sure you wish to cancel this loan?')) {
      return;
    }

    ParseReact.Mutation.Set(loan, {
      status: 'canceled',
    }).dispatch();

    this._incrementSize(loan);
  },

  _onReturn: function(loan) {
    if (!confirm('Are you sure you wish to mark this as returned?')) {
      return;
    }

    ParseReact.Mutation.Set(loan, {
      status: 'returned',
    }).dispatch();

    this._incrementSize(loan);
  },

  _renderLoan: function(loan, index) {
    var actions = loan.status === 'pending'
      ? <td>
          <button
            type="button"
            className="btn btn-xs btn-success"
            title="Mark as loaned"
            onClick={this._onConfirm.bind(this, loan)}>
            <span className="glyphicon glyphicon-ok" />
          </button>
          <button
            type="button"
            className="btn btn-xs btn-danger"
            title="Cancel loan"
            onClick={this._onCancel.bind(this, loan)}>
            <span className="glyphicon glyphicon-remove" />
          </button>
        </td>
      : loan.status === 'loaned'
      ? <td>
          <button
            type="button"
            className="btn btn-xs btn-success"
            title="Mark as returned"
            onClick={this._onReturn.bind(this, loan)}>
            <span className="glyphicon glyphicon-sunglasses" />
          </button>
        </td>
      : <td/>;

    return (
      <tr key={loan.objectId}>
        <td>{loan.label}</td>
        <td>{loan.name}</td>
        <td>{loan.size}</td>
        <td>{loan.borrower} ({loan.andrewId})</td>
        <td>{moment(loan.borrowDate).format(DATE_FORMAT)}</td>
        <td>{moment(loan.returnDate).format(DATE_FORMAT)}</td>
        <td>{loan.status.capitalize()}</td>
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
              <th>Size</th>
              <th>Borrower</th>
              <th>Borrow Date</th>
              <th>Return Date</th>
              <th>Status</th>
              <th>Action</th>
            </thead>
            <tbody>
              {this.data.loans.map(this._renderLoan)}
            </tbody>
          </table>
        </section>
      </div>
    );
  },
});

module.exports = BorrowedList;
