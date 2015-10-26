angular.module('TKServicesModule', [])
.service('TKQuestionsService', function () {
    var service = this;
    var questions = [];
    service.setQuestions = function(serverQuestions)
    {
        questions = serverQuestions;
    };
    service.getQuestion = function(questionID)
    {
        var results = [];
        questions.forEach(function(question){
            if(question.Question_Number == questionID)
            results.push(question);
        });
        return results;
    };
    service.questionsLength = function()
    {
        return questions.length;
    }
})
.service('TKAnswersService', function() {
    var service = this;
    var answerCategories = {
        "competing": 0,
        "collaborating": 0,
        "compromising": 0,
        "avoiding": 0,
        "accommodating": 0
    };
    var answers = {};
    service.saveAnswer = function(questionNumber, answerCategory, option)
    {
        answerCategories[answerCategory.toLowerCase()]++;
        answers[questionNumber] = option;
    };
    service.getAnswers = function()
    {
        return answerCategories;
    };
    service.setAnswers = function(answers)
    {
        answerCategories = answers;
    }
    service.setTestDate = function(testDate)
    {
        testDate = testDate
    }
    service.resetAnswers = function()
    {
        for (var property in answerCategories) {
            if (answerCategories.hasOwnProperty(property)) {
                answerCategories[property] = 0;
            }
        }
    }
})