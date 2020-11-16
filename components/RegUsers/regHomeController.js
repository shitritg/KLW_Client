angular.module('citiesApp')
 .controller('regHomeController', ['$scope', '$rootScope', '$location', '$http', 'setHeadersToken','localStorageModel', function ($scope , $rootScope, $location, $http, setHeadersToken,localStorageModel) {

    self = this
    self.twoPop = []
    self.lastSaved = []
    self.token = localStorageModel.getLocalStorage('token')
    self.favBool = [] //setHeadersToken.getFavBool()
    self.lastSavedlbl = "You didn't saved any pois yet"


    self.getTwoPop = function () {

        let newPath = setHeadersToken.pathPlusToken("reg/poi/twoTopPopularByCategories", self.token)
        // register user
        $http.get(newPath)
            .then(function (response) {
                if(response.data.message === 'Failed to authenticate token.')
        {
            setHeadersToken.logout()
            return
        }
                self.twoPop = response.data;
                self.initMapPop()
            }, function (response) {
            //    self.reg.content = response.data
                //Second function handles error
                // self.reg.content = "Something went wrong";
            });
    }

    self.getLastSaved = function () {
        let newPath = setHeadersToken.pathPlusToken("reg/poi/getLastSaved", self.token)
        // register user
        $http.get(newPath)
            .then(function (response) {
                if(response.data.message === 'Failed to authenticate token.')
        {
            setHeadersToken.logout()
            return
        }
                self.lastSaved = response.data;
                if(self.lastSaved.length>0)
                    self.lastSavedlbl= "Last two  pois that you saved:"
                self.initMapLast()
            }, function (response) {
            //    self.reg.content = response.data
                //Second function handles error
                // self.reg.content = "Something went wrong";
            });
    }

    self.getPOIDetForLast = function (name) {
        self.boolMapLast[name] = !self.boolMapLast[name];
        if (self.boolMapLast[name])
            setHeadersToken.updateViews(name);


}

self.getPOIDetForPop = function (name) {
    self.boolMapPop[name] = !self.boolMapPop[name];
    if (self.boolMapPop[name])
        setHeadersToken.updateViews(name);


}

self.initMapLast = function () {
    self.boolMapLast = new Object();
    for(var i=0; i< self.lastSaved.length; i++)
    {
        self.boolMapLast[self.lastSaved[i].name]=false;
    }

}
self.initMapPop = function () {
    self.boolMapPop = new Object();
    for(var i=0; i< self.twoPop.length; i++)
    {
        self.boolMapPop[self.twoPop[i].name]=false;
    }

}


self.addToFav = function (poi) {
    setHeadersToken.addToFav(poi)
    self.getLastSaved();
}

//rank
var modal = document.getElementById('myModal');

self.rank = function (name) {
    modal.style.display = "block";
    self.currRank=name
}

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
modal.style.display = "none";
self.currRank=""
$scope.selectedRank="1"
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
if (event.target == modal) {
    modal.style.display = "none";
    self.currRank=""
    $scope.selectedRank="1"
}
}
self.rankPoi = function () {

let rankObj = {
    name: self.currRank,
    rank: $scope.selectedRank
}

let token = localStorageModel.getLocalStorage('token');
let newPath = setHeadersToken.pathPlusToken( "reg/poi/rank", token)
$http.post(newPath, rankObj )
.then(function (response) {
    if(response.data.message === 'Failed to authenticate token.')
    {
        $rootScope.userName= "guest";
        localStorageModel.updateLocalStorage("token", null)
        localStorageModel.updateLocalStorage("localList", null)
        $rootScope.loginPressed = false
        $rootScope.loglbl = "login"
        $rootScope.homePath= '#/';
        $location.path('/')
    }
    else if(response.data ==='No token provided.')
    {
        $rootScope.userName= "guest";
        localStorageModel.updateLocalStorage("token", null)
        localStorageModel.updateLocalStorage("localList", null)
        $rootScope.loginPressed = false
        $rootScope.loglbl = "login"
        $rootScope.homePath= '#/';
        $location.path('/')
    }
    else
    {
        return
    }
}, function (response) {
//    self.reg.content = response.data
    //Second function handles error
    // self.reg.content = "Something went wrong";
});

if( $scope.feedback != "")
{
    let feedObj = {
        name: self.currRank,
        feedback: $scope.feedback
    }

let pathForFeed = setHeadersToken.pathPlusToken( "reg/poi/feedback", token)
    $http.post(pathForFeed, feedObj )
.then(function (response) {

}, function (response) {
//    self.reg.content = response.data
    //Second function handles error
    // self.reg.content = "Something went wrong";
});

}

self.currRank=""
document.getElementById("regBut").disabled = true;
$scope.selectedRank="1"
}



self.initFav = function(poi)
{
    setHeadersToken.initFav()
}


self.indexOf= function(poi){
    let index= -1;
    for (var i=0; i< $rootScope.pois.length; i++)
    {
        if ($rootScope.pois[i].name== poi.name)
        {
            index=i;
            return index;
        }
    } 
    return index;
    
}


}]);