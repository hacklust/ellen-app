var ellen = angular.module('ellen', ['ionic']);
var controllers = {};

ellen.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
            .state('home', {
        url: "/",
        templateUrl: "templates/home.html",
        controller: "HomeCtrl"
    })
            .state('ellen', {
        url: "/ellen",
        templateUrl: "templates/ellen.html",
        controller: "EllenCtrl"
    })
            .state('articles', {
        url: "/articles/:category",
        templateUrl: "templates/articles.html",
        controller: "ListCtrl"
    })
            .state('article', {
        url: "/article/:articleId",
        templateUrl: "templates/article.html",
        controller: "PostCtrl"
    })
            .state('questions', {
        url: "/questions/:category",
        templateUrl: "templates/questions.html",
        controller: "QuestionsCtrl"
    })
            .state('question', {
        url: "/question/:questionId",
        templateUrl: "templates/question.html",
        controller: "PostCtrl"
    })
            .state('categories', {
        url: "/categories/:item",
        templateUrl: "templates/categories.html",
        controller: "CategoriesCtrl"
    })
            .state('profile', {
        url: "/profile/:id",
        templateUrl: "templates/profile.html",
        controller: "ProfileCtrl"
    })
            .state('report', {
        url: "/report",
        templateUrl: "templates/report.html",
        controller: "ProfileCtrl"
    })
            .state('rights', {
        url: "/rights",
        templateUrl: "templates/rights.html",
        controller: "ProfileCtrl"
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/');

});

ellen.factory('chatbotService', function($http) {
    return {
        sendMessage: function($scope) {
            //return the promise directly.
            return $http({
                url: "http://www.nelonoel.com/app/bot.php",
                data: {
                    'action': 'query',
                    'custid': $scope.user.botid,
                    'query': $scope.user.query
                },
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).error(function(err) {
                $scope.conversation.pop();

                $scope.user.query = $scope.conversation.pop().content;

                $scope.conversation.push({
                    type: 'idle',
                    content: 'You\'re offline. Message not sent.'
                });
            }).then(function(result) {
                return result.data;
            });
        }
    };
});

ellen.factory('uiService', function() {
    return {
        initialize: function($scope) {
            var contentEl = document.getElementById('content');
            var content = new ionic.views.SideMenuContent({
                el: contentEl
            });

            var leftMenuEl = document.getElementById('menu-left');
            var leftMenu = new ionic.views.SideMenu({
                el: leftMenuEl,
                width: 270
            });

            var sm = new ionic.controllers.SideMenuController({
                content: content,
                left: leftMenu
            });

            $scope.leftButtons = [
                {
                    type: 'button-clear',
                    content: '<i class="icon ion-navicon"></i>',
                    tap: function(e) {
                        sm.toggleLeft();
                    }
                }
            ];

            sm.toggleLeft();
        }
    };
});

controllers.ProfileCtrl = function($scope, $stateParams, uiService) {
    uiService.initialize($scope);
};

controllers.CategoriesCtrl = function($scope, $stateParams, uiService) {
    uiService.initialize($scope);

    $scope.item = $stateParams.item;
};

controllers.PostCtrl = function($scope, $stateParams, uiService) {
    uiService.initialize($scope);
};

controllers.ListCtrl = function($scope, $stateParams, uiService) {
    uiService.initialize($scope);
};

controllers.QuestionsCtrl = function($scope, $stateParams, $ionicModal, uiService) {
    uiService.initialize($scope);

    $scope.rightButtons = [
        {
            type: 'button-clear',
            content: '<i class="icon ion-ios7-compose-outline"></i>',
            tap: function(e) {
                $scope.newQuestion();
            }
        }
    ];

    // Create our modal
    $ionicModal.fromTemplateUrl('new-question.html', function(modal) {
        $scope.questionModal = modal;
    }, {
        focusFirstInput: false,
        scope: $scope
    });

    $scope.newQuestion = function() {
        $scope.questionModal.show();
    };

    $scope.closeNewQuestion = function() {
        $scope.questionModal.hide();
    };
    
    $scope.postQuestion = function() {
        
    };
};

controllers.EllenCtrl = function($scope, chatbotService, uiService) {
    uiService.initialize($scope);

    $scope.user = {};

    $scope.user.query = '';
    $scope.user.botid = '';

    $scope.conversation = [{
            type: 'response',
            content: "Hi there! I\'m Ellen. You can tell me anything."
        }];

    $scope.processRequest = function() {
        if ($scope.conversation.length > 0 &&
                $scope.conversation[$scope.conversation.length - 1].type === 'idle') {
            $scope.conversation.pop();
        }

        $scope.conversation.push({
            type: 'input',
            content: $scope.user.query
        }, {
            type: 'idle',
            content: 'Ellen is typing..'
        });

        chatbotService.sendMessage($scope)
                .then(function(result) {
            if ($scope.conversation.length > 0 &&
                    $scope.conversation[$scope.conversation.length - 1].type === 'idle') {
                $scope.conversation.pop();
            }

            if (result.source === 'pandorabots') {
                if ($scope.user.botid === '') {
                    $scope.user.botid = result.custid;
                }

                $scope.conversation.push({
                    type: 'response',
                    content: result.response
                });
            }
            else if (result.source === 'wolframalpha') {
                $scope.conversation.push({
                    type: 'response',
                    image: result.image,
                    content: result.response
                });
            }

            //effin workaround
            setTimeout(function() {
                $('.conversation').scrollTop($('.conversation')[0].scrollHeight + 500);
            }, 200);
        });

        $scope.user.query = '';
        $('#query').focus();

        //effin workaround
        setTimeout(function() {
            $('.conversation').animate({scrollTop: $('.conversation')[0].scrollHeight + 500}, 200);
        }, 200);
    };
};

controllers.HomeCtrl = function($scope, uiService) {
    uiService.initialize($scope);
};

ellen.controller(controllers);