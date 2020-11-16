

angular.module('Visualization')
    .directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
    }])
    // .directive('fixedTableHeaders', ['$timeout', function($timeout) {
    //     return {
    //       restrict: 'A',
    //       link: function(scope, element, attrs) {
    //         $timeout(function() {
    //             var container = element.parentsUntil(attrs.fixedTableHeaders);
    //             element.stickyTableHeaders({ scrollableArea: container, "fixedOffset": 2 });
    //         }, 0);
    //       }
    //     }
    //   }])
    // .service('myService', function () { this.set = function() {return "hello"} })
    .service('service',['localStorageModel', '$rootScope', '$location', '$http', function (localStorageModel, $rootScope,$location, $http) {


        let self = this;

        // let poiDet = ""
        // let token = ""
        
        // self.questions = ["What is your pet's name?","What is your school's name?","What is your teacher's name?","What is your mother last name befor marriage?"]
        self.serverUrl = 'http://127.0.0.1:5000/'
        // self.serverUrl = 'http://132.72.64.65:8000/'
        // self.userName='guest'
        // self.loginPressed = false
        // self.registerPressed = false

        self.getEntities = function (){
        if ( $rootScope.entities.length == 0 ) 
        {
            //$rootScope.currentDatasetloded = $rootScope.selcetedDataSet.data_set_name;
            let formForEntities = new FormData();
            formForEntities.append('data_set_name', $rootScope.selcetedDataSet.data_set_name)
            var url = self.serverUrl + `getEntities`;
            var request = new Request(url, {
                method: 'POST',
                mode: "cors",
                // headers: {'Content-Type': 'application/json'},
                body: formForEntities,
            });
            fetch(request)
            .then(async function (response) {
                if(!response.ok)
                {
                    throw response;
                }
                else
                {
                    let jsonString=await response.text().then(s=>s);
                    let res=JSON.parse(jsonString); 
                    //self.entities = res['Entities'];;
                    let entities = res['Entities'];
                    let jsons = [];
                    for(let i=0; i<entities.length; i++)
                    {
                        let entity = JSON.parse(entities[i]);
                        jsons.push(entity);
                    }
                    // $scope.entities = res['Entities'];
                    // $rootScope.workstations = $rootScope.entities[0].workstation; 

                    //document.getElementById('loader').style.display = "none";
                    //document.getElementById('entitiesTbl').style.display = "block";

                    $rootScope.entities = jsons;
                    $rootScope.$apply();
                    //self.load();
                    // $scope.$apply();
                    //     let t = $('#entitiesTbl').DataTable({
                    //         "dom": "fltip",
                    //     //    "scrollY": "55%",
                    //        "scrollCollapse": true,
                    //        "scrollX": true,
                    //        "autoWidth": true,
                    //        retrieve: true,
                    //        paging: true,
                    //        "fnInitComplete":function(){
                    //            let tbl = document.getElementById("entitiesTbl");
                    //            tbl.style.display = "block";
                    //            //$("#statesTbl").show();
                    //        }
                    //        });
                        
                    //console.trace()
                    // var table = document.getElementById("entitiesTbl");
                    // var table2 = document.getElementById("entities2Tbl");
                    // $('#entities1Tbl').DataTable().ajax.reload();
                    // $('#entities2Tbl').DataTable().ajax.reload();
                    // $( "#loader" ).load(window.location.href + " #loader" );
                    // $( "#entitiesTbl1" ).load(window.location.href + " #entitiesTbl1" );
                    // $( "#entitiesTbl2" ).load(window.location.href + " #entitiesTbl2" );
                    // $location.path('/entities')
                    // $("#loader").load(" #loader > *");
                    // $("#entitiesTbl1").load(" #entitiesTbl1 > *");
                    // $("#entitiesTbl2").load(" #entitiesTbl2 > *");
                    // table.refresh ();
                    // table2.refresh ();
                    // $( "#entities1Tbl" ).load();
                    // $( "#entities2Tbl" ).load();
                    // table.contentWindow.location.reload();
                    // table2.contentWindow.location.reload();
                }
            })
            .catch(async (response)=> {
                //error   
                try{
                msg= await response.json()
                } catch(e){
                    msg={errMsg:'Internal Error'};
                }
                alert("Something went wrong.\n"+ msg.errMsg+ "\nPlease Try Again") 
                // $scope.$apply(function () { $location.path('/')} );
                return;
            });    
    
        }
        }

        self.getStates = function (){
        if ($rootScope.states.length == 0)
        {
            //$rootScope.currentDatasetloded = $rootScope.selcetedDataSet.data_set_name;
            let formForStates = new FormData();
            formForStates.append('data_set_name', $rootScope.selcetedDataSet.data_set_name)
            var url = self.serverUrl + `getStates`;
            var request = new Request(url, {
                method: 'POST',
                mode: "cors",
                // headers: {'Content-Type': 'application/json'},
                body: formForStates,
            });
            fetch(request)
            .then(async function (response) {
                if(!response.ok)
                {
                    throw response;
                }
                else
                {
                    //self.loaded = true;
                    let jsonString=await response.text().then(s=>s);
                    let res=JSON.parse(jsonString); 
                    self.states = res['States'];
                    let jsons = [];
                    for(let i=0; i<self.states.length; i++)
                    {
                        let state = JSON.parse(self.states[i]);
                        jsons.push(state);
                    }
                    // $scope.entities = res['Entities'];
                    // $rootScope.workstations = $rootScope.entities[0].workstation; 

                    //document.getElementById('loader').style.display = "none";
                    //document.getElementById('entitiesTbl').style.display = "block";

                    $rootScope.states = jsons; 
                    $rootScope.$apply();
                    //self.load();
                    // $('#dtVerticalScrollExample2').DataTable({
                    //     "scrollY": "310px",
                    //     "scrollCollapse": true,
                    //     });
                    //     $('.dataTables_length').addClass('bs-select');
                }
            })
            .catch(async (response)=> {
                //error   
                try{
                msg= await response.json()
                } catch(e){
                    msg={errMsg:'Internal Error'};
                }
                alert("Something went wrong.\n"+ msg.errMsg+ "\nPlease Try Again") 
                $scope.$apply(function () { $location.path('/')} );
                return;
            });    
        }
    }


    self.getDateForSymbol = function(time)
    {
        switch($rootScope.selcetedDataSet.timestamp) {
            case 'Years':
                if(time % 1 != 0)
                {
                    let d = new Date(0)
                    let rest = (time % 1) * 12;
                    let t = Math.floor(time)
                    d.setFullYear(t);
                    d.setMonth(rest)
                    return d
                }
                let d = new Date(0)
                d.setFullYear(time);
                return d;
            case 'Months':
                if(time % 1 != 0)
                {
                    let rest = (time % 1) * 31;
                    let m = Math.floor(time)
                    return new Date(0,Math.floor(time),rest);
                }
                return new Date(0,time);
            case 'Days':
                if(time % 1 != 0)
                {
                    let rest = (time % 1) * 24;
                    return new Date(0,0,time,rest);
                }
                return new Date(0,0,time);
                break;
            case 'Hours':
                if(time % 1 != 0)
                {
                    let rest = (time % 1) * 60;
                    return new Date(0,0,0,time,rest);
                }
                return new Date(0,0,0,time);
            case 'Minutes':
                if(time % 1 != 0)
                {
                    let rest = (time % 1) * 60;
                    return new Date(0,0,0,0,Math.floor(time),rest);
                }
                return new Date(0,0,0,0,time);
            case 'Seconds':
                return new Date(0,0,0,0,0,time);
    }
}

    self.getDiffBetweenDates = function(date1, date2, to_add_timestamp)
{
    let _MS_PER_DAY = 1000 * 60 * 60 * 24 * 30 *12;
    //let utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(),date1.getDate(),date1.getHours(), date1.getMinutes(), date1.getSeconds());
    //let utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(),date2.getDate(),date2.getHours(), date2.getMinutes(), date2.getSeconds());
    let utc1 = date1.getTime()
    let utc2 = date2.getTime()
    switch ($rootScope.selcetedDataSet.timestamp) {
        case 'Years':

              
                ans =  Math.floor((utc2 - utc1) / _MS_PER_DAY);
                //ans = (date2.getYear() - date1.getYear())
                if (to_add_timestamp)
                    return ans;
                return ans + " " + $rootScope.selcetedDataSet.timestamp
        case 'Months':
            _MS_PER_DAY = 1000 * 60 * 60 * 24 * 30.5;
            // d1 = date1.getMonth();
            // d2 = date2.getMonth();
            // ans = d2 - d1;
            //     ans = ans + (date2.getYear() - date1.getYear())*12

        //   a = (utc2 - utc1)
        //   a2 = ((utc2 - utc1) / _MS_PER_DAY);
            ans =  Math.floor((utc2 - utc1) / _MS_PER_DAY);
            if (to_add_timestamp)
            return ans;
                return ans + " " + $rootScope.selcetedDataSet.timestamp;
        case 'Days':
                // d1 = date1.getDay();
                // d2 = date2.getDay();
                // ans = d2 - d1;
                //ans = ans + (date2.getMonth() - date1.getMonth())*31 + (date2.getYear() - date1.getYear())*365
                _MS_PER_DAY = 1000 * 60 * 60 * 24;

                
                ans =  Math.floor( (utc2 - utc1) /_MS_PER_DAY);
                if (to_add_timestamp)
                return ans;
                return ans + " " + $rootScope.selcetedDataSet.timestamp
        case 'Hours':
                _MS_PER_DAY = 1000 * 60 * 60 ;
                ans =  Math.floor((utc2 - utc1) / _MS_PER_DAY);
                // d1 = date1.getHours();
                // d2 = date2.getHours();
                // ans = d2 - d1;
                //ans = ans + (date2.getDay() - date1.getDay())*24 + (date2.getMonth() - date1.getMonth())*31 + (date2.getYear() - date1.getYear())*365
                if (to_add_timestamp)
                    return ans;
                return ans + " " + $rootScope.selcetedDataSet.timestamp
        case 'Minutes':
                _MS_PER_DAY = 1000 * 60;
                let a = (utc2 - utc1);
                ans =  Math.floor((utc2 - utc1) / _MS_PER_DAY);
                // d1 = date1.getMinutes();
                // d2 = date2.getMinutes();
                // ans = d2 - d1;
                //ans = ans + (date2.getHours() - date1.getHours())*60 + (date2.getDay() - date1.getDay())*24 + (date2.getMonth() - date1.getMonth())*31 + (date2.getYear() - date1.getYear())*365
                if (to_add_timestamp)
                    return ans;
                return ans + " " + $rootScope.selcetedDataSet.timestamp
        case 'Seconds':
                _MS_PER_DAY = 1000;
                ans =  Math.floor((utc2 - utc1) / _MS_PER_DAY);
                if (to_add_timestamp)
                    return ans;
                return ans + " " + $rootScope.selcetedDataSet.timestamp
                // d1 = date1.getSeconds();
                // d2 = date2.getSeconds();
                // ans = d2 - d1;
                //ans = ans + (date2.getMinutes() - date1.getMinutes())*60 + (date2.getHours() - date1.getHours())*60 + (date2.getDay() - date1.getDay())*24 + (date2.getMonth() - date1.getMonth())*31 + (date2.getYear() - date1.getYear())*365
                //return (Math.floor((date2 - date1) / (1000))).toString()+ " " + $rootScope.selcetedDataSet.timestamp
    }
}


        


    }]);
