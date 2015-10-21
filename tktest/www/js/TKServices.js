angular.module('TKServices', [])
.service('TKQuestionsService', function () {
    var service = this;
    var questions = [];
    service.setQuestions - function(serverQuestions)
    {
        questions = serverQuestions;
    };
    service.getQuestion - function(questionID)
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
        return questions.length
    }
})