var builder = require('botbuilder');
var restify = require('restify');

module.exports = function(bot) {

bot.dialog('Explore Hiring Options', [
  function (session) {
  var msg = new builder.Message(session)
  .text("Its nice to know you are exploring hiring options. Click on any one to know more.")
  .suggestedActions(
    builder.SuggestedActions.create(
      session, [
        builder.CardAction.imBack(session, "Full time employees", "Full time employees"),
        builder.CardAction.imBack(session, "Internal Talent", "Internal Talent"),
        builder.CardAction.imBack(session, "Freelance Talent", "Freelance Talent"),
        builder.CardAction.imBack(session, "Hiring for cross functional projects", "Hiring for cross functional projects"),
        builder.CardAction.imBack(session, "Hire for increasing winning mix", "Hire for increasing winning mix"),
        builder.CardAction.imBack(session, "Consultants/Contractors", "Consultants/Contractors"),
        builder.CardAction.imBack(session, "Interns/ Campus Recruits/TAS /Global Campus Program", "Interns/ Campus Recruits/TAS /Global Campus Program"),
        builder.CardAction.imBack(session, "TATA group hires", "TATA group hires")
      ]
    ));
  builder.Prompts.text(session,msg);
},
function (session) {
  var msg = new builder.Message(session)
    .text("Here is all you need to know about this hiring option.")
    .addAttachment({
      contentUrl:"https://tcshrchatbot.blob.core.windows.net/tcs-hr-chatbot/hiringOptions.png",
      contentType:"image/png",
    });
  session.send(msg);
}]).triggerAction({
    matches: 'Explore Hiring Options',
    intentThreshold: 0.8
});

}
