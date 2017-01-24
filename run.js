// var inquirer = require('inquirer');
var select;

var inquirer = require("inquirer");
var fs = require('fs');

var newCard;
var running = true;

var run = function(){
	inquirer.prompt([
		{
      		type: 'list',
        	name: 'go',
        	message: "Would you like to enter a card, take a quiz, or quit?",
        	choices: ['Create', 'Quiz', 'Quit']
      	}, {
      		type: 'list',
      		name: 'create',
      		message: 'A clozecard or basic card?',
      		choices: ['Basic', 'Clozecard', 'back'],
      		when: function(response){
      			return response.go === 'Create';
      		}
    	}, {
      		name: 'basicHint',
      		message: 'What should the hint be?',
      		when: function(response){
      			return response.create === 'Basic';
      		}
    	},{
      		name: 'basicAnswer',
      		message: 'What should the answer be?',
      		when: function(response){
      			return response.create === 'Basic';
      		}
    	}, {
    		type: 'list',
      		name: 'quiz',
      		message: 'What type of quiz?',
      		choices: ['Basic', 'Clozecard', 'back'],
      		when: function(response){
      			return response.go === 'Quiz';
      	}
      }
    ]).then(function(response) {
      

      console.log(response.go);
		switch(response.go){


			case 'Create':
				if (response.create === 'Basic'){
					newCard = (',' + response.basicHint + ',' + response.basicAnswer);
					createBasic();
				} else {
					createCloze();
				}
				console.log('Card created');
			break;


			case 'Quiz':
				quiz();
				console.log('read card');
			break;
			case 'Quit':
				console.log('quit');
				running = false;
			break;
			default:
				console.log('error');
		}
	});
}

var createBasic = function(){
	fs.appendFile('flashCards.txt', newCard, function(err){
	if (err){
		return console.log(err);
	}

	console.log('Added succesfully');
	run();
});
}

var quiz = function(){
fs.readFile('flashCards.txt','utf8', function(error,data){
	var holdItems = data.split(',');

	for (i=0; i<holdItems.length; i++){
		if (i%2 === 0){
			console.log('Question:');
		} else {
			console.log('Answer');
		}
		console.log(holdItems[i]);


		stdin.on('keypress', function (chunk, key) {
  			process.stdout.write('Get Chunk: ' + chunk + '\n');
  			if (key && key.ctrl && key.name == 'c') 
  				process.exit();
			});
		}
	});
}

run();