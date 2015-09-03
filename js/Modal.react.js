var React = require('react');

global.jQuery = require('jquery');
require('bootstrap');
var cx = require('classnames');
var moment = require('moment');

var BorrowForm = require('./BorrowForm.react.js');
var ModalItem = require('./ModalItem.react.js');

var DATE_FORMAT = 'ddd MMM Do, YYYY';

var Modal = React.createClass({
  propTypes: {
    borrower: React.PropTypes.string,
    returnDate: React.PropTypes.object,

    nextItem: React.PropTypes.func.isRequired,
    prevItem: React.PropTypes.func.isRequired,
  },

  getInitialState: function() {
    return {
      formActive: false,
    };
  },

  _onBorrow: function() {
    if (this.props.borrower) {
      return;
    }

    this.setState({formActive: true});
  },

  _onCancel: function() {
    this.setState({formActive: false});
  },

  _onSubmit: function(name, andrewID, returnDate) {
    console.log(name, andrewID, returnDate);
    // TODO: fill google sheet
    // TODO: mutate Parse data
  },

  render: function() {
    var {nextItem, prevItem, ...props} = this.props;
    var canBorrow = !this.props.borrower;
    var borrowText = canBorrow
      ? 'Borrow'
      : ['Loaned to', this.props.borrower, 'until', moment(this.props.returnDate).format(DATE_FORMAT)].join(' ');

    var content = this.state.formActive
      ? <BorrowForm onCancel={this._onCancel} onSubmit={this._onSubmit} {...props} />
      : <ModalItem {...props} />;

    var carouselControls = !this.state.formActive && (
      <div>
        <a className="left carousel-control" onClick={prevItem}>
          <span className="glyphicon glyphicon-chevron-left" />
        </a>
        <a className="right carousel-control" onClick={nextItem}>
          <span className="glyphicon glyphicon-chevron-right" />
        </a>
      </div>
    );

    var closeButton = (
      <button type="button" className="close text-overlay right" data-dismiss="modal">
        &times;
      </button>
    );

    var borrowButton = !this.state.formActive && (
      <a
        className={cx('btn', 'btn-lg', 'btn-overlay', {
          'btn-warning': canBorrow,
          'btn-default': !canBorrow,
        })}
        disabled={!canBorrow}
        onClick={this._onBorrow}
        role="button">
        {borrowText}
      </a>
    );

    return (
      <div className="modal fade" id="imageModal" tabIndex={-1}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-body">
              {content}
              {carouselControls}
              {closeButton}
              {borrowButton}
            </div>
          </div>
        </div>
      </div>
    );
  },
});

module.exports = Modal;
