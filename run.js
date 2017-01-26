// var inquirer = require('inquirer');
var select;

var inquirer = require("inquirer");
var fs = require('fs');
var log = require('./log.json');
var i = 0;
// var stdin = process.openStdin(); 
// process.stdin.setRawMode(true);
// require('tty').setRawMode(true);

var newCard;
var running = true;


function FlashCard(type, question, answer){
	this.type = type;
	this.question = question;
	this.answer = answer;
};



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
    	},{
      		name: 'clozeHint',
      		message: 'Write a statement inculding the answer.',
      		when: function(response){
      			return response.create === 'Clozecard';
      		}
    	},{
      		name: 'clozeAnswer',
      		message: 'Which part should be hidden? (Use exact syntex)',
      		when: function(response){
      			return response.create === 'Clozecard';
      		}
    	}, {
    		type: 'list',
      		name: 'quiz',
      		message: 'What type of quiz?',
      		choices: ['All', 'back'],
      		when: function(response){
      			return response.go === 'Quiz';
      	}
      }
    ]).then(function(response) {
      

      console.log(response.go);
		switch(response.go){


			case 'Create':
				switch(response.create){
					case 'Basic':
						newCard = new FlashCard('basic',response.basicHint, response.basicAnswer);
						createBasic();
						console.log('Card created');
						break;

					case 'Clozecard':
						newCard = new FlashCard('cloze',response.clozeHint, response.clozeAnswer);
						createCloze();
						break;

					default:
						run();
				}
				
			break;

			case 'Quiz':
				i=0;
				var type = response.quiz;
				switch(type){
					case 'All':
						quiz();
					break;

					default:
						run();
				}
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
	console.log(newCard.question);
	console.log(newCard.answer);
	log.push(newCard);
	fs.writeFile('log.json', JSON.stringify(log, null, 2), function(err){
		if (err){
			return console.log(err);
		}
		run();
	});
}

var createCloze = function(){
	console.log(newCard.question);
	console.log(newCard.answer);
	var hold = newCard.question.split(newCard.answer);
	if (hold.length === 1){
		console.log('The answer was not found in the question, you may want to create a basic card');
	} else {
		newCard.question = hold[0] + ' ... ' + hold[1];
		log.push(newCard);
		fs.writeFile('log.json', JSON.stringify(log, null, 2), function(err){
			if (err){
				return console.log(err);
			}
			console.log('Card created');

			run();
		});
	}
}

var quiz = function(){

	var holdItems = (JSON.stringify(log, null, 2));
	holdItems = JSON.parse(holdItems);
// 	fs.readFile(JSON.parse('log.json'),'utf8', function(error,data){
// 		console.log(data);
// 		var holdItems = data.split('answer');

// 		console.log(holdItems.length);
// 		i++;

		inquirer.prompt([
		{
        	name: 'answer',
        	message: holdItems[i].question,
      	}]).then(function(response) {
      		if (response.answer == holdItems[i].answer){
      			console.log('Correct!');
      			nextQuestion(holdItems.length);
      		} else {
      			console.log('Incorrect!');
      			console.log('The answer was ' + holdItems[i].answer);
      			nextQuestion(holdItems.length);
      		}
      	});

		// for (i=0; i<holdItems.length; i++){
		// 	if (i%2 === 1){
		// 		console.log('Question:');
		// 		console.log(holdItems[i]);
		// 	} else {

		// 		console.log('Answer');
		// 		console.log(holdItems[i]);
		// 		console.log('-----------------------')
		// 	}
		// }

	// });
}

var nextQuestion = function(len){
	i++;
	if (i < len){
		quiz();
	} else {
		console.log('All cards read');
		console.log('--------------');
		run();
	}
}

run();