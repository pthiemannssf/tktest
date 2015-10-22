angular.module('starter.controllers', [])

.run(function ($rootScope, $state, $stateParams) {

})
.controller('LoginCtrl',['$scope', '$state', 'UserService', '$ionicHistory', '$window', function($scope, $state, UserService, $ionicHistory, $window) {
    $scope.user = {};
    $scope.loginSubmitForm = function(form)
    {
        if(form.$valid)
        {
            UserService.login($scope.user)
            .then(function(response) {
                if (response.status === 200) {
                    console.log(response);
                    $window.localStorage["userID"] = response.data.userId;
                    $window.localStorage['token'] = response.data.id;
                    $ionicHistory.nextViewOptions({
                        historyRoot: true,
                        disableBack: true
                    });
                    $state.go('lobby');
                } else {
                    alert("Something went wrong, try again.");
                }
            }, function(response) {
                if(response.status === 401)
                {
                    alert("Incorrect username or password");
                }else if(response.data === null) {
                    alert("The connection with the server was unsuccessful, check your internet connection and try again later.");
                }else {
                    alert("Something went wrong, try again.");
                }
            }
            );
        }
    }
}])
.controller('RegisterCtrl',['$scope', '$state', 'UserService', '$ionicHistory', '$window', function($scope, $state, UserService, $ionicHistory, $window) {
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
                $state.go('landing)');
            }
            
        });
    }
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
                    alert("Something went wrong, try again.");
                }
            }, function(response) {
                if(response.data === 422) {
                    alert("That email is already taken");
                    
                } else
                if(response.data === null) {
                    alert("The connection with the server was unsuccessful, check your internet connection and try again later.");
                }else {
                    alert("Something went wrong, try again.");
                }
            }
            );
        }
    } else {
        alert("Passwords do not match")
    }
    };
}])
.controller('LobbyCtrl',['$scope', '$state', '$ionicHistory', 'UserService', '$window', 'ServerQuestionService', 'TKQuestionsService', 
function($scope, $state, $ionicHistory, UserService, $window, ServerQuestionService, TKQuestionsService) {
    $scope.logout = function() {
        UserService.logout($window.localStorage.token)
        .then(function(response) {
            if(response.status === 204)
            {
                $ionicHistory.nextViewOptions({
                    historyRoot: true,
                    disableBack: true
                })
                $state.go('landing');
                
            }else {
                alert("Could not logout at this moment, try again.");
            }
        })
    }
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
        })
    }
    function confirmPrompt()
    {
        var response = confirm("The questions could not be retrieved at this time, do you want to try again?");
        if (response == true) {
            getQuestions();
        }
    }
    $scope.takeTestButtonTapped = function()
    {
        
        if(TKQuestionsService.questionsLength() === 0){
        console.log("pressed")
        getQuestions();
    }else {
        $state.go('test.detail',{testID:1});
    }
    }
}])
.controller('TestCtrl', ['$scope', 'testInfo', '$stateParams', '$state',
function($scope, testInfo, $stateParams, $state) {
    
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
    }
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
        if(option === "A") {
            console.log("Chose A");
        }
        else if (option === "B") {
            console.log("Chose B");
        }
        var nextqNumber = Number(qNumber) +1;
        if(nextqNumber>30) {
            $state.go('results');
        }else {
            $state.go('test.detail',{testID:nextqNumber});
        }
    }
}])