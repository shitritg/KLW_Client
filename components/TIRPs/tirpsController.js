angular.module('Visualization')
 .controller('tirpsController', ['$scope', '$rootScope', '$location', '$http', 'service','localStorageModel','$timeout', function ($scope, $rootScope, $location, $http, service,localStorageModel,$timeout) {
 

    let self = this;
    let serverUrl = service.serverUrl;
    self.loaded = false;
    self.loadingNextLevel = false;
    self.currentLevel = [];
    self.matrix = [];
    self.clicked = false;
    $rootScope.location = "TIRPs";


    self.initiateTirps = function () {
        // if ($rootScope.selcetedDataSet.entities_file_name != 'File does not exist')
        //     service.getEntities();
        if ($rootScope.rootElements.length == 0)
        {
            let form = new FormData();
            form.append('data_set_name', $rootScope.selcetedDataSet.data_set_name)
        
            var url = serverUrl + `initiateTirps`;
            var request = new Request(url, {
                method: 'POST',
                mode: "cors",
                // headers: {'Content-Type': 'application/json'},
                body: form,
            });
            fetch(request)
            .then(async function (response) {
                if(!response.ok)
                {
                    throw response;
                }
                else
                {
                    setTimeout(() => null, 0);
                    let jsonString=await response.text().then(s=>s);
                    let res=JSON.parse(jsonString); 
                    let arr  = res['Root'];
                    let jsons = [];
                    for(let i=0; i<arr.length; i++)
                    {

                        let tirp = JSON.parse(arr[i]);
                        if ($rootScope.selcetedDataSet.second_class_output_file_name == 'File does not exist' || tirp._TIRP__exist_in_class0)
                            jsons.push(tirp);
                        // let props = new Array();
                        // for(let j=0; j<tirp._TIRP__supporting_entities_properties.length; j++)
                        // {
                        //     props.push(JSON.parse(tirp._TIRP__supporting_entities_properties[j]));
                        // }
                        // tirp._TIRP__supporting_entities_properties = props;
                        
                    }
                    self.currentLevel = jsons;
                    //$rootScope.currentLevel = self.currentLevel;
                    $rootScope.rootElements = self.currentLevel;
                    if($rootScope.PassedFromSearch)
                    {
                        $rootScope.PassedFromSearch = false
                        for (var i =0; i<$rootScope.pathOfTirps.length-1; i++ )
                        {
                            $rootScope.pathOfTirps[i].partOfPath = true;
                        }
                        //if ($rootScope.pathOfTirps[$rootScope.pathOfTirps.length-1]._TIRP__childes.length > 0)
                         //   {
                                $rootScope.pathOfTirps[$rootScope.pathOfTirps.length-1].partOfPath = true;
                                // let childs = $rootScope.pathOfTirps[$rootScope.pathOfTirps.length-1]._TIRP__childes;
                                // childs.forEach(function(child) {
                                //     child.score = self.getScore(child); })
                        //    }
                       // else
                      //  {
                            $rootScope.pathOfTirps[$rootScope.pathOfTirps.length-1].partOfPath = false;
                      //  }

                    if($rootScope.pathOfTirps[$rootScope.pathOfTirps.length-1].partOfPath)
                        self.currentLevel = $rootScope.pathOfTirps[$rootScope.pathOfTirps.length-1]._TIRP__childes;
                    else
                    {
                        if($rootScope.pathOfTirps.length > 1)
                            self.currentLevel = $rootScope.pathOfTirps[$rootScope.pathOfTirps.length-2]._TIRP__childes;
                        else
                            self.currentLevel = $rootScope.rootElements;
                    }
                    self.loaded = true;
                    self.DrawMatrix();
                    self.drawPie();
                    self.drawAvgTirp();
                    $timeout(function () {
                        self.load(true);
                        self.loadMatrics();
                        })
                    }
                    else
                    {
                    // $timeout(function () {
                    //     self.load();
                        let firstTirp = self.currentLevel[0];
                        firstTirp.partOfPath = false;
                        // let f = $( "tr:first" )[0];
                        // if($( "tr:first" )[0].hasClass( "hasChilds" ))
                        // {
                        //     $( "tr:first" )[0].removeClass( "hasChilds" );
                        //     $( "tr:first" )[0].addClass( "hasChilds" );
                        // }
                        // $( "tr:first" )[0].addClass( "selected" );
                        // $timeout(function () {
                        //     self.load('first');
                        //     })
                        self.getSubTree(firstTirp,'first')
                    //})
                    //self.load();
                    // let t = $('#tirpsTbl').DataTable({
                    //     "dom": "fltip",
                    // //    "scrollY": "55%",
                    //    "scrollCollapse": true,
                    //    "scrollX": true,
                    //    "autoWidth": true,
                    //    retrieve: true,
                    //    paging: false,
                    //    "fnInitComplete":function(){
                    //        let tbl = document.getElementById("tirpsTbl");
                    //        tbl.style.display = "block";
                    //        //$("#statesTbl").show();
                    //    },       
                    //    "drawCallback": function( settings ) {
                    //     // $(".dataTables_scrollHeadInner").css({"width":"100%"});
                    //     // $(".table ").css({"width":"100%"});
                    //     $(".dataTables_scrollBody").width($(".dataTables_scrollHead").width());
                    //    }
                    //    });
                    //    $('.dataTables_length').addClass('bs-select'); 
                       //t.fnAdjustColumnSizing();
                    //    self.loaded = true;
                }
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
                $rootScope.location = 'Files';
                return;
            });   
        }
        else
        {
            if($rootScope.pathOfTirps.length == 0)
            {
                self.currentLevel = $rootScope.rootElements;
                self.load('first');
                $timeout(function () {
                let firstTirp = self.getFirstTirpFromTable();
                firstTirp.partOfPath = false;
                self.getSubTree(firstTirp)                
                    })
            }
            else
            {
                // if ($rootScope.pathOfTirps.length>=1)
                //     {
                //         $rootScope.pathOfTirps = $rootScope.pathOfTirps.slice(0, $rootScope.pathOfTirps.length-1);
                //         self.currentLevel = $rootScope.pathOfTirps[$rootScope.pathOfTirps.length-1]._TIRP__childes;
                //     }
                //     else
                //     {
                //         self.currentLevel = $rootScope.rootElements;
                //     }
                // let firstTirp = self.currentLevel[0];
                // firstTirp.partOfPath = false;
                // $timeout(function () {
                //     self.load();
                //     })
                //self.getSubTree($rootScope.pathOfTirps[$rootScope.pathOfTirps.length-1])
            
            
        //     $timeout(function () {
        //     self.load();
        //     if($rootScope.pathOfTirps.length > 0)
        //     {
        //         self.DrawMatrix();
        //         self.drawPie();
        //         self.drawAvgTirp();
        //     }
        // })
        if($rootScope.PassedFromSearch)
        {
            $rootScope.PassedFromSearch = false
            for (var i =0; i<$rootScope.pathOfTirps.length-1; i++ )
            {
                $rootScope.pathOfTirps[i].partOfPath = true;
            }
           // if ($rootScope.pathOfTirps[$rootScope.pathOfTirps.length-1]._TIRP__childes.length > 0)
         //       {
            //        $rootScope.pathOfTirps[$rootScope.pathOfTirps.length-1].partOfPath = true;
         //       }
        //    else
       //     {
                $rootScope.pathOfTirps[$rootScope.pathOfTirps.length-1].partOfPath = false;
      //      }

        }
        if($rootScope.pathOfTirps[$rootScope.pathOfTirps.length-1].partOfPath)
            self.currentLevel = $rootScope.pathOfTirps[$rootScope.pathOfTirps.length-1]._TIRP__childes;
        else
        {
            if($rootScope.pathOfTirps.length > 1)
                self.currentLevel = $rootScope.pathOfTirps[$rootScope.pathOfTirps.length-2]._TIRP__childes;
            else
                self.currentLevel = $rootScope.rootElements;
        }
        self.loaded = true;
        self.DrawMatrix();
        self.drawPie();
        self.drawAvgTirp();
        $timeout(function () {
            self.load(true);
            self.loadMatrics();
            })
        }
    }
    }


    self.getFirstTirpFromTable = function(){
        if (self.currentLevel.length == 0)
            return undefined;
        let symbol = ""
        let rel = ""
        for( var i = 0; i<self.currentLevel.length; i++)
        {
            var rowTr = $('#tirpsTbl').dataTable().fnGetNodes( i );
            if (rowTr.rowIndex == 1)
            {
                rel = rowTr.childNodes[1].innerText.trim();
                symbol = rowTr.childNodes[2].innerText.trim();
                break;
            }
        }

        for (tirp in self.currentLevel)
        {
            let rel2 = self.getRel(self.currentLevel[tirp]);
            let sym2 = self.getSymbol(self.currentLevel[tirp]);
            if (sym2 == symbol && rel2 == rel)
                return self.currentLevel[tirp];
        }
    }

    self.getSubTree = function(tirp,index, toLoad) {
        if($rootScope.pathOfTirps.length > 0 && !$rootScope.pathOfTirps[$rootScope.pathOfTirps.length-1].partOfPath)
        {
            $rootScope.pathOfTirps = $rootScope.pathOfTirps.slice(0, $rootScope.pathOfTirps.length-1);
        }
        $rootScope.pathOfTirps.push(tirp);   
        if($rootScope.pathOfTirps.length == 1)
        {
            if(tirp.partOfPath)
            {
                self.loadingNextLevel = true;
                document.getElementById("NextLevelLoader").style.display = "block";
                document.getElementById("tirpsTblDiv").style.display = "none";
            
                let body = {
                    data_set_name: $rootScope.selcetedDataSet.data_set_name,
                    TIRP: tirp._TIRP__symbols[0]
                }
                $http.post(serverUrl + "getSubTree", body)
                    .then(function (response) {
                        let parsed_tirp = response.data['TIRPs'];
                        let tirpWithChilds = JSON.parse(parsed_tirp);
                        let class0Childs = []
                        for (var i=0; i<tirpWithChilds._TIRP__childes.length; i++)
                        {
                            if (tirpWithChilds._TIRP__childes[i]._TIRP__exist_in_class0)
                            {
                                class0Childs.push(tirpWithChilds._TIRP__childes[i]);
                            }
                        }
                        tirpWithChilds._TIRP__childes = class0Childs;
                        let childs = tirpWithChilds._TIRP__childes;
                        self.loadingNextLevel = false;
                        tirpWithChilds.partOfPath = tirp.partOfPath;
                        $rootScope.pathOfTirps[0] = tirpWithChilds;
                                self.currentLevel = childs;
                                $timeout(function(){
                                    $scope.$apply();
                                    self.loadMatrics();
                                    self.drawAvgTirp();
                                    self.drawPie();
                                    self.DrawMatrix();
                                    self.load(index);
                                    })
                        
                }, function (response) {
                    
                    alert("Something went wrong.\n" + "Please Try Again"); 
                    $rootScope.location = 'Files';
                    $scope.$apply(function () { $location.path('/')} );
                    });
                }
                else
                {
                    $timeout(function(){
                        $scope.$apply();
                        self.loadMatrics();
                        self.drawAvgTirp();
                        self.drawPie();
                        self.DrawMatrix();
                        if($rootScope.pathOfTirps.length == 1 && index == undefined)
                            self.load('first');
                        else
                            if (!toLoad)
                                self.load(index);
                        })
                }

        }
        else
        {
            let class0Childs = []
            for (var i=0; i<tirp._TIRP__childes.length; i++)
            {
                if (tirp._TIRP__childes[i]._TIRP__exist_in_class0)
                {
                    class0Childs.push(tirp._TIRP__childes[i]);
                }
            }
            tirp._TIRP__childes = class0Childs;
            if(tirp.partOfPath)
            {
                self.currentLevel = tirp._TIRP__childes;
            }


            $timeout(function () {
                self.DrawMatrix();
                self.drawAvgTirp();
                self.drawPie();
                // if($rootScope.pathOfTirps.length == 1 && !tirp.partOfPath)
                //     self.load('first');
                // else
                if (!toLoad)
                    self.load(index);
                })
        }
        

    }

    self.loadCompleted = function(){
        self.loaded = true;
        document.getElementById('loader').style.display = "none";
}

        self.goDown = function(tirp) {
                tirpCopy = Object.assign({}, tirp);
                if (tirpCopy._TIRP__childes.length > 0)
                    tirpCopy.partOfPath = true;
                else
                    tirpCopy.partOfPath = false;
                self.getSubTree(tirpCopy)
        }

         $('#tirpsTbl tbody').on('click', 'tr', function( e ) { 

            $('table > tbody  > tr').removeClass( "selected" );
            if($(this).hasClass( "hasChilds" ))
            {
                $(this).removeClass( "hasChilds" );
                $(this).addClass( "hasChilds" );
            }
            $(this).addClass( "selected" );
            let rel = $(this).find("td:eq(1)").text().trim();
            let sym = $(this).find("td:eq(2)").text().trim();
            let vs = $(this).find("td:eq(3)").text().trim();
            let mhs = $(this).find("td:eq(4)").text().trim();
            let mmd = $(this).find("td:eq(5)").text().trim();
            for (tirp in self.currentLevel)
            {
                let rel2 = self.getRel(self.currentLevel[tirp]);
                let sym2 = self.getSymbol(self.currentLevel[tirp]);
                let vs2 = ((self.currentLevel[tirp]._TIRP__vertical_support/$rootScope.selcetedDataSet.num_of_entities).toFixed(2)*100).toFixed(0) + "%"
                let mhs2 = self.currentLevel[tirp]._TIRP__mean_horizontal_support
                let mmd2 = self.currentLevel[tirp]._TIRP__mean_duration
                if (rel2 == rel &&  sym2 == sym && vs2 == vs && mhs2 == mhs && mmd2 == mmd)
                {
                    tirp_obj = self.currentLevel[tirp];
                    if (e.target.nodeName == "BUTTON" || e.target.nodeName == "I")
                    {
                        self.goDown(tirp_obj);
                        return;
                    }
                    tirp_obj.partOfPath = false;
                    self.getSubTree(tirp_obj,true, true)
                    return;
                }
            }
        })
        
        
    self.getRel = function(tirp) {
        if (tirp == undefined)
            return ""; 
        if (tirp._TIRP__rel.length == 0)
        {
            return '-'
        }
        if ( tirp._TIRP__rel[tirp._TIRP__rel.length -1] == "finished by")
            return "finish-by"
        return tirp._TIRP__rel[tirp._TIRP__rel.length -1];
    }

    self.getSymbol = function(tirp) {
        if (tirp == undefined)
        return ""; 
        return (tirp._TIRP__symbols[tirp._TIRP__symbols.length -1]);
    }

    self.goToRoot = function() {
        $rootScope.pathOfTirps = [];
        self.initiateTirps()
    }

    self.getLevel = function(tirp, index) {
        if (index <  $rootScope.pathOfTirps.length-1)
        {
            $rootScope.pathOfTirps = $rootScope.pathOfTirps .slice(0, index+2);
            $rootScope.pathOfTirps[$rootScope.pathOfTirps.length-1].partOfPath = false
            if($rootScope.pathOfTirps.length > 1)
                self.currentLevel = $rootScope.pathOfTirps[$rootScope.pathOfTirps.length-2]._TIRP__childes;
            else
                 self.currentLevel = $rootScope.rootElements;
            self.DrawMatrix();
            self.drawPie();
            self.drawAvgTirp();
            $timeout(function () {
                self.load(true);
                self.loadMatrics();
                })
            }
    }

    $scope.is_highlight = function(tirp) {
        if (tirp == undefined)
        return false;
        else
        {
            if (tirp._TIRP__childes.length == 0 || !self.has_childs_class_0(tirp._TIRP__childes))
                return false;
            else
            {
                return true;
            }
        }
      };

      self.has_childs_class_0 = function(childs)
      {
        if (childs[0] == true)
            return true;
        for (var i=0; i<childs.length; i++)
        {
            if (childs[i]._TIRP__exist_in_class0)
                return true;
        }
        return false;
      }

      $scope.initSelect = function()
      {
          let val = document.getElementById("selectProperty").value;
          if (val == "? object:null ?" || val == "Properties Distribution")
          {
              document.getElementById("selectProperty").value = "Properties Distribution"
              $scope.selectedProperty = "Properties Distribution";
          }
          else
          {
            let v = $rootScope.pathOfTirps[$rootScope.pathOfTirps.length-1]._TIRP__supporting_entities_properties
          }
          return true;
      };



      self.load = function(index){
        $timeout(function () {
        let stdTable1 = $("#tirpsTbl").dataTable({
        "bPaginate": false,
        "bFilter": false,
        "aaSorting": [[ 2, "asc" ]],
         "bRetrieve": true,
        "bInfo" : false,
        "aoColumns": [
            {
                "mData": null,
                "bSortable": false,
                "mRender": function(data, type, full) {
                    return '<button class="goDown"></button>'

                }},
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
            "mData": 4
          }],
        "fnInitComplete": function() {
            //this.css("visibility", "visible");
            let tbl = document.getElementById("tirpsTbl");
            tbl.style.display = "block";
            let tblDiv = document.getElementById("tirpsTblDiv");
            tblDiv.style.display = "block";
     },
     "drawCallback": function( settings ) {
        $(".dataTables_scrollBody").width($(".dataTables_scrollHead").width());
     }
    });
    $('.dataTables_length').addClass('bs-select');
    stdTable1.fnClearTable();
    let rows = []
    self.currentLevel.forEach(function(tirp) { //insert rows
        // var button = document.createElement('button');
        // button.onclick = self.goDown(tirp);
        rows.push([self.getRel(tirp), self.getSymbol(tirp), ((tirp._TIRP__vertical_support/$rootScope.selcetedDataSet.num_of_entities).toFixed(2)*100).toFixed(0) + "%", tirp._TIRP__mean_horizontal_support, tirp._TIRP__mean_duration])
      })
      if (rows.length > 0)
      {
      var rowIdxes =$('#tirpsTbl').dataTable().fnAddData(rows);
      for (var i=0; i<rowIdxes.length; i++)
      {
        for (tirp in self.currentLevel)
        {
            let rel2 = self.getRel(self.currentLevel[tirp]);
            let sym2 = self.getSymbol(self.currentLevel[tirp]);
            let vs2 = ((self.currentLevel[tirp]._TIRP__vertical_support/$rootScope.selcetedDataSet.num_of_entities).toFixed(2)*100).toFixed(0) + "%"
            let mhs2 = self.currentLevel[tirp]._TIRP__mean_horizontal_support
            let mmd2 = self.currentLevel[tirp]._TIRP__mean_duration
            if (rel2 == rows[i][0] &&  sym2 == rows[i][1] && vs2 == rows[i][2] && mhs2 == rows[i][3] && mmd2 == rows[i][4])
            {
                var rowTr = $('#tirpsTbl').dataTable().fnGetNodes( rowIdxes[i] );
                if($scope.is_highlight(self.currentLevel[tirp]))
                {
                    //if (!$(rowTr).hasClass( "selected" ))
                        $(rowTr).addClass('hasChilds');
                }
                else
                {
                    let td = rowTr.firstElementChild;
                    let btn = td.firstChild;
                    btn.disabled = true;
                    // btn.hidden = true;
                }
                if (index== true)
                {
                    let lastTirp = $rootScope.pathOfTirps[$rootScope.pathOfTirps.length-1];
                    if (self.getRel(lastTirp) == rel2 && self.getSymbol(lastTirp) == sym2 && ((lastTirp._TIRP__vertical_support/$rootScope.selcetedDataSet.num_of_entities).toFixed(2)*100).toFixed(0) + "%" && lastTirp._TIRP__mean_horizontal_support == mhs2 && lastTirp._TIRP__mean_duration == mmd2)
                    {
                        $(rowTr).addClass( "selected" );
                    }
                }
                else if(index == 'first')
                {
                    if (rowTr.rowIndex == 1)
                    $(rowTr).addClass( "selected" );
                }
                break;
            }
        }
          
    }
      }
      let tblDiv = document.getElementById("tirpsTblDiv");
      tblDiv.style.display = "block";
      if(self.currentLevel[0]._TIRP__symbols.length == 1)
        $rootScope.level = 'Root'
      else
        $rootScope.level = self.currentLevel[0]._TIRP__symbols.length 
      self.loadCompleted();
    })
}


      self.loadMatrics = function(){
        var stdTable2 = $("#currTirpTbl").dataTable({
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
            "bFilter": false,
            "aoColumns": [
                {
                    "sWidth": "35%",
                "mData": 0
              }, {
                "sWidth": "65%",
                "mData": 1
              }],
            //"sDom": 't',
            "sDom": '<"H"CTrf>t<"F"lip>',
            /* "aLengthMenu": [[25, 50, 100, -1], [25, 50, 100, "All"]], */
            //"sScrollY": "500px",
            //"sScrollX": "100%",
            "sScrollXInner": "110%",
            "fnInitComplete": function() {
                this.css("visibility", "visible");
                let tbl = document.getElementById("currTirpTbl");
                tbl.style.display = "block";
                let tblDiv = document.getElementById("currTirpTblDiv");
                tblDiv.style.display = "block";
         }
        });
        let tblDiv = document.getElementById("currTirpTblDiv");
        tblDiv.style.display = "block";
      }


    self.DrawMatrix = function() {
        let currTirp = $rootScope.pathOfTirps[$rootScope.pathOfTirps.length-1];
        let symbols = currTirp._TIRP__symbols;
        let relations = currTirp._TIRP__rel;
        let matrix = new Array(symbols.length);
        let iterations = 1;
        let relIndex = 0;
        let num = 1;
        for (var i = 0; i < matrix.length; i++) { 
            matrix[i] = new Array(); 
            // num = num + 1 ;
        } 
        matrix[0] = symbols.slice(1,symbols.length+1)
        matrix[0].unshift("");
        cols = symbols.slice(0,symbols.length-1)
        for(var i=1; i< cols.length+1;i++)
        {
            matrix[i][0] = cols[i-1];
        }
        //matrix[0][1].unshift("");
        for(var i=1; i< symbols.length; i++)
        {
            for (var j=1; j<iterations+1; j++)
            {
                matrix[j][i] = relations[relIndex].substring(0, 1);;;
                relIndex = relIndex + 1;
            }
            iterations = iterations + 1;
        }
        self.matrix = matrix;
        
    }

    self.showMatrix = function()
    {
        if ($rootScope.pathOfTirps.length > 1)
            $('#myModal').modal();
    }

    $scope.has_content = function (cell_content) {
        if (cell_content == undefined)
            return false;
        else {
            if (cell_content == '' )
                return false;
            else {
                if (cell_content.length == 1)
                    return true;
            }
            return false;
        }
    };

    self.drawPie = function()
    {
    if($scope.selectedProperty != undefined && $scope.selectedProperty != null && $scope.selectedProperty != "Properties Distribution")
    {
     let currTirp = $rootScope.pathOfTirps[$rootScope.pathOfTirps.length-1];
     let properties = currTirp._TIRP__supporting_entities_properties[$scope.selectedProperty];
     google.charts.load("current", {packages:["corechart"]});
      google.charts.setOnLoadCallback(drawChart);
      function drawChart() {
        var propertiesAsArray = [['Property', 'Value']];
        for (var i=0; i<properties.length; i++)
        {
            let b = Object.entries(properties[i])
            let c = b[0];
            propertiesAsArray.push([c[0],parseInt(c[1])]);

        }
        var data = google.visualization.arrayToDataTable(propertiesAsArray);


        var options = {
        //   title: $scope.selectedProperty,
        //   'titleTextStyle': {
        //     fontSize: 18,
        //     bold:true,
        //     italic:false
        // },
        'width':'100%',
        'height':'100%',
        backgroundColor: 'transparent',
          is3D: true,
        };

        var chart = new google.visualization.PieChart(document.getElementById('piechart_entitiesProperties'));
        chart.draw(data, options);
      }
    }
    }

    self.drawAvgTirp = function()
    {
        let currTirp = $rootScope.pathOfTirps[$rootScope.pathOfTirps.length-1];
        let times = currTirp._TIRP__mean_offset_from_first_symbol;
        let durationOfFirstInterval = currTirp._TIRP__mean_of_first_interval;
        let symbols = currTirp._TIRP__symbols;
        google.charts.load('current', {'packages':['timeline']});
        google.charts.setOnLoadCallback(drawTimeLine);
        function drawTimeLine() {
                // to expand the height of the timeLine
                var len = currTirp._TIRP__symbols.filter(function(val, i, arr) { 
                return arr.indexOf(val) === i;
            }).length;
            // let height = (95 + (len-1) * 40) + "px";
            // if (len == 1)
            // {
            //     height = len * 95 + "px";
            // }
            // document.getElementById("timeline").style.height  = height;
          var container = document.getElementById('timeline');
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
        let date1 = service.getDateForSymbol(0);
        let date2 = service.getDateForSymbol(durationOfFirstInterval);
        interval.push(symbols[0]+ " - " + service.getDiffBetweenDates(date1,date2));
        interval.push(date1);
        interval.push(date2);
        data.push(interval);
        var j = 2;
        var offset = durationOfFirstInterval;
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
                    else
                    {
                        label.setAttribute('font-size', '12');
                    }
                });
              });

            // set the height to be covered by the rows
            var rowHeight = dataTable.getNumberOfRows() * 30;
            // set the total chart height
            var chartHeight = rowHeight + 70;

        
        chart.draw(dataTable,{
            timeline: { colorByRowLabel: true,
                showRowLabels: false,
                barLabelStyle: {
                    fontSize: 9
                } },
            hAxis: {
              minValue: new Date(1900, 1, 1)//,
            },
            height:chartHeight
            //width: 645
            });

        }
    }


}]);