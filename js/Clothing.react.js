var React = require('react');

var Clothing = React.createClass({
  propTypes: {
    name: React.PropTypes.string,
    photos: React.PropTypes.arrayOf(React.PropTypes.object),
    gender: React.PropTypes.string,
    style: React.PropTypes.string,
    borrower: React.PropTypes.string,
    borrowDate: React.PropTypes.object,
    returnDate: React.PropTypes.object,
  },

  render: function() {
    return (
      <div>
        {this.props.name} ({this.props.style}, {this.props.gender})
      </div>
    );
  },
});

module.exports = Clothing;
