var React = require('react');

global.jQuery = require('jquery');
require('bootstrap');

var ImageModal = React.createClass({
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
    var imageSource = this.props.photos.main
      ? this.props.photos.main._url
      : 'http://placekitten.com/1000/750';

    return (
      <div className="modal fade" id="imageModal" tabIndex={-1}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal">
                &times;
              </button>
              <div className="modal-title">
                <h3>{this.props.name}</h3>
                <h4>({this.props.style}/{this.props.gender})</h4>
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
});

module.exports = ImageModal;
