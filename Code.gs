function myFunction() {
  var email = 'user@tld.com';
  //var groups = GroupsApp.getGroups();
  //Logger.log('You are a member of %s Google Groups.', groups.length);
  // https://medium.com/@Urwa.Shabir/automate-adding-members-to-google-group-from-google-sheets-google-apps-script-16ee6eb41c43
  var newsigroup = GroupsApp.getGroupByEmail("gp@ourdomain.org");
  var oldsigroup = GroupsApp.getGroupByEmail("gp@googlegroups.com");
  var hasoldMember;
  try {
   hasoldMember = oldsigroup.hasUser(email);
   Logger.log('is a member of the old group = T/F')
   //Logger.log(hasoldMember)
   

  }
  catch (e) {
    Logger.log(e)
  }
  try {
    //delMember('user@gmail.com', oldsigroup); this doesn't work because the oldgroup is in googlegroups.com
    addMember(email, newsigroup);
    addToSpreadsheet(email, hasoldMember);
    MailApp.sendEmail({
    to: email,
    cc: 'ouremail@ourdomain.org',
    subject: 'Em issue',
    htmlBody: "This is the html body<br><br>"
      +"Can see the GAS documentation of MailApp.sendEmail for more"
    
  });
    
     
  }
  catch(e) {
    console.error(e);
    Logger.log(e);
    //var emailQuotaRemaining = MailApp.getRemainingDailyQuota();
    //Logger.log("Remaining email quota: " + emailQuotaRemaining);
    MailApp.sendEmail('myemail@ourdomain.org', 'user subscribe failed', 'The error is '+e);

  }     
}

function addMember(email, group) {
  
  var hasMember = group.hasUser(email);
  Utilities.sleep(1000);
  
  if(!hasMember) {
    var newMember = {email: email, 
                     role: "MEMBER" };
    AdminDirectory.Members.insert(newMember, "gp@ourdomain.org");
  } else {
    Logger.log('%s is already a member of the group.', email)
  }
}

function enc(str) {
    var encoded = "";
    for (i=0; i<str.length;i++) {
        var a = str.charCodeAt(i);
        var b = a ^ 123;    // bitwise XOR with any number, e.g. 123, change this in production
        encoded = encoded+String.fromCharCode(b);
    }
    return encoded;
}
function testenc(str) {
  str = 'user@gmail.com';
  var encoded = encodeURIComponent(enc(str));
  Logger.log('Encoded = %s, Decoded = %s', encoded, enc(decodeURIComponent(encoded)) );
}

function delMember(email, group) {
  
  var hasMember = group.hasUser(email);
  Utilities.sleep(1000);
  
  if(hasMember) {
    AdminDirectory.Members.remove( "gp@googlegroups.com", email);
    // gives error that this group was not found, because this is in googlegroups.com domain and not our domain
    Logger.log('%s deleted from the old group.', email);
  } else {
    Logger.log('%s is not a member of the old group.', email);
  }
}

// https://developers.google.com/apps-script/reference/groups/group?hl=en#getUsers()

function listGroupMembers() {
  var GROUP_EMAIL = "anothergp@googlegroups.com";
  var group = GroupsApp.getGroupByEmail(GROUP_EMAIL);
  var users = group.getUsers();
  console.log("Group " + GROUP_EMAIL + " has " + users.length + " members:");
  for (var i = 0; i < users.length; i++) {
    var user = users[i];
    Logger.log(user.getEmail());
  }
}

function addToSpreadsheet(email, present) {
  //for testing, email = 'user@icloud.com';
  //present = false;
  // the spreadsheet at https://docs.google.com/spreadsheets/d/ID/edit#gid=0
  var ss = SpreadsheetApp.openById('ID');
  var activesheet = ss.getSheetByName('Sheet1');
  // rows are of the form "Email Id",	"Added",	"Removed from other group", "Comments"
  var row = [];
  if (!present) {
    row = [email, 'Yes' ,  , 'not present in old group'];
  }
  else {
    row = [email,'Yes'];
  }
  activesheet.appendRow(row);


}
function createsublink(email) {
  // for testing
  var email = 'user@rediffmail.com'
  var url='https://script.google.com/macros/s/ThisisAnotherID/exec?hash=';
  var hashedemail = encodeURIComponent(enc(email));
  url += hashedemail;
  Logger.log(url);
  return url;
}

