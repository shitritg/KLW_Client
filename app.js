let app = angular.module('Visualization', ["ngRoute", 'LocalStorageModule']);

app.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider)  {


    $locationProvider.hashPrefix('');


    $routeProvider.when('/', {
        //template: '<h1>This is the default route</h1>'
        templateUrl: 'components/Home/home.html',
        controller : 'homeController as homeCtrl'
    })
        .when('/tirps', {
            templateUrl: 'components/TIRPs/tirps.html',
            controller : 'tirpsController as tirpCtrl'
        })
        .when('/upload', {
            templateUrl: 'components/UploadDataSet/uploadDataSet.html',
            controller : 'uploadDataSetController as uploadCtrl'
        })
        .when('/search', {
            templateUrl: 'components/SearchTool/searchTool.html',
            controller : 'searchToolController as srchCtrl'
        })
        .when('/searchTbl', {
            templateUrl: 'components/SearchTool/searchTbl.html',
            controller : 'searchTblController as srchTblCtrl'
        })
        .when('/psearch', {
            templateUrl: 'components/SearchTool/psearchTool.html',
            controller : 'psearchToolController as psrchCtrl'
        })
        .when('/psearchTbl', {
            templateUrl: 'components/SearchTool/psearchTbl.html',
            controller : 'psearchTblController as psrchTblCtrl'
        })
        .when('/service', {
            templateUrl: 'components/Services/service.html',
            controller : 'serviceController as srvCtrl'
        })
        .when('/analysis', {
            templateUrl: 'components/Analysis/analysis.html',
            controller : 'analysisController as analCtrl'
        })
        .when('/states', {
            templateUrl: 'components/States/states.html',
            controller : 'statesController as statCtrl'
        })
        .when('/entities', {
            templateUrl: 'components/Entities/entities.html',
            controller : 'entitiesController as entCtrl'
        })
        .when('/tirpEntities', {
            templateUrl: 'components/TIRPEntities/TIRPEntities.html',
            controller : 'TIRPEntitiesController as tirpentCtrl'
        })
        .when('/predictive', {
            templateUrl: 'components/PredictiveTIRPs/predictiveTIRPs.html',
            controller : 'predictiveTIRPsController as predCtrl'
        })
        .when('/:param1', {
            templateUrl: 'components/Home/home.html',
            controller : 'homeController as homeCtrl'
        })
        .otherwise({ redirectTo: '/' })

        


//})
}]);

// app.run(function ($rootScope, $location) {
//     $location.path('/'+$rootScope.data_set_name_from_url);
//     $rootScope.$on("$routeChangeStart", function(e, next, current) {
//     $rootScope.queryString = $location.search()
// })

// $rootScope.$on("$routeChangeSuccess", function(e, next, current) {
//     $location.search($rootScope.queryString);
//   });
// });











