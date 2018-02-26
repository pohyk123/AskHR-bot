var builder = require('botbuilder');
var restify = require('restify');

module.exports = function(bot) {

bot.dialog('Get Query Answered', [
  function (session,args) {
    builder.Prompts.choice(session,'Its nice to know you are exploring hiring options. Choose a number to find out more.','How do I raise a requisition?|How do I hire?|Which system is used for hiring?|How do I login to the hiring system?|What is the hiring process?|What is approval process?|What is status of my requisition?');
  },
  function (session,args) {
    if (args.response.index <= 4) {
      session.endDialog('We use the Prism Recruiment module for recruitment. You can login to Prism through single sign on and raise a requisition. Here is a quick tutorial on how to access the system and raise a requisition.');
    } else if (args.response.index == 5) {
      session.send('The approval process depends on the type of hiring option you have chosen.')
      session.beginDialog('Explore Hiring Options')
    } else if (args.response.index == 6) {
      session.beginDialog('Get Requisition Status')
    }
  }
]).triggerAction({
    matches: 'Get Query Answered',
    intentThreshold: 0.8
});

bot.dialog('Get Requisition Status', [
  function(session) {
    builder.Prompts.text(session,'Please enter requisition id:')
  },
  function(session,results) {
  var msg = new builder.Message(session)
    .text("Thank you for entering your requisition ID. Here is your requisition status:")
    .addAttachment({
      contentUrl:"https://tcshrchatbot.blob.core.windows.net/tcs-hr-chatbot/hiringStage.png",
      contentType:"image/png",
    });
  session.endDialog(msg);
  }
]).triggerAction({
    matches: 'Get Requisition Status',
    intentThreshold: 0.8
});

}
