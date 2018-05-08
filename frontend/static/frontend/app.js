var app = angular.module("HangmanApp", ['ui.router']);

app.config(function($stateProvider, $httpProvider) {
    var homeState = {
      name: 'home',
      url: '/home',
      templateUrl: '/static/frontend/templates/home.html'
    }
  
    var gameState = {
      name: 'game',
      url: '/game',
      templateUrl: '/static/frontend/templates/game.html'
    }

    var contactState = {
        name: 'contact',
        url: '/contact',
        templateUrl: '/static/frontend/templates/contact-list.html'
    }

    var contactDetailState = {
        name: 'contactDetail',
        url: '/contact/:id',
        templateUrl: '/static/frontend/templates/contact-detail.html'
    }
  
    $stateProvider.state(homeState);
    $stateProvider.state(gameState);
    $stateProvider.state(contactState);
    $stateProvider.state(contactDetailState);

    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

  });

  app.factory("ContactFactory", ['$http', function($http) {

    const baseUrl = 'http://127.0.0.1:8000';
    var contacts = {};

    contacts.getContact = getContact;
    contacts.getAllContacts = getAllContacts;
    contacts.createContact = createContact;

    return contacts;

    function getContact(id) {
        console.log("getContact function is called.");
        return $http.get(baseUrl + '/api/v1/contact/' + id);
    }

    function getAllContacts() {
        console.log("get all contact function is called.");
        return $http.get(baseUrl + '/api/v1/contact/');
    }

    function createContact(contactData) {

        return $http.post(baseUrl + '/api/v1/contact/', contactData);
    }
  }]);

  app.controller("ContactController", ['$scope', '$state', 'ContactFactory', function($scope, $state, ContactFactory) {

    $scope.contact = {
        
        id : '',
        name : '',
        number : ''
    }

    $scope.propertyName = 'name';
    $scope.reverse = true;

    $scope.sortBy = function(propertyName) {
        
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };
    

    $scope.postContact = function() {

        var contactData = angular.toJson($scope.contact, true);
        //console.log(contactData);
        //console.log($scope.contact.name);
        //console.log($scope.contact.number);

        ContactFactory.createContact(contactData)
            .then(function(response) {
                $scope.contact = response.data;
                //console.log($scope.contact.id);
                $state.go('contactDetail', {id : $scope.contact.id});
            });

    }

    ContactFactory.getAllContacts()
        .then(function(response) {
            $scope.contacts = response.data;
        });
}]);

app.controller("ContactDetailController", ['$scope', '$stateParams', 'ContactFactory', function($scope, $stateParams, ContactFactory) {
    console.log("Detail is calling");
    
    ContactFactory.getContact($stateParams.id)
        .then(function(response) {
            //console.log(response);
            $scope.contact = response.data;
        });
}]);
  

app.controller("GameController", ['$scope', function($scope) {
    
    var words = ["cat", "bat", "rat", "tiger", "Lion"];
    $scope.incorrectLettersChosen = [];
    $scope.correctLettersChosen = [];
    $scope.guesses = 6;
    $scope.displayWord = '';
    $scope.input = {
       
        letter : ''
    }

    var selectRandomWord = function() {

        var index = Math.floor(Math.random()*words.length);
        console.log(index);
        return words[index];
    }

    var newGame = function() {
        
        $scope.incorrectLettersChosen = [];
        $scope.correctLettersChosen = [];
        $scope.guesses = 5;
        $scope.displayWord = '';

        selectedWord = selectRandomWord();
        var tempDisplayWord = '';
        console.log(selectedWord);

        for(var i = 0; i < selectedWord.length; i++) {

            tempDisplayWord += '*';
        }
        
        $scope.displayWord = tempDisplayWord;

    }

    $scope.letterChosen = function() {

        console.log("letterChosen function is called");
        for(var i = 0; i < $scope.correctLettersChosen.length; i++) {

            if($scope.correctLettersChosen[i].toLowerCase() == $scope.input.letter.toLowerCase()) {

                $scope.input.letter = "";
                console.log("matched one character");
                return;
            }
        }

        for(var i = 0; i < $scope.incorrectLettersChosen.length; i++) {

            if($scope.incorrectLettersChosen[i].toLowerCase() == $scope.input.letter.toLowerCase()) {

                $scope.input.letter = "";
                return;
            }
        }

        var correct = false;

        for(var i = 0; i < selectedWord.length; i++) {

            if(selectedWord[i].toLowerCase() == $scope.input.letter.toLowerCase()) {

                correct = true;
            }
        }

        if(correct) {
            
            $scope.correctLettersChosen.push($scope.input.letter.toLowerCase());
        }
        else {

            $scope.incorrectLettersChosen.push($scope.input.letter.toLowerCase());
            $scope.guesses--;
        }

        $scope.input.letter = "";

        if($scope.guessess == 0) {

            alert("you lost");
            console.log("you lost.");
            newGame();
        }

    }

    newGame();

}]);
