var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

app.use(express.static('views'));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// ############################################################
// Map the Steam name to the discord Id to @mention the players
//
var playerMapping = {
  'Terabyt3r': '463077545051422720',
  'R1klus': '158703705141542912',
  'Kölski': '186226325931950080',
  'eunadia': '587631819667537952',
  'Nyms': '165561724194390017',
};

// #################################################################
// Map game name to different bots so you can have channels per game
//  
var serverMapping = {
  "Nyms's Game": 'https://discordapp.com/api/webhooks/694965742847918164/iR_7ecM-CL2Uik4EkCuYWjLmW9EXvGU0a0GT3gCPeYH1vpwfoW7_cd3xh1aN9iM4sKoN'
}; 
 

app.post("/", (req, response) => {
  
  console.log( req.body );
  console.log ( req.body.value2);
  var playerId = playerMapping[req.body.value2];
  var server = serverMapping[req.body.value1];
  var gamename = req.body.value1;
  
  console.log( playerId);
  var turnNumber = req.body.value3;
  
  if ( playerId && server )
  {
    var content = "Hæ <@"+ playerId + ">, þú á leik í " + gamename +" (umferð #" + turnNumber + ")";
    sendMessage( server, content);
    console.log("Done triggering.");
  }
  else
  {
    var content = "Error in data, missing game or player?\n" + req.body;
    console.log( content );
  }

  response.end();  
});


function sendMessage( server, content )
{
	request({ 
    uri: server,
    body: { "content":content},
    json: true,
    method: 'POST'
  }, function (error, response, body) {
     if (!error && response.statusCode == 200) {
       console.log(body); // Show the response from Habitica
     }
    else {
      console.log(response.statusCode);
      console.log(body);
    }
  });
}

// listen for requests :)
var listener = app.listen(PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});