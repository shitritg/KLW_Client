angular.module('Visualization')
 .controller('statesController', ['$scope', '$rootScope', '$location', '$http', 'service','localStorageModel','$timeout', function ($scope, $rootScope, $location, $http, service,localStorageModel,$timeout) {

    let self = this;
    let serverUrl = service.serverUrl;
    self.loaded = false;
    self.states = [];

    self.getStates = function ()
     {
        if ($rootScope.states.length == 0)
        {
            service.getStates();
            self.loaded = true;
        }
        else
        {
            $timeout(function () {
            self.states = $rootScope.states;
            self.loaded = true;
            self.load();
            });
        }
    
    }

    // self.load = function() {
    //     $timeout(function () {
    //         let t = $('#statesTbl').DataTable({
    //         "dom": "fltip",
    //     //    "scrollY": "55%",
    //        "scrollCollapse": true,
    //        "scrollX": true,
    //        "autoWidth": true,
    //        retrieve: true,
    //        paging: false,
    //        "fnInitComplete":function(){
    //            let tbl = document.getElementById("statesTbl");
    //            tbl.style.display = "block";
    //            //$("#statesTbl").show();
    //        }
    //        });
    //        $('.dataTables_length').addClass('bs-select'); 
    //        //t.fnAdjustColumnSizing();
    //        self.loaded = true;
    //     }, 0); 
           
    // }

    self.load = function(){
        $timeout(function () {
        var stdTable1 = $("#statesTbl").dataTable({
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
                let tbl = document.getElementById("statesTbl");
                tbl.style.display = "block";
                // let tblDiv = document.getElementById("statesDataTableDiv");
                // tblDiv.style.display = "block";
         }
        });
        //new $.fn.dataTable.FixedHeader( stdTable1 );
        let tblDiv = document.getElementById("statesTbl");
        tblDiv.style.display = "block";
    }, 0); 
}

}]);