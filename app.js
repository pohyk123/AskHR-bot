// This is main conversation file
// This loads the environment variables from the .env file
require('dotenv-extended').load();

var builder = require('botbuilder');
var restify = require('restify');
var spellService = require('./spell-service');

var inMemoryStorage = new builder.MemoryBotStorage();

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
// Create connector and listen for messages
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector, function (session,args) {
  session.send('Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.', session.message.text);
}).set('storage', inMemoryStorage);

// You can provide your own model by specifing the 'LUIS_MODEL_URL' environment variable
// This Url can be obtained by uploading or creating your model from the LUIS portal: https://www.luis.ai/
var recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL);
recognizer.intentThreshold=0.8;
bot.recognizer(recognizer);

// Include other conversation scripts
var HireForTeam = require('./branches/HireForTeam')(bot);
var HiringOptions = require('./branches/HiringOptions')(bot);
var HiringOptions = require('./branches/GetQueryAnswered')(bot);
var BuildJobDescription = require('./branches/BuildJobDescription')(bot);


bot.dialog('Start', [
    function (session, args, next) {
        var msg = new builder.Message(session)
        .text("Great, let\'s get started! What would you like to do today?")
        .suggestedActions(
          builder.SuggestedActions.create(
            session, [
              builder.CardAction.imBack(session, "Hire for my team.", "Hire for your team"),
              builder.CardAction.imBack(session, "Get requisition status.", "Get status update on existing request"),
              builder.CardAction.imBack(session, "Explore hiring options", "Explore hiring options"),
              builder.CardAction.imBack(session, "Get my query answered", "Get a Query Answered")
            ]
          ));

        session.send(msg);
    },
    // function(session,results) {
    //   session.endDialog();
    // }
])
.triggerAction({
    matches: 'Start',
});

// bot.dialog('ShowHotelsReviews', function (session, args) {
//     // retrieve hotel name from matched entities
//     var hotelEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'Hotel');
//     if (hotelEntity) {
//         session.send('Looking for reviews of \'%s\'...', hotelEntity.entity);
//         Store.searchHotelReviews(hotelEntity.entity)
//             .then(function (reviews) {
//                 var message = new builder.Message()
//                     .attachmentLayout(builder.AttachmentLayout.carousel)
//                     .attachments(reviews.map(reviewAsAttachment));
//                 session.endDialog(message);
//             });
//     }
// }).triggerAction({
//     matches: 'ShowHotelsReviews'
// });

bot.dialog('Help', function (session) {
    session.endDialog('Sure. On this chat, you can get a consultation on your hiring, start a new requisition, or track an existing one. If you want to restart your conversation with me, simply type \'reset\'');
}).triggerAction({
    matches: 'Help',
    intentThreshold: 0.8
});

bot.dialog('Hire For Team', [
  function (session, results, next) {
    var msg = new builder.Message(session)
    .text("Great, hiring for your team is a very important task. Let me help you with this. Are you hiring for the first time?")
    .suggestedActions(
      builder.SuggestedActions.create(
        session, [
          builder.CardAction.imBack(session, "Yes","Yes."),
          builder.CardAction.imBack(session, "No.","No."),
        ]
      ));
      builder.Prompts.text(session,msg);
  },
  function (session, results) {
      if (results.response.toLowerCase().includes('yes') || results.response == 'y' || results.response == 'Y') {
        var msg = new builder.Message(session)
        .text("Awesome, here is how you can get started.")
        .suggestedActions(
          builder.SuggestedActions.create(
            session, [
              builder.CardAction.imBack(session, "Watch a quick tutorial on hiring @ TCL","Watch a quick tutorial on hiring @ TCL."),
              builder.CardAction.imBack(session, "View learning recommendations for hiring & interviewing skills.","View learning recommendations for hiring & interviewing skills."),
              builder.CardAction.imBack(session, "Consult on my requirement.","Consult on your requirement."),
              builder.CardAction.imBack(session, "Explore Hiring options at TCL.","Explore Hiring options at TCL."),
            ]
          ));
          builder.Prompts.text(session,msg);
      } else if (results.response.toLowerCase().includes('no') || results.response == 'n' || results.response == 'N') {
        var msg = new builder.Message(session)
        .text("Awesome, here is how you can get started.")
        .suggestedActions(
          builder.SuggestedActions.create(
            session, [
              builder.CardAction.imBack(session, "Launch a requisition","Launch a requisition"),
              builder.CardAction.imBack(session, "Build a job description","Build a job description"),
              builder.CardAction.imBack(session, "Watch a quick tutorial on hiring @ TCL","Watch a quick tutorial on hiring @ TCL."),
              builder.CardAction.imBack(session, "Consult on my requirement.","Consult on your requirement."),
              builder.CardAction.imBack(session, "Explore Hiring options at TCL.","Explore Hiring options at TCL."),
            ]
          ));
          builder.Prompts.text(session,msg);
      }
  }
]).triggerAction({
    matches: 'Hire For Team',
    intentThreshold: 0.8
})


bot.dialog('Get Status Update', function (session) {
    session.endDialog('Connect to AskHR for queries realted to systems and processes by writing in to AskHR@tatacommunications.com');
}).triggerAction({
    matches: 'Get Status Update',
    intentThreshold: 0.8
});

bot.dialog('Greetings', function (session) {
    session.endDialog('Hello, I am Recrutron. I can help you with all your recruitment related queries. Type \'Get Started\' when you are ready! If there is something you would like to know type \'help\'');
}).triggerAction({
    matches: 'Greetings',
    intentThreshold: 0.8
});

bot.dialog('Appreciation', function (session) {
    session.endDialog('You\'re welcome! :)');
}).triggerAction({
    matches: 'Appreciation',
    intentThreshold: 0.8
});

bot.dialog('Reset', [
  function (session,args) {
    var msg = new builder.Message(session)
    .text("You are now attempting to restart the session; are you sure? Any saved conversation data will be wiped out.\nIf you click no, please provide input for the previous question.")
    .suggestedActions(
      builder.SuggestedActions.create(
        session, [
          builder.CardAction.imBack(session, "Yes","Yes."),
          builder.CardAction.imBack(session, "No.","No."),
        ]
      ));
    builder.Prompts.text(session,msg)
  },
  function(session,results) {
    if (results.response.toLowerCase().includes('yes') || results.response == 'y' || results.response == 'Y') {
      session.send('Session has restarted.')
      session.reset('Start');
    } else if (results.response.toLowerCase().includes('no') || results.response == 'n' || results.response == 'N') {
      session.endDialog('Session restart aborted.');
    }
  }
])
// .triggerAction({
//     matches: 'Reset',
//     intentThreshold: 0.8,
//     onSelectAction: (session, args, next) => {
//       //add to top of dialog stack
//             session.beginDialog(args.action, args);
//         }
// });
bot.beginDialogAction('beginReset','Reset',{
    matches: 'Reset',
    intentThreshold: 0.6}
  )

// Spell Check
if (process.env.IS_SPELL_CORRECTION_ENABLED === 'true') {
    bot.use({
        botbuilder: function (session, next) {
            spellService
                .getCorrectedText(session.message.text)
                .then(function (text) {
                    console.log('Text corrected to "' + text + '"');
                    session.message.text = text;
                    next();
                })
                .catch(function (error) {
                    console.error(error);
                    next();
                });
        }
    });
}

// // Helpers
// function hotelAsAttachment(hotel) {
//     return new builder.HeroCard()
//         .title(hotel.name)
//         .subtitle('%d stars. %d reviews. From $%d per night.', hotel.rating, hotel.numberOfReviews, hotel.priceStarting)
//         .images([new builder.CardImage().url(hotel.image)])
//         .buttons([
//             new builder.CardAction()
//                 .title('More details')
//                 .type('openUrl')
//                 .value('https://www.bing.com/search?q=hotels+in+' + encodeURIComponent(hotel.location))
//         ]);
// }
//
// function reviewAsAttachment(review) {
//     return new builder.ThumbnailCard()
//         .title(review.title)
//         .text(review.text)
//         .images([new builder.CardImage().url(review.image)]);
// }
