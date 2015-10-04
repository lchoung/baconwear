var Mailgun = require('mailgun');
var moment = require('moment');


// Initialize Mailgun client
var DOMAIN = 'sandboxa5240d7ba154408cb116da96154c0ee0.mailgun.org';
var API_KEY = 'key-7280cabdb5a610e1784ad81908001e23';
Mailgun.initialize(DOMAIN, API_KEY);

var DATE_FORMAT = 'ddd MMM Do, YYYY';


/**
 * Send email notifications upon loan creation using Mailgun API
 */
Parse.Cloud.afterSave('Loan', function(request) {
  // Don't do anything for updates, only new created loans
  if (request.object.existed()) {
    return;
  }

  function sendEmail(recipients) {
    Mailgun.sendEmail({
      to: recipients.join(', '),
      from: 'ballroom@andrew.cmu.edu',
      subject: 'Ballroom Closet loan notification',
      text: [
        'Hello! This is a friendly notification that',
        request.object.get('borrower'),
        '(' + request.object.get('andrewId') + ')',
        'has requested a loan of',
        request.object.get('name'),
        '(' + request.object.get('label') + ')',
        'from',
        moment(request.object.borrowDate).format(DATE_FORMAT),
        'until',
        moment(request.object.returnDate).format(DATE_FORMAT),
        '. Please visit http://www.cmubdc.org/closet/admin to approve or deny this loan.'
      ].join(' ')
    }, {
      success: function(httpResponse) {
        console.log('successfully sent email notification');
      },
      error: function(httpResponse) {
        console.error('failed to send email!');
        console.log(httpResponse);
      }
    });
  }

  new Parse.Query('Admin').find({
    success: function(admins) {
      var emails = admins.map(function(admin) {
        return admin.get('email');
      });
      sendEmail(emails);
    },
    error: function(error) {
      console.error('failed to retrieve admin emails: ' + error.message);
    }
  });

});
