angular.module('Visualization')
 .controller('psearchTblController', ['$scope', '$rootScope', '$location', '$http', 'service','$timeout', function ($scope, $rootScope, $location, $http, service,$timeout) {
 
    let self = this;
    self.loaded = false;
    $rootScope.location = "psearchTbl";
    let serverUrl = service.serverUrl;
    


    self.getStates = function(){
        if ($rootScope.states.length == 0)
        {
            service.getStates();
        }
        else
        {
            self.setStates();
        }
        
    }

    $scope.$watch('$root.states', function() {
        if ($rootScope.states.length == 0)
            return;
        self.setStates();
    });


    self.setStates = function()
    {
        if ($rootScope.tblPSearchConditions == undefined)
        {
            $rootScope.tblPSearchConditions = []
            $rootScope.tblPSearchConditions[0] = true;
            $rootScope.tblPSearchConditions[1] = true;
            $rootScope.tblPSearchConditions[2] = true;
            $rootScope.tblPSearchConditions[3] = 1;
            $rootScope.tblPSearchConditions[4] = "";
            $rootScope.tblPSearchConditions[5] = $rootScope.selcetedDataSet.min_ver_support*100;
            $rootScope.tblPSearchConditions[6] = 100;
            $rootScope.tblPSearchConditions[7] = 1;
            $rootScope.tblPSearchConditions[8] = "";
            $rootScope.tblPSearchConditions[9] = true;
            $rootScope.tblPSearchConditions[10] = true;
            $rootScope.tblPSearchConditions[11] = $rootScope.selcetedDataSet.min_ver_support*100;
            //self.final_results = []     
        self.states = []
        $scope.states = []
        self.states_dictionary =  {};
        let states = $rootScope.states;
        for (var i = 0; i<states.length; i++)
        {
            let name = ""
            let part1 = ""
            let part2 = ""
            if(states[i].TemporalPropertyName == undefined)
            {
                part1 = states[i].TemporalPropertyID;
            }
            else
            {
                part1 = states[i].TemporalPropertyName;
            }
            if(states[i].BinLabel == undefined)
            {
                part2 = states[i].BinID;
            }
            else
            {
                part2 = states[i].BinLabel;
            }
            name = part1 + "." + part2;
            let state = 
            {
                id: states[i].StateID,
                name: name,
                isStartsChecked: true,
                isContainsChecked: true,
                isEndsChecked: true
            }
            self.states.push(state)
            self.states_dictionary[states[i].StateID] = name;
        }
        $scope.states = self.states
        $rootScope.tblPSearchStates = self.states;
        $rootScope.tblPSearchStatesDictinary =  self.states_dictionary;
    }

    //self.currTirp = undefined;
    //$scope.columns = ['size','property #1','relations','v.s','m.h.s','m.m.d'];
    //self.loaded = false;
    document.getElementById("minVS").min = $rootScope.tblPSearchConditions[5];
    document.getElementById("minVS").max = 100;
    document.getElementById("minVS").value = $rootScope.tblPSearchConditions[5];
    $scope.minVS = $rootScope.tblPSearchConditions[5];
    document.getElementById("maxVS").value = $rootScope.tblPSearchConditions[6];
    $scope.maxVS = $rootScope.tblPSearchConditions[6];
    document.getElementById("maxVS").min = $rootScope.tblPSearchConditions[5];
    document.getElementById("maxVS").max = 100;
    document.getElementById("minHS").value = $rootScope.tblPSearchConditions[3];
    $scope.minHS = $rootScope.tblPSearchConditions[3];
    document.getElementById("maxHS").value = $rootScope.tblPSearchConditions[4];
    $scope.maxHS = $rootScope.tblPSearchConditions[4];
    document.getElementById("minSize").value = $rootScope.tblPSearchConditions[7];
    $scope.minSize = $rootScope.tblPSearchConditions[7];
    document.getElementById("maxSize").value = $rootScope.tblPSearchConditions[8];
    $scope.maxSize = $rootScope.tblPSearchConditions[8];
    $scope.allStartsItemsSelected = $rootScope.tblPSearchConditions[0];
    $scope.allContainsItemsSelected = $rootScope.tblPSearchConditions[1];
    $scope.allEndsItemsSelected = $rootScope.tblPSearchConditions[2];
    $scope.mhsPval = $rootScope.tblPSearchConditions[9];
    $scope.mmdPval = $rootScope.tblPSearchConditions[10];
    $scope.states = $rootScope.tblPSearchStates;
    self.states = $rootScope.tblPSearchStates;
    self.states_dictionary = $rootScope.tblPSearchStatesDictinary;
    self.loaded = true;
    //if ($rootScope.tblPSearchFinalResults != undefined)
        //self.final_results = $rootScope.tblPSearchFinalResults;
    if ($rootScope.tblPSearchFinalResults != undefined)
    {
        
        self.final_results =$rootScope.tblPSearchFinalResults;
        if($rootScope.cuurTirptblPSearch != undefined)
        {
            self.currTirp = $rootScope.cuurTirptblPSearch;
            self.drawAvgTirp();
        }

    //     $timeout(function () {
    //     self.chart.render();
    //     $timeout(function () {
    // $scope.$apply()})}, 3000)
        //$scope.renderGraph();
        //$scope.search('initial');
    }
    // else{
    //     self.final_results = []
    // }
    }

    

    // $scope.diasbleSearch = function()
    // {
    //     if(!$scope.limitHSValue && !$scope.limitVSValue && !$scope.limitSizeValue)
    //     {
    //         for (var i = 0; i < $scope.states.length; i++) {
    //             if ( $scope.states[i].isStartsChecked || $scope.states[i].isContainsChecked || $scope.states[i].isEndsChecked)
    //             return false;
    //         }
    //         return true;
    //     }
        // else
        // {
        //     if($scope.limitHSValue)
        //     {
        //         if(!document.getElementById("minHS").value && !document.getElementById("minHS").value)
        //             return true;
        //     }
        //     if($scope.limitVSValue)
        //     {
        //         if(!document.getElementById("minHS").value && !document.getElementById("maxHS").value)
        //             return true;
        //     }
        // }
    //     return false;
    // }

    $scope.checkMinValue = function (type) {
        if (type == "VS")
        {
            var value = $scope.minVS 
            if (value < $rootScope.selcetedDataSet.min_ver_support*100)
            {
                value = $rootScope.selcetedDataSet.min_ver_support*100;
                document.getElementById("minVS").value = $rootScope.selcetedDataSet.min_ver_support*100;
                $scope.minVS = $rootScope.selcetedDataSet.min_ver_support*100;
            }
            else if (value > 100)
            {
                value = 100;
                document.getElementById("minVS").value = 100;
                $scope.minVS = 100;
            }
            $rootScope.tblPSearchConditions[5] = value;
        }
        else if(type == "HS")
        {
            var value = $scope.minHS
            if (value < 1)
            {
                value = 1;
                document.getElementById("minHS").value = 1;
                $scope.minHS = 1;
            }
            $rootScope.tblPSearchConditions[3] = value;
        }
        else
        {
            var value = $scope.minSize
            if (value < 1)
            {
                value = 1;
                document.getElementById("minSize").value = 1;
                $scope.minSize = 1;
            }
            $rootScope.tblPSearchConditions[7] = value;

        }
    }

    $scope.checkMaxValue = function (type) {
        if (type == "VS")
        {
            var value = $scope.maxVS
            if (value < $rootScope.selcetedDataSet.min_ver_support*100)
            {
                value = $rootScope.selcetedDataSet.min_ver_support*100;
                document.getElementById("maxVS").value = $rootScope.selcetedDataSet.min_ver_support*100;
                $scope.maxVS = $rootScope.selcetedDataSet.min_ver_support*100;
            }
            $rootScope.tblPSearchConditions[6] = value;
        }
        else if(type == "HS")
        {
            var value = $scope.maxHS
            
            if (value < 1 && value != "")
            {
                value = 1;
                document.getElementById("maxHS").value = 1;
                $scope.maxHS = 1;
            }
            $rootScope.tblPSearchConditions[4] = value;
        }
        else
        {
            var value = $scope.maxSize
            if (value < 1 && value != "")
            {
                value = 1;
                document.getElementById("maxSize").value = 1;
                $scope.minSize = 1;
            }
            $rootScope.tblPSearchConditions[8] = value;
        }
    }

    $scope.search = function()
    {
        self.currTirp = undefined;
        $rootScope.cuurTirptblPSearch = undefined
        startsList = []
        containList = []
        endsList = []
        let minHS = $scope.minHS
        let maxHS = $scope.maxHS
        if(maxHS == "")
            maxHS = null
        let minVS =$scope.minVS
        $rootScope.tblPSearchConditions[11] = minVS
        let maxVS = $scope.maxVS
        for (var i = 0; i < $scope.states.length; i++) {
            if (!$scope.allStartsItemsSelected )
            {
                if ( $scope.states[i].isStartsChecked)
                {
                    startsList.push( $scope.states[i].id)
                    startsInSearch = true
                }
            }
            if (!$scope.allContainsItemsSelected )
            {

                if($scope.states[i].isContainsChecked)
                {
                    containList.push( $scope.states[i].id)
                    containsInSearch = true
                }
             }
             if (!$scope.allEndsItemsSelected )
             {
                if($scope.states[i].isEndsChecked)
                {
                    endsList.push( $scope.states[i].id)
                    endsInSearch = true
                }
            }
                
        }
        if ((startsList.length == 0 && !$scope.allStartsItemsSelected) || (containList.length == 0 && !$scope.allContainsItemsSelected) ||  (endsList.length == 0 && !$scope.allEndsItemsSelected) )
        {
            self.final_results = []
            return;
        }

        let body = {
            data_set_name: $rootScope.selcetedDataSet.data_set_name,
            search_in_class_1: true,
            startsList: startsList,
            containList: containList,
            endsList: endsList,
            minHS: minHS,
            maxHS: maxHS,
            minVS: minVS,
            maxVS: maxVS
        }
        $http.post(serverUrl + "searchTirps", body)
        .then(function (response) {
            let results = response.data['Results'];
            self.final_results =[]
            //let max_delta_mmd = 0
            for (result in results)
            {
                res = results[result].split(',')
                //if(Math.abs(parseFloat(res[7])- parseFloat(res[8])) > max_delta_mmd)
                    //max_delta_mmd = Math.abs(parseFloat(res[7])- parseFloat(res[8]))
                     if($scope.maxSize != '' && $scope.maxSize != undefined)
                     {
                        if (res[4] >= $scope.minSize && res[4] <= $scope.maxSize)
                        self.final_results.push(res)
                     }
                     else
                     {
                        if (res[4] >= $scope.minSize)
                        self.final_results.push(res)
                     }
            }
            //let tblDiv = document.getElementById("resultsDiv");
            //tblDiv.style.display = "block";
            $rootScope.tblPSearchFinalResults = self.final_results;
            self.loadResults();

        
    }, function (response) {
                    
        alert("Something went wrong.\n" + "Please Try Again"); 
        $rootScope.location = 'Files';
        $scope.$apply(function () { $location.path('/')} );
        });

    }


    $scope.findTirp = function()
    {
        self.loaded = true;
        document.getElementById('loader').style.display = "block";
        let body = {
            data_set_name: $rootScope.selcetedDataSet.data_set_name,
            symbols: self.currTirp[0].replace("(",""),
            relations: self.currTirp[1]
        }
        $http.post(serverUrl + "find_Path_of_tirps", body)
        .then(function (response) {
            let results = response.data['Path'];
            let path = []
            for(let i=0; i<results.length; i++)
            {

                let tirp = JSON.parse(results[i]);
                path.push(tirp);
            }
            $rootScope.PassedFromPSearch = true;
            $rootScope.ptirpsPathOfTirps = path;
            $location.path('/predictive')
            $rootScope.location = 'predictive TIRPs';
        
    }, function (response) {
                    
        alert("Something went wrong.\n" + "Please Try Again"); 
        $rootScope.location = 'Files';
        $scope.$apply(function () { $location.path('/')} );
        });
    }

   

    document.getElementById("maxVS").oninput = function () {
        var max = parseInt(this.max);

        if (parseInt(this.value) > max) {
            this.value = max; 
        }
    }


    $scope.selectAllStarts = function () {
        $rootScope.tblPSearchConditions[0] = $scope.allStartsItemsSelected;
        // Loop through all the entities and set their isChecked property
        for (var i = 0; i < $scope.states.length; i++) {
            $scope.states[i].isStartsChecked = $scope.allStartsItemsSelected;
        }
    };

    $scope.StartsSelect = function () {
        $rootScope.tblPSearchStates = $scope.states;
        // If any entity is not checked, then uncheck the "allItemsSelected" checkbox
        for (var i = 0; i < $scope.states.length; i++) {
            if (!$scope.states[i].isStartsChecked) {
                $scope.allStartsItemsSelected = false;
                $rootScope.tblPSearchConditions[0] = false;
                return;
            }
        }
        //If not the check the "allItemsSelected" checkbox
        $scope.allStartsItemsSelected = true;
        $rootScope.tblPSearchConditions[0] = true;
    };
      

    $scope.ContainsSelect = function () {
        $rootScope.tblPSearchStates = $scope.states;
        // If any entity is not checked, then uncheck the "allItemsSelected" checkbox
        for (var i = 0; i < $scope.states.length; i++) {
            if (!$scope.states[i].isContainsChecked) {
                $scope.allContainsItemsSelected = false;
                $rootScope.tblPSearchConditions[1] = false;
                return;
            }
        }
        //If not the check the "allItemsSelected" checkbox
        $scope.allContainsItemsSelected = true;
        $rootScope.tblPSearchConditions[1] = true;
    };

    $scope.selectAllContains = function () {
        $rootScope.tblPSearchConditions[1] = $scope.allContainsItemsSelected;
        // Loop through all the entities and set their isChecked property
        for (var i = 0; i < $scope.states.length; i++) {
            $scope.states[i].isContainsChecked = $scope.allContainsItemsSelected;
        }
    };

    $scope.EndsSelect = function () {
        $rootScope.tblPSearchStates = $scope.states;
        // If any entity is not checked, then uncheck the "allItemsSelected" checkbox
        for (var i = 0; i < $scope.states.length; i++) {
            if (!$scope.states[i].isEndsChecked) {
                $scope.allEndsItemsSelected = false;
                $rootScope.tblPSearchConditions[2] = false;
                return;
            }
        }

        //If not the check the "allItemsSelected" checkbox
        $scope.allEndsItemsSelected = true;
        $rootScope.tblPSearchConditions[2] = true;
    };

    $scope.selectAllEnds = function () {
        $rootScope.tblPSearchConditions[2] = $scope.allEndsItemsSelected;
        // Loop through all the entities and set their isChecked property
        for (var i = 0; i < $scope.states.length; i++) {
            $scope.states[i].isEndsChecked = $scope.allEndsItemsSelected;
        }
    };

    $scope.limitHS = function()
    {
        if($scope.limitHSValue)
        {
            document.getElementById("minHS").disabled = false;
            document.getElementById("maxHS").disabled = false;
        }
        else
        {
            document.getElementById("minHS").disabled = true;
            document.getElementById("maxHS").disabled = true;
        }
    }

    $scope.limitVS = function()
    {
        if($scope.limitVSValue)
        {
            document.getElementById("minVS").disabled = false;
            document.getElementById("maxVS").disabled = false;
        }
        else
        {
            document.getElementById("minVS").disabled = true;
            document.getElementById("maxVS").disabled = true;
        }
    }

    $scope.limitSize = function()
    {
        if($scope.limitSizeValue)
        {
            document.getElementById("minSize").disabled = false;
            document.getElementById("maxSize").disabled = false;
        }
        else
        {
            document.getElementById("minSize").disabled = true;
            document.getElementById("maxSize").disabled = true;
        }
    }



self.drawAvgTirp = function (e) {
    $timeout(function () {
    // let self.currTirp;
    // if ( e != undefined)
    //     self.currTirp = e.dataself.currTirp;
    // else
    // {
    //     self.currTirp = $rootScope.cuurTirptblPSearch
    // }
        
    // if (self.currTirp != undefined)
    // {
    //     let symbols = $rootScope.cuurTirptblPSearch.symbols
    //     let rels = $rootScope.cuurTirptblPSearch.relations
    //     let data = self.chart.data[0].dataself.currTirps
    //     for(var i=0; i<data.length; i++)
    //     {
    //         if (data[i].symbols == symbols && data[i].relations == rels)
    //         {
    //             if (e != undefined)
    //                 data[i].markerColor = self.currTirp.oldColor
    //             else
    //                 self.currTirp = data[i]
    //             break;
    //         }
    //     }
    //     //self.currTirp.markerColor = self.currTirp.oldColor
    // }
    // self.currTirp = self.currTirp
    // $rootScope.cuurTirptblPSearch = self.currTirp;
    // if( self.currTirp.markerColor != 'red')
    //     self.currTirp.oldColor = self.currTirp.markerColor
    // else
    //     self.currTirp.oldColor = self.currTirp.oldColor;
    // self.currTirp.markerColor = 'red'
    // self.chart.render();
    //self.showResults();
    let vs = $scope.getVS0(self.currTirp)
    let vs_class_1 = $scope.getVS1(self.currTirp)

    document.getElementById("currTirpDetails").innerHTML = "V.S- " + vs + "/" + vs_class_1 + "% , M.M.Duration- " + self.currTirp[7] + "/" + self.currTirp[8] + " , M.H.S- " + self.currTirp[3] + "/" + self.currTirp[6]

    $scope.$apply();
    let times = self.currTirp[11].replace("[","").replace("]","").split('|');
    let timesClass1 = self.currTirp[12].replace("[","").replace("]","").split('|');
    let durationOfFirstInterval = parseFloat(self.currTirp[9])
    let durationOfFirstIntervalClass1 = parseFloat(self.currTirp[10])
    let symbols = self.currTirp[0].replace("(","").split('-');
    let tirpSize = self.currTirp[4];
    let exist_in_class_1 = (self.currTirp[15] == 'True');
    let exist_in_class_0 = (self.currTirp[16] == 'True');
    //symbols = symbols
    google.charts.load('current', { 'packages': ['timeline'] });
    google.charts.setOnLoadCallback(drawTimeLine);
    function drawTimeLine() {
         // to expand the height of the timeLine
        var container = document.getElementById('timeline');
        var chart = new google.visualization.Timeline(container);
        var dataTable = new google.visualization.DataTable();

        dataTable.addColumn({ type: 'string', id: 'Lable' });
        dataTable.addColumn({ type: 'string', id: 'Duration' });
        dataTable.addColumn({ type: 'date', id: 'Start' });
        dataTable.addColumn({ type: 'date', id: 'End' });


        let data = [];
        interval = new Array();
        // insert m.duration of first interval
        interval.push(self.states_dictionary[symbols[0]]);
        let date1 = service.getDateForSymbol(0);
        let date2 = service.getDateForSymbol(durationOfFirstInterval);
        let duration = service.getDiffBetweenDates(date1,date2,true)
        if (!exist_in_class_0)
        {
            duration = "0 " +  " / " + duration + " " + $rootScope.selcetedDataSet.timestamp
        }
        else if (exist_in_class_1)
        {
            let date1Class1 = date1;
            let date2Class1 = service.getDateForSymbol(durationOfFirstIntervalClass1);
            duration += " / " + service.getDiffBetweenDates(date1Class1,date2Class1)
        }
        else
        {
            duration += " / 0 " + $rootScope.selcetedDataSet.timestamp
        }
        interval.push(self.states_dictionary[symbols[0]] + " - " + duration);
        interval.push(date1);
        interval.push(date2);
        data.push(interval);
        var j = 2;
        var offset = durationOfFirstInterval;
        var offsetClass1 = durationOfFirstIntervalClass1;
        for(var i=1; i<tirpSize; i++)
        {
            interval = new Array();
            interval.push(self.states_dictionary[symbols[i]])
            date1 = service.getDateForSymbol(offset + parseFloat(times[j]));
            date2 = service.getDateForSymbol(offset + parseFloat(times[j + 1]));
            duration = service.getDiffBetweenDates(date1,date2, true);
            if (!exist_in_class_0)
            {
                duration = "0 " +  " / " + duration + " " + $rootScope.selcetedDataSet.timestamp
            }
            else if (exist_in_class_1)
            {
                date1Class1 = service.getDateForSymbol(offsetClass1 + parseFloat(timesClass1[j]));
                date2Class1 = service.getDateForSymbol(offsetClass1 + parseFloat(timesClass1[j + 1]));
                duration += " / " + service.getDiffBetweenDates(date1Class1,date2Class1)
            }
            else
            {
                duration += " / 0 " + $rootScope.selcetedDataSet.timestamp
            }
            interval.push(self.states_dictionary[symbols[i]] + " - " + duration);
            interval.push(date1);
            interval.push(date2);
            data.push(interval);
            j += 2;
        }
        dataTable.addRows(data);
        dataTable.insertColumn(2, {type: 'string', role: 'tooltip', p: {html: true}});
        for (var i = 0; i < dataTable.getNumberOfRows(); i++) {
            let label = dataTable.getValue(i, 1);
            let durationClass1 = label.substring(label.lastIndexOf('-') + 1, label.lastIndexOf('/'));
            let durationClass0 = label.substring(label.lastIndexOf('/') + 1);
            let class0Name = 'Class 1 ';
            if ($rootScope.selcetedDataSet.class_name != '')
                class0Name +='(' + $rootScope.selcetedDataSet.class_name + ') '
            let class1Name = 'Class 0 ';
            if ($rootScope.selcetedDataSet.second_class_name != '')
                class1Name +='(' + $rootScope.selcetedDataSet.second_class_name + ') '
            var tooltip = '<div class="ggl-tooltip"><span>' +
              dataTable.getValue(i, 0) + '</span></div><div class="ggl-tooltip"><span>' +
              class0Name + 'M.M.D: </span>' + durationClass1 + " " + $rootScope.selcetedDataSet.timestamp + '</div><div class="ggl-tooltip"><span>' +
              class1Name +  'M.M.D: </span>' + durationClass0 + '</span></div>'
      
            dataTable.setValue(i, 2, tooltip);
          }
        
        // to remove the time axis
        google.visualization.events.addListener(chart, 'ready', function () {
            var labels = container.getElementsByTagName('text');
            Array.prototype.forEach.call(labels, function (label) {
                if (label.getAttribute('text-anchor') === 'middle' || label.getAttribute('font-weight') === 'bold' || label.getAttribute('fill') === '#000000') {
                    label.setAttribute('font-size', '0');
                }
            });
        });
        dataTable.setProperty(0, 0, 'style', 'width:500px');
        // dataTable.setProperty(0, 1, 'style', 'width:500px');
        chart.draw(dataTable, {
            // width: '100%', height: '100%',
            timeline: { colorByRowLabel: true,
                 showRowLabels: false,
                barLabelStyle: {
                    fontSize: 10
                } },
            title: $rootScope.selcetedDataSet.class_name,
            tooltip: {
                isHtml: true
              },
        //     'titleTextStyle': {
        //       fontSize: 18,
        //       bold:true,
        //       italic:false
        //   },
            hAxis: {
                minValue: new Date(1900, 1, 1)
                //maxValue: new Date()
            }
        });
        //   dataTable.addRows([
        //     [ 'Washington', new Date(1789, 3, 30), new Date(1797, 2, 4) ],
        //     [ 'Adams',      new Date(1797, 2, 4),  new Date(1801, 2, 4) ],
        //               [ 'Washington', new Date(1801, 3, 30), new Date(1809, 2, 4) ],
        //     [ 'Jefferson',  new Date(1801, 2, 4),  new Date(1809, 2, 4) ]]);
    }
})
}

    self.loadStarts = function(){
        $timeout(function () {
        var stdTable1 = $("#starts").dataTable({
            //"iDisplayLength": -1,
            "bPaginate": false,
            "iCookieDuration": 60,
            "bStateSave": false,
            "bAutoWidth": false,
            "aaSorting": [[ 1, "asc" ]],
            //true
            "bScrollAutoCss": true,
            "bProcessing": true,
            "bRetrieve": true,
            "bJQueryUI": true,
            "bInfo" : false,
            "bFilter": false,
            // fixedHeader: true,
            //"sDom": 't',
            "sDom": '<"H"CTrf>t<"F"lip>',
            "aoColumns": [
                {
                    "sWidth": "20%",
                "mData": 0
              }, {
                "sWidth": "80%",
                "mData": 1
              }],
            /* "aLengthMenu": [[25, 50, 100, -1], [25, 50, 100, "All"]], */
            //"sScrollY": "500px",
            //"sScrollX": "100%",
            //"sScrollXInner": "110%",
            "fnInitComplete": function() {
                this.css("visibility", "visible");
                let tbl = document.getElementById("startsDiv");
                tbl.style.display = "block";
                // let tblDiv = document.getElementById("statesDataTableDiv");
                // tblDiv.style.display = "block";
         }
        });
        //new $.fn.dataTable.FixedHeader( stdTable1 );
        let tblDiv = document.getElementById("startsDiv");
        tblDiv.style.display = "block";
        //$scope.selectAllStarts()
    }, 0); 
}

self.loadContains = function(){
    $timeout(function () {
    var stdTable1 = $("#contains").dataTable({
        //"iDisplayLength": -1,
        "bPaginate": false,
        "iCookieDuration": 60,
        "bStateSave": false,
        "bAutoWidth": false,
        "aaSorting": [[ 1, "asc" ]],
        //true
        "bScrollAutoCss": true,
        "bProcessing": true,
        "bFilter": false,
        "bRetrieve": true,
        "bJQueryUI": true,
        "bInfo" : false,
        // fixedHeader: true,
        //"sDom": 't',
        "sDom": '<"H"CTrf>t<"F"lip>',
        "aoColumns": [
            {
                "sWidth": "20%",
            "mData": 0
          }, {
            "sWidth": "80%",
            "mData": 1
          }],
        /* "aLengthMenu": [[25, 50, 100, -1], [25, 50, 100, "All"]], */
        //"sScrollY": "500px",
        //"sScrollX": "100%",
        //"sScrollXInner": "110%",
        "fnInitComplete": function() {
            this.css("visibility", "visible");
            let tbl = document.getElementById("containsDiv");
            tbl.style.display = "block";
            // let tblDiv = document.getElementById("statesDataTableDiv");
            // tblDiv.style.display = "block";
     }
    });
    //new $.fn.dataTable.FixedHeader( stdTable1 );
    let tblDiv = document.getElementById("containsDiv");
    tblDiv.style.display = "block";
}, 0); 
}



self.loadEnds = function(){
    $timeout(function () {
    var stdTable1 = $("#ends").dataTable({
        //"iDisplayLength": -1,
        "bPaginate": false,
        "iCookieDuration": 60,
        "bStateSave": false,
        "bAutoWidth": false,
        "aaSorting": [[ 1, "asc" ]],
        //true
        "bScrollAutoCss": true,
        "bProcessing": true,
        "bRetrieve": true,
        "bFilter": false,
        "bJQueryUI": true,
        "bInfo" : false,
        // fixedHeader: true,
        //"sDom": 't',
        "sDom": '<"H"CTrf>t<"F"lip>',
        "aoColumns": [
            {
                "sWidth": "20%",
            "mData": 0
          }, {
            "sWidth": "80%",
            "mData": 1
          }],
        /* "aLengthMenu": [[25, 50, 100, -1], [25, 50, 100, "All"]], */
        //"sScrollY": "500px",
        //"sScrollX": "100%",
        //"sScrollXInner": "110%",
        "fnInitComplete": function() {
            this.css("visibility", "visible");
            let tbl = document.getElementById("endsDiv");
            tbl.style.display = "block";
            // let tblDiv = document.getElementById("statesDataTableDiv");
            // tblDiv.style.display = "block";
     }
    });
    //new $.fn.dataTable.FixedHeader( stdTable1 );
    let tblDiv = document.getElementById("endsDiv");
    tblDiv.style.display = "block";
}, 0); 
}


self.loadResults = function(){
    $timeout(function () {
     resTbl = $("#results").dataTable({
              //"iDisplayLength": -1,
              "bPaginate": false,
              "iCookieDuration": 60,
              "bStateSave": false,
              "bAutoWidth": false,
              //true
              "bScrollAutoCss": true,
              "bProcessing": true,
              "bRetrieve": true,
              "bFilter": false,
              "bJQueryUI": true,
              "bInfo" : false,
              // fixedHeader: true,
              //"sDom": 't',
              "sDom": '<"H"CTrf>t<"F"lip>',
              "aoColumns": [
                {
                    "sWidth": "20%",
                "mData": 0
              }, {
                "sWidth": "50%",
                "mData": 1
              }, {
                "sWidth": "20%",
                "mData": 2
              }, {
                "sWidth": "20%",
                "mData": 3
              }, {
                "sWidth": "20%",
                "mData": 4,
                "sType" : "numeric"
              }, {
                "sWidth": "20%",
                "mData": 5
              }, {
                "sWidth": "20%",
                "mData": 6
              }, {
                "sWidth": "20%",
                "mData": 7
              }, {
                "sWidth": "20%",
                "mData": 8
              }, {
                "sWidth": "20%",
                "mData": 9
              }],
        
    "fnInitComplete": function() {
        //this.css("visibility", "visible");
        //if(maxSizeRetrived > 0)
        {
            let tbl = document.getElementById("results");
            tbl.style.display = "block";
            let tblDiv = document.getElementById("resultsDiv");
            tblDiv.style.display = "block";
        }
 },
 "drawCallback": function( settings ) {
    // $(".dataTables_scrollHeadInner").css({"width":"100%"});
    // $(".table ").css({"width":"100%"});
    //$(".dataTables_scrollBody").width($(".dataTables_scrollHead").width());
 }
});
resTbl.fnClearTable();
        let rows = []
        self.final_results.forEach(function(tirp) { 
            rows.push([tirp[4], $scope.getSymbols(tirp), tirp[1], $scope.getScore(tirp), $scope.getVS0(tirp), $scope.getVS1(tirp) + "%" ,tirp[3], tirp[6], tirp[7], tirp[8]])
          })
          if (rows.length > 0)
          {
          var rowIdxes =$('#results').dataTable().fnAddData(rows);
          if(self.currTirp != undefined)
          {

          for (var i=0; i<rowIdxes.length; i++)
          {
                if ($scope.getSymbols(self.currTirp) == rows[i][1] &&  self.currTirp[1] == rows[i][2])
                {
                    var rowTr = $('#results').dataTable().fnGetNodes( rowIdxes[i] );
                    $(rowTr).addClass('selected');
                    break;
                }
            
        }
              
        }
    }
})
}

$scope.is_highlight = function(tirp) {
    if (tirp == undefined || self.currTirp == undefined)
        return false;
    if (self.currTirp[0] == tirp[0] && self.currTirp[1] == tirp[1])
        return true;
    else
    {
        return false;
    }
  };

//   $scope.rowSelected = function(tirp) {
//       self.currTirp = tirp;
//       $rootScope.cuurTirptblPSearch = tirp;
//       self.drawAvgTirp();
//   }


$('#results tbody').on('click', 'tr', function( e ) { 

    $('table > tbody  > tr').removeClass( "selected" );
    $(this).addClass( "selected" );
    let rel = $(this).find("td:eq(2)").text().trim();
    let sym = $(this).find("td:eq(1)").text().trim();
    for (tirp in self.final_results)
    {
        let sym2 = $scope.getSymbols(self.final_results[tirp]);
        let rel2 = self.final_results[tirp][1];
        if (rel2 == rel &&  sym2 == sym)
        {
            tirp = self.final_results[tirp];
            self.currTirp = tirp;
            $rootScope.cuurTirptblPSearch = tirp;
            self.drawAvgTirp();
        }
    }
})


  $scope.getSymbols = function(tirp) {
    symbols = tirp[0].split('-');
    symbols[0] = symbols[0].substring(1);
    symbolsStr = ""
    for(var i=0; i< symbols.length-2; i++)
    {
        symbolsStr += self.states_dictionary[symbols[i]] + "-";

    }
    symbolsStr += self.states_dictionary[symbols[symbols.length-2]];
    return symbolsStr;
  }


  $scope.getScore = function (tirp) {
    if (tirp == undefined)
        return "";
    let numOfEntities = $rootScope.selcetedDataSet.num_of_entities;
    let numOfEntitiesClass1 = $rootScope.selcetedDataSet.num_of_entities_class_1;
    let vs0 = 0
    let exist_in_class_0 = (tirp[16] == 'True');
    let exist_in_class_1 = (tirp[15] == 'True');
    if (exist_in_class_0)
        vs0 =  ((tirp[2]/numOfEntities).toFixed(2)*100).toFixed(0)
    let vs1 = 0
    if (exist_in_class_1 || !exist_in_class_0)
        {
            vs1 = ((tirp[5]/numOfEntitiesClass1).toFixed(2)*100).toFixed(0)
        }
    // let avg_vs = (vs0+vs1)/2
    let delta_vs = Math.abs(vs0-vs1)
    let delta_mhs = parseFloat(Math.abs(parseFloat(tirp[3])- parseFloat(tirp[6])).toFixed(2))
    let delta_mmd = Math.abs(parseFloat(tirp[7])- parseFloat(tirp[8])).toFixed(2)
    // let p_hs = 1-10*tirp._TIRP__p_value_mhs
    // let p_mmd = 1-10*tirp._TIRP__p_value_md
    let score = 0
    // if (tirp._TIRP__exist_in_class1)
    score =  $rootScope.weights[0]*delta_vs + $rootScope.weights[1]*delta_mhs + $rootScope.weights[2]*delta_mmd
    // else
    //     score =  $rootScope.weights[0]*(avg_vs+delta_vs)
    return score.toFixed(1);
}

//   $scope.getScore = function (tirp) {
//     if (tirp == undefined)
//         return "";
//     let exist_in_class_1 = (tirp[15] == 'True');
//     let numOfEntities = $rootScope.selcetedDataSet.num_of_entities;
//     let vs0 = parseFloat((tirp[2]*100).toFixed(0))/ numOfEntities
//     let vs1 = tirp[5]
//     if (exist_in_class_1)
//     {
//         vs1 = vs1/$rootScope.selcetedDataSet.num_of_entities_class_1;
//     }
//     else
//     {
//         vs1 = vs1*2
//     }
//     vs1 = parseFloat((vs1*100).toFixed(0))
//     // let avg_vs = (vs0+vs1)/2
//     let delta_vs = Math.abs(vs0-vs1)
//     let delta_mhs = parseFloat(Math.abs(parseFloat(tirp[3])- parseFloat(tirp[6])).toFixed(2))
//     let delta_mmd = Math.abs(parseFloat(tirp[7])- parseFloat(tirp[8])).toFixed(2)
//     let score =  $rootScope.weights[0]*delta_vs + $rootScope.weights[1]*delta_mhs + $rootScope.weights[2]*delta_mmd
//     return score.toFixed(4);
// }

$scope.getVS1 = function(tirp)
{
    // if (!exist_in_class_0)
    //     return 
    let exist_in_class_0 = (tirp[16] == 'True');
    let exist_in_class_1 = (tirp[15] == 'True');
    let vs1 = tirp[5]
    if (exist_in_class_1 || !exist_in_class_0)
    {
        vs1 = vs1/$rootScope.selcetedDataSet.num_of_entities_class_1;
        vs1 = parseFloat((vs1*100).toFixed(0))
    }
    else
    {
        vs1 = vs1*2
        vs1 = "-<" + parseFloat((vs1*100).toFixed(0))
    }
    return vs1;
}

$scope.getVS0 = function(tirp)
{
    let exist_in_class_0 = (tirp[16] == 'True');
    if (!exist_in_class_0)
        return "-<" + ($rootScope.selcetedDataSet.min_ver_support*100).toFixed(0) +"%"
    return (tirp[2]/$rootScope.selcetedDataSet.num_of_entities*100).toFixed(0) + "%"
}


}]);