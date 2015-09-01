var React = require('react');

global.jQuery = require('jquery');
require('bootstrap');
var cx = require('classnames');
var moment = require('moment');

var ModalItem = require('./ModalItem.react.js');

var DATE_FORMAT = 'ddd MMM Do, YYYY';

var Modal = React.createClass({
  propTypes: {
    borrower: React.PropTypes.string,
    returnDate: React.PropTypes.object,

    borrowURL: React.PropTypes.string.isRequired,
    nextItem: React.PropTypes.func.isRequired,
    prevItem: React.PropTypes.func.isRequired,
  },

  render: function() {
    var {nextItem, prevItem, borrowURL, ...props} = this.props;
    var canBorrow = !this.props.borrower;
    var borrowText = canBorrow
      ? 'Borrow'
      : ['Loaned to', this.props.borrower, 'until', moment(this.props.returnDate).format(DATE_FORMAT)].join(' ');

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
              <a
                className={cx('btn', 'btn-lg', 'btn-overlay', {
                  'btn-warning': canBorrow,
                  'btn-default': !canBorrow,
                })}
                disabled={!canBorrow}
                href={canBorrow ? borrowURL : ''}
                role="button">
                {borrowText}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

module.exports = Modal;
