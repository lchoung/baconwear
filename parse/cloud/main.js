
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.afterSave('Clothing', function(request) {
  // TODO: use request.object and add field to google spreadsheet
  // if label already exists, then update that row
  console.log(request.object);
});
