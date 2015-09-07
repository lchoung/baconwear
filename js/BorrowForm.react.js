var DatePicker = require('react-datepicker');
var React = require('react');
var moment = require('moment');

var DATE_FORMAT = 'ddd MMM Do, YYYY';

var BorrowForm = React.createClass({
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

    onCancel: React.PropTypes.func.isRequired,
    onSubmit: React.PropTypes.func.isRequired,
  },

  getInitialState: function() {
    return {
      name: '',
      andrewID: '',
      returnDate: null,
    };
  },

  handleChange: function(state, event) {
    var value = event.target ? event.target.value : event;
    this.setState({[`${state}`]: value});
  },

  _onSubmit: function() {
    var {name, andrewID, returnDate} = this.state;
    var canSubmit = name && andrewID && returnDate;
    if (!canSubmit) {
      return;
    }

    this.props.onSubmit(name, andrewID, returnDate);
  },

  render: function() {
    var imageSource = this.props.photos.main
      ? this.props.photos.main._url
      : 'http://placekitten.com/180/240';

    var {name, andrewID, returnDate} = this.state;
    var canSubmit = name && andrewID && returnDate;

    var closeButton = (
      <button className="btn btn-default" onClick={this.props.onCancel}>
        Cancel
      </button>
    );

    var submitButton = (
      <button
        className="btn btn-warning"
        disabled={!canSubmit}
        onClick={this._onSubmit}>
        Submit
      </button>
    );

    var form = (
      <form className="form right">
        <div className="form-group">
          <label htmlFor="input-name">Name</label>
          <input
            type="text" className="form-control" id="input-name"
            placeholder="Yimeng Shoe"
            onChange={this.handleChange.bind(this, 'name')}
            value={name}
          />
        </div>
        <div className="form-group">
          <label htmlFor="input-andrew">Andrew ID</label>
          <input
            type="text" className="form-control" id="input-andrew"
            placeholder="ymgshoe"
            onChange={this.handleChange.bind(this, 'andrewID')}
            value={andrewID}
          />
        </div>
        <div className="form-group">
          <label htmlFor="input-date">Borrow Until...</label>
          <DatePicker
            className="datepicker__input"
            id="input-date"
            dateFormat={DATE_FORMAT}
            placeholderText="Select a date"
            minDate={moment()}
            maxDate={moment().add(1, 'years')}
            weekStart="0"
            selected={returnDate}
            onChange={this.handleChange.bind(this, 'returnDate')}
          />
        </div>
        {closeButton}
        {submitButton}
      </form>
    );

    return (
      <div className="borrow-form clearfix">
        <h3 className="form-title">Borrow Form</h3>
        <div className="pull-left">
          <h4 className="clothing-title">{this.props.name}</h4>
          <img className="image" width={180} height={240} src={imageSource} />
        </div>
        {form}
      </div>
    );
  },
});

module.exports = BorrowForm;
