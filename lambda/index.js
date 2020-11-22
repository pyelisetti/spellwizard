/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const AWS = require('aws-sdk');
//const ddbAdapter = require('ask-sdk-dynamodb-persistence-adapter');


//1- AlphabeticalQuizRequestHandler
//2- Random

const wordList = require('./wordlist.json')
//var ddb = new Alexa.DynamoDB({apiVersion: '2012-08-10'});

//WordSpellIntent

const WordSpellIntentHandler = {
    canHandle(handlerInput) {
        console.log(`~~~~ AnswerHandler RequestType: ${Alexa.getRequestType(handlerInput.requestEnvelope)}`);
        console.log(`~~~~ AnswerHandler IntentName: ${Alexa.getRequestType(handlerInput.requestEnvelope)}`);
        console.log(`~~~~ AnswerHandler getSessionAttributes: ${handlerInput.attributesManager.getSessionAttributes()}`);
        
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes()

         const eval =  Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'WordSpellIntent';
            
            console.log(`~~~~ AnswerHandler Eval is : ${eval}`);
        
            
            return eval;

    },

    handle(handlerInput) {
         console.log(`~~~~ AnswerHandler : I am in answer handler`);
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const currentWord = sessionAttributes.currentWord

        var answer = spelledWord(handlerInput);
    
        
         console.log(`~~~~ AnswerHandler Recevied answer: ${answer} for the word ${currentWord.word}`);

        
        var speakOutput = `That is incorrect, I will let you try one more time`;
        var attemptsMap = sessionAttributes.attemptsMap;
        if(attemptsMap[currentWord.word] === undefined){
            attemptsMap[currentWord.word]= 0;
        }

        if(answer === currentWord.word){
            sessionAttributes.correct++;
            const newWordResponse = newWord(sessionAttributes)
            sessionAttributes = newWordResponse[0]
            speakOutput = `That is correct.  ${newWordResponse[1]}`;

        }else{
            attemptsMap[currentWord.word] = attemptsMap[currentWord.word] +1 ;
            sessionAttributes.incorrect++;
            if(attemptsMap[currentWord.word] >1){
                const newWordResponse = newWord(sessionAttributes)
                sessionAttributes = newWordResponse[0]
                 speakOutput = `${currentWord.word} is spelt, ${cm(currentWord.word)} , and means ${currentWord.meaning}. ${newWordResponse[1]}`;
            }else{
                speakOutput = `That is incorrect.  Try again}`;
            }
        }
        
        sessionAttributes.attemptsMap = attemptsMap;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const checkAndReplace = (value) => {
    return value === undefined ? "" : value.toLowerCase();
}


const spelledWord = (handlerInput) => {
	const letter1 = checkAndReplace(handlerInput.requestEnvelope.request.intent.slots.LETTER_ONE.value);
	const letter2 = checkAndReplace(handlerInput.requestEnvelope.request.intent.slots.LETTER_TWO.value);	
	const letter3 = checkAndReplace(handlerInput.requestEnvelope.request.intent.slots.LETTER_THREE.value);
	const letter4 = checkAndReplace(handlerInput.requestEnvelope.request.intent.slots.LETTER_FOUR.value);
	const letter5 = checkAndReplace(handlerInput.requestEnvelope.request.intent.slots.LETTER_FIVE.value);			
	const letter6 = checkAndReplace(handlerInput.requestEnvelope.request.intent.slots.LETTER_SIX.value);
	const letter7 = checkAndReplace(handlerInput.requestEnvelope.request.intent.slots.LETTER_SEVEN.value);	
	const letter8 = checkAndReplace(handlerInput.requestEnvelope.request.intent.slots.LETTER_EIGHT.value);
	const letter9 = checkAndReplace(handlerInput.requestEnvelope.request.intent.slots.LETTER_NINE.value);
	const letter10 = checkAndReplace(handlerInput.requestEnvelope.request.intent.slots.LETTER_TEN.value);			
	const letter11 = checkAndReplace(handlerInput.requestEnvelope.request.intent.slots.LETTER_ELEVEN.value);
	const letter12 = checkAndReplace(handlerInput.requestEnvelope.request.intent.slots.LETTER_TWELVE.value);
	const letter13 = checkAndReplace(handlerInput.requestEnvelope.request.intent.slots.LETTER_THIRTEEN.value);
	const letter14 = checkAndReplace(handlerInput.requestEnvelope.request.intent.slots.LETTER_FOURTEEN.value);
	const letter15 = checkAndReplace(handlerInput.requestEnvelope.request.intent.slots.LETTER_FIFTEEN.value);			
	const letter16 = checkAndReplace(handlerInput.requestEnvelope.request.intent.slots.LETTER_SIXTEEN.value);
	const letter17 = checkAndReplace(handlerInput.requestEnvelope.request.intent.slots.LETTER_SEVENTEEN.value);	
	const letter18 = checkAndReplace(handlerInput.requestEnvelope.request.intent.slots.LETTER_EIGHTEEN.value);
	const letter19 = checkAndReplace(handlerInput.requestEnvelope.request.intent.slots.LETTER_NINETEEN.value);
	const letter20 = checkAndReplace(handlerInput.requestEnvelope.request.intent.slots.LETTER_TWENTY.value);		

	const letter =  	letter1+letter2+letter3+letter4+letter5+letter6+letter7+letter8+letter9+letter10+
	letter11+letter12+letter13+letter14+letter15+letter16+letter17+letter18+letter19+letter20;
	
	console.log(`answered letter: ${letter}`)
	return letter.replace(/\./g,'');

}



const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        sessionAttributes.currentUserId =  handlerInput.requestEnvelope.session.user.userId;
        sessionAttributes.currentSessionId = handlerInput.requestEnvelope.session.sessionId;
        sessionAttributes.startTime = new Date().toISOString();

        sessionAttributes.attemptsMap =  {};
        
        console.log(`~~~~ HelloWorldIntentHandler currentUserId: ${sessionAttributes.currentUserId}`);
        console.log(`~~~~ HelloWorldIntentHandler currentSessionId: ${sessionAttributes.currentSessionId}`);
        
        const speakOutput = 'Hello Vishruth, I am Your spelling wizrd assitant. What would you like to do?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const ReadWordsRequestHandler = {
    canHandle(handlerInput) {
        console.log(`~~~~ RandomQuizRequestHandler RequestType: ${Alexa.getRequestType(handlerInput.requestEnvelope)}`);
        console.log(`~~~~ RandomQuizRequestHandler IntentName: ${Alexa.getRequestType(handlerInput.requestEnvelope)}`);

         return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ReadRequestIntent';
    },
    handle(handlerInput) {
                 console.log(`~~~~ RandomQuizRequestHandler : I am in start quiz handler`);

        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        sessionAttributes.order=1;
        setNextIndex(sessionAttributes);
        sessionAttributes.attempted = 0;
        sessionAttributes.correct = 0;
        sessionAttributes.incorrect = 0;

        console.log(`~~~~ RandomQuizRequestHandler :Initialization Complete`);

        
        const newWordResponse = newWord(sessionAttributes)
        handlerInput.attributesManager.setSessionAttributes(newWordResponse[0]);
        var currentWord = sessionAttributes.currentWord;
        const speakOutput  = `${currentWord.word} is , ${currentWord.pos} , ${currentWord.word} is spelt, ${cm(currentWord.word)} , and means ${currentWord.meaning}`;

        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const ReadNextWordRequestHandler = {
    canHandle(handlerInput) {
        console.log(`~~~~ RandomQuizRequestHandler RequestType: ${Alexa.getRequestType(handlerInput.requestEnvelope)}`);
        console.log(`~~~~ RandomQuizRequestHandler IntentName: ${Alexa.getRequestType(handlerInput.requestEnvelope)}`);

         return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ReadNextWordIntent';
    },
    handle(handlerInput) {
                 console.log(`~~~~ RandomQuizRequestHandler : I am in start quiz handler`);

        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        const newWordResponse = newWord(sessionAttributes)
        handlerInput.attributesManager.setSessionAttributes(newWordResponse[0]);
        var currentWord = sessionAttributes.currentWord;
        const speakOutput  = `${currentWord.word} is , ${currentWord.pos} , ${currentWord.word} is spelt, ${cm(currentWord.word)} , and means ${currentWord.meaning}`;

        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


const AlphabeticalQuizRequestHandler = {
    canHandle(handlerInput) {
        console.log(`~~~~ RandomQuizRequestHandler RequestType: ${Alexa.getRequestType(handlerInput.requestEnvelope)}`);
        console.log(`~~~~ RandomQuizRequestHandler IntentName: ${Alexa.getRequestType(handlerInput.requestEnvelope)}`);

         return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AlphabeticalQuizIntent';
    },
    handle(handlerInput) {
                 console.log(`~~~~ RandomQuizRequestHandler : I am in start quiz handler`);

        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        sessionAttributes.order=1;
        setNextIndex(sessionAttributes);
        sessionAttributes.attempted = 0;
        sessionAttributes.correct = 0;
        sessionAttributes.incorrect = 0;

        console.log(`~~~~ RandomQuizRequestHandler :Initialization Complete`);

        
        const newWordResponse = newWord(sessionAttributes)
        handlerInput.attributesManager.setSessionAttributes(newWordResponse[0]);
        const speakOutput = newWordResponse[1] ;

        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
 

const RandomQuizRequestHandler = {
    canHandle(handlerInput) {
        console.log(`~~~~ RandomQuizRequestHandler RequestType: ${Alexa.getRequestType(handlerInput.requestEnvelope)}`);
        console.log(`~~~~ RandomQuizRequestHandler IntentName: ${Alexa.getRequestType(handlerInput.requestEnvelope)}`);

         return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RandomQuizIntent';
    },
    handle(handlerInput) {
                 console.log(`~~~~ RandomQuizRequestHandler : I am in start quiz handler`);

        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        sessionAttributes.order=2;
        setNextIndex(sessionAttributes);
        sessionAttributes.attempted = 0;
        sessionAttributes.correct = 0;
        sessionAttributes.incorrect = 0;
        
        console.log(`~~~~ RandomQuizRequestHandler :Initialization Complete`);

        
        const newWordResponse = newWord(sessionAttributes)
        handlerInput.attributesManager.setSessionAttributes(newWordResponse[0]);
        const speakOutput = newWordResponse[1] ;
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const setNextIndex = (sessionAttributes) => {

    if (sessionAttributes.order === 1){
        if( sessionAttributes.currentWordIndex === undefined){
                sessionAttributes.currentWordIndex = 0;
        }else if(sessionAttributes.currentWordIndex >= wordList.length){
            sessionAttributes.currentWordIndex = 0;
        }else {
            sessionAttributes.currentWordIndex++;
        }
    }else if(sessionAttributes.order === 2){
           sessionAttributes.currentWordIndex = getRandomArbitrary(0, wordList.length)
    }
}

const getRandomArbitrary = (min, max) => {
    return Math.floor( Math.random() * ( 1 + max - min ) ) + min;
}

const newWord = (sessionAttributes) => {
  console.log(`~~~~  New Word Generator`);
  setNextIndex(sessionAttributes)
  const currentWord = wordList[sessionAttributes.currentWordIndex]
  sessionAttributes.attempted++;
  sessionAttributes.currentWord =  currentWord;
  
  console.log(`~~~~  giving back response`);   
  var speechPrefix = '';
  
  if(sessionAttributes.currentWordIndex === 0){
      speechPrefix = 'Here is Your First word , ';
  }else{
      speechPrefix = 'Here is Your next word , '
  }
  return [sessionAttributes, speechPrefix +currentWord.word]

}

const AnswerHandler = {
    canHandle(handlerInput) {
        console.log(`~~~~ AnswerHandler RequestType: ${Alexa.getRequestType(handlerInput.requestEnvelope)}`);
        console.log(`~~~~ AnswerHandler IntentName: ${Alexa.getRequestType(handlerInput.requestEnvelope)}`);
        console.log(`~~~~ AnswerHandler getSessionAttributes: ${handlerInput.attributesManager.getSessionAttributes()}`);
        
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes()

         const eval =  Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AnswerIntent';
            
            console.log(`~~~~ AnswerHandler Eval is : ${eval}`);
        
            
            return eval;

    },
    handle(handlerInput) {
         console.log(`~~~~ AnswerHandler : I am in answer handler`);
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const currentWord = sessionAttributes.currentWord

        var answer = "Do not know what you mean";
       
        if (handlerInput.requestEnvelope.request.intent.slots.answer !== undefined) {
             answer = handlerInput.requestEnvelope.request.intent.slots.answer.value;
             answer = answer.toLowerCase();
        }
        
         console.log(`~~~~ AnswerHandler Recevied answer: ${answer} for the word ${currentWord}`);

        
        var speakOutput = `That is incorrect, I will let you try one more time`;
        var attemptsMap = sessionAttributes.attemptsMap;
        if(attemptsMap[currentWord.word] === undefined){
            attemptsMap[currentWord.word]= 0;
        }

        if(answer === currentWord.word){
            sessionAttributes.correct++;
            const newWordResponse = newWord(sessionAttributes)
            sessionAttributes = newWordResponse[0]
            speakOutput = `That is correct.  ${newWordResponse[1]}`;

        }else{
            attemptsMap[currentWord.word] = attemptsMap[currentWord.word] +1 ;
            sessionAttributes.incorrect++;
            if(attemptsMap[currentWord.word] >1){
                const newWordResponse = newWord(sessionAttributes)
                sessionAttributes = newWordResponse[0]
                 speakOutput = `${currentWord.word} is spelt, ${cm(currentWord.word)} , and means ${currentWord.meaning}. ${newWordResponse[1]}`;
            }else{
                speakOutput = `That is incorrect.  Try again}`;
            }
        }
        
        sessionAttributes.attemptsMap = attemptsMap;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const cm = (word) => {
    var newWord = ''
    for (var i = 0; i < word.length; i++) {
  		newWord = newWord+word.charAt(i)+',';
	}
	return newWord;
}



const MeaningIntentHandler = {
    canHandle(handlerInput) {
        console.log(`~~~~ AnswerHandler RequestType: ${Alexa.getRequestType(handlerInput.requestEnvelope)}`);
        console.log(`~~~~ AnswerHandler IntentName: ${Alexa.getRequestType(handlerInput.requestEnvelope)}`);

         return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MeaningIntent';
    },
    handle(handlerInput) {
         console.log(`~~~~ AnswerHandler : I am in MeaningIntentHandler`);
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const currentWord = sessionAttributes.currentWord

        var speakOutput = `${currentWord.word} means, ${currentWord.meaning}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const RepeatWordIntentHandler = {
    canHandle(handlerInput) {
        console.log(`~~~~ AnswerHandler RequestType: ${Alexa.getRequestType(handlerInput.requestEnvelope)}`);
        console.log(`~~~~ AnswerHandler IntentName: ${Alexa.getRequestType(handlerInput.requestEnvelope)}`);

         return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RepeatWordIntent';
    },
    handle(handlerInput) {
         console.log(`~~~~ AnswerHandler : I am in RepeatWordIntentHandler`);
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const currentWord = sessionAttributes.currentWord

        var speakOutput = ` The word is,  ${currentWord.word}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const PartofSpeechIntentHandler = {
    canHandle(handlerInput) {
        console.log(`~~~~ AnswerHandler RequestType: ${Alexa.getRequestType(handlerInput.requestEnvelope)}`);
        console.log(`~~~~ AnswerHandler IntentName: ${Alexa.getRequestType(handlerInput.requestEnvelope)}`);

         return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PartofSpeechIntent';
    },
    handle(handlerInput) {
         console.log(`~~~~ AnswerHandler : I am in PartofSpeechIntentHandler`);
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const currentWord = sessionAttributes.currentWord

        var speakOutput = ` The part of speech is,  ${currentWord.pos}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        
        const speakOutput = 'Hello, I am Your spelling wizrd assitant. How could I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        
                const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const currentWord = wordList[0].word

        var answer = "Do not know what you mean";
       
        if (!handlerInput.requestEnvelope.request.intent.slots.answer === undefined) {
             answer = handlerInput.requestEnvelope.request.intent.slots.answer.value;
        }
        
        const speakOutput = 'Your current word is '+ currentWord+' and your answer is  '+answer;

        
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered  Spell Wizards's  ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. If you were spelling a word please start with, answer is. Please try again. ';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        RandomQuizRequestHandler,
        AlphabeticalQuizRequestHandler,
        ReadNextWordRequestHandler, ReadWordsRequestHandler, WordSpellIntentHandler,
        AnswerHandler,
        MeaningIntentHandler, 
        RepeatWordIntentHandler,
        PartofSpeechIntentHandler,
        LaunchRequestHandler,
        HelloWorldIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();