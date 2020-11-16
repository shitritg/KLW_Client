angular.module('Visualization')
 .controller('searchToolController', ['$scope', '$rootScope', '$location', '$http', 'service','$timeout', function ($scope, $rootScope, $location, $http, service,$timeout) {
 

    let self = this;
    self.loaded = false;
    $rootScope.location = "search";
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
        if ($rootScope.searchConditions == undefined)
        {
            $rootScope.searchConditions = []
            $rootScope.searchConditions[0] = true;
            $rootScope.searchConditions[1] = true;
            $rootScope.searchConditions[2] = true;
            $rootScope.searchConditions[3] = 1;
            $rootScope.searchConditions[4] = "";
            $rootScope.searchConditions[5] = $rootScope.selcetedDataSet.min_ver_support*100;
            $rootScope.searchConditions[6] = 100;
            $rootScope.searchConditions[7] = 1;
            $rootScope.searchConditions[8] = "";
            $rootScope.searchConditions[9] = true;
            $rootScope.searchConditions[10] = true;
            self.final_results = []     
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
        $scope.states = self.states;
        $rootScope.searchStates = self.states;
        $rootScope.searchStatesDictinary =  self.states_dictionary;
    }

    //self.currTirp = undefined;
    //$scope.columns = ['size','property #1','relations','v.s','m.h.s','m.m.d'];
    //self.loaded = false;
    document.getElementById("minVS").min = $rootScope.searchConditions[5];
    document.getElementById("minVS").max = 100;
    document.getElementById("minVS").value = $rootScope.searchConditions[5];
    $scope.minVS = $rootScope.searchConditions[5];
    document.getElementById("maxVS").value = $rootScope.searchConditions[6];
    $scope.maxVS = $rootScope.searchConditions[6];
    document.getElementById("maxVS").min = $rootScope.searchConditions[5];
    document.getElementById("maxVS").max = 100;
    document.getElementById("minHS").value = $rootScope.searchConditions[3];
    $scope.minHS = $rootScope.searchConditions[3];
    document.getElementById("maxHS").value = $rootScope.searchConditions[4];
    $scope.maxHS = $rootScope.searchConditions[4];
    document.getElementById("minSize").value = $rootScope.searchConditions[7];
    $scope.minSize = $rootScope.searchConditions[7];
    document.getElementById("maxSize").value = $rootScope.searchConditions[8];
    $scope.maxSize = $rootScope.searchConditions[8];
    $scope.allStartsItemsSelected = $rootScope.searchConditions[0];
    $scope.allContainsItemsSelected = $rootScope.searchConditions[1];
    $scope.allEndsItemsSelected = $rootScope.searchConditions[2];
    $scope.states = $rootScope.searchStates;
    self.states = $rootScope.searchStates;
    self.states_dictionary = $rootScope.searchStatesDictinary;
    self.loaded = true;
    //if ($rootScope.searchFinalResults != undefined)
        //self.final_results = $rootScope.searchFinalResults;
    if ($rootScope.searchChart != undefined)
    {
        
        self.chart = $rootScope.searchChart;
        self.currTirp = $rootScope.cuurTirpSearch;
    //     $timeout(function () {
    //     self.chart.render();
    //     $timeout(function () {
    // $scope.$apply()})}, 3000)
        //$scope.renderGraph();
        $scope.search('initial');
    }
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
            $rootScope.searchConditions[5] = value;
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
            $rootScope.searchConditions[3] = value;
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
            $rootScope.searchConditions[7] = value;

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
            $rootScope.searchConditions[6] = value;
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
            $rootScope.searchConditions[4] = value;
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
            $rootScope.searchConditions[8] = value;
        }
    }


    $scope.search = function(type)
    {
        if (type != 'initial')
        {
            self.currTirp = undefined;
            $rootScope.cuurTirpSearch = undefined
        }
        startsList = []
        containList = []
        endsList = []
        let minHS = $scope.minHS
        let maxHS = $scope.maxHS
        if(maxHS == "")
            maxHS = null
        let minVS =$scope.minVS
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
            self.showResults();
            return;
        }

        let body = {
            data_set_name: $rootScope.selcetedDataSet.data_set_name,
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
            let max_mmd = 0;
            self.final_results =[]
            for (result in results)
            {
                res = results[result].split(',')
                if(parseFloat(res[7]) > max_mmd)
                    max_mmd = parseFloat(res[7])
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
            $rootScope.searchFinalResults = self.final_results;
            self.showResults(max_mmd);

        
    }, function (response) {
                    
        alert("Something went wrong.\n" + "Please Try Again"); 
        $rootScope.location = 'Files';
        $scope.$apply(function () { $location.path('/')} );
        });

    }


    $scope.findTirp = function()
    {
        self.loaded = false;
        document.getElementById('loader').style.display = "block";
        let body = {
            data_set_name: $rootScope.selcetedDataSet.data_set_name,
            symbols: self.currTirp.symbols.replace("(",""),
            relations: self.currTirp.relations
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
            $rootScope.PassedFromSearch = true;
            $rootScope.pathOfTirps = path;
            $location.path('/tirps')
            $rootScope.location = 'TIRPs';
        
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
        $rootScope.searchConditions[0] = $scope.allStartsItemsSelected;
        // Loop through all the entities and set their isChecked property
        for (var i = 0; i < $scope.states.length; i++) {
            $scope.states[i].isStartsChecked = $scope.allStartsItemsSelected;
        }
    };

    $scope.StartsSelect = function () {
        $rootScope.searchStates = $scope.states;
        // If any entity is not checked, then uncheck the "allItemsSelected" checkbox
        for (var i = 0; i < $scope.states.length; i++) {
            if (!$scope.states[i].isStartsChecked) {
                $scope.allStartsItemsSelected = false;
                $rootScope.searchConditions[0] = false;
                return;
            }
        }
        //If not the check the "allItemsSelected" checkbox
        $scope.allStartsItemsSelected = true;
        $rootScope.searchConditions[0] = true;
    };
      

    $scope.ContainsSelect = function () {
        $rootScope.searchStates = $scope.states;
        // If any entity is not checked, then uncheck the "allItemsSelected" checkbox
        for (var i = 0; i < $scope.states.length; i++) {
            if (!$scope.states[i].isContainsChecked) {
                $scope.allContainsItemsSelected = false;
                $rootScope.searchConditions[1] = false;
                return;
            }
        }
        //If not the check the "allItemsSelected" checkbox
        $scope.allContainsItemsSelected = true;
        $rootScope.searchConditions[1] = true;
    };

    $scope.selectAllContains = function () {
        $rootScope.searchConditions[1] = $scope.allContainsItemsSelected;
        // Loop through all the entities and set their isChecked property
        for (var i = 0; i < $scope.states.length; i++) {
            $scope.states[i].isContainsChecked = $scope.allContainsItemsSelected;
        }
    };

    $scope.EndsSelect = function () {
        $rootScope.searchStates = $scope.states;
        // If any entity is not checked, then uncheck the "allItemsSelected" checkbox
        for (var i = 0; i < $scope.states.length; i++) {
            if (!$scope.states[i].isEndsChecked) {
                $scope.allEndsItemsSelected = false;
                $rootScope.searchConditions[2] = false;
                return;
            }
        }

        //If not the check the "allItemsSelected" checkbox
        $scope.allEndsItemsSelected = true;
        $rootScope.searchConditions[2] = true;
    };

    $scope.selectAllEnds = function () {
        $rootScope.searchConditions[2] = $scope.allEndsItemsSelected;
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


    self.showResults = function(max_mmd){ 
        let data = [];
        for (result in self.final_results)
            {
                fake_point = {
                    x: 1, y:-10, z:2, markerColor: "white"
                }
                data.push(fake_point)
                let curr_result = self.final_results[result]
                point = {
                    x: parseFloat(curr_result[3]),
                    y: parseFloat((curr_result[2]/$rootScope.selcetedDataSet.num_of_entities *100).toFixed(0)) ,
                    //z: parseFloat(curr_result[7]),
                    z: 1,
                    markerColor: self.getColor(max_mmd ,parseFloat(curr_result[7]),  curr_result[0], curr_result[1]),
                    markerBorderThickness: 1,
                    markerBorderColor: "black",
                    size: parseInt(curr_result[4]),
                    symbols: curr_result[0],
                    relations: curr_result[1],
                    mean_of_first_interval: curr_result[9],
                    mean_offset_from_first_symbol:  curr_result[11],
                    mmd: parseFloat(curr_result[7]),
                    mhs: parseFloat(curr_result[3]),
                    id: curr_result[17]
                }
                data.push(point)
            }
        let class_lable = "Class 1"
        if ($rootScope.selcetedDataSet.class_name != "")
            class_lable = $rootScope.selcetedDataSet.class_name
        self.chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            zoomEnabled: true,
            zoomType: "xy",
            theme: "light2",
            title:{
                text:  class_lable + " TIRPs",
                fontSize: 18
            },
            subtitles:[
                {
                    text: self.final_results.length + " TIRPs having >= " + $scope.minVS + "% vertical support" ,
                    fontSize: 15
                }],
            axisX: {
                title:"Mean Horizontal Support ",
                titleFontWeight: "bold",
                //suffix: "%",
                minimum: 1,//Math.max(($rootScope.selcetedDataSet.min_ver_support*100-10),0),
                //maximum: 100,
                gridThickness: 1
            },
            axisY:{
                title:"Vertical Support",
                titleFontWeight: "bold",
                suffix: "%",
                minimum:  Math.max(($rootScope.selcetedDataSet.min_ver_support*100-10),0),
                //maximum: 100,
                gridThickness: 1
            },
            data: [{
                type: "bubble",
                showInLegend: true,
                explodeOnClick: true,
                legendText: "Bubble Color Tone = Mean Mean Duration in " + $rootScope.selcetedDataSet.timestamp,
                legendMarkerType: "circle",
                legendMarkerColor: "#3377ff",
                click: self.drawAvgTirp,
                toolTipContent: "tirp size: {size}<br/>v.s "+": {y}% <br/> m.h.s " +": {x}<br/> m.m.d: {mmd}" + " " + $rootScope.selcetedDataSet.timestamp,
                dataPoints: data
                
            }]
            // ,
            // options: {
            //     onClick: function(evt, activeElements) {
            //       var elementIndex = activeElements[0]._index;
            //       this.data.datasets[0].pointBackgroundColor[elementIndex] = 'red';
            //       this.update();
            //     }}
        });
        self.chart.render();
        $rootScope.searchChart = self.chart;
        if ($rootScope.cuurTirpSearch != undefined)
        {
            $timeout(function () {
                self.drawAvgTirp();})
        }

        
    }


self.getColor = function(max_mmd, mmd, symbols, rels)
{
    if($rootScope.cuurTirpSearch != undefined && symbols == $rootScope.cuurTirpSearch.symbols && rels == $rootScope.cuurTirpSearch.relations)
        return 'red'
    // if (!exist_in_class_1)
    //     return 
    let size_of_bin = max_mmd / 4;
    let diff = mmd
    if (diff <= size_of_bin)
        return '#99bbff'
    else if (diff > size_of_bin && diff <= 2*size_of_bin)
        return '#3377ff'
    else if (diff > 2*size_of_bin && diff <= 3*size_of_bin)
        return '#0044cc'
    else
        return '#002266';
}


self.drawAvgTirp = function (e) {
    $timeout(function () {
    let point;
    if ( e != undefined)
        point = e.dataPoint;
    else
    {
        point = $rootScope.cuurTirpSearch
    }
    if(point.markerColor == "white")
        return;
        
    if (self.currTirp != undefined)
    {
        let symbols = $rootScope.cuurTirpSearch.symbols
        let rels = $rootScope.cuurTirpSearch.relations
        let data = self.chart.data[0].dataPoints
        for(var i=0; i<data.length; i++)
        {
            if (data[i].symbols == symbols && data[i].relations == rels)
            {
                if (e != undefined)
                    data[i].markerColor = self.currTirp.oldColor
                else
                {
                    data[i].oldColor = self.currTirp.oldColor
                    point = data[i]
                }
                break;
            }
        }
        //self.currTirp.markerColor = self.currTirp.oldColor
    }
    self.currTirp = point
    $rootScope.cuurTirpSearch = self.currTirp;
    if( point.markerColor != 'red')
        self.currTirp.oldColor = point.markerColor
    else
        self.currTirp.oldColor = point.oldColor;
    point.markerColor = 'red'
    self.chart.render();
    //self.showResults();
    document.getElementById("currTirpDetails").innerHTML = "V.S- " + point.y +  "% , M.M.Duration- " + point.mmd + " , M.H.S- " + point.mhs 

    $scope.$apply();
    let times = point.mean_offset_from_first_symbol.replace("[","").replace("]","").split('|');
    //let timesClass1 = point.mean_offset_from_first_symbol_class_1.replace("[","").replace("]","").split('|');
    let durationOfFirstInterval = parseFloat(point.mean_of_first_interval)
    //let durationOfFirstIntervalClass1 = parseFloat(point.mean_of_first_interval_class_1)
    let symbols = point.symbols.replace("(","").split('-');
    let tirpSize = point.size;
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
        interval.push(self.states_dictionary[symbols[0]]+ " - "  +service.getDiffBetweenDates(date1,date2));
        interval.push(date1);
        interval.push(date2);
        data.push(interval);
        var j = 2;
        var offset = durationOfFirstInterval;
        for (var i = 1; i < tirpSize; i++) {
            interval = new Array();
            interval.push(self.states_dictionary[symbols[i]]);
            date1 = service.getDateForSymbol(offset + parseFloat(times[j]));
            date2 = service.getDateForSymbol(offset + parseFloat(times[j + 1]));
            interval.push(self.states_dictionary[symbols[i]] + " - "  +service.getDiffBetweenDates(date1,date2));
            interval.push(date1);
            interval.push(date2);
            data.push(interval);
            j += 2;
        }
        dataTable.addRows(data);
        dataTable.insertColumn(2, {type: 'string', role: 'tooltip', p: {html: true}});
        for (var i = 0; i < dataTable.getNumberOfRows(); i++) {
            let label = dataTable.getValue(i, 1);
            var tooltip = '<div class="ggl-tooltip"><span>' +
              dataTable.getValue(i, 0) + '</span></div><div class="ggl-tooltip"><span>' +
              'M.M.D: </span>' + service.getDiffBetweenDates(dataTable.getValue(i, 3),dataTable.getValue(i, 4)) ; + '</div>'
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


// $scope.renderGraph = function()
// {
//     let data = self.chart.data[0].dataPoints
//     for(var i=0; i<data.length; i++)
//     {
//         let borderSize = 0
//         let mhs_pvalue = data[i].p_value_mhs
//         let mmd_pvalue = data[i].p_value_mmd
//         if($scope.mhsPval)
//         {
//             if (mhs_pvalue < 0.05)
//             {
//                 borderSize = 2
//             }
//         }
//         if($scope.mmdPval)
//         {
//             if (mmd_pvalue < 0.05)
//             {
//                 borderSize = 2
//             }
//         }
//         data[i].markerBorderThickness = borderSize;
//     }
//     self.chart.data[0].dataPoints = data;
//     self.chart.render();
// }


// self.loadEnds = function(index){
//     $timeout(function () {
//     let stdTable1 = $("#ends").dataTable({
//     //"iDisplayLength": -1,
//     "bPaginate": false,
//     // "iCookieDuration": 60,
//     // "bStateSave": false,
//     //"bAutoWidth": false,
//     "bFilter": false,
//     //true
//     // "bScrollAutoCss": true,
//     // "bProcessing": true,
//      "bRetrieve": true,
//     // "bJQueryUI": true,
//     "bInfo" : false,
//     // columnDefs:  [ {
//     //     "targets": 0,
//     //     width: '10%',
//     //     "targets": 1,
//     //     width: '10%',
//     //     "targets": 2,
//     //     width: '30%',  
//     //     "targets": 3,
//     //     width: '35%',
//     //     "targets": 4,
//     //     width: '25%'}],
//     "aoColumns": [
//         {
//             "mData": null,
//             // "sWidth": "3%",
//             "bSortable": false},
//         {
//             "sWidth": "20%",
//         "mData": 0
//       }, {
//         "sWidth": "50%",
//         "mData": 1
//       }, {
//         "sWidth": "30%",
//         "mData": 2
//       }, {
//       }],
//     //"sDom": 't',
//     // "sDom": '<"H"CTrf>t<"F"lip>',
//     /* "aLengthMenu": [[25, 50, 100, -1], [25, 50, 100, "All"]], */
//     //"sScrollY": "500px",
//     //"sScrollX": "100%",
//     // "sScrollXInner": "110%",
//     "fnInitComplete": function() {
//         //this.css("visibility", "visible");
//         let tbl = document.getElementById("ends");
//         tbl.style.display = "block";
//  },
//  "drawCallback": function( settings ) {
//     // $(".dataTables_scrollHeadInner").css({"width":"100%"});
//     // $(".table ").css({"width":"100%"});
//     $(".dataTables_scrollBody").width($(".dataTables_scrollHead").width());
//  }
// });
// $('.dataTables_length').addClass('bs-select');

//   let tblDiv = document.getElementById("ends");
//   tblDiv.style.display = "block";
// })
// }



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




}]);