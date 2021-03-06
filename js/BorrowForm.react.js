var DatePicker = require('react-datepicker');
var ParseReact = require('parse-react');
var React = require('react');

var cx = require('classnames');
var moment = require('moment');

var DATE_FORMAT = 'ddd MMM Do, YYYY';

var BorrowForm = React.createClass({
  _sizeOptions: [],

  propTypes: {
    clothing: React.PropTypes.object,
    name: React.PropTypes.string,
    label: React.PropTypes.string,
    photos: React.PropTypes.shape({
      main: React.PropTypes.object,
      large: React.PropTypes.object,
    }),
    gender: React.PropTypes.string,
    status: React.PropTypes.string,
    style: React.PropTypes.string,

    onCancel: React.PropTypes.func.isRequired,
    onSuccess: React.PropTypes.func.isRequired,
    onFailure: React.PropTypes.func.isRequired,
  },

  getInitialState: function() {
    return {
      name: '',
      andrewID: '',
      returnDate: null,
      size: '',
      submitting: false,
    };
  },

  componentDidMount: function() {
    var SIZES = {
      S: 'Small',
      M: 'Medium',
      L: 'Large',
    };
    var sizeOptions = ['S', 'M', 'L'].filter((size) =>
      this.props.quantity[size] > 0
    );

    if (sizeOptions.length > 0) {
      this.setState({size: sizeOptions[0]});
      this._sizeOptions = sizeOptions.map((size) => {
        return <option key={size} value={size}>{SIZES[size]}</option>;
      });
    }
  },

  handleChange: function(state, event) {
    var value = event.target ? event.target.value : event;
    this.setState({[`${state}`]: value});
  },

  _onSubmit: function() {
    this.setState({submitting: true});
    var {name, andrewID, returnDate, size} = this.state;
    var canSubmit = name && andrewID && returnDate && size;
    if (!canSubmit) {
      return;
    }

    // Create new Parse loan
    ParseReact.Mutation.Create('Loan', {
      label: this.props.label,
      name: this.props.name,
      borrower: name,
      andrewId: andrewID,
      borrowDate: moment()._d,
      returnDate: returnDate._d,
      size: size,
      status: 'pending',
    }).dispatch()
    .done(() => {
      // Subtract 1 from borrowed clothing quantity
      var quantityS = this.props.quantity.S - (size === 'S' ? 1 : 0);
      var quantityM = this.props.quantity.M - (size === 'M' ? 1 : 0);
      var quantityL = this.props.quantity.L - (size === 'L' ? 1 : 0);
      ParseReact.Mutation.Set(this.props.clothing, {
        quantityS: quantityS,
        quantityM: quantityM,
        quantityL: quantityL,
      }).dispatch()
      .done(() => this._onSuccess(name, andrewID, returnDate, size));
    }).fail(this.props.onFailure);
  },

  _onSuccess: function(name, andrewID, returnDate, size) {
    this.setState({submitting: false});
    this.props.onSuccess(name, andrewID, returnDate, size);
  },

  render: function() {
    var imageSource = this.props.photos.main
      ? this.props.photos.main._url
      : 'http://placekitten.com/180/240';

    var {name, andrewID, returnDate, size} = this.state;
    var canSubmit = name && andrewID && returnDate && size;

    var closeButton = (
      <button type="button" className="btn btn-default" onClick={this.props.onCancel}>
        Cancel
      </button>
    );

    var submitButton = (
      <button
        type="button"
        className="btn btn-warning"
        disabled={!canSubmit || this.state.submitting}
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
            disabled={this.state.submitting}
            onChange={this.handleChange.bind(this, 'name')}
            value={name}
          />
        </div>
        <div className="form-group">
          <label htmlFor="input-andrew">Andrew ID</label>
          <input
            type="text" className="form-control" id="input-andrew"
            placeholder="ymgshoe"
            disabled={this.state.submitting}
            onChange={this.handleChange.bind(this, 'andrewID')}
            value={andrewID}
          />
        </div>
        <div className="form-group form-group-small">
          <label htmlFor="input-size">Size</label>
          <select className="form-control width-small" id="input-size"
            disabled={this.state.submitting}
            onChange={this.handleChange.bind(this, 'size')}
            value={size}
          >
            {this._sizeOptions}
          </select>
        </div>

        <div className="form-group form-group-small">
          <label htmlFor="input-date">Borrow Until...</label>
          <DatePicker
            className="datepicker__input"
            id="input-date"
            disabled={this.state.submitting}
            dateFormat={DATE_FORMAT}
            placeholderText="Select a date"
            minDate={moment()}
            maxDate={moment().add(1, 'years')}
            weekStart="0"
            selected={returnDate}
            onChange={this.handleChange.bind(this, 'returnDate')}
          />
        </div>

        <div className="form-buttons text-right">
          {closeButton}
          {submitButton}
        </div>
      </form>
    );

    var sizeClass = (size) => {
      return cx('col-lg-4', {
        'clothing-out': !this.props.quantity[size],
      });
    };

    return (
      <div className="borrow-form clearfix">
        <h3 className="form-title">Borrow Form</h3>
        <div className="pull-left">
          <h4 className="clothing-title">{this.props.name}</h4>
          <img className="image" width={180} height={240} src={imageSource} />
        <div className="row clothing-sizes">
          <span className={sizeClass('S')}>{this.props.quantity.S || 0} &times; S</span>
          <span className={sizeClass('M')}>{this.props.quantity.M || 0} &times; M</span>
          <span className={sizeClass('L')}>{this.props.quantity.L || 0} &times; L</span>
        </div>

        </div>
        {form}
      </div>
    );
  },
});

module.exports = BorrowForm;
