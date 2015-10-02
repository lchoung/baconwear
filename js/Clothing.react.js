var LazyLoad = require('react-lazy-load');
var React = require('react');

var cx = require('classnames');

var Clothing = React.createClass({
  propTypes: {
    name: React.PropTypes.string,
    label: React.PropTypes.string,
    photos: React.PropTypes.shape({
      main: React.PropTypes.object,
      large: React.PropTypes.object,
    }),
    gender: React.PropTypes.string,
    size: React.PropTypes.string,
    status: React.PropTypes.string,
    style: React.PropTypes.string,
    quantity: React.PropTypes.shape({
      S: React.PropTypes.number,
      M: React.PropTypes.number,
      L: React.PropTypes.number,
    }),
    canBorrow: React.PropTypes.bool,

    openModal: React.PropTypes.func.isRequired,
  },

  render: function() {
    var imageSource = this.props.photos.main
      ? this.props.photos.main._url
      : 'http://placekitten.com/180/240';

    var sizeClass = (size) => {
      return cx('col-lg-4', {
        'clothing-out': !this.props.quantity[size],
      });
    };

    return (
      <div className={cx('clothing', 'panel', 'text-center', {
        'borrowed': !this.props.canBorrow,
      })}>
        <h4 className="clothing-title">{this.props.name}</h4>
        <h5>{this.props.label}</h5>
        <a href="#" onClick={this.props.openModal} data-toggle="modal" data-target="#imageModal">
          <LazyLoad height="240">
            <img className="image" width={180} height={240} src={imageSource} />
          </LazyLoad>
        </a>
        <div className="row clothing-sizes">
          <span className={sizeClass('S')}>{this.props.quantity.S || 0} &times; S</span>
          <span className={sizeClass('M')}>{this.props.quantity.M || 0} &times; M</span>
          <span className={sizeClass('L')}>{this.props.quantity.L || 0} &times; L</span>
        </div>
      </div>
    );
  },
});

module.exports = Clothing;
