var LazyLoad = require('react-lazy-load');
var React = require('react');

var cx = require('classnames');

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
    var imageSource = this.props.photos.main
      ? this.props.photos.main._url
      : 'http://placekitten.com/180/240';

    return (
      <div className={cx('clothing', 'panel', 'text-center', {
        'borrowed': !!this.props.borrower,
      })}>
        <h4 className="clothing-title">{this.props.name}</h4>
        <a href="#" onClick={this.props.openModal} data-toggle="modal" data-target="#imageModal">
          <LazyLoad height="240">
            <img className="image" width={180} height={240} src={imageSource} />
          </LazyLoad>
        </a>
      </div>
    );
  },
});

module.exports = Clothing;
