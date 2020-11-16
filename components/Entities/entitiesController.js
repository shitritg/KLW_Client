angular.module('Visualization')
 .controller('entitiesController', ['$scope', '$rootScope', '$location', '$http', 'service','localStorageModel','$rootScope','$timeout', function ($scope, $rootScope, $location, $http, service,localStorageModel,$rootScope,$timeout) {
    // 'ui.bootstrap','ui.utils',, '$modalInstance'
    let self = this;
    let serverUrl = service.serverUrl;
    self.loaded = false;
    //self.entities = [];

    self.getEntities = function ()
     {
        if ( $rootScope.entities.length == 0 ) 
         {
            service.getEntities();
         //   self.loaded = true;
         }
         
        // $('#dtVerticalScrollExample').hide();

            //$rootScope.$apply();
            // $('#dtVerticalScrollExample').DataTable({
            //     dom: "fltip",
            //     "scrollY": "200px",
            //     "scrollX": "200px",
            //     "scrollCollapse": true,
            //     });
            //     $('.dataTables_length').addClass('bs-select');
            //console.trace()
            // return;
            else
            {            
                $timeout(function () {
                self.loaded = true;
                self.load();
                });
                //self.loaded = false;
                //$timeout(function(){
                    //self.entities = $rootScope.entities;
                    //self.loaded = true;
                    
                    //document.getElementById('entitiesTbl').style.display = "block";
                    //$scope.$apply();
                    //self.load();
                    //})
            }
        }
    
        $scope.$watch('$root.entities', function() {
            if ($rootScope.entities.length == 0)
                return;
            self.load();
        });

    // $(document).ready(function () {
    //     $('#dtVerticalScrollExample').DataTable({
    //     "scrollY": "200px",
    //     "scrollCollapse": true,
    //     });
    //     $('.dataTables_length').addClass('bs-select');
    // });

    // self.load = function() {
    //     //document.getElementById('loader').style.display = "block";
    //     $timeout(function () {
    //         $('#entitiesTbl').DataTable({
    //         // "dom": "fltip",
    //     //    "scrollY": "55%",
    //        "scrollCollapse": true,
    //        "autoWidth": true,
    //        "scrollX": true,
    //        retrieve: true,
    //        paging: false,
    //        "fnInitComplete":function(){
    //         document.getElementById('loader').style.display = "none";
    //            let tbl = document.getElementById("entitiesTbl");
    //            tbl.style.display = "block";
    //            self.loaded = true;
    //        },
    //        "drawCallback": function( settings ) {
    //         $(".dataTables_scrollBody").width($(".dataTables_scrollHead").width());}
    //        });
    //        $('.dataTables_length').addClass('bs-select'); 
    //        //self.loaded = true;
           
           
    //     }, 0); 

    // self.load = function(){
    //     $timeout(function () {
    //     var stdTable1 = $("#entitiesTbl").dataTable({
    //         //"iDisplayLength": -1,
    //         "bPaginate": false,
    //         "iCookieDuration": 60,
    //         "bStateSave": false,
    //         "bAutoWidth": false,
    //         //true
    //         "bScrollAutoCss": true,
    //         "bProcessing": true,
    //         "bRetrieve": true,
    //         "bJQueryUI": true,
    //         "bInfo" : false,
    //         //"sDom": 't',
    //         "sDom": '<"H"CTrf>t<"F"lip>',
    //         /* "aLengthMenu": [[25, 50, 100, -1], [25, 50, 100, "All"]], */
    //         //"sScrollY": "500px",
    //         //"sScrollX": "100%",
    //         "sScrollXInner": "110%",
    //         "fnInitComplete": function() {
    //             this.css("visibility", "visible");
    //             document.getElementById('loader').style.display = "none";
    //             let tbl = document.getElementById("entitiesTbl");
    //             tbl.style.display = "block";
    //             let tblDiv = document.getElementById("dataTableDiv");
    //             tblDiv.style.display = "block";
    //      }
    //     });
    //     let tbl = document.getElementById("dataTableDiv");
    //     tbl.style.display = "block";
    // }, 0); 
    // }

    self.load = function(){
        $timeout(function () {
        var stdTable1 = $("#entitiesTbl").dataTable({
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
            "bInfo" : false,
            // fixedHeader: true,
            //"sDom": 't',
            "sDom": '<"H"CTrf>t<"F"lip>',
            /* "aLengthMenu": [[25, 50, 100, -1], [25, 50, 100, "All"]], */
            //"sScrollY": "500px",
            //"sScrollX": "100%",
            //"sScrollXInner": "110%",
            "fnInitComplete": function() {
                this.css("visibility", "visible");
                let tbl = document.getElementById("entitiesTbl");
                tbl.style.display = "block";
                let tblDiv = document.getElementById("dataTableDiv");
                tblDiv.style.display = "block";
         }
        });
        //new $.fn.dataTable.FixedHeader( stdTable1 );
        document.getElementById('loader').style.display = "none";
        let tblDiv = document.getElementById("dataTableDiv");
        tblDiv.style.display = "block";
    }, 0); 
}


}]);