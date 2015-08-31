var React = require('react');

global.jQuery = require('jquery');
require('bootstrap');

var ModalItem = require('./ModalItem.react.js');

var Modal = React.createClass({
  propTypes: {
    nextItem: React.PropTypes.func.isRequired,
    prevItem: React.PropTypes.func.isRequired,
  },

  render: function() {
    var {nextItem, prevItem, ...props} = this.props;
    return (
      <div className="modal fade" id="imageModal" tabIndex={-1}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-body">
              <ModalItem {...props} />
              <a className="left carousel-control" onClick={prevItem}>
                <span className="glyphicon glyphicon-chevron-left" />
              </a>
              <a className="right carousel-control" onClick={nextItem}>
                <span className="glyphicon glyphicon-chevron-right" />
              </a>
              <button type="button" className="close text-overlay right" data-dismiss="modal">
                &times;
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

module.exports = Modal;
