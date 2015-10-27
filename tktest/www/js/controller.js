angular.module('starter.controllers', [])

.run(function ($rootScope, $state, $stateParams) {

})
.controller('LoginCtrl',['$scope', '$state', 'UserService', '$ionicHistory', '$window', 'SSFAlertsService', function($scope, $state, UserService, $ionicHistory, $window, SSFAlertsService) {
    $scope.user = {};
    $scope.loginSubmitForm = function(form)
    {
        if(form.$valid)
        {
            UserService.login($scope.user)
            .then(function(response) {
                if (response.status === 200) {
                    console.log(response);
                    console.log(response.data);
                    $window.localStorage["userID"] = response.data.userId;
                    $window.localStorage['token'] = response.data.id;
                    $ionicHistory.nextViewOptions({
                        historyRoot: true,
                        disableBack: true
                    });
                    UserService.get(window.localStorage["userID"], window.localStorage['token'])
                    .then(function(response) {
                    $window.localStorage['firstName'] = response.data.firstName;
                    $window.localStorage['lastName'] = response.data.lastName;
                    });
                    $state.go('lobby');
                } else {
                    SSFAlertsService.showAlert("Error", "Something went wrong, try again.");
                }
            }, function(response) {
                if(response.status === 401)
                {
                    SSFAlertsService.showAlert("Error", "Incorrect username or password");
                }else if(response.data === null) {
                    SSFAlertsService.showAlert("Errot", "The connection with the server was unsuccessful, check your internet connection and try again later.");
                }else {
                    SSFAlertsService.showAlert("Error", "Something went wrong, try again.");
                }
            }
            );
        }
    };
}])
.controller('RegisterCtrl',['$scope', '$state', 'UserService', '$ionicHistory', '$window', 'SSFAlertsService', function($scope, $state, UserService, $ionicHistory, $window, SSFAlertsService) {
    $scope.user = {};
    $scope.repeatPassword = {};
    $scope.loginAfterRegister = function() {
        UserService.login($scope.user)
        .then(function(response) {
            if (response.status === 200) {
                $window.localStorage["userID"] = response.data.userId;
                $window.localStorage['token'] = response.data.id;
                $ionicHistory.nextViewOptions({
                    historyRoot: true,
                    disableBack: true
                    
                });
                $state.go('lobby');
            } else {
                $state.go('landing');
            }
            
        });
    };
    $scope.registerSubmitForm = function(form)
    {
        if($scope.user.password == $scope.repeatPassword.password) {
        if(form.$valid)
        {
            UserService.create($scope.user)
            .then(function(response) {
                if (response.status === 200) {
                    $scope.loginAfterRegister();
                } else {
                    SSFAlertsService.showAlert("Error", "Something went wrong, try again.");
                }
            }, function(response) {
                if(response.data === 422) {
                    SSFAlertsService.showAlert("Error", "That email is already taken");
                    
                } else
                if(response.data === null) {
                    SSFAlertsService.showAlert("error", "The connection with the server was unsuccessful, check your internet connection and try again later.");
                }else {
                    SSFAlertsService.showAlert("Error", "Something went wrong, try again.");
                }
            }
            );
        }
    } else {
        SSFAlertsService.showAlert("Error", "Passwords do not match");
    }
    };
}])
.controller('LobbyCtrl',['$scope', '$state', '$ionicHistory', 'UserService', '$window', 'ServerQuestionService', 'TKQuestionsService', 'TKAnswersService', 'SSFAlertsService',
function($scope, $state, $ionicHistory, UserService, $window, ServerQuestionService, TKQuestionsService, TKAnswersService, SSFAlertsService) {
    $scope.$on('$ionicView.enter', function() {
        console.log("reset");
        console.log(window.localStorage['firstName']);
        TKAnswersService.resetAnswers();
        UserService.get(window.localStorage["userID"], window.localStorage['token'])
         .then(function(response) {
         $window.localStorage['firstName'] = response.data.firstName;
         $window.localStorage['lastName'] = response.data.lastName;
         });
    });
    $scope.goToHistory = function() {
        $state.go('history');
    };
    $scope.logout = function() {
        UserService.logout($window.localStorage.token)
        .then(function(response) {
            if(response.status === 204)
            {
                delete $window.localStorage['token'];
                delete $window.localStorage['userID'];
                $ionicHistory.nextViewOptions({
                    historyRoot: true,
                    disableBack: true
                });
                $state.go('landing');
                
            }else {
                SSFAlertsService.showAlert("Error", "Could not logout at this moment, try again.");
            }
        });
    };
    if(TKQuestionsService.questionsLength() === 0)
        getQuestions();
    
    
    function getQuestions()
    {
        ServerQuestionService.all($window.localStorage['token'])
        .then(function(response) {
            if (response.status === 200) {
                var questions = response.data;
                TKQuestionsService.setQuestions(questions);
            } else {
                confirmPrompt();
            }
        }, function(response) {
            confirmPrompt();
        });
    }
    function confirmPrompt()
    {
        var response = SSFAlertsService.showConfirm("Error", "The questions could not be retrieved at this time, do you want to try again?");
        if (response == true) {
            getQuestions();
        } else {
            
        }
    }
    $scope.takeTestButtonTapped = function()
    {
        
        if(TKQuestionsService.questionsLength() === 0){
        getQuestions();
    }else {
        $state.go('test.detail',{testID:1});
    }
    };

}])
.controller('TestCtrl', ['$scope', 'testInfo', '$stateParams', '$state', '$window', 'TKQuestionsService', 'TKAnswersService', 'ServerAnswersService', '$ionicHistory', 'SSFAlertsService',
function($scope, testInfo, $stateParams, $state, $window, TKQuestionsService, TKAnswersService, ServerAnswersService, $ionicHistory, SSFAlertsService) {
    console.log(TKAnswersService.getAnswers());
    //var height = Math.round(width/7.7/20)*20
    $scope.height = 0;
    $scope.changeHeight = function(){
        var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        if(width <= 320){
            $scope.height = 213;
        } else if (width <= 373) {
            $scope.height = 193;
        } else if (width <= 419) {
            $scope.height = 173;
        } else if (width <= 429) {
            $scope.height = 153;
        } else if (width <= 522) {
            $scope.height = 133;
        } else if (width <= 628) {
            $scope.height = 113;
        } else if (width <= 889) {
            $scope.height = 93;
        } else {
            $scope.height = 73;
        }
        console.log($scope.height);
    };
    $scope.changeHeight();
    window.onresize = $scope.changeHeight;
    $scope.height = $scope.height+"px";
    var qNumber = $stateParams.testID;
    $scope.title = "Question #"+qNumber;
    testInfo.forEach(function(infoDict)
    {
        if(infoDict.Answer_ID === "A")
            $scope.questionA = infoDict;
        if(infoDict.Answer_ID === "B")
            $scope.questionB = infoDict;
    });
    $scope.buttonClicked = function (option) {
        var category = $scope["question"+option].Style;
        TKAnswersService.saveAnswer(qNumber, category, option);
        
        var nextqNumber = Number(qNumber) +1;
        if(nextqNumber>30) {
            performRequest();
        }else {
            $state.go('test.detail',{testID:nextqNumber});
        }
        function performRequest() 
        {
            var answersDict = angular.copy(TKAnswersService.getAnswers());
            answersDict["userID"] = $window.localStorage['userID'];
            var date = new Date();
            answersDict["createDate"] = date.toUTCString();
            console.log(answersDict);
            ServerAnswersService.create(answersDict, $window.localStorage['token'])
            .then(function(response) {
                if (response.status === 200) {
                    console.log(response.status);
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $state.go('results');
                } else {
                    confirmPrompt();
                }
            });
        }
        function confirmPrompt()
        {
            var response = SSFAlertsService.showConfirm("Error", "The answers could not be saved at this moment, do you want to try again?");
            if (response == true) {
                performRequest();
            } else {
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go('results');
            }
        }
    };
}])
.controller('ResultsCtrl', ['$scope', 'TKAnswersService', '$ionicHistory', '$state',
function($scope, TKAnswersService, $ionicHistory, $state) {
    $scope.$on('$ionicView.enter', function() {
        console.log(TKAnswersService.getAnswers());

    });
    $scope.menuButtonTapped = function()
    {
        $ionicHistory.nextViewOptions({
            historyRoot: true,
            disableBack: true
        });
        $state.go('lobby');
    };
    var answersInfo = TKAnswersService.getAnswers();
    $scope.labels = ["Competing", "Collaborating", "Compromising", "Avoiding", "Accommodating"];
    console.log(answersInfo);
    function returnPercentage (value)
    {
        return (value/12)*100;
    }
    $scope.data = [[
        returnPercentage(answersInfo["competing"]),
        returnPercentage(answersInfo["collaborating"]),
        returnPercentage(answersInfo["compromising"]),
        returnPercentage(answersInfo["avoiding"]),
        returnPercentage(answersInfo["accommodating"])]];

    $scope.options = {
        scaleIntegersOnly: false,
        animation: true,
        responsive:true,
        maintainAspectRatio: false,
        scaleOverride: true,
        scaleSteps: 4,
        scaleStepWidth: 25,
        scaleStartValue: 0,
        scaleShowGridLines: false,
        barShowStroke: false,
        barValueSpacing: 1, 
        slaceLabel: "<%=value%)"+"%",
        tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%=value.toFixed(0) %>"+"%",
    };
    console.log($scope.data);
    $scope.colours = [{
        fillColor: "rgba(17,193,243,0.6)",
        strokeColor: "rgba(15,187,25,1)",
        pointColor: "rgba(15,187,25,1)",
        pointStrokeColor: "#fff",
        pointHilightFIll: "#fff",
        pointHighlightStroke:"rgba(151,187,205,0.8)"
    }];
    $scope.myGoBack = function() {
        $ionicHistory.goBack();
    };
}])
.controller('HistoryCtrl', ['$scope', 'ServerAnswersService', '$window', '$state', 'TKAnswersService', '$ionicListDelegate', 'SSFAlertsService',
function($scope, ServerAnswersService, $window, $state, TKAnswersService, $ionicListDelegate, SSFAlertsService) {
    $scope.tests = [];
    function performRequest()
    {
        ServerAnswersService.all($window.localStorage['userID'],
        $window.localStorage['token'])
        .then(function(response) {
            if (response.status === 200) {
                $scope.tests = response.data;
                console.log(response.data);
                console.log($scope.tests);
            } else {
                confirmPrompt();
            }
        }, function(response) {
            console.log(response);
            confirmPrompt();
        });
    }

    performRequest();
    function confirmPrompt()
    {
        var response = SSFAlertsService.showConfirm("Error", "The tests could not be retrieved at the moment, do you want to try again?");
        if (response == true) {
            performRequest();
        } else {
            
        }
    }
    $scope.goToResult=function(test)
    {
        var answers={
            "competing":test.competing,
            "collaborating":test.collaborating,
            "compromising":test.compromising,
            "avoiding":test.avoiding,
            "accommodating":test.accommodating

        };
        TKAnswersService.setAnswers(answers);
        $state.go('historyDetail');
        console.log($scope.tests);
        console.log(answers);
    };
    $scope.deleteTest = function(test)
    {
        ServerAnswersService.delete(test.id, $window.localStorage['token']);
        $ionicListDelegate.closeOptionButtons();
        window.setTimeout(refresh,100);
        window.setTimeout(refresh,1000);
    };
    function refresh() {
        performRequest();
    }
}])
.controller('ProfileCtrl', ['$scope', 'UserService', 'ServerAnswersService', '$ionicListDelegate', '$state', '$window', 'SSFAlertsService',
function($scope, UserService, ServerAnswersService, $ionicListDelegate, $state, $window, SSFAlertsService) {
    $scope.$on('$ionicView.leave', function() {
        $scope.edit = false;
    });
    $scope.firstName = window.localStorage['firstName'];
    $scope.lastName = window.localStorage['lastName'];
    $scope.edit = false;
    $scope.editChange = function() {
        $scope.edit = !$scope.edit;
     };

    var tests = ServerAnswersService.all($window.localStorage['userID'], $window.localStorage['token'])
    .then(function(response) {
        return response;
    });
    tests.then(function(data) {
        console.log(data.data);
        $scope.testsTaken = data.data.length;
        var competing = data.data.map(function(item) {
            return item.competing;
        });
        var collaborating = data.data.map(function(item) {
            return item.collaborating;
        });
        var compromising = data.data.map(function(item) {
            return item.compromising;
        });
        var avoiding = data.data.map(function(item) {
            return item.avoiding;
        });
        var accommodating = data.data.map(function(item) {
            return item.accommodating;
        });
        var totalCompeting = competing.reduce(function(a, b) {
            return a + b;
        });
        var totalCollaborating = collaborating.reduce(function(a, b) {
            return a + b;
        });
        var totalCompromising = compromising.reduce(function(a, b) {
            return a + b;
        });
        var totalAvoiding = avoiding.reduce(function(a, b) {
            return a + b;
        });
        var totalAccommodating = accommodating.reduce(function(a, b) {
            return a + b;
        });
        var chartData = {};
        chartData.competing = Math.round(totalCompeting/data.data.length * 1000) / 1000;
        chartData.collaborating = Math.round(totalCollaborating/data.data.length * 1000) / 1000;
        chartData.compromising = Math.round(totalCompromising/data.data.length * 1000) / 1000;
        chartData.avoiding = Math.round(totalAvoiding/data.data.length * 1000) / 1000;
        chartData.accommodating = Math.round(totalAccommodating/data.data.length * 1000) / 1000;
        console.log(chartData);
        $scope.chartData = [[
        returnPercentage(chartData["competing"]),
        returnPercentage(chartData["collaborating"]),
        returnPercentage(chartData["compromising"]),
        returnPercentage(chartData["avoiding"]),
        returnPercentage(chartData["accommodating"])]];
    });
    function returnPercentage (value)
    {
        return (value/12)*100;
    }
    $scope.colours = [{
        fillColor: "rgba(17,193,243,0.6)",
        strokeColor: "rgba(15,187,25,1)",
        pointColor: "rgba(15,187,25,1)",
        pointStrokeColor: "#fff",
        pointHilightFIll: "#fff",
        pointHighlightStroke:"rgba(151,187,205,0.8)"
    }];
    $scope.options = {
        scaleIntegersOnly: false,
        animation: true,
        responsive:true,
        maintainAspectRatio: false,
        scaleOverride: true,
        scaleSteps: 4,
        scaleStepWidth: 25,
        scaleStartValue: 0,
        scaleShowGridLines: false,
        barShowStroke: false,
        barValueSpacing: 1.3, 
        slaceLabel: "<%=value%)"+"%",
        tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%=value.toFixed(0) %>"+"%",
    };
    $scope.labels = ["Competing", "Collaborating", "Compromising", "Avoiding", "Accommodating"];
    $scope.deleteUser = function() {
        SSFAlertsService.showConfirm("Confirm", "Do you really want to delete the account for "+window.localStorage['firstName']+" "+window.localStorage['lastName']+"?")
        .then(function(response) {
        if (response == true) {
            UserService.delete(window.localStorage['userID'], window.localStorage['token'])
            .then(function(response) {
                if (response.status === 204) {
                    $state.go('landing');
                }
            });
    } else {
        
    }
    });
    };
            
        

    
}]);