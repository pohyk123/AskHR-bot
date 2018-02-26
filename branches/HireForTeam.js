var builder = require('botbuilder');
var restify = require('restify');

module.exports = function(bot) {

bot.dialog('Tutorial Video', function (session) {
  var msg = new builder.Message(session)
    .text('Watch Video tutorial below.')
    .addAttachment({
      name:"Watch HR Tutorial Video",
      contentUrl:"https://play.tatacommunications.com/app/video/gcc-2141388d-48da-4112-a176-afe5a82b73aa?search=hiring"
    });
  session.endDialog(msg);
}).triggerAction({
    matches: 'Tutorial Video',
    intentThreshold: 0.8
});

bot.dialog('Learning Recommendations', function (session) {
  var msg = new builder.Message(session)
    .text("These are some available recommendations for you.")
    .addAttachment({
      contentUrl:"https://tcshrchatbot.blob.core.windows.net/tcs-hr-chatbot/learning_recommendations.png",
      contentType:"image/png",
    });
  session.send(msg);
}).triggerAction({
    matches: 'Learning Recommendations',
    intentThreshold: 0.8
});

bot.dialog('Consult Requirement', [
  function (session,results,next) {
    session.send('You are consulting on hiring requirements. In order to facilitate hiring, I will be asking you several questions. Feel free to type in your own answers; buttons will be provided to guide you during the questionaire.');
    var msg = new builder.Message(session)
    .text("At what location are you intending to hire?")
    .suggestedActions(
      builder.SuggestedActions.create(
        session, [
          builder.CardAction.imBack(session, "India","India"),
          builder.CardAction.imBack(session, "International","International"),
        ]
      ));
    builder.Prompts.text(session,msg);
  },
  function(session,results,next) {
    session.dialogData.location = results.response
    var msg = new builder.Message(session)
    .text("Is this role aligned to a long term goal in the organisation or a short-term project?")
    .suggestedActions(
      builder.SuggestedActions.create(
        session, [
          builder.CardAction.imBack(session, "Long Term","Long Term"),
          builder.CardAction.imBack(session, "Short Term","Short Term"),
          builder.CardAction.imBack(session, "I don't know yet","I don't know yet"),
        ]
      ));
      builder.Prompts.text(session,msg);
  },
  function(session,results,next) {
    session.dialogData.duration = results.response
    var msg = new builder.Message(session)
    .text("Is the Scope of the work fixed or changing over time?")
    .suggestedActions(
      builder.SuggestedActions.create(
        session, [
          builder.CardAction.imBack(session, "Fixed","Fixed"),
          builder.CardAction.imBack(session, "Changing","Changing"),
          builder.CardAction.imBack(session, "I don't know yet","I don't know yet"),
        ]
      ));
      builder.Prompts.text(session,msg);
  },
  function(session,results,next) {
    session.dialogData.jobType = results.response
    var msg = new builder.Message(session)
    .text("Is the nature of the work -:")
    .suggestedActions(
      builder.SuggestedActions.create(
        session, [
          builder.CardAction.imBack(session, "Repetitive","Repetitive"),
          builder.CardAction.imBack(session, "Challenging","Based on crticial thinking , innovation & decision making"),
          builder.CardAction.imBack(session, "Both","A little of both"),
          builder.CardAction.imBack(session, "I don't know","I don't know"),
        ]
      ));
      builder.Prompts.text(session,msg);
  },
  function(session,results,next) {
    session.dialogData.workNature = results.response
    var msg = new builder.Message(session)
    .text("What is the required work hours per week?")
    .suggestedActions(
      builder.SuggestedActions.create(
        session, [
          builder.CardAction.imBack(session, "Less than 30 hours","Less than 30 hours"),
          builder.CardAction.imBack(session, "30-40 hours","30-40 hours"),
          builder.CardAction.imBack(session, "I don't know yet","I don't know yet"),
        ]
      ));
      builder.Prompts.text(session,msg);
  },
  function(session,results,next) {
    session.dialogData.workHours = results.response
    msg="Enter skills required: <<Insert IYS profiler>>"
    builder.Prompts.text(session,msg);
  },
  function(session,results,next) {
    session.dialogData.skills = results.response
    var msg = new builder.Message(session)
    .text("How are you funding this requirement?")
    .suggestedActions(
      builder.SuggestedActions.create(
        session, [
          builder.CardAction.imBack(session, "Within AOP" ,"It is within AOP."),
          builder.CardAction.imBack(session, "Position outside of AOP","Position outside of AOP"),
        ]
      ));
    builder.Prompts.text(session,msg);
  },
  function(session,results,next) {
    session.dialogData.funding = results.response
    var msg = new builder.Message(session)
    .text("What level are you hiring at?")
    .suggestedActions(
      builder.SuggestedActions.create(
        session, [
          builder.CardAction.imBack(session, "Entry Level" ,"Entry Level"),
          builder.CardAction.imBack(session, "Experienced","Experienced"),
        ]
      ));
    builder.Prompts.text(session,msg);
  },
  function(session,results,next) {
    session.dialogData.experience = results.response
    var msg = new builder.Message(session)
    .text("Is this a replacement to an existing role or a new role?")
    .suggestedActions(
      builder.SuggestedActions.create(
        session, [
          builder.CardAction.imBack(session, "New" ,"New"),
          builder.CardAction.imBack(session, "Replacement","Replacement"),
        ]
      ));
    builder.Prompts.text(session,msg);
  },
  function(session,results,next) {
    session.dialogData.replacement = results.response
    session.send(`Thank you for response, your input are as follows: <br/>Location: ${session.dialogData.location}<br/>Duration: ${session.dialogData.duration}<br/>Job Type: ${session.dialogData.jobType}<br/>Work Nature: ${session.dialogData.workNature}<br/>Working Hours: ${session.dialogData.workHours}<br/>Required Skills: ${session.dialogData.skills}<br/>AOP Funding: ${session.dialogData.funding}<br/>Experience: ${session.dialogData.experience}<br/>Hire Type: ${session.dialogData.replacement}`)
    session.send('These are our recommendations for you:')

    var msg = new builder.Message(session)
      .addAttachment({
        contentUrl:"https://tcshrchatbot.blob.core.windows.net/tcs-hr-chatbot/hiringCandidate.png",
        contentType:"image/png",
      });
    session.send(msg);

    var msg = new builder.Message(session)
    .text("Was this consultation helpful?")
    .suggestedActions(
      builder.SuggestedActions.create(
        session, [
          builder.CardAction.imBack(session, "Yes" ,"Yes"),
          builder.CardAction.imBack(session, "No","No"),
        ]
      ));
    builder.Prompts.text(session,msg);
  },
  function(session,results,next) {
    if (results.response.toLowerCase().includes('yes') || results.response == 'y' || results.response == 'Y') {
      var msg = "Hire a full time employee from the market|Hire internal talent|Hire Freelancers with this skillset|Hire through the Tata Group SCIP program";
      builder.Prompts.choice(session,'Awesome, here is what you can do next:',msg);
    } else if (results.response.toLowerCase().includes('no') || results.response == 'n' || results.response == 'N') {
      var msg = new builder.Message(session)
      .text("Oh! We are sorry to hear that, here is what you can do next:")
      .suggestedActions(
        builder.SuggestedActions.create(
          session, [
            builder.CardAction.imBack(session, "Build a job description" ,"Build a job description"),
            builder.CardAction.imBack(session, "Explore hiring options @ TCL","Explore hiring options @ TCL"),
            builder.CardAction.imBack(session, "Launch a requisition","Launch a requisition"),
          ]
        ));
      builder.Prompts.text(session,msg);
    }
  },
  function(session,results){
    session.endDialog('<---END OF SESSION--->');
  }
]).triggerAction({
    matches: 'Consult Requirement',
});

}
