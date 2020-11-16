angular.module('citiesApp')
 .controller('retrievePassController', ['$scope','$location', '$http', 'setHeadersToken','localStorageModel', function ($scope,$location, $http, setHeadersToken,localStorageModel) {

self = this;

let serverUrl = setHeadersToken.serverUrl
self.questions = setHeadersToken.questions
self.retPass=""
self.newQue=""


self.ret = function () {
    if ( $scope.selectedQ1== "What is your pet's name?")
         self.newQue="pet"
    else if ( $scope.selectedQ1=== "What is your school's name?")
         self.newQue="school"    
    else if ( $scope.selectedQ1=== "What is your teacher's name?")
          self.newQue="teacher"     
    else if ( $scope.selectedQ1=== "What is your mother last name befor marriage?")
         self.newQue="mother"  


 let obj =
{
     username: $scope.username,
     que: self.newQue,
     ans: $scope.A1
}
    // register user
    $http.post(serverUrl + "users/retrivepass", obj)
        .then(function (response) {
            self.retPass = response.data;

        }, function (response) {
            self.reg.content = response.data
            //Second function handles error
            // self.reg.content = "Something went wrong";
        });
}





}]);