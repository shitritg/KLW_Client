angular.module('Visualization')
 .controller('homeController', ['$scope', '$rootScope', '$location', '$http', 'service','$timeout','$routeParams', function ($scope, $rootScope, $location, $http, service,$timeout, $routeParams) {
 

    self = this;
    let serverUrl = service.serverUrl
    self.dataSets = [];
    self.loaded = false;
    $rootScope.location = "Files"
    


    $scope.initialToolTip = function(){
        $('.tooltip23').tooltipster({
            theme: 'tooltipster-punk',
            side: 'left',
            distance: 30,
            maxWidth: 350 
        });
    }


    self.getDatasets = function () {
        var data_set_name_from_url = $routeParams.param1;
        $rootScope.data_set_name_from_url = $routeParams.param1;
        if(data_set_name_from_url)
        {
            let body = {
                data_set_name: data_set_name_from_url,
            }
            $http.post(serverUrl + "getDataSets", body)
            .then(function (response) {
                self.dataSets = response.data['DataSets'];
                $rootScope.selcetedDataSet = self.dataSets[0];
                self.initilizeRootScope();
            
        }, function (response) {
                        
            alert("Something went wrong.\n" + "Please Try Again"); 
            $rootScope.location = 'Files';
            $scope.$apply(function () { $location.path('/')} );
            });
    
        }
        else
        {
        $http.get(serverUrl + "getDataSets", )
            .then(function (response) {
                self.dataSets = response.data['DataSets'];
                if($rootScope.uploadedDataSetName != undefined)
                {
                    for(var i=0; i<self.dataSets.length; i++)
                        {
                            if (self.dataSets[i].data_set_name == $rootScope.uploadedDataSetName)
                            {
                                $rootScope.selcetedDataSet = self.dataSets[i]
                                break;
                            }
                        }
                }
                //self.load();
                // $('#dataSetsTbl').DataTable({
                //     "scrollY": "310px",
                //     "scrollCollapse": true,
                //     });
                //     $('.dataTables_length').addClass('bs-select');

            }, function (response) {
                
            //    self.reg.content = response.data
                //Second function handles error
                // self.reg.content = "Something went wrong";
            });
        }
}

self.load = function(){
    var stdTable1 = $("#dataSetsTbl").dataTable({
        //"iDisplayLength": -1,
        "bPaginate": false,
        "iCookieDuration": 60,
        "bStateSave": false,
        "bAutoWidth": false,
        //true
        "bScrollAutoCss": true,
        "bProcessing": true,
        "bRetrieve": true,
        "bJQueryUI": true,
        //"sDom": 't',
        "sDom": '<"H"CTrf>t<"F"lip>',
        /* "aLengthMenu": [[25, 50, 100, -1], [25, 50, 100, "All"]], */
        //"sScrollY": "500px",
        //"sScrollX": "100%",
        "sScrollXInner": "110%",
        "fnInitComplete": function() {
            this.css("visibility", "visible");
            let tbl = document.getElementById("dataSetsTbl");
            tbl.style.display = "block";
     }
    });
    
  }

self.load = function() {
    $timeout(function () {
       var table = $('#dataSetsTbl').DataTable({
        // "autoWidth": true,
        // pageLength: 10,
        // lengthMenu: [[ 10, 20, -1], [ 10, 20, 50]],
        // responsive: true,
    //     "bAutoWidth": false,
    //    "scrollY": "55%",
    //    "scrollCollapse": true,
    //    "sScrollX": true,
    //    scroller: true,
       fixedHeader: true,
    //    retrieve: true,
        paging: false,
        "bInfo" : false,
       columnDefs:  [ {
        "targets": 3,
        width: '7%' }
    ],
    // "aoColumns" : [
    //     null,
    //     null,
    //     null,                    
    //     null,
    //     {"sWidth": "20px"},
    //     { "sWidth": "20px"}],
    //fixedColumns: false,
       "fnInitComplete":function(){
        let tbl = document.getElementById("dataSetsTbl");
        tbl.style.display = "block";
        //$("#dataSetsTbl").css("width","100%");
        //$('#guy').removeClass('guy');
    },    
    "drawCallback": function( settings ) {
        // $(".dataTables_scrollHeadInner").css({"width":"100%"});
        // $(".table ").css({"width":"100%"});
        // $(".dataTables_scrollBody").width($(".dataTables_scrollHead").width());
    }
       });
       
       $('.dataTables_length').addClass('bs-select');
       
       //$.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
       self.loaded = true;
    //    new $.fn.dataTable.FixedHeader( table, {
    //     "offsetTop": $('#nav-wrapper .navbar').height()});
       //$('#dataSetsTbl').resize()
        },0); 

}

// $("#dataSetsTbl").on( 'column-sizing.dt', function ( e, settings ) {
//     $(".dataTables_scrollHeadInner").css( "width", "100%" );
//     });




// // Get the modal
// var modal = document.getElementById("myModal");
// var editModal = document.getElementById("editModal");

// // Get the button that opens the modal
// var uploadbtn = document.getElementById("uploadFormbtn");

// // Get the <span> element that closes the modal
// var span = document.getElementsByClassName("close")[0];
// var span2 = document.getElementsByClassName("close")[1];

// When the user clicks the button, open the modal 
// uploadbtn.onclick = function() {
//   modal.style.display = "block";
//   $scope.dataSetName = "";
//   document.getElementsByName("dataSetName")[0].value = "";
//   $scope.className = "";
//   document.getElementsByName("className")[0].value = "";
//   $scope.secclassName = "";
//   document.getElementsByName("secclassName")[0].value = "";
//   $scope.userName = "";
//   document.getElementsByName("userName")[0].value = "";
//   $scope.Comments = ""
//   document.getElementsByName("Comments")[0].value = "";
//   $scope.file1 = undefined
//   $scope.file2 = undefined
//   $scope.file3 = undefined
//   $scope.file4 = undefined
//   $scope.file5 = undefined
// $("input[type='file']").val('');

// // }

// // When the user clicks on <span> (x), close the modal
// span.onclick = function() {
//   modal.style.display = "none";
// }

// span2.onclick = function() {
//     editModal.style.display = "none";
//   }

// // When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//   if (event.target == modal || event.target == editModal) {
//     modal.style.display = "none";
//     editModal.style.display = "none";
//   }
// }
// window.onclick = function(event) {
//     if (event.target == editModal) {
//         editModal.style.display = "none";

//     }
//   }
  


self.edit = function (dataSet, raw) {
    $rootScope.selcetedDataSet = dataSet;
    $rootScope.uploadedDataSetName = undefined;
    $rootScope.editMode = true;
    $rootScope.location = 'upload';
    self.initilizeRootScope();
    $location.path('/upload');
    //reset all models
    // $scope.file1 = undefined
    // $scope.file2 = undefined
    // $scope.file3 = undefined
    // $scope.file4 = undefined
    // $scope.file5 = undefined
    // //insert old values to te edit form
    // document.getElementById("dataSetName").value = dataSet.data_set_name;
    // $scope.dataSetName = dataSet.data_set_name;
    // document.getElementById("className").value = dataSet.class_name;
    // $scope.className = dataSet.class_name;
    // document.getElementById("userName").value = dataSet.username;
    // $scope.userName = dataSet.username;
    // document.getElementById("secclassName").value = dataSet.second_class_name;
    // $scope.secclassName = dataSet.second_class_name;
    // document.getElementById("Comments").value = dataSet.comments;
    // $scope.Comments =  dataSet.comments;
    // $("input[type='file']").val('');
    // editModal.style.display = "block";
   }
     

self.rowSelected = function(dataSet)
{
    $rootScope.selcetedDataSet = dataSet;
    $rootScope.uploadedDataSetName = undefined;
    self.initilizeRootScope();
}



$scope.is_highlight = function(dataSet) {
    if ($rootScope.selcetedDataSet == undefined)
    return false;
    else
    {
        if (dataSet.data_set_name == $rootScope.selcetedDataSet.data_set_name) {
            return true;
          }
          return false;
    }

  };

  self.initilizeRootScope = function()
  {
    $rootScope.entities = [];
    $rootScope.states = [];
    $rootScope.rootElements = [];
    $rootScope.pathOfTirps = [];
    $rootScope.ptirpsRootElements = [];
    $rootScope.ptirpsPathOfTirps = [];
    $rootScope.weights = [0.34,0.33,0.33];
    $rootScope.tblSearchConditions = undefined;
    // $rootScope.tblSearchStates = [];
    // $rootScope.tblSearchStatesDictinary = {};
    $rootScope.tblSearchFinalResults = undefined;
    $rootScope.cuurTirptblSearch = undefined;
    $rootScope.searchConditions = undefined;
    // $rootScope.searchStates = [];
    // $rootScope.searchStatesDictinary = {};
    $rootScope.searchFinalResults = undefined;
    $rootScope.cuurTirpSearch = undefined;
    $rootScope.searchChart = undefined;
    $rootScope.tblPSearchConditions = undefined;
    // $rootScope.tblPSearchStates = [];
    // $rootScope.tblPSearchStatesDictinary = {};
    $rootScope.tblPSearchFinalResults = undefined;
    $rootScope.cuurTirptblPSearch = undefined;
    $rootScope.pSearchConditions = undefined;
    // $rootScope.pSearchStates = [];
    // $rootScope.pSearchStatesDictinary = {};
    $rootScope.pSearchFinalResults = undefined;
    $rootScope.cuurTirpPSearch = undefined;
    $rootScope.PSearchChart = undefined;
  }


 }]);
