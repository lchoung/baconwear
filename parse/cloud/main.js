/**
 * Save borrower data to Google Spreadsheet
 * Spreadsheet should have the format:
 *
 *     Label   Borrower  Borrow Date  Return Date         Status
 * ex  wla0014  Nancy    09/03/2015   09/10/2015  Pending|Loaned|Returned
 */
Parse.Cloud.afterSave('Clothing', function(request) {
  var label = request.object.label;
  var borrower = request.object.borrower;
  var borrowDate = requiest.object.borrowDate;
  var returnDate = request.object.returnDate;

  if (/*label exists in col A of spreadsheet*/ true) {
    // TODO: update that row's borrower data
  } else if (borrower) {
    // TODO: create row with new data and status 'Pending'
  }
});
