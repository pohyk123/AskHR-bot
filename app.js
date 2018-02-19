// This loads the environment variables from the .env file
require('dotenv-extended').load();

var builder = require('botbuilder');
var restify = require('restify');
var Store = require('./store');
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

var bot = new builder.UniversalBot(connector, function (session) {
    session.send('Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.', session.message.text);
}).set('storage', inMemoryStorage);

// You can provide your own model by specifing the 'LUIS_MODEL_URL' environment variable
// This Url can be obtained by uploading or creating your model from the LUIS portal: https://www.luis.ai/
var recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL);
recognizer.intentThresholad=0.8
bot.recognizer(recognizer);

bot.dialog('Start', [
    function (session, args, next) {
        var msg = new builder.Message(session)
        .text("Great, let\'s get started! What would you like to do today?")
        .suggestedActions(
          builder.SuggestedActions.create(
            session, [
              builder.CardAction.imBack(session, "Hire for my team.", "Hire for your team"),
              builder.CardAction.imBack(session, "Get status update on my hiring request.", "Get Status Update on your hiring request"),
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
    session.endDialog('Sure. On this chat, you can get a consultation on your hiring, start a new requisition, or track an existing one. Simply start typing!');
}).triggerAction({
    matches: 'Help',
    intentThreshold: 0.8
});

bot.dialog('Hire For Team', [
  function (session, results, next) {
    var msg = new builder.Message(session)
    .text("Cool , hiring for your team surely is a critical task; would you like to go for some consultation around your requirement? (Y/N)")
    .suggestedActions(
      builder.SuggestedActions.create(
        session, [
          builder.CardAction.imBack(session, "Yes.","Yes."),
          builder.CardAction.imBack(session, "No.","No."),
        ]
      ));
      builder.Prompts.text(session,msg);
  },
  function (session, results) {
      if (results.response.toLowerCase().includes('yes') || results.response == 'y' || results.response == 'Y') {
        session.beginDialog('Yes');
      } else if (results.response.toLowerCase().includes('no') || results.response == 'n' || results.response == 'N') {
        //bot.beginDialog('No')
      }
  }
]).triggerAction({
    matches: 'Hire For Team',
    intentThreshold: 0.8
})

bot.dialog('Yes', [
  function (session,results,next) {
    session.send('In order to facilitate hiring, I will be asking you several questions. Feel free to type in your own answers; buttons will be provided to guide you during the questionaire.');
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
    session.send(`Thank you for response, your input are as follows: <br/>Location: ${session.dialogData.location}<br/>Duration: ${session.dialogData.duration}<br/>Job Type: ${session.dialogData.jobtype}<br/>Work Nature: ${session.dialogData.workNature}<br/>Working Hours: ${session.dialogData.workHours}<br/>Required Skills: ${session.dialogData.skills}<br/>AOP Funding: ${session.dialogData.funding}<br/>Experience: ${session.dialogData.experience}<br/>Hire Type: ${session.dialogData.replacement}`)
    session.send('These are our recommendations for you: (Internal Talent that matches your requirement)')

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
      var msg = new builder.Message(session)
      .text("Glad that you found it useful! Please pick one of the available options:")
      .suggestedActions(
        builder.SuggestedActions.create(
          session, [
            builder.CardAction.postBack(session, "Launch requisition for hiring" ,"Launch requisition for hiring"),
            builder.CardAction.postBack(session, "Explore hiring options","Explore hiring options"),
          ]
        ));
      builder.Prompts.text(session,msg);
    } else if (results.response.toLowerCase().includes('no') || results.response == 'n' || results.response == 'N') {
      var msg = new builder.Message(session)
      .text("Glad that you found it useful! Please pick one of the available options:")
      .suggestedActions(
        builder.SuggestedActions.create(
          session, [
            builder.CardAction.postBack(session, "Connect to your HR Business Partner" ,"Connect to your HR Business Partner"),
            builder.CardAction.postBack(session, "Explore hiring options","Explore hiring options"),
            builder.CardAction.postBack(session, "Raise a query","Raise a query"),
          ]
        ));
      builder.Prompts.text(session,msg);
    }
  },
  function(session,results){
    session.endDialog('<---END OF SESSION--->');
  }
]);

bot.dialog('Get Status Update', function (session) {
    session.endDialog('Connect to AskHR for queries realted to systems and processes by writing in to AskHR@tatacommunications.com');
}).triggerAction({
    matches: 'Get Status Update',
    intentThreshold: 0.8
});

bot.dialog('Get Query Answered', function (session) {
    session.endDialog('Connect to AskHR for queries realted to systems and processes by writing in to AskHR@tatacommunications.com');
}).triggerAction({
    matches: 'Get Query Answered',
    intentThreshold: 0.8
});

bot.dialog('Greetings', function (session) {
    session.endDialog('Hello, I am Recrutron. I can help you with all your recruitment related queries. Type \'Get Started\' when you are ready! If there is something you would like to know type \'help\'');
}).triggerAction({
    matches: 'Greetings',
    intentThreshold: 0.8
});

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
