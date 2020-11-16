angular.module('Visualization')
 .controller('TIRPEntitiesController', ['$scope', '$rootScope', '$location', '$http', 'service','localStorageModel','$timeout', function ($scope, $rootScope, $location, $http, service,localStorageModel,$timeout) {
 
    let self = this;
    let serverUrl = service.serverUrl;
    self.supportingEntities = [];
    // self.currTirp = $rootScope.pathOfTirps[$rootScope.pathOfTirps.length-1];
    self.loaded = false;
    $scope.selectedRow = undefined;
    self.maxDate = service.getDateForSymbol(0)


    self.getSupportingEntities = function() {
        if ($rootScope.selcetedDataSet.entities_file_name != 'File does not exist')
          service.getEntities();
    }


    $scope.$watch('$root.entities', function() {
          if ($rootScope.entities.length == 0)
            return;
          let symbols = $rootScope.pathOfTirps[$rootScope.pathOfTirps.length-1]._TIRP__symbols;
          let symbols_str = ""
          for (var i=0; i<symbols.length; i++)
          {
            if (i <symbols.length-1)
              symbols_str += symbols[i] + "-"
            else
              symbols_str += symbols[i] 
          }
          let rels = $rootScope.pathOfTirps[$rootScope.pathOfTirps.length-1]._TIRP__rel;
          let rels_str = ""
          for (var i=0; i<rels.length; i++)
          {
            if (i <rels.length-1)
            rels_str += rels[i] + "."
          else
          rels_str += rels[i] 
          }
          let body = {
            data_set_name: $rootScope.selcetedDataSet.data_set_name,
            to_add_entities: true,
            symbols: symbols_str,
            relations: rels_str
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
        self.currTirp = path[path.length-1]
        let entities = $rootScope.entities;
        let supportingEntitiesIds = new Set(self.currTirp._TIRP__supporting_entities);
        var j = 0;
        for (var i=0; i<entities.length; i++)
        {
            let id = String(entities[i].id)
            // if (id == "200339_0")
            //   var a = 1;
            if (supportingEntitiesIds.has(id))
            {
              let md = (self.currTirp._TIRP__supporting_instances[j]._SupportingInstance__mean_duration + 1)
              if (md % 1 != 0)
                  md = md.toFixed(2)
                let supportingInstance = {
                    "id":  self.currTirp._TIRP__supporting_instances[j]._SupportingInstance__entityId,
                    "H.S": self.currTirp._TIRP__supporting_instances[j]._SupportingInstance__symbolic_intervals.length,
                    "M.D": md
                };
                var strValue = JSON.stringify(entities[i])
                let entity = JSON.parse(strValue);
                delete entity.id;
                var details = Object.assign(supportingInstance, entity)
                //var details = $.extend(supportingInstance, entity);
                self.supportingEntities.push(details);
                //max date
                symbolic_intervals = self.currTirp._TIRP__supporting_instances[j]._SupportingInstance__symbolic_intervals;
                for(var k =0; k<symbolic_intervals.length; k++)
                {
                  for( l = 0; l<symbolic_intervals[k].length; l++ )
                  {
                    let time = symbolic_intervals[k][l]._end_time+1;
                    last_date = service.getDateForSymbol(time + self.currTirp._TIRP__mean_offset_from_start);
                    if(self.maxDate < last_date )
                    {
                        self.maxDate = last_date;
                    }
                  }

                }
                // let time = self.currTirp._TIRP__supporting_instances[j]._SupportingInstance__mean_duration + self.currTirp._TIRP__supporting_instances[j]._SupportingInstance__mean_offset_from_start;
                //      last_date = service.getDateForSymbol(time);
                //     if(self.maxDate < last_date )
                //     {
                //         self.maxDate = last_date;
                //     }
                j++;

            }
                
        }
        self.loaded = true;
        // let tbl = document.getElementById("tirpEntitiesTbl");
        // tbl.style.display = "block";
        self.load();
        self.drawAvgTirp();
      }, function (response) {
                    
        alert("Something went wrong.\n" + "Please Try Again"); 
        $rootScope.location = 'Files';
        $scope.$apply(function () { $location.path('/')} );
        });
      });

    self.showInstances = function(rowData, index) {
        $scope.selectedRow = index;
        document.getElementById('presentations').innerHTML = "";
        let instance = self.currTirp._TIRP__supporting_instances[index];
                // finding max 
                let max = 0;
                for(var i =0; i<instance._SupportingInstance__symbolic_intervals.length; i++)
                {
                  for (var j=0; j< instance._SupportingInstance__symbolic_intervals[i].length; j++)
                  {
                    if (max < instance._SupportingInstance__symbolic_intervals[i][j]._end_time)
                        max = instance._SupportingInstance__symbolic_intervals[i][j]._end_time
                  }
                }
        self.drawInstanceAvgTirp(instance, max);
        title = document.createElement('H8');
        let titleText = "Instances List" + " - entity #" + instance._SupportingInstance__entityId
        var text = document.createTextNode(titleText);
        title.appendChild(text);
        document.getElementById('presentations').appendChild(title);
        instances_div = document.createElement('div');
        instances_div.setAttribute("id", "Instances");
        instances_div.classList.add("InstancesDiv");
        document.getElementById('presentations').appendChild(instances_div);
        for(var i =0; i<instance._SupportingInstance__symbolic_intervals.length; i++)
        {
            chart = document.createElement('div');
            chart.setAttribute("id", "presentation"+i);
            chart.classList.add("timeLinesEntitiesTirp");
            // chart.style.height = "180px";
            // chart.style.width = "100%";
            // chart.style.position = "relative";
            document.getElementById('Instances').appendChild(chart);
            self.drawInstance(instance._SupportingInstance__symbolic_intervals[i],"presentation"+i, max)
        }
        
    }

    // self.load = function() {
    //     document.getElementById('loader').style.display = "block";
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
    //        },
    //        "drawCallback": function( settings ) {
    //         $(".dataTables_scrollBody").width($(".dataTables_scrollHead").width());}
    //        });
    //        document.getElementById('loader').style.display = "none";
    //        let tbl = document.getElementById("tirpEntitiesTbl");
    //        tbl.style.display = "block";
    //        self.loaded = true;
    //        $('.dataTables_length').addClass('bs-select'); 
    //        //self.loaded = true;
           
           
    //     }, 0); 
           
    // }

    self.load = function(){
        $timeout(function () {
        var stdTable1 = $("#tirpEntitiesTbl").dataTable({
            //"iDisplayLength": -1,
            "bPaginate": false,
            "iCookieDuration": 60,
            "bStateSave": false,
            "bAutoWidth": false,
            "aDataSort": [[ 0, "asc" ],[ 1, "asc" ], ,[ 2, "asc" ]],
            //true
            "bScrollAutoCss": true,
            "bProcessing": true,
            "bRetrieve": true,
            "bJQueryUI": true,
            "bInfo" : false,
            //"sDom": 't',
            "sDom": '<"H"CTrf>t<"F"lip>',
            /* "aLengthMenu": [[25, 50, 100, -1], [25, 50, 100, "All"]], */
            //"sScrollY": "500px",
            //"sScrollX": "100%",
            "sScrollXInner": "110%",
            "fnInitComplete": function() {
                this.css("visibility", "visible");
                document.getElementById('loader').style.display = "block";
                let tbl = document.getElementById("tirpEntitiesTbl");
                tbl.style.display = "block";
         }
        });
        document.getElementById('loader').style.display = "block";
        let tblDiv = document.getElementById("tirpEntitiesTbl");
        tblDiv.style.display = "block";
    }, 0); 
      }

    self.drawInstanceAvgTirp = function(instance, max)
    {
        // let currTirp = $rootScope.pathOfTirps[$rootScope.pathOfTirps.length-1];
        let times = instance._SupportingInstance__mean_offset_from_first_symbol;
        let durationOfFirstInterval = instance._SupportingInstance__mean_of_first_interval;
        let offset_from_start = instance._SupportingInstance__mean_offset_from_start;
        let instanceIntervals = instance._SupportingInstance__symbolic_intervals[0];
        title = document.createElement('H8');
        let titleText = "Mean Presentation" + " - entity #" + instance._SupportingInstance__entityId
        var text = document.createTextNode(titleText);
        title.appendChild(text);
        document.getElementById('presentations').appendChild(title);
        div = document.createElement('div');
        div.setAttribute("id", "AVGPresentation");
        //div.style.height = "180px";
        document.getElementById('presentations').appendChild(div);
        // let symbols = currTirp._TIRP__symbols;
        google.charts.load('current', {'packages':['timeline']});
        google.charts.setOnLoadCallback(drawTimeLine);
        function drawTimeLine() {
            
            // var len =instanceIntervals.filter(function(val, i, arr) { 
            //     return arr.indexOf(val) === i;
            // }).length;
            // let height = (95 + (len-1) * 40) + "px";
            // if (len == 1)
            // {
            //     height = len * 95 + "px";
            // }
            // document.getElementById("AVGPresentation").style.height  = height;
            var container = document.getElementById('AVGPresentation');
            container.classList.add("timeLinesEntitiesTirp");
            var chart = new google.visualization.Timeline(container);
            var dataTable = new google.visualization.DataTable();
  
          dataTable.addColumn({ type: 'string', id: '' });
          dataTable.addColumn({ type: 'string', id: 'Duration' });
          dataTable.addColumn({ type: 'date', id: 'Start' });
          dataTable.addColumn({ type: 'date', id: 'End' });

        let data = [];
        interval = new Array();
        // insert m.duration of first interval
        interval.push(instanceIntervals[0]._symbol);
        let date1 = service.getDateForSymbol(offset_from_start);
        let date2 = service.getDateForSymbol(offset_from_start + durationOfFirstInterval);
        interval.push(instanceIntervals[0]._symbol + " - "  +service.getDiffBetweenDates(date1,date2));
        interval.push(date1);
        interval.push(date2);
        data.push(interval);
        var j = 2;
        var offset = offset_from_start + durationOfFirstInterval;
        for(var i=1; i<instanceIntervals.length; i++)
        {
            interval = new Array();
            interval.push(instanceIntervals[i]._symbol);
            date1 = service.getDateForSymbol(offset + times[j]);
            date2 = service.getDateForSymbol(offset + times[j + 1]);
            interval.push(instanceIntervals[i]._symbol + " - "  +service.getDiffBetweenDates(date1,date2));
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
                Array.prototype.forEach.call(labels, function(label) {
                    if (label.getAttribute('text-anchor') === 'middle' || label.getAttribute('font-weight') === 'bold' || label.getAttribute('fill') === '#000000') {
                    label.setAttribute('font-size', '0');
                  }
                });
              });
              // set a padding value to cover the height of title and axis values
            var paddingHeight = 50;
            // set the height to be covered by the rows
            var rowHeight = dataTable.getNumberOfRows() * 30;
            // set the total chart height
            var chartHeight = rowHeight + paddingHeight;

              chart.draw(dataTable,{
                timeline: { colorByRowLabel: true,
                  showRowLabels: false,
                    barLabelStyle: {
                        fontSize: 8
                    } },
                hAxis: {
                  minValue: service.getDateForSymbol(0),
                 maxValue: service.getDateForSymbol(max)
                //  maxValue: service.getDateForSymbol(offset_from_start + instance._SupportingInstance__mean_duration + instance._SupportingInstance__mean_offset_from_end)
                }, height: chartHeight
                });
        }
    }

    self.drawInstance = function(symbolic_intervals, elementName, max_time)
    {
        google.charts.load('current', {'packages':['timeline']});
        google.charts.setOnLoadCallback(drawTimeLine);
        function drawTimeLine() {
            // var len =symbolic_intervals.filter(function(val, i, arr) { 
            //     return arr.indexOf(val) === i;
            // }).length;
            // let height = (95 + (len-1) * 40) + "px";
            // if (len == 1)
            // {
            //     height = len * 95 + "px";
            // }
            // document.getElementById(elementName).style.height  = height;
          var container = document.getElementById(elementName);
          container.classList.add("timeLinesEntitiesTirp");
          var chart = new google.visualization.Timeline(container);
          var dataTable = new google.visualization.DataTable();
  
          dataTable.addColumn({ type: 'string', id: '' });
          dataTable.addColumn({ type: 'string', id: 'Duration' });
          dataTable.addColumn({ type: 'date', id: 'Start' });
          dataTable.addColumn({ type: 'date', id: 'End' });

        let data = [];
        for(var i=0; i<symbolic_intervals.length; i++)
        {
            interval = new Array();
            interval.push(symbolic_intervals[i]._symbol);
            let date1 = (service.getDateForSymbol(symbolic_intervals[i]._start_time));
            let date2 = (service.getDateForSymbol(symbolic_intervals[i]._end_time+1));
            interval.push(symbolic_intervals[i]._symbol + " - "  +service.getDiffBetweenDates(date1,date2));
            interval.push(date1);
            interval.push(date2);
            data.push(interval);
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
                Array.prototype.forEach.call(labels, function(label) {
                  if (label.getAttribute('text-anchor') === 'middle' || label.getAttribute('font-weight') === 'bold' || label.getAttribute('fill') === '#000000') {
                    label.setAttribute('font-size', '0');
                  }
                });
              });

            // set a padding value to cover the height of title and axis values
            //var paddingHeight = 40;
            // set the height to be covered by the rows
            var rowHeight = dataTable.getNumberOfRows() * 30;
            // set the total chart height
            var chartHeight = rowHeight + 50;


        chart.draw(dataTable,{
            timeline: { colorByRowLabel: true,
              showRowLabels: false,
                barLabelStyle: {
                    fontSize: 8
                } },
            hAxis: {
              minValue: service.getDateForSymbol(0),
             maxValue: service.getDateForSymbol(max_time)
            },
            height: chartHeight,
            width: 645
            });
        //   dataTable.addRows([
        //     [ 'Washington', new Date(1789, 3, 30), new Date(1797, 2, 4) ],
        //     [ 'Adams',      new Date(1797, 2, 4),  new Date(1801, 2, 4) ],
        //               [ 'Washington', new Date(1801, 3, 30), new Date(1809, 2, 4) ],
        //     [ 'Jefferson',  new Date(1801, 2, 4),  new Date(1809, 2, 4) ]]);
        }
    }

    self.drawAvgTirp = function()
    {
        let currTirp = $rootScope.pathOfTirps[$rootScope.pathOfTirps.length-1];
        let times = currTirp._TIRP__mean_offset_from_first_symbol;
        let offset_from_start = currTirp._TIRP__mean_offset_from_start
        let durationOfFirstInterval = currTirp._TIRP__mean_of_first_interval;
        let symbols = currTirp._TIRP__symbols;
        google.charts.load('current', {'packages':['timeline']});
        google.charts.setOnLoadCallback(drawTimeLine);
        function drawTimeLine() {
                // to expand the height of the timeLine
            //     var len = currTirp._TIRP__symbols.filter(function(val, i, arr) { 
            //     return arr.indexOf(val) === i;
            // }).length;
            // let height = (95 + (len-1) * 40) + "px";
            // if (len == 1)
            // {
            //     height = len * 95 + "px";
            // }
            // document.getElementById("tirpEntitiesTimeline").style.height  = height;
          var container = document.getElementById('tirpEntitiesTimeline');
          container.classList.add("timeLinesEntitiesTirp");
          var chart = new google.visualization.Timeline(container);
          var dataTable = new google.visualization.DataTable();
  
          dataTable.addColumn({ type: 'string', id: '' });
          dataTable.addColumn({ type: 'string', id: 'Duration' });
          dataTable.addColumn({ type: 'date', id: 'Start' });
          dataTable.addColumn({ type: 'date', id: 'End' });

        let data = [];
        interval = new Array();
        // insert m.duration of first interval
        interval.push(symbols[0]);
        let date1 = service.getDateForSymbol(offset_from_start);
        let date2 = service.getDateForSymbol(offset_from_start + durationOfFirstInterval);
        interval.push(symbols[0] + " - "  +service.getDiffBetweenDates(date1,date2));
        interval.push(date1);
        interval.push(date2);
        data.push(interval);
        var j = 2;
        var offset = offset_from_start + durationOfFirstInterval;
        for(var i=1; i<symbols.length; i++)
        {
            interval = new Array();
            interval.push(symbols[i]);
            date1 = service.getDateForSymbol(offset + times[j]);
            date2 = service.getDateForSymbol(offset + times[j + 1]);
            interval.push(symbols[i] + " - "  +service.getDiffBetweenDates(date1,date2));
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
                Array.prototype.forEach.call(labels, function(label) {
                    if (label.getAttribute('text-anchor') === 'middle' || label.getAttribute('font-weight') === 'bold' || label.getAttribute('fill') === '#000000') {
                        label.setAttribute('font-size', '0');
                  }
                });
              });

            // set the height to be covered by the rows
            var rowHeight = dataTable.getNumberOfRows() * 30;
            // set the total chart height
            var chartHeight = rowHeight + 50;
        
        chart.draw(dataTable,{
            timeline: { colorByRowLabel: true,
              showRowLabels: false,
                barLabelStyle: {
                    fontSize: 8
                } },
            hAxis: {
              minValue: service.getDateForSymbol(0),
              // maxValue: self.maxDate}
              maxValue: service.getDateForSymbol(currTirp._TIRP__mean_offset_from_start + currTirp._TIRP__mean_duration + currTirp._TIRP__mean_offset_from_end)}
            //  maxValue:  service.getDateForSymbol(offset_from_start + currTirp._TIRP__mean_duration + currTirp._TIRP__mean_offset_from_end)}
            , height:chartHeight,
            width: 645
            });

        }
    }


}]);