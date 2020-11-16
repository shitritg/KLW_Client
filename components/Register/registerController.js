angular.module('citiesApp')
 .controller('registerController', ['$scope','$location', '$http', 'setHeadersToken','localStorageModel', function ($scope,$location, $http, setHeadersToken,localStorageModel) {
 
    let serverUrl = setHeadersToken.serverUrl
    let self = this;
    self.cats =[]
    self.questions = setHeadersToken.questions
    self.Countries = []
    self.newQue1=""
    self.newQue2=""
   

   

    self.submit = function () {
        // register user
        if ($scope.selectedQ1== $scope.selectedQ2)
        {
            window.alert("choose different questions")
            return
        }
        if ( $scope.selectedQ1== "What is your pet's name?")
        self.newQue1="pet"
   else if ( $scope.selectedQ1=== "What is your school's name?")
        self.newQue1="school"    
   else if ( $scope.selectedQ1=== "What is your teacher's name?")
         self.newQue1="teacher"     
   else if ( $scope.selectedQ1=== "What is your mother last name befor marriage?")
        self.newQue1="mother"  

        if ( $scope.selectedQ2== "What is your pet's name?")
        self.newQue2="pet"
   else if ( $scope.selectedQ2=== "What is your school's name?")
        self.newQue2="school"    
   else if ( $scope.selectedQ2=== "What is your teacher's name?")
         self.newQue2="teacher"     
   else if ( $scope.selectedQ2=== "What is your mother last name befor marriage?")
        self.newQue2="mother"  


        let user = {
            username: $scope.username,
            password: $scope.password,
            fname: $scope.firstname,
            lname: $scope.lastname,
            country: $scope.selectedName,
            city: $scope.city,
            email: $scope.email,
            que1: self.newQue1,
            ans1: $scope.A1,
            que2: self.newQue2,
            ans2: $scope.A2,
            categories: self.cats
    
        }
           

        $http.post(serverUrl + "users/reg/", user)
            .then(function (response) {
                //self.reg.content = response.data;
                if (response.status === 200)
                {
                    window.alert($scope.username+" added successfully")
                    $location.path('/')
                } 


            }, function (response) {
         //       self.reg.content = response.data
                //Second function handles error
                // self.reg.content = "Something went wrong";
                window.alert("something went wrong")
            });
    }

    self.addCat = function (id) {
        if (self.cats.includes(id))
            self.cats.splice(self.cats.indexOf(id), 1)
        else 
            self.cats.push(id)
    }

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            self.findCountries(this);
        }
    };


    xmlhttp.open("GET", "./shared/countries.xml", true);
    xmlhttp.send();

    self.findCountries=function(xml) {
        var i;
        var xmlDoc = xml.responseXML;
        var temp = [];
        var x = xmlDoc.getElementsByTagName("Country");
        for (i = 0; i <x.length; i++) {
            var json = { "ID" :x[i].getElementsByTagName("ID")[0].childNodes[0].nodeValue.toString(),
                "Name" :x[i].getElementsByTagName("Name")[0].childNodes[0].nodeValue.toString()}
            temp.push(json);
        }
        self.Countries = temp;
    }

}]);

