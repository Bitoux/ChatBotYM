/* DEPENDENCES */
var builder = require('botbuilder');
var restify = require('restify');

/* CREATE SERVER */
var server = restify.createServer();

server.listen(process.env.port || 3978, function() {
    console.log(`server name:${server.name} | server url: ${server.url}`);
});

/* CONNECT CHAT */
var connector = new builder.ChatConnector({
  appId: process.env.APP_ID,
  appPassword:  process.env.APP_PASSWORD
});

/* LISTEN MESSAGES */
server.post('/api/messages', connector.listen());

/* WHEN RECIEVE MESSAGES */
var bot = new builder.UniversalBot(connector, function (session) {
  if (session.message.text === "doheavywork") {
    session.sendTyping();
    setTimeout(()  => {
      session.send("Yoo !");
    }, 3000);
  }
        
  bot.on ('typing', function() {
    session.send(`I see you`);
  });
});

bot.on('conversationUpdate', function (message) {
  if (message.membersAdded) {
    message.membersAdded.forEach(function (identity) {
      if (identity.id === message.address.bot.id) {
        let msg = new builder.Message().address(message.address);
        msg.text('Yoo');
        bot.send(msg);
      }
    });
  }
});
