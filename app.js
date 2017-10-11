/* DEPENDENCES */
var builder = require('botbuilder');
var restify = require('restify');

/* CREATE SERVER */
var server = restify.createServer();

server.listen(process.env.port || 3978, function() {
    console.log(`server name:${server.name} | server url: ${server.url}`);
});

/* CONNECT CHAT */
var connector = new builder.ChatConnector({});

/* LISTEN MESSAGES */
server.post('/api/messages', connector.listen());

/* MENU */
var menuItems = {
  "Ask Name": {
    item: 'askName'
  },
  "Ask Phone": {
    item: "askPhone"
  },
  "Ask Date": {
    item: "askDate"
  },
  "Ask number People": {
    item: "askNumbPers"
  }
};

/* TP - 2 */



/* WHEN RECIEVE MESSAGES */
var bot = new builder.UniversalBot(connector, [
  function(session){
    session.beginDialog('makeResa');
  },
  function(session, results){
    if(session.resaName && session.resaDate && session.resaNb && session.resaPhone){
      var strUser = "Your reservation is for:"+session.userData.resaDate+", for "+session.userData.resaNb+" persons. With the name: "+session.userData.resaName;
      session.endDialog(strUser);
    }else{
      session.beginDialog('makeResa');
    }
    
  }
]);

/* BEIN THE DIALOG AND ASK FOR NAME */
/*bot.dialog('greetings', [
  function(session){
    session.beginDialog('askName');
  },
  function (session, results){
    session.endDialog('Hello %s!', results.response);
  }
]);*/

bot.dialog('makeResa', [
  function(session){
    builder.Prompts.choice(session, "Que voulez vous faire:", menuItems);
  },
  function(session, results){
    if(results.response){
      session.beginDialog(menuItems[results.response.entity].item);
    }
  }
])
.triggerAction({
  matches: /^main menu$/i,
  confirmPrompt: "Choix"
});

/* ASKS ARE CALLED, AND RETURN THE NAME */
bot.dialog('askName', [
  function(session){
    builder.Prompts.text(session, 'Hi, What is your name?');
  },
  function(session, results){
    var resaName = results.response;
    session.userData.resaName = resaName;
    session.endDialogWithResult(results);
    builder.Prompts.choice(session, "Que voulez vous faire:", menuItems);
  }
]);

bot.dialog('askPhone', [
  function(session, args){
    if(args && args.reprompt){
      builder.Prompts.text(session, "Enter your phone number as 0123456545");
    }else{
      builder.Prompts.text(session, "What is your phone number?");
    }
  },
  function(session, results){
    var resaPhone = results.response;
    if(resaPhone.length == 10){
      session.userData.resaPhone = resaPhone;
      session.endDialogWithResult(results);
      builder.Prompts.choice(session, "Que voulez vous faire:", menuItems);
    }else{
      session.replaceDialog('askPhone', {reprompt: true});
    }
  }
]);

bot.dialog('askDate', [
  function(session){
    builder.Prompts.time(session, 'Which date would you like to reserve?');
  },
  function(session, results){
    var resaDate = results.response;
    session.userData.resaDate = resaDate;
    session.endDialogWithResult(results);
    builder.Prompts.choice(session, "Que voulez vous faire:", menuItems);
  }
]);

bot.dialog('askNumbPers', [
  function(session){
    builder.Prompts.number(session, 'How many people will be with you?');
  },
  function(session, results){
    var resaNb = results.response;
    session.userData.resaNb = resaNb;
    session.endDialogWithResult(results);
    builder.Prompts.choice(session, "Que voulez vous faire:", menuItems);
  }
]);
