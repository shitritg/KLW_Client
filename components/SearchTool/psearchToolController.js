angular.module('Visualization')
 .controller('psearchToolController', ['$scope', '$rootScope', '$location', '$http', 'service','$timeout', function ($scope, $rootScope, $location, $http, service,$timeout) {
 
    let self = this;
    self.loaded = false;
    $rootScope.location = "psearch";
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
        if ($rootScope.pSearchConditions == undefined)
        {
            $rootScope.pSearchConditions = []
            $rootScope.pSearchConditions[0] = true;
            $rootScope.pSearchConditions[1] = true;
            $rootScope.pSearchConditions[2] = true;
            $rootScope.pSearchConditions[3] = 1;
            $rootScope.pSearchConditions[4] = "";
            $rootScope.pSearchConditions[5] = $rootScope.selcetedDataSet.min_ver_support*100;
            $rootScope.pSearchConditions[6] = 100;
            $rootScope.pSearchConditions[7] = 1;
            $rootScope.pSearchConditions[8] = "";
            $rootScope.pSearchConditions[9] = true;
            $rootScope.pSearchConditions[10] = true;
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
        $scope.states = self.states
        $rootScope.pSearchStates = self.states;
        $rootScope.pSearchStatesDictinary =  self.states_dictionary;
    }

    //self.currTirp = undefined;
    //$scope.columns = ['size','property #1','relations','v.s','m.h.s','m.m.d'];
    //self.loaded = false;
    document.getElementById("minVS").min = $rootScope.pSearchConditions[5];
    document.getElementById("minVS").max = 100;
    document.getElementById("minVS").value = $rootScope.pSearchConditions[5];
    $scope.minVS = $rootScope.pSearchConditions[5];
    document.getElementById("maxVS").value = $rootScope.pSearchConditions[6];
    $scope.maxVS = $rootScope.pSearchConditions[6];
    document.getElementById("maxVS").min = $rootScope.pSearchConditions[5];
    document.getElementById("maxVS").max = 100;
    document.getElementById("minHS").value = $rootScope.pSearchConditions[3];
    $scope.minHS = $rootScope.pSearchConditions[3];
    document.getElementById("maxHS").value = $rootScope.pSearchConditions[4];
    $scope.maxHS = $rootScope.pSearchConditions[4];
    document.getElementById("minSize").value = $rootScope.pSearchConditions[7];
    $scope.minSize = $rootScope.pSearchConditions[7];
    document.getElementById("maxSize").value = $rootScope.pSearchConditions[8];
    $scope.maxSize = $rootScope.pSearchConditions[8];
    $scope.allStartsItemsSelected = $rootScope.pSearchConditions[0];
    $scope.allContainsItemsSelected = $rootScope.pSearchConditions[1];
    $scope.allEndsItemsSelected = $rootScope.pSearchConditions[2];
    $scope.mhsPval = $rootScope.pSearchConditions[9];
    $scope.mmdPval = $rootScope.pSearchConditions[10];
    $scope.states = $rootScope.pSearchStates;
    self.states = $rootScope.pSearchStates;
    self.states_dictionary = $rootScope.pSearchStatesDictinary;
    self.loaded = true;
    //if ($rootScope.pSearchFinalResults != undefined)
        //self.final_results = $rootScope.pSearchFinalResults;
    if ($rootScope.PSearchChart != undefined)
    {
        
        self.chart = $rootScope.PSearchChart;
        self.currTirp = $rootScope.cuurTirpPSearch;
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
            $rootScope.pSearchConditions[5] = value;
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
            $rootScope.pSearchConditions[3] = value;
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
            $rootScope.pSearchConditions[7] = value;

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
            $rootScope.pSearchConditions[6] = value;
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
            $rootScope.pSearchConditions[4] = value;
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
            $rootScope.pSearchConditions[8] = value;
        }
    }


    $scope.search = function(type)
    {
        if (type != 'initial')
        {
            self.currTirp = undefined;
            $rootScope.cuurTirpPSearch = undefined
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
            let max_delta_mmd = 0
            for (result in results)
            {
                res = results[result].split(',')
                if(Math.abs(parseFloat(res[7])- parseFloat(res[8])) > max_delta_mmd)
                    max_delta_mmd = Math.abs(parseFloat(res[7])- parseFloat(res[8]))
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
            $rootScope.pSearchFinalResults = self.final_results;
            self.showResults(max_delta_mmd);

        
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
        $rootScope.pSearchConditions[0] = $scope.allStartsItemsSelected;
        // Loop through all the entities and set their isChecked property
        for (var i = 0; i < $scope.states.length; i++) {
            $scope.states[i].isStartsChecked = $scope.allStartsItemsSelected;
        }
    };

    $scope.StartsSelect = function () {
        $rootScope.pSearchStates = $scope.states;
        // If any entity is not checked, then uncheck the "allItemsSelected" checkbox
        for (var i = 0; i < $scope.states.length; i++) {
            if (!$scope.states[i].isStartsChecked) {
                $scope.allStartsItemsSelected = false;
                $rootScope.pSearchConditions[0] = false;
                return;
            }
        }
        //If not the check the "allItemsSelected" checkbox
        $scope.allStartsItemsSelected = true;
        $rootScope.pSearchConditions[0] = true;
    };
      

    $scope.ContainsSelect = function () {
        $rootScope.pSearchStates = $scope.states;
        // If any entity is not checked, then uncheck the "allItemsSelected" checkbox
        for (var i = 0; i < $scope.states.length; i++) {
            if (!$scope.states[i].isContainsChecked) {
                $scope.allContainsItemsSelected = false;
                $rootScope.pSearchConditions[1] = false;
                return;
            }
        }
        //If not the check the "allItemsSelected" checkbox
        $scope.allContainsItemsSelected = true;
        $rootScope.pSearchConditions[1] = true;
    };

    $scope.selectAllContains = function () {
        $rootScope.pSearchConditions[1] = $scope.allContainsItemsSelected;
        // Loop through all the entities and set their isChecked property
        for (var i = 0; i < $scope.states.length; i++) {
            $scope.states[i].isContainsChecked = $scope.allContainsItemsSelected;
        }
    };

    $scope.EndsSelect = function () {
        $rootScope.pSearchStates = $scope.states;
        // If any entity is not checked, then uncheck the "allItemsSelected" checkbox
        for (var i = 0; i < $scope.states.length; i++) {
            if (!$scope.states[i].isEndsChecked) {
                $scope.allEndsItemsSelected = false;
                $rootScope.pSearchConditions[2] = false;
                return;
            }
        }

        //If not the check the "allItemsSelected" checkbox
        $scope.allEndsItemsSelected = true;
        $rootScope.pSearchConditions[2] = true;
    };

    $scope.selectAllEnds = function () {
        $rootScope.pSearchConditions[2] = $scope.allEndsItemsSelected;
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


    self.showResults = function(max_delta_mmd){ 
        let labelClass1 = "";
                if ($rootScope.selcetedDataSet.class_name != '')
                    labelClass1 += $rootScope.selcetedDataSet.class_name;
                else
                    labelClass1 += "Class 1"
                let labelClass0 = "";
                if ($rootScope.selcetedDataSet.second_class_name != '')
                    labelClass0 += $rootScope.selcetedDataSet.second_class_name; 
                else
                    labelClass0 += "Class 0"
        let data = [];
        for (result in self.final_results)
            {
                let curr_result = self.final_results[result]
                let exist_in_class_1 = (curr_result[15] == 'True');
                let exist_in_class_0 = (curr_result[16] == 'True');
                let vs = (curr_result[2]/$rootScope.selcetedDataSet.num_of_entities);
                let vs_class_1 = curr_result[5]
                let color = '#002266'
                if (!exist_in_class_0)
                {
                    vs =$rootScope.selcetedDataSet.min_ver_support;
                    vs_class_1 = (curr_result[5]/$rootScope.selcetedDataSet.num_of_entities_class_1);
                    color = self.getColor(parseFloat(curr_result[7]), parseFloat(curr_result[8]), max_delta_mmd,exist_in_class_1,  curr_result[0], curr_result[1] )
                }
                else
                {
                    if (exist_in_class_1)
                    {
                        vs_class_1 = vs_class_1/$rootScope.selcetedDataSet.num_of_entities_class_1;
                        color = self.getColor(parseFloat(curr_result[7]), parseFloat(curr_result[8]), max_delta_mmd,exist_in_class_1,  curr_result[0], curr_result[1] )
                    }
                    else
                    {
                        vs_class_1 = vs_class_1*2
                    }
                }

                let markerBorderThicknessSize = 0
                let mhs_pvalue = parseFloat(curr_result[13]).toFixed(3);
                let mmd_pvalue = parseFloat(curr_result[14]).toFixed(3);
                //if (parseFloat(curr_result[13]).toFixed(3) < 0.05 || parseFloat(curr_result[14]).toFixed(3) < 0.05)
                    //markerBorderThicknessSize = 2
                    if($scope.mhsPval)
                    {
                        if (mhs_pvalue < 0.05)
                        {
                            markerBorderThicknessSize = 2
                        }
                    }
                    if($scope.mmdPval)
                    {
                        if (mmd_pvalue < 0.05)
                        {
                            markerBorderThicknessSize = 2
                        }
                    }
                point = {
                    x: parseFloat((vs_class_1*100).toFixed(0)) ,
                    y: parseFloat((vs*100).toFixed(0)) ,
                    z: parseFloat(Math.abs(parseFloat(curr_result[3])- parseFloat(curr_result[6])).toFixed(2)),
                    markerColor: color,
                    markerBorderColor: "black",
                    markerBorderThickness: markerBorderThicknessSize,
                    // delta_mhs: Math.abs(parseFloat(curr_result[3])- parseFloat(curr_result[6])),
                    delta_vs: Math.abs(parseFloat((vs_class_1*100).toFixed(0))-parseFloat((vs*100).toFixed(0))),
                    delta_mmd: Math.abs(parseFloat(curr_result[7])- parseFloat(curr_result[8])).toFixed(2),
                    size: parseInt(curr_result[4]),
                    p_value_mhs:  parseFloat(curr_result[13]).toFixed(3),
                    p_value_mmd:  parseFloat(curr_result[14]).toFixed(3),
                    symbols: curr_result[0],
                    relations: curr_result[1],
                    mean_of_first_interval: curr_result[9],
                    mean_of_first_interval_class_1: curr_result[10],
                    mean_offset_from_first_symbol:  curr_result[11],
                    mean_offset_from_first_symbol_class_1:  curr_result[12],
                    exist_in_class1: exist_in_class_1,
                    exist_in_class0: exist_in_class_0,
                    mmd: parseFloat(curr_result[7]),
                    mmd1: parseFloat(curr_result[8]),
                    mhs: parseFloat(curr_result[3]),
                    mhs1: parseFloat(curr_result[6]),
                    id: curr_result[17]
                }
                data.push(point)
            }
        self.chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            zoomEnabled: true,
            zoomType: "xy",
            theme: "light2",
            title:{
                text:  $rootScope.selcetedDataSet.data_set_name + " Predictive TIRPs",
                fontSize: 18
            },
            subtitles:[
                {
                    text: self.final_results.length + " TIRPs having >= " + $scope.minVS + "% vertical support" ,
                    fontSize: 15
                }],
            axisX: {
                title:"Vertical Support " + labelClass0,
                titleFontWeight: "bold",
                suffix: "%",
                minimum: Math.max(($rootScope.selcetedDataSet.min_ver_support*100-10),0),
                maximum: 100,
                gridThickness: 1
            },
            axisY:{
                title:"Vertical Support " + labelClass1,
                titleFontWeight: "bold",
                suffix: "%",
                minimum:  Math.max(($rootScope.selcetedDataSet.min_ver_support*100-10),0),
                maximum: 100,
                gridThickness: 1
            },
            data: [{
                type: "bubble",
                showInLegend: true,
                explodeOnClick: true,
                legendText: "Bubble Size = Delta M.H.S, Bubble Color Tone = Delta M.M.D in " + $rootScope.selcetedDataSet.timestamp,
                legendMarkerType: "circle",
                legendMarkerColor: "#3377ff",
                click: self.drawAvgTirp,
                toolTipContent: "tirp size: {size}<br/>v.s "+ labelClass1+": {y}% <br/> v.s " + labelClass0+": {x}%<br/> delta v.s: {delta_vs}%<br/> delta m.h.s: {z}<br/> delta m.m.d: {delta_mmd}" + " " + $rootScope.selcetedDataSet.timestamp + "<br/>p-value m.h.s: {p_value_mhs}<br/>p-value m.m.d: {p_value_mmd}",
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
        $rootScope.PSearchChart = self.chart;
        if ($rootScope.cuurTirpPSearch != undefined)
        {
            $timeout(function () {
                self.drawAvgTirp();})
        }

        
    }


self.getColor = function(mmd1, mmd0,max_delta_mmd,exist_in_class_1, symbols, rels)
{
    if($rootScope.cuurTirpPSearch != undefined && symbols == $rootScope.cuurTirpPSearch.symbols && rels == $rootScope.cuurTirpPSearch.relations)
        return 'red'
    if (!exist_in_class_1)
        return '#002266';
    let size_of_bin = max_delta_mmd / 3;
    let diff = Math.abs(mmd1,mmd0)
    if (diff <= size_of_bin)
        return '#99bbff'
    else if (diff > size_of_bin && diff <= 2*size_of_bin)
        return '#3377ff'
    else
        return '#0044cc'
}


self.drawAvgTirp = function (e) {
    $timeout(function () {
    let point;
    if ( e != undefined)
        point = e.dataPoint;
    else
    {
        point = $rootScope.cuurTirpPSearch
    }
        
    if (self.currTirp != undefined)
    {
        let symbols = $rootScope.cuurTirpPSearch.symbols
        let rels = $rootScope.cuurTirpPSearch.relations
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
    if( point.markerColor != 'red')
        self.currTirp.oldColor = point.markerColor
    else
        self.currTirp.oldColor = point.oldColor;
    point.markerColor = 'red'
    $rootScope.cuurTirpPSearch = self.currTirp;
    self.chart.render();
    //self.showResults();
    let vs =  point.y 
    let vs1 = point.x
    if (!point.exist_in_class0)
    {
        vs = "<" + $rootScope.selcetedDataSet.min_ver_support*100
    }
    else if (!point.exist_in_class1)
    {
        vs1 = "<" + $rootScope.selcetedDataSet.min_ver_support*100
    }
    document.getElementById("currTirpDetails").innerHTML = "V.S- " + vs + "%/" + vs1 + "% , M.M.Duration- " + point.mmd + "/" + point.mmd1 + " , M.H.S- " + point.mhs + "/" + point.mhs1 

    $scope.$apply();
    let times = point.mean_offset_from_first_symbol.replace("[","").replace("]","").split('|');
    let timesClass1 = point.mean_offset_from_first_symbol_class_1.replace("[","").replace("]","").split('|');
    let durationOfFirstInterval = parseFloat(point.mean_of_first_interval)
    let durationOfFirstIntervalClass1 = parseFloat(point.mean_of_first_interval_class_1)
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
        let duration = service.getDiffBetweenDates(date1,date2,true)
        if (!point.exist_in_class0)
        {
            duration = "0 " +  " / " + duration + " " + $rootScope.selcetedDataSet.timestamp
        }
        else if (point.exist_in_class1)
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
        for (var i = 1; i < tirpSize; i++) {
            interval = new Array();
            interval.push(self.states_dictionary[symbols[i]]);
            date1 = service.getDateForSymbol(offset + parseFloat(times[j]));
            date2 = service.getDateForSymbol(offset + parseFloat(times[j + 1]));
            duration = service.getDiffBetweenDates(date1,date2, true);
            if (!point.exist_in_class0)
            {
                duration =  "0 / " + duration + " " + $rootScope.selcetedDataSet.timestamp
            }
            else if (point.exist_in_class1)
            {
                date1Class1 = service.getDateForSymbol(offsetClass1 + parseFloat(timesClass1[j]));
                date2Class1 = service.getDateForSymbol(offsetClass1 + parseFloat(timesClass1[j + 1]));
                duration += " / " + service.getDiffBetweenDates(date1Class1,date2Class1)
            }
            else
            {
                duration += " / 0 " + $rootScope.selcetedDataSet.timestamp
            }
            interval.push(self.states_dictionary[symbols[i]] + " - " +duration);
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
              class0Name + 'M.M.D: </span>' + durationClass1 +  $rootScope.selcetedDataSet.timestamp + '</div><div class="ggl-tooltip"><span>' +
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


$scope.renderGraph = function()
{
    $rootScope.pSearchConditions[9] = $scope.mhsPval;
    $rootScope.pSearchConditions[10] = $scope.mmdPval;
    let data = self.chart.data[0].dataPoints
    for(var i=0; i<data.length; i++)
    {
        let borderSize = 0
        let mhs_pvalue = data[i].p_value_mhs
        let mmd_pvalue = data[i].p_value_mmd
        if($scope.mhsPval)
        {
            if (mhs_pvalue < 0.05)
            {
                borderSize = 2
            }
        }
        if($scope.mmdPval)
        {
            if (mmd_pvalue < 0.05)
            {
                borderSize = 2
            }
        }
        data[i].markerBorderThickness = borderSize;
    }
    self.chart.data[0].dataPoints = data;
    self.chart.render();
}


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