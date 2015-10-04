var Parse = require('parse').Parse;
var ParseReact = require('parse-react');
var React = require('react');

var BorrowedList = require('./BorrowedList.react.js');

var MAX_RESULTS = 50;


var Admin = React.createClass({
  mixins: [ParseReact.Mixin],

  observe: function(props, state) {
    var Admin = Parse.Object.extend('Admin');
    var adminQuery = new Parse.Query(Admin);

    return {
      admins: adminQuery.limit(MAX_RESULTS),
    };
  },

  getInitialState: function() {
    return {
      newEmail: '',
    };
  },

  handleChange: function(event) {
    this.setState({newEmail: event.target.value});
  },

  _createEmail: function() {
    ParseReact.Mutation.Create('Admin', {
      email: this.state.newEmail,
    }).dispatch();
    this.setState({newEmail: ''});
  },

  _removeEmail: function(admin) {
    ParseReact.Mutation.Destroy(admin).dispatch();
  },

  _renderEmail: function(admin) {
    return (
      <div className="emails" key={admin.objectId}>
        <button
          type="button"
          className="btn btn-xs btn-danger"
          title="Delete email"
          onClick={this._removeEmail.bind(this, admin)}>
          <span className="glyphicon glyphicon-remove" />
        </button>
        <span className="padleft">{admin.email}</span>
      </div>
    );
  },

  _renderAddEmailForm: function() {
    return (
      <form className="padtop">
        <input
          type="email"
          className="form-control input-small"
          placeholder="New email"
          value={this.state.newEmail}
          onChange={this.handleChange}
        />
        <button
          type="submit"
          className="btn btn-xs btn-success"
          disabled={!this.state.newEmail}
          title="Add email"
          onClick={this._createEmail}>
          <span className="glyphicon glyphicon-plus" />
        </button>
      </form>
    );
  },

  render: function() {
    return (
      <div>
        <BorrowedList />

        <section className="container" id="emails">
          <div>
            <h3>Email Notifications</h3>
            <p>Sign up to receive an email whenever a new outfit is requested.</p>
            <div>
              {this.data.admins.map(this._renderEmail)}
            </div>
            {this._renderAddEmailForm()}
          </div>
        </section>
      </div>
    );
  },
});

module.exports = Admin;
