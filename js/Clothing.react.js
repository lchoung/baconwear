var React = require('react');

var cx = require('classnames');
var moment = require('moment');

var DATE_FORMAT = 'ddd MMM Do, YYYY';

var Clothing = React.createClass({
  propTypes: {
    name: React.PropTypes.string,
    photos: React.PropTypes.shape({
      main: React.PropTypes.object,
      large: React.PropTypes.object,
    }),
    gender: React.PropTypes.string,
    style: React.PropTypes.string,
    borrower: React.PropTypes.string,
    borrowDate: React.PropTypes.object,
    returnDate: React.PropTypes.object,

    openModal: React.PropTypes.func.isRequired,
  },

  render: function() {
    var canBorrow = !this.props.borrower;
    var borrowText = canBorrow
      ? 'Borrow'
      : ['Loaned to', this.props.borrower, 'until', moment(this.props.returnDate).format(DATE_FORMAT)].join(' ');

    var imageSource = this.props.photos.main
      ? this.props.photos.main._url
      : 'http://placekitten.com/180/240';

    return (
      <div className="clothing panel text-center">
        <h4 className="clothing-title">{this.props.name}</h4>
        <a href="#" onClick={this.props.openModal} data-toggle="modal" data-target="#imageModal">
          <img className="image" width={180} height={240} src={imageSource} />
        </a>
      </div>
    );
  },
});

module.exports = Clothing;
