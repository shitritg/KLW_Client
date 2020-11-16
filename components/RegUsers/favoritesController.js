angular.module('citiesApp')
 .controller('favoritesController', ['$route','$rootScope', '$scope','$location', '$http', 'setHeadersToken','localStorageModel', function ($route,$rootScope, $scope,$location, $http, setHeadersToken,localStorageModel) {

let self= this;
//self.favoritesFromDB= [];
//self.favoritesFromLocal= [];
//self.mergedFav= [];
self.token="";
self.boolMap=[];// show poi details or not
//var favBool={} //saves poi.name
let pois= setHeadersToken.pois;

//rank
    self.currRank= ""
    $scope.wantedSort="taste"
    $scope.selectedRank="1"
    self.categories = ["no filter","museum","restaurant","cofee shop","center"]
    self.categoryToFilter="no filter"
    self.filterBool = false;
    self.checkSortBool = false
    self.sortArray =[]
    self.currPlace = []
    self.Nums = []

self.initFav= function(){
    setHeadersToken.initFav()
}
self.updateFields = function() {
    //self.pois=setHeadersToken.pois;
    self.boolMap= setHeadersToken.boolMap;
    //self.favBool= setHeadersToken.favBool;
}

self.initMap = function () {
    self.boolMap = new Array();
    for(var i=0; i< $rootScope.mergedFav.length; i++)
    {
        self.boolMap[$rootScope.mergedFav[i].name]=false;
    }

}
self.showFavorites= function(){
    setHeadersToken.showFavorites();

}

/*self.helpForMerge= function(arr, poi){

                if (arr[i]== poi.name)
                    return true;
            return false;
}*/





self.getPOIDet = function (name) {
    self.boolMap[name] = !self.boolMap[name];
    //if (self.boolMap[name])
    setHeadersToken.updateViews(name);

    
}

self.removeFromFav= function (poi){///////
    $rootScope.mergedFav.splice($rootScope.mergedFav.indexOf(poi), 1)
    $rootScope.favList.splice($rootScope.favList.indexOf(poi), 1)
    $rootScope.favBool[poi.name]= 'add to favoites';
    //$rootScope.favCounter= $rootScope.favCounter-1;

}


self.addToFav = function (poi) {
    setHeadersToken.addToFav(poi)
    //self.updateFields();
}

self.saveFav= function(){
    self.token = localStorageModel.getLocalStorage('token')
    let newPath = setHeadersToken.pathPlusToken("reg/poi/saveFavorites", self.token)
    //self.showFavorites();
    let favNames=[];
    for (var i=0; i< $rootScope.mergedFav.length; i++)
    {
        favNames[i]= $rootScope.mergedFav[i].name;
    }
        // register user
        let favorites = {
            favorites: favNames
        }
        $http.post(newPath, favorites)
            .then(function (response) {
                if(response.data.message === 'Failed to authenticate token.')
                {
                    setHeadersToken.logout()
                    return
                }
                if (response.status=='200')
                {
                    window.alert("list saved successfully!")
                    self.showFavorites();
                }
                    
            }, function (response) {
                window.alert("something went wrong...")
            //    self.reg.content = response.data
                //Second function handles error
                // self.reg.content = "Something went wrong";
            });

}

self.poiExistInMergedFav= function(poi)
        {
            for (var i=0; i<$rootScope.mergedFav.length; i++)
            {
                //var x= $rootScope.mergedFav[i].name
                if ($rootScope.mergedFav[i].name== poi.name)
                    return true;
            }
            return false;
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
            setHeadersToken.logout()
            return
        }
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
    if(response.data.message === 'Failed to authenticate token.')
        {
            setHeadersToken.logout()
            return
        }

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

self.filter = function () {
if(self.categoryToFilter=="no filter")
    self.filterBool = false
else    
     self.filterBool = true
}

self.filterFunc = function (poi) {
    if (self.filterBool === false) 
        return true;
    else 
        return poi.category === self.categoryToFilter;
};


self.checkSort = function()
    {
        self.checkSortBool = (!self.checkSortBool )
    }

    self.addToSortArr = function(poi, index)
    {
        self.poiExistInFavList(poi)
        self.sortArray.push([poi,self.currPlace[index]])
    }

    self.userSort = function()
    {
      for(var i =0; i<$rootScope.mergedFav.length; i++)
      {
          self.favsTwoDim.push([$rootScope.mergedFav[i],$rootScope.mergedFav.length])
      }

      for(var i=0; i<self.sortArray.length; ++i) {
        for(var j=0; j<self.favsTwoDim.length; ++j) {
            if(self.sortArray[i][0].name== self.favsTwoDim[j][0].name)
           self.favsTwoDim.splice(j--, 1);
        }
    }
    var arr = self.sortArray.concat(self.favsTwoDim);

    arr.sort(sortFunction)
    self.newPois = []
    for(var i=0; i<arr.length; i++)
    {
        self.newPois[i]= arr[i][0]
    }
    $rootScope.mergedFav = self.newPois
    $route.reload

    }

    function sortFunction(a, b) {
        if (a[1] === b[1]) {
            return 0;
        }
        else {
            return (a[1] < b[1]) ? -1 : 1;
        }
    }

self.initNums = function()
{
    self.Nums= new Array();
    self.sortArray= new Array();
    self.favsTwoDim= new Array();
    for(var i=1; i<=$rootScope.mergedFav.length; i++)
    {
        self.Nums.push(i)
    }
}

self.poiExistInFavList= function(poi)
{
    for (var i=0; i<self.sortArray.length; i++)
    {
        var x= self.sortArray[i][0].name
        if (self.sortArray[i][0].name == poi.name)
        self.sortArray.splice(self.sortArray[0].indexOf(poi), 1)
    }
}
/*
self.poiPlace = function(poi)
{
    for(var i=1; i<= $rootScope.mergedFav.length; i++)
    {
        if($rootScope.mergedFav[i].name == poi.name)
            return i
    }
}
*/


}]);