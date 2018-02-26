var builder = require('botbuilder');
var restify = require('restify');

module.exports = function(bot) {

bot.dialog('Build Job Description', [
  function (session,results) {
    session.send('Welcome to job description builder, here I will guide you through how a job description should be built.')
    var msg = new builder.Message(session)
    .text("Do you have a position ID for this role?")
    .suggestedActions(
      builder.SuggestedActions.create(
        session, [
          builder.CardAction.imBack(session, "Yes" ,"Yes"),
          builder.CardAction.imBack(session, "No","No"),
        ]
      ));
    builder.Prompts.text(session,msg);
  },
  function (session,results) {
    if (results.response.toLowerCase().includes('yes') || results.response == 'y' || results.response == 'Y') {
      session.send('You will now fill up some pieces of information required in the job description; as this is an existing job ID, you can choose to accept or edit.');
      session.beginDialog('Existing Job Description');
    } else if (results.response.toLowerCase().includes('no') || results.response == 'n' || results.response == 'N') {
      session.send('You will now fill up some pieces of information required in the job description.');
      session.beginDialog('New Job Description');
    }
  }
]).triggerAction({
    matches: 'Build Job Description',
    intentThreshold: 0.8
});

bot.dialog('New Job Description', [
  function(session,results){
    builder.Prompts.text(session,'1. What would the role be like?');
  },
  function(session,results){
    session.privateConversationData.JD1 = results.response;
    builder.Prompts.text(session,'2. What are the Role responsibilities/ expected activities form this hire?');
  },
  function(session,results){
    session.privateConversationData.JD2 = results.response;
    builder.Prompts.text(session,'3. What is the Primary Skill-Set (must have) for the hire?');
  },
  function(session,results){
    session.privateConversationData.JD3 = results.response;
    builder.Prompts.text(session,'4.What are Additional Skills (good to have)?');
  },
  function(session,results){
    session.privateConversationData.JD4 = results.response;
    builder.Prompts.text(session,'5.Would you like the candidate to have any Certifications?');
  },
  function(session,results){
    session.privateConversationData.JD5 = results.response;
    builder.Prompts.text(session,'6.What is Experience  level you are looking at?');
  },
  function(session,results){
    session.privateConversationData.JD6 = results.response;
    builder.Prompts.text(session,'7.Could you help us with some Target Companies who may have these kind of roles?');
  },
  function(session,results){
    session.privateConversationData.JD7 = results.response;
    builder.Prompts.text(session,'8.If you have an ideal candidate in mind you can post his linkedin profile link here ?');
  },
  function(session,results,next) {
    session.privateConversationData.JD8 = results.response;
    session.send(`Thank you for response, your input are as follows: <br/>Role: ${session.privateConversationData.JD1}<br/>Responsibilities: ${session.privateConversationData.JD2}<br/>Primary Skill Set: ${session.privateConversationData.JD3}<br/>Additional Skills: ${session.privateConversationData.JD4}<br/>Certifications: ${session.privateConversationData.JD5}<br/>Experience Level: ${session.privateConversationData.JD6}<br/>Target Companies: ${session.privateConversationData.JD7}<br/>Ideal Candidate: ${session.privateConversationData.JD8}<br/>`);
    next();
  },
  function(session){
    session.beginDialog('Finish Job Description');
  }
]);

bot.dialog('Existing Job Description', [
  function(session){
    builder.Prompts.text(session,'Firstly, please key in your job ID.');
  },
  function(session,results,next){
    session.privateConversationData.JD1 = 'This is an Individual contributor role';
    session.privateConversationData.JD2 = 'Responsible for entire product life cycle management - development and management of products as per new product/service requirement and enhancement of existing products and features. Also responsible for augmentation of network capacity to meet growing customer needs, new technology introduction, or increasing operational efficiencies, with the objective of ensuring increase in product and service profitability, revenue and market competitiveness; and developing and delivering effective multi product solutions to meet customer requirements. Drive P&L management through product strategy development and manage a group of products within a technology area across multiple regions. Works with the sales team on market strategy, pricing and positioning of the product. Engage and partner with technology providers to recruit new features or new product. Assess performance of product/service portfolio against annual operating plan and discuss achievement of targets with Sales.';
    session.privateConversationData.JD3 = 'P&L Management\nDeep Product Knowledge\nProduct Strategy Roadmap Creation and Deployment\nEnd User Empathy and Market Understanding\nStakeholder Management';
    session.privateConversationData.JD4 = 'Creating Architecture Map\nProduct Engineering & Implementation\nData Analysis\nCustomer Experience';
    session.privateConversationData.JD5 = 'Avaya , Cisco';
    session.privateConversationData.JD6 = 'Experience of 10-12 years in telecommunications industry in techno-commercial assignments';
    session.privateConversationData.JD7 = 'Avaya, Cisco, Reliance';
    session.privateConversationData.JD8 = '<empty>';
    next();
  },
  function(session,results){
    session.send('1. What would the role be like?');
    builder.Prompts.choice(session,'Current Answer:\n'+session.privateConversationData.JD1,'Accept|Edit');
  },
  function(session,results,next){
    if(results.response.index == 0) {
      next();
    } else {
      builder.Prompts.text(session,'Please type in a new description.')
    }
  },
  function(session,results,next){
    if (results.response){
      session.privateConversationData.JD1 = results.response;
      session.send('Response accepted. You typed: '+session.privateConversationData.JD1);
    };
    next();
  },
  function(session,results){
    session.send('2. What are the Role responsibilities/ expected activities form this hire?');
    builder.Prompts.choice(session,'Current Answer:\n'+session.privateConversationData.JD2,'Accept|Edit');
  },
  function(session,results,next){
    if(results.response.index == 0) {
      next();
    } else {
      builder.Prompts.text(session,'Please type in a new description.')
    }
  },
  function(session,results,next){
    if (results.response){
    session.privateConversationData.JD2 = results.response;
      session.send('Response accepted. You typed: '+session.privateConversationData.JD2);
    };
    next();
  },function(session,results){
    session.send('3. What is the Primary Skill-Set (must have) for the hire?');
    builder.Prompts.choice(session,'Current Answer:\n'+session.privateConversationData.JD3,'Accept|Edit');
  },
  function(session,results,next){
    if(results.response.index == 0) {
      next();
    } else {
      builder.Prompts.text(session,'Please type in a new description.')
    }
  },
  function(session,results,next){
    if (results.response){
      session.privateConversationData.JD3 = results.response;
      session.send('Response accepted. You typed: '+session.privateConversationData.JD3);
    };
    next();
  },function(session,results){
    session.send('4.What are Additional Skills (good to have)?');
    builder.Prompts.choice(session,'Current Answer:\n'+session.privateConversationData.JD4,'Accept|Edit');
  },
  function(session,results,next){
    if(results.response.index == 0) {
      next();
    } else {
      builder.Prompts.text(session,'Please type in a new description.')
    }
  },
  function(session,results,next){
    if (results.response){
      session.privateConversationData.JD4 = results.response;
      session.send('Response accepted. You typed: '+session.privateConversationData.JD4);
    };
    next();
  },function(session,results){
    session.send('5.Would you like the candidate to have any Certifications?');
    builder.Prompts.choice(session,'Current Answer:\n'+session.privateConversationData.JD5,'Accept|Edit');
  },
  function(session,results,next){
    if(results.response.index == 0) {
      next();
    } else {
      builder.Prompts.text(session,'Please type in a new description.')
    }
  },
  function(session,results,next){
    if (results.response){
      session.privateConversationData.JD5 = results.response;
      session.send('Response accepted. You typed: '+session.privateConversationData.JD5);
    };
    next();
  },function(session,results){
    session.send('6.What is Experience  level you are looking at?');
    builder.Prompts.choice(session,'Current Answer:\n'+session.privateConversationData.JD6,'Accept|Edit');
  },
  function(session,results,next){
    if(results.response.index == 0) {
      next();
    } else {
      builder.Prompts.text(session,'Please type in a new description.')
    }
  },
  function(session,results,next){
    if (results.response){
      session.privateConversationData.JD6 = results.response;
      session.send('Response accepted. You typed: '+session.privateConversationData.JD6);
    };
    next();
  },function(session,results){
    session.send('7.Could you help us with some Target Companies who may have these kind of roles?');
    builder.Prompts.choice(session,'Current Answer:\n'+session.privateConversationData.JD7,'Accept|Edit');
  },
  function(session,results,next){
    if(results.response.index == 0) {
      next();
    } else {
      builder.Prompts.text(session,'Please type in a new description.')
    }
  },
  function(session,results,next){
    if (results.response){
      session.privateConversationData.JD7 = results.response;
      session.send('Response accepted. You typed: '+session.privateConversationData.JD7);
    };
    next();
  },function(session,results){
    session.send('8.If you have an ideal candidate in mind you can post his linkedin profile link here ?');
    builder.Prompts.choice(session,'Current Answer:\n'+session.privateConversationData.JD8,'Accept|Edit');
  },
  function(session,results,next){
    if(results.response.index == 0) {
      next();
    } else {
      builder.Prompts.text(session,'Please type in a new description.')
    }
  },
  function(session,results,next){
    if (results.response){
      session.privateConversationData.JD8 = results.response;
      session.send('Response accepted. You typed: '+session.privateConversationData.JD8);
    };
    next();
  },
  function(session,args,next) {
    session.send(`Thank you for response, your input are as follows: <br/>Role: ${session.privateConversationData.JD1}<br/>Responsibilities: ${session.privateConversationData.JD2}<br/>Primary Skill Set: ${session.privateConversationData.JD3}<br/>Additional Skills: ${session.privateConversationData.JD4}<br/>Certifications: ${session.privateConversationData.JD5}<br/>Experience Level: ${session.privateConversationData.JD6}<br/>Target Companies: ${session.privateConversationData.JD7}<br/>Ideal Candidate: ${session.privateConversationData.JD8}<br/>`);
    next();
  },
  function(session){
    session.beginDialog('Finish Job Description');
  }
]);

bot.dialog('Finish Job Description', [
  function(session){
    session.send('Awesome , Thanks for patiently giving all the inputs. Here is an editable version of the JD you just created . You can upload this in Prism when you raise a requisition or keep a copy for future reference.');
    var msg = new builder.Message(session)
      .addAttachment({
        contentUrl:"https://tcshrchatbot.blob.core.windows.net/tcs-hr-chatbot/jobDescription.png",
        contentType:"image/png",
      });
    session.send(msg);
    var msg = new builder.Message(session)
    .suggestedActions(
      builder.SuggestedActions.create(
        session, [
          builder.CardAction.imBack(session, "Download","Download"),
          builder.CardAction.imBack(session, "Launch Requisition","Launch Requisition"),
          builder.CardAction.imBack(session, "Start Menu","Start Menu"),
        ]
      ));
    builder.Prompts.text(session,msg);
  },
  function(session) {
    session.endDialog('Dialog has ended.');
  }
]);

}
