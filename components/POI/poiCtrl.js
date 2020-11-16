angular.module('citiesApp')
 .controller('poiCtrl', ['$scope', '$rootScope', '$location', '$http', 'setHeadersToken','localStorageModel', function ($scope, $rootScope, $location, $http, setHeadersToken,localStorageModel) {
 

    let self = this;
    let pois =[];
    self.boolMap={};
    //var favBool={} //saves poi.name- buttons names
    let serverUrl = setHeadersToken.serverUrl;
    self.currRank= ""
    $scope.wantedSort="category"
    $scope.selectedRank="1"
    self.categories = ["no filter","museum","restaurant","cofee shop","center"]
    self.categoryToFilter="no filter"
    self.filterBool = false;
   

    self.initMap = function () {
        //self.boolMap = new Object();
        self.boolMap= new Array();
        for(var i=0; i< $rootScope.pois.length; i++)
        {
            self.boolMap[$rootScope.pois[i].name]=false;
        }

    }

    self.poiExistInFavList= function(poi)
        {
            for (var i=0; i<$rootScope.favList.length; i++)
            {
                var x= $rootScope.mergedFav[i].name
                if ($rootScope.mergedFav[i].name== poi.name)
                    return true;
            }
            return false;
        }

    self.initFav= function()
        {
    
            var listFromLocal = JSON.parse(localStorage.getItem("localList"));
            $rootScope.favList= listFromLocal;
            if ($rootScope.favList== null)
                $rootScope.favList= new Array()
            /*for (var i= 0; i< self.favList.length; i++)
            {
                self.favList.push(listFromLocal[i])
            }*/
    
            $rootScope.favBool= new Array()
            for (var i=0; i< $rootScope.pois.length; i++)
            {
                if (self.poiExistInFavList($rootScope.pois[i]))
                {
                    $rootScope.favBool[$rootScope.pois[i].name]= 'remove from favoites';
                }   
                else
                {
                    $rootScope.favBool[$rootScope.pois[i].name]= 'add to favoites';
    
                }
                    
            }
    
            
        }

    self.updateFields = function() {
      //  self.pois=setHeadersToken.pois;
       // self.boolMap= setHeadersToken.boolMap;
        //self.favBool= setHeadersToken.favBool;
    }

    self.getPOIs = function () {
        setHeadersToken.getPOIs()
          
        
    }   
    
    self.getPOIDet = function (name) {
        self.boolMap[name] = !self.boolMap[name];
        if (self.boolMap[name])
            setHeadersToken.updateViews(name);
    }

    self.addToFav = function (poi) {
        setHeadersToken.addToFav(poi)
        self.updateFields();
    }

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


/*
    self.selectedCity= function (id){

        console.log (self.selected )
    }

    self.addToCart = function (id, city) {

        console.log(id)
        console.log(city)
        console.log(self.amount[id])


    }

    */
    


   

 

 }]);
