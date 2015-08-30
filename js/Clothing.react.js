var React = require('react');

var cx = require('classnames');
var moment = require('moment');

var DATE_FORMAT = 'ddd MMM Do, YYYY';

var Clothing = React.createClass({
  propTypes: {
    name: React.PropTypes.string,
    photos: React.PropTypes.shape({
      main: React.PropTypes.object,
      other: React.PropTypes.arrayOf(React.PropTypes.object),
    }),
    gender: React.PropTypes.string,
    style: React.PropTypes.string,
    borrower: React.PropTypes.string,
    borrowDate: React.PropTypes.object,
    returnDate: React.PropTypes.object,
  },

  render: function() {
    var canBorrow = !this.props.borrower;
    var borrowText = canBorrow
      ? 'Borrow'
      : ['Loaned to', this.props.borrower, 'until', moment(this.props.returnDate).format(DATE_FORMAT)].join(' ');

    return (
      <div className="media">
        <div className="media-left">
          <img className="image media-object" src={this.props.photos.main._url} />
        </div>
        <div className="media-body">
          <h3 className="media-heading">{this.props.name}</h3>
          <h4>{this.props.style} &sdot; {this.props.gender}</h4>
          <a href="#" // TODO: link to form for borrowing
             className={cx({takenLink: !canBorrow})}
             disabled={!canBorrow}>
            {borrowText}
          </a>
        </div>
      </div>
    );
  },
});

module.exports = Clothing;
