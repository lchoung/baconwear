var React = require('react');

var cx = require('classnames');

var FilterButton = React.createClass({
  propTypes: {
    active: React.PropTypes.bool.isRequired,
    children: React.PropTypes.node.isRequired,
    onClick: React.PropTypes.func,
  },

  render: function() {
    var className = cx('btn', 'btn-default', 'btn-filter', {
      'active': this.props.active,
    });
    return (
      <a className={className} role="button" onClick={this.props.onClick}>
        {this.props.children}
      </a>
    );
  },
});

module.exports = FilterButton;
