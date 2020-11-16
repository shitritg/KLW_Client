angular.module('Visualization')
    .controller('predictiveTIRPsController', ['$scope', '$rootScope', '$location', '$http', 'service', 'localStorageModel', '$rootScope','$timeout', function ($scope, $rootScope, $location, $http, service, localStorageModel, $rootScope,$timeout) {

        let self = this;
        let serverUrl = service.serverUrl;
        self.loaded = false;
        self.loadingNextLevel = false;
        //self.chartsLoaded = false;
        self.currentLevel = [];
        self.matrix = [];
        self.isPredictive = true;
        $rootScope.location = "predictive TIRPs";
        

        // define(['Modernizr'], function(Modernizr) {
        //     Modernizr.addTest('passiveeventlisteners', function() {
        //       var supportsPassiveOption = false;
        //     })})

        // addEventListener(document, "touchstart", function(e) {
        //     console.log(e.defaultPrevented);  // will be false
        //     e.preventDefault();   // does nothing since the listener is passive
        //     console.log(e.defaultPrevented);  // still false
        //   }, Modernizr.passiveeventlisteners ? {passive: true} : false);

        self.initiateTirps = function () {
            //if ($rootScope.selcetedDataSet.entities_file_name != 'File does not exist')
                //service.getEntities();
            if ($rootScope.ptirpsRootElements.length == 0)
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
                        let jsonString=await response.text().then(s=>s);
                        let res=JSON.parse(jsonString); 
                        let arr  = res['Root'];
                        let jsons = [];
                        for(let i=0; i<arr.length; i++)
                        {
    
                            let tirp = JSON.parse(arr[i]);
                            tirp.score = self.getScore(tirp);
                            // let props = new Array();
                            // for(let j=0; j<tirp._TIRP__supporting_entities_properties.length; j++)
                            // {
                            //     props.push(JSON.parse(tirp._TIRP__supporting_entities_properties[j]));
                            // }
                            // tirp._TIRP__supporting_entities_properties = props;
                            jsons.push(tirp);
                        }
                        self.currentLevel = jsons;
                        self.currentLevel.forEach(function(child) {
                            child.score = self.getScore(child);})
                        //$rootScope.currentLevel = self.currentLevel;
                        $rootScope.ptirpsRootElements = self.currentLevel;
                        if($rootScope.PassedFromPSearch)
                        {
                            $rootScope.PassedFromPSearch = false
                            for (var i =0; i<$rootScope.ptirpsPathOfTirps.length-1; i++ )
                            {
                                $rootScope.ptirpsPathOfTirps[i].partOfPath = true;
                            }
                        //    if ($rootScope.ptirpsPathOfTirps[$rootScope.ptirpsPathOfTirps.length-1]._TIRP__childes.length > 0)
                           //     {
                         //          $rootScope.ptirpsPathOfTirps[$rootScope.ptirpsPathOfTirps.length-1].partOfPath = true;
                                    // let childs = $rootScope.ptirpsPathOfTirps[$rootScope.ptirpsPathOfTirps.length-1]._TIRP__childes;
                                    // childs.forEach(function(child) {
                                    //     child.score = self.getScore(child); })
                        //        }
                         //   else
                       //     {
                                $rootScope.ptirpsPathOfTirps[$rootScope.ptirpsPathOfTirps.length-1].partOfPath = false;
                     //       }
    
                        if($rootScope.ptirpsPathOfTirps[$rootScope.ptirpsPathOfTirps.length-1].partOfPath)
                            self.currentLevel = $rootScope.ptirpsPathOfTirps[$rootScope.ptirpsPathOfTirps.length-1]._TIRP__childes;
                        else
                        {
                            if($rootScope.ptirpsPathOfTirps.length > 1)
                                self.currentLevel = $rootScope.ptirpsPathOfTirps[$rootScope.ptirpsPathOfTirps.length-2]._TIRP__childes;
                            else
                                self.currentLevel = $rootScope.ptirpsRootElements;
                        }
                        self.currentLevel.forEach(function(child) {
                            child.score = self.getScore(child);})
                        self.loaded = true;
                        self.DrawMatrix();
                        self.drawPie();
                        self.drawAvgTirp();
                        self.drawVS();
                        self.drawMHS();
                        self.drawMMD();
                        $timeout(function () {
                            self.load(true);
                            self.loadMatrics();
                            })
                            document.getElementById("weight1").value = $rootScope.weights[0];
                            $scope.weight1 = $rootScope.weights[0];
                            document.getElementById("weight2").value = $rootScope.weights[1];
                            $scope.weight2 = $rootScope.weights[1];
                            document.getElementById("weight3").value = $rootScope.weights[2];
                            $scope.weight3 = $rootScope.weights[2];
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
                        }
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
                })
                .catch(async (response)=> {
                    //error   
                    try{
                    msg= await response.json()
                    } catch(e){
                        msg={errMsg:'Internal Error'};
                    }
                    alert("Something went wrong.\n"+ msg.errMsg+ "\nPlease Try Again") 
                    $rootScope.location = 'Files';
                    $scope.$apply(function () { $location.path('/')} );
                    return;
                });   
            }
            else
            {
                if($rootScope.ptirpsPathOfTirps.length == 0)
                {
                    self.currentLevel = $rootScope.ptirpsRootElements;
                    self.currentLevel.forEach(function(child) {
                        child.score = self.getScore(child);})
                    self.load('first');
                    $timeout(function () {
                    let firstTirp = self.getFirstTirpFromTable();
                    firstTirp.partOfPath = false;
                    self.getSubTree(firstTirp, 'first')                
                        })
                }
                else
                {
                    if($rootScope.PassedFromPSearch)
                    {
                        $rootScope.PassedFromPSearch = false
                        for (var i =0; i<$rootScope.ptirpsPathOfTirps.length-1; i++ )
                        {
                            $rootScope.ptirpsPathOfTirps[i].partOfPath = true;
                        }
                        // if ($rootScope.ptirpsPathOfTirps[$rootScope.ptirpsPathOfTirps.length-1]._TIRP__childes.length > 0)
                        //     {
                        //         $rootScope.ptirpsPathOfTirps[$rootScope.ptirpsPathOfTirps.length-1].partOfPath = true;
                        //     }
                        // else
                        // {
                            $rootScope.ptirpsPathOfTirps[$rootScope.ptirpsPathOfTirps.length-1].partOfPath = false;
                       // }

                    }
                    if($rootScope.ptirpsPathOfTirps[$rootScope.ptirpsPathOfTirps.length-1].partOfPath)
                        self.currentLevel = $rootScope.ptirpsPathOfTirps[$rootScope.ptirpsPathOfTirps.length-1]._TIRP__childes;
                    else
                    {
                        if($rootScope.ptirpsPathOfTirps.length > 1)
                            self.currentLevel = $rootScope.ptirpsPathOfTirps[$rootScope.ptirpsPathOfTirps.length-2]._TIRP__childes;
                        else
                            self.currentLevel = $rootScope.ptirpsRootElements;
                    }
                    self.currentLevel.forEach(function(child) {
                        child.score = self.getScore(child);})
                    self.loaded = true;
                    self.DrawMatrix();
                    self.drawPie();
                    self.drawAvgTirp();
                    self.drawVS();
                    self.drawMHS();
                    self.drawMMD();
                    $timeout(function () {
                        self.load(true);
                        self.loadMatrics();
                        })
                }
            }
            //$timeout(function () {
            document.getElementById("weight1").value = $rootScope.weights[0];
            $scope.weight1 = $rootScope.weights[0];
            document.getElementById("weight2").value = $rootScope.weights[1];
            $scope.weight2 = $rootScope.weights[1];
            document.getElementById("weight3").value = $rootScope.weights[2];
            $scope.weight3 = $rootScope.weights[2];//})
            // document.getElementById("selectProperty").value = "Select a Property"
            // $scope.selectedProperty = "Select a Property";

        }


        

        self.getFirstTirpFromTable = function(){
            if (self.currentLevel.length == 0)
                return undefined;
            let symbol = ""
            let rel = ""
            for( var i = 0; i<self.currentLevel.length; i++)
            {
                var rowTr = $('#ptirpsTbl').dataTable().fnGetNodes( i );
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
            // headers.append('Content-Type', 'application/json');
            // headers.append('data_set_name',  $rootScope.selcetedDataSet.data_set_name)
            // headers.append('TIRP',  tirp)
            if($rootScope.ptirpsPathOfTirps.length > 0 && !$rootScope.ptirpsPathOfTirps[$rootScope.ptirpsPathOfTirps.length-1].partOfPath)
            {
                $rootScope.ptirpsPathOfTirps = $rootScope.ptirpsPathOfTirps.slice(0, $rootScope.ptirpsPathOfTirps.length-1);
            }
            $rootScope.ptirpsPathOfTirps.push(tirp);   
            if($rootScope.ptirpsPathOfTirps.length == 1)
            {
                if(tirp.partOfPath)
                {
                    self.loadingNextLevel = true;
                    document.getElementById("NextLevelLoader").style.display = "block";
                    document.getElementById("ptirpsTblDiv").style.display = "none";
                
                //let lodedTirpWithChilds = $rootScope.ptirpsRootElementsWithChilds.get(tirp._TIRP__unique_name);
                //if( lodedTirpWithChilds == undefined)
                //{
                    let body = {
                        data_set_name: $rootScope.selcetedDataSet.data_set_name,
                        TIRP: tirp._TIRP__symbols[0]
                    }
                    $http.post(serverUrl + "getSubTree", body)
                        .then(function (response) {
                            // let arr  = response.data['TIRPs'];
                            // let jsons = [];
                            // for(let i=0; i<arr.length; i++)
                            // {
                            //     jsons.push(JSON.parse(arr[i]));
                            // }
                            // self.currentLevel = jsons;
                            let parsed_tirp = response.data['TIRPs'];
                            let a = parsed_tirp[0].includes('_TIRP__tirp_size": 4')
                            let tirpWithChilds = JSON.parse(parsed_tirp);
                            // $rootScope.ptirpsRootElementsWithChilds[tirpWithChilds._TIRP__unique_name] = tirpWithChilds;
                            let childs = tirpWithChilds._TIRP__childes;
                            childs.forEach(function(child) {
                                child.score = self.getScore(child); })
                            self.loadingNextLevel = false;
                            tirpWithChilds.partOfPath = tirp.partOfPath;
                            $rootScope.ptirpsPathOfTirps[0] = tirpWithChilds;
                            //$scope.$apply();

                            //$scope.$apply();
                                //if(tirp.partOfPath)
                               // {
                                    self.currentLevel = childs;
                                    self.currentLevel.forEach(function(child) {
                                        child.score = self.getScore(child);})
                                    $timeout(function(){
                                        $scope.$apply();
                                        self.loadMatrics();
                                        self.drawAvgTirp();
                                        self.drawVS();
                                        self.drawMHS();
                                        self.drawMMD();
                                        self.drawPie();
                                        self.DrawMatrix();
                                        self.load(index);
                                        //self.loadCompleted();
                                        
                                        })
                                //    self.load(index);
                                //    $timeout(function(){
                                    //let firstTirp = self.getFirstTirpFromTable();
                                    // if (firstTirp != undefined)
                                    // {
                                    //     firstTirp.partOfPath = false;
                                    //     $rootScope.ptirpsPathOfTirps.push(firstTirp);  
                                    // }
                                    // $timeout(function(){
                                    //     self.load(index);
                                    // })
                         //       })
                            //    }

    
                           
                            // document.getElementById("tirpsTblDiv").style.display = "block";
                            
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
                            self.drawVS();
                            self.drawMHS();
                            self.drawMMD();
                            self.drawPie();
                            self.DrawMatrix();
                            if (!toLoad)
                                self.load(index);
                            //self.loadCompleted();
                            
                            })
                    }

                //}
                // else
                // {
                    
                //     self.currentLevel = lodedTirpWithChilds._TIRP__childes;
                //     $rootScope.ptirpsPathOfTirps[0] = lodedTirpWithChilds;
                // }
    
            }
            else
            {
                if(tirp.partOfPath)
                {
                    let childs = tirp._TIRP__childes;
                    childs.forEach(function(child) {
                        child.score = self.getScore(child); })
                    self.currentLevel = childs;
                    // self.load();
                    // $timeout(function(){
                    // let firstTirp = self.getFirstTirpFromTable();
                    // if (firstTirp != undefined)
                    // {
                    //     firstTirp.partOfPath = false;
                    //     $rootScope.ptirpsPathOfTirps.push(firstTirp);  
                    // }
                    // $timeout(function () {
                    //     self.DrawMatrix();
                    //     self.drawAvgTirp();
                    //     self.drawVS();
                    //     self.drawMHS();
                    //     self.drawMMD();
                    //     self.drawPie();
                    //     self.load(index);
                    //     })
                  //  })
                }
    
                //$( "#tirpsTbl" ).load( "tirps.html #tirpsTbl" );
                //$('#tirpsTbl').dataTable().fnClearTable();
                //$('#tirpsTbl').dataTable().fnAddData(self.currentLevel);
    
                $timeout(function(){
                self.loadMatrics();
                self.DrawMatrix();
                self.drawAvgTirp();
                self.drawVS();
                self.drawMHS();
                self.drawMMD();
                self.drawPie();
                if (!toLoad)
                    self.load(index);})
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

        $('#ptirpsTbl tbody').on('click', 'tr', function( e ) { 

            // let a = this;
            // let text = $(this).text();
            // let ind = this.rowIndex;
            // let tirp = self.currentLevel[ind];
            // alert($(this).children("td").html());
            $('table > tbody  > tr').removeClass( "selected" );
            if($(this).hasClass( "hasChilds" ))
            {
                $(this).removeClass( "hasChilds" );
                $(this).addClass( "hasChilds" );
            }
            $(this).addClass( "selected" );
            // $(this).addClass( "hasChilds" );
            let rel = $(this).find("td:eq(1)").text().trim();
            let sym = $(this).find("td:eq(2)").text().trim();
            let score = $(this).find("td:eq(3)").text().trim();
            for (tirp in self.currentLevel)
            {
                let rel2 = self.getRel(self.currentLevel[tirp]);
                let sym2 = self.getSymbol(self.currentLevel[tirp]);
                let score2 = self.getScore(self.currentLevel[tirp])
                if (rel2 == rel &&  sym2 == sym && score == score2)
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

        self.getRel = function (tirp) {
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

        self.getSymbol = function (tirp) {
            if (tirp == undefined)
                return "";
            return tirp._TIRP__symbols[tirp._TIRP__symbols.length - 1];
        }

        self.getVS0 = function(tirp)
        {
            if (tirp == undefined)
                return "";
            if (!tirp._TIRP__exist_in_class0)
                return "-<" + ($rootScope.selcetedDataSet.min_ver_support*100).toFixed(0) +"%"
            return (tirp._TIRP__vertical_support/$rootScope.selcetedDataSet.num_of_entities*100).toFixed(0) + "%"
        }

        self.getVSClass1 = function (tirp) {
            if (tirp == undefined)
                return "";
            if (tirp._TIRP__exist_in_class1 || !tirp._TIRP__exist_in_class0)
           
                return  ((tirp._TIRP__vertical_support_class_1/$rootScope.selcetedDataSet.num_of_entities_class_1).toFixed(2)*100).toFixed(0) + "%";
            else
                return "-<" + (($rootScope.selcetedDataSet.min_ver_support).toFixed(2)*100).toFixed(0) + "%";
            //return Math.round(tirp._TIRP__vertical_support_class_1*$rootScope.selcetedDataSet.num_of_entities) + "("+ tirp._TIRP__vertical_support_class_1 + "%)"
        }

        self.getAmountInstancesClass0 = function (tirp) {
            if (tirp == undefined)
                return "";
            if (tirp._TIRP__exist_in_class0)
           
                return  tirp._TIRP__vertical_support
            else
                return "<" + ($rootScope.selcetedDataSet.min_ver_support*$rootScope.selcetedDataSet.num_of_entities).toFixed(0);
            //return Math.round(tirp._TIRP__vertical_support_class_1*$rootScope.selcetedDataSet.num_of_entities) + "("+ tirp._TIRP__vertical_support_class_1 + "%)"
        }

        self.getAmountInstancesClass1 = function (tirp) {
            if (tirp == undefined)
                return "";
            if (tirp._TIRP__exist_in_class1 || !tirp._TIRP__exist_in_class0)
           
                return  tirp._TIRP__vertical_support_class_1
            else
                return "<" + ($rootScope.selcetedDataSet.min_ver_support*$rootScope.selcetedDataSet.num_of_entities_class_1).toFixed(0);
            //return Math.round(tirp._TIRP__vertical_support_class_1*$rootScope.selcetedDataSet.num_of_entities) + "("+ tirp._TIRP__vertical_support_class_1 + "%)"
        }



        self.getScore = function (tirp) {
            if (tirp == undefined)
                return "";
            let numOfEntities = $rootScope.selcetedDataSet.num_of_entities;
            let numOfEntitiesClass1 = $rootScope.selcetedDataSet.num_of_entities_class_1;
            let vs0 = 0
            if (tirp._TIRP__exist_in_class0)
                vs0 =  ((self.getAmountInstancesClass0(tirp)/numOfEntities).toFixed(2)*100).toFixed(0)
            let vs1 = 0
            if (tirp._TIRP__exist_in_class1 || !tirp._TIRP__exist_in_class0)
                vs1 = ((self.getAmountInstancesClass1(tirp)/numOfEntitiesClass1).toFixed(2)*100).toFixed(0)
            // let avg_vs = (vs0+vs1)/2
            let delta_vs = Math.abs(vs0-vs1)
            let delta_mhs = Math.abs(tirp._TIRP__mean_horizontal_support-tirp._TIRP__mean_horizontal_support_class_1)
            let delta_mmd = Math.abs(tirp._TIRP__mean_duration-tirp._TIRP__mean_duration_class_1)
            // let p_hs = 1-10*tirp._TIRP__p_value_mhs
            // let p_mmd = 1-10*tirp._TIRP__p_value_md
            let score = 0
            // if (tirp._TIRP__exist_in_class1)
            score =  $rootScope.weights[0]*delta_vs + $rootScope.weights[1]*delta_mhs + $rootScope.weights[2]*delta_mmd
            // else
            //     score =  $rootScope.weights[0]*(avg_vs+delta_vs)
            return score.toFixed(1);
        }

        self.calculateWeights = function () {
            weight1 = $scope.weight1;
            weight2 = $scope.weight2;
            weight3 = $scope.weight3;
            if (weight1 + weight2 + weight3 == 1)
                return false;
            return true;
        }

        self.calculateScores = function () {
            $rootScope.weights[0] = $scope.weight1;
            $rootScope.weights[1] = $scope.weight2;
            $rootScope.weights[2] = $scope.weight3;
            self.currentLevel.forEach(function(tirp) {
                tirp.score = self.getScore(tirp); })
            self.load();
        }
        

        self.goToRoot = function() {
            $rootScope.ptirpsPathOfTirps = [];
            self.initiateTirps()
        }

        self.getLevel = function(tirp, index) {
            if (index <  $rootScope.ptirpsPathOfTirps.length-1)
            {
                $rootScope.ptirpsPathOfTirps = $rootScope.ptirpsPathOfTirps .slice(0, index+2);
                $rootScope.ptirpsPathOfTirps[$rootScope.ptirpsPathOfTirps.length-1].partOfPath = false
                if($rootScope.ptirpsPathOfTirps.length > 1)
                    self.currentLevel = $rootScope.ptirpsPathOfTirps[$rootScope.ptirpsPathOfTirps.length-2]._TIRP__childes;
                else
                     self.currentLevel = $rootScope.ptirpsRootElements;
                self.currentLevel.forEach(function(child) {
                    child.score = self.getScore(child); })
                self.DrawMatrix();
                self.drawPie();
                self.drawAvgTirp();
                self.drawVS();
                self.drawMHS();
                self.drawMMD();
                $timeout(function () {
                    self.load(true);
                    self.loadMatrics();
                    })
                }
            }

        $scope.is_highlight = function (tirp) {
            if (tirp == undefined)
                return false;
            else {
                if (tirp._TIRP__childes.length == 0)
                    return false;
                else {
                    return true;
                }
            }
        };

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


        $scope.initSelect = function()
        {
            let val = document.getElementById("selectProperty").value;
            if (val == "? object:null ?" || val == "Select a Property")
            {
                document.getElementById("selectProperty").value = "Select a Property"
                $scope.selectedProperty = "Select a Property";
            }
            return true;
        };

        
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
                let tblDiv = document.getElementById("currPTirpTblDiv");
                tblDiv.style.display = "block";
         }
        });
        let tblDiv = document.getElementById("currPTirpTblDiv");
        tblDiv.style.display = "block";
      }

        // self.load = function () {
        //     $timeout(function () {
        //         let t = $('#tirpsTbl').DataTable({
        //             "dom": "fltip",
        //             "scrollY": "25%",
        //             "scrollCollapse": true,
        //             "scrollX": true,
        //             "autoWidth": true,
        //             retrieve: true,
        //             paging: false,
        //             "fnInitComplete": function () {
        //                 let tbl = document.getElementById("tirpsTbl");
        //                 tbl.style.display = "block";
        //                 let tblDiv = document.getElementById("tirpsTblDiv");
        //                 tblDiv.style.display = "block";
        //                 //$("#statesTbl").show();
        //             },
        //             "drawCallback": function (settings) {
        //                 // $(".dataTables_scrollHeadInner").css({"width":"100%"});
        //                 // $(".table ").css({"width":"100%"});
        //                 $(".dataTables_scrollBody").width($(".dataTables_scrollHead").width());
        //             }
        //         });
        //         let tbl = document.getElementById("tirpsTbl");
        //         tbl.style.display = "block";
        //         let tblDiv = document.getElementById("tirpsTblDiv");
        //         tblDiv.style.display = "block";
        //         $('.dataTables_length').addClass('bs-select');
        //         //t.fnAdjustColumnSizing();
        //         //    self.loaded = true;
        //     }, 0);

        // }

        // self.load = function(){
        //     var stdTable1 = $("#ptirpsTbl").dataTable({
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
        //             let tbl = document.getElementById("ptirpsTbl");
        //             tbl.style.display = "block";
        //             let tblDiv = document.getElementById("ptirpsTblDiv");
        //             tblDiv.style.display = "block";
        //      }
        //     });
        //     //new $.fn.dataTable.FixedHeader( stdTable1 );
        //     let tblDiv = document.getElementById("ptirpsTblDiv");
        //     tblDiv.style.display = "block";
        //   }
    
        self.load = function(index){
            $timeout(function () {
            let stdTable1 = $("#ptirpsTbl").dataTable({
            //"iDisplayLength": -1,
            "bPaginate": false,
            // "iCookieDuration": 60,
            // "bStateSave": false,
            //"bAutoWidth": false,
            "bFilter": false,
            "aaSorting": [[ 2, "asc" ]],
            //true
            // "bScrollAutoCss": true,
            // "bProcessing": true,
             "bRetrieve": true,
            // "bJQueryUI": true,
            "bInfo" : false,
            // columnDefs:  [ {
            //     "targets": 0,
            //     width: '10%',
            //     "targets": 1,
            //     width: '10%',
            //     "targets": 2,
            //     width: '30%',  
            //     "targets": 3,
            //     width: '35%',
            //     "targets": 4,
            //     width: '25%'}],
            "aoColumns": [
                {
                    "mData": null,
                    // "sWidth": "3%",
                    "bSortable": false,
                    "mRender": function(data, type, full) {
                    //   return '<a class="btn btn-info btn-sm" href=#/' + full[0] + '>' + 'Edit' + '</a>';
                        return '<button class="goDown"></button>'
                        // <i id="goDownIcon" class="material-icons">keyboard_arrow_down</i>
                //         <button class="edit" ng-style="{'font-size': '1px'}"
                //         ng-click="homeCtrl.edit(dataSet,this)">
                //         <p class="download"><i class="material-icons"
                //                         ng-style="{'font-size': '35px'}">edit</i><br />
                //         </p>
                // </button>
                    }},
                {
                    "sWidth": "20%",
                "mData": 0
              }, {
                "sWidth": "50%",
                "mData": 1
              }, {
                "sWidth": "30%",
                "mData": 2
              }, {
                "sWidth": "10%",
                "mData": 3
              }, {
                "sWidth": "20%",
                "mData": 4
              },{
                "sWidth": "20%",
                "mData": 5
              },{
                "sWidth": "20%",
                "mData": 6
              },
              {
                "sWidth": "20%",
                "mData": 7
              },{
                "sWidth": "20%",
                "mData": 8
              }],
            //"sDom": 't',
            // "sDom": '<"H"CTrf>t<"F"lip>',
            /* "aLengthMenu": [[25, 50, 100, -1], [25, 50, 100, "All"]], */
            //"sScrollY": "500px",
            //"sScrollX": "100%",
            // "sScrollXInner": "110%",
            "fnInitComplete": function() {
                //this.css("visibility", "visible");
                let tbl = document.getElementById("ptirpsTbl");
                tbl.style.display = "block";
                let tblDiv = document.getElementById("ptirpsTblDiv");
                tblDiv.style.display = "block";
         },
         "drawCallback": function( settings ) {
            // $(".dataTables_scrollHeadInner").css({"width":"100%"});
            // $(".table ").css({"width":"100%"});
            $(".dataTables_scrollBody").width($(".dataTables_scrollHead").width());
         }
        });
        $('.dataTables_length').addClass('bs-select');
        stdTable1.fnClearTable();
        let rows = []
        self.currentLevel.forEach(function(tirp) { //insert rows
            // var button = document.createElement('button');
            // button.onclick = self.goDown(tirp);
            rows.push([self.getRel(tirp), self.getSymbol(tirp),tirp.score, self.getVS0(tirp) ,self.getVSClass1(tirp), tirp._TIRP__mean_horizontal_support,tirp._TIRP__mean_horizontal_support_class_1, tirp._TIRP__mean_duration,tirp._TIRP__mean_duration_class_1])
          })
          if (rows.length > 0)
          {
          var rowIdxes =$('#ptirpsTbl').dataTable().fnAddData(rows);
          for (var i=0; i<rowIdxes.length; i++)
          {
            for (tirp in self.currentLevel)
            {
                let rel2 = self.getRel(self.currentLevel[tirp]);
                let sym2 = self.getSymbol(self.currentLevel[tirp]);
                let score2 = self.getScore(self.currentLevel[tirp])
                if (rel2 == rows[i][0] &&  sym2 == rows[i][1] && score2 == rows[i][2])
                {
                    var rowTr = $('#ptirpsTbl').dataTable().fnGetNodes( rowIdxes[i] );
                    if($scope.is_highlight(self.currentLevel[tirp]))
                    {
                        $(rowTr).addClass('hasChilds');
                    }
                    else
                    {
                        let td = rowTr.firstElementChild;
                        let btn = td.firstChild;
                        btn.disabled = true;
                        // btn.className = "goDownDisable";
                        // let l = btn.classList;
                        // l.append("classList")
                        //btn.hidden = true;
                    }
                    if (index== true)// || index == undefined)  
                    {
                        if ($rootScope.ptirpsPathOfTirps[$rootScope.ptirpsPathOfTirps.length-1].partOfPath == false)
                        {
                            let lastTirp = $rootScope.ptirpsPathOfTirps[$rootScope.ptirpsPathOfTirps.length-1];
                            if (self.getRel(lastTirp) == rel2 && self.getSymbol(lastTirp) == sym2 && self.getScore(lastTirp) == score2)
                            {
                                $(rowTr).addClass( "selected" );
                            }
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
          let tblDiv = document.getElementById("ptirpsTblDiv");
          tblDiv.style.display = "block";
          if(self.currentLevel[0]._TIRP__symbols.length == 1)
          $rootScope.plevel = 'Root'
          else
            $rootScope.plevel = self.currentLevel[0]._TIRP__symbols.length 
          self.loadCompleted();
        })
    }
    


        self.DrawMatrix = function () {
                let currTirp = $rootScope.ptirpsPathOfTirps[$rootScope.ptirpsPathOfTirps.length - 1];
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
                matrix[0] = symbols.slice(1, symbols.length + 1)
                matrix[0].unshift("");
                cols = symbols.slice(0, symbols.length - 1)
                for (var i = 1; i < cols.length + 1; i++) {
                    matrix[i][0] = cols[i - 1];
                }
                //matrix[0][1].unshift("");
                for (var i = 1; i < symbols.length; i++) {
                    for (var j = 1; j < iterations + 1; j++) {
                        matrix[j][i] = relations[relIndex].substring(0, 1);;
                        relIndex = relIndex + 1;
                    }
                    iterations = iterations + 1;
                }
                self.matrix = matrix;

        }

        self.showMatrix = function()
        {
            if ($rootScope.ptirpsPathOfTirps.length > 1)
                $('#myModal').modal();
        }

        self.drawPie = function () {
            if ($scope.selectedProperty != undefined && $scope.selectedProperty != null && $scope.selectedProperty != "Select a Property") {
                let currTirp = $rootScope.ptirpsPathOfTirps[$rootScope.ptirpsPathOfTirps.length - 1];
                let properties = currTirp._TIRP__supporting_entities_properties[$scope.selectedProperty];
                let propertiesClass1 = currTirp._TIRP__supporting_entities_properties_class_1[$scope.selectedProperty];
                google.charts.load("current", { packages: ["corechart"] });
                google.charts.setOnLoadCallback(drawChart);
                function drawChart() {
                    if (currTirp._TIRP__exist_in_class0)
                    {
                        var propertiesAsArray = [['Property', 'Value']];
                        for (var i = 0; i < properties.length; i++) {
                            let b = Object.entries(properties[i])
                            let c = b[0];
                            propertiesAsArray.push([c[0], parseInt(c[1])]);

                        }
                        var data = google.visualization.arrayToDataTable(propertiesAsArray);
                        
                        var options0 = {
                            title: $rootScope.selcetedDataSet.class_name,
                            'titleTextStyle': {
                            fontSize: 10,
                            bold:true,
                            italic:false
                        },
                        legend:'none', 
                        'width': '20%',
                        'height': '20%',
                        // 'chartArea': {'width': '50%', 'height': '50%'},
                        backgroundColor: 'transparent',
                        is3D: true,
                    };

                    var chart = new google.visualization.PieChart(document.getElementById('piechart_predEntitiesProperties'));
                    chart.draw(data, options0);
                    }   
                    if (currTirp._TIRP__exist_in_class1 || !currTirp._TIRP__exist_in_class0)
                    {
                        var propertiesAsArrayClass1 = [['Property', 'Value']];
                        for (var i = 0; i < propertiesClass1.length; i++) {
                            let d = Object.entries(propertiesClass1[i])
                            let e = d[0];
                            propertiesAsArrayClass1.push([e[0], parseInt(e[1])]);

                        }
                        var dataClass1 = google.visualization.arrayToDataTable(propertiesAsArrayClass1);
                        var options1 = {
                            title: $rootScope.selcetedDataSet.second_class_name,
                            'titleTextStyle': {
                                fontSize: 10,
                                bold:true,
                                italic:false
                            },
                            legend:'none', 
                            'width': '30%',
                            'height': '20%',
                            backgroundColor: 'transparent',
                            is3D: true,
                        };
                        var chartClass1 = new google.visualization.PieChart(document.getElementById('piechart_predEntitiesPropertiesClass1'));
                        chartClass1.draw(dataClass1, options1);
                }
                }
            }
        }

        self.drawAvgTirp = function () {
            let currTirp = $rootScope.ptirpsPathOfTirps[$rootScope.ptirpsPathOfTirps.length - 1];
            let times = currTirp._TIRP__mean_offset_from_first_symbol;
            let timesClass1 = currTirp._TIRP__mean_offset_from_first_symbol_class_1;
            let durationOfFirstInterval = currTirp._TIRP__mean_of_first_interval;
            let durationOfFirstIntervalClass1 = currTirp._TIRP__mean_of_first_interval_class_1;
            let symbols = currTirp._TIRP__symbols;
            google.charts.load('current', { 'packages': ['timeline'] });
            google.charts.setOnLoadCallback(drawTimeLine);
            function drawTimeLine() {
                 // to expand the height of the timeLine
                    var len = currTirp._TIRP__symbols.filter(function(val, i, arr) { 
                        return arr.indexOf(val) === i;
                    }).length;
                    // let height = (92 + (len-1) * 40) + "px";
                    // if (len == 1)
                    // {
                    //     height = len * 92 + "px";
                    // }
                    // document.getElementById("timeline").style.height  = height;
                var container = document.getElementById('ptimeline');
                var chart = new google.visualization.Timeline(container);
                var dataTable = new google.visualization.DataTable();

                dataTable.addColumn({ type: 'string', id: 'Lable' });
                dataTable.addColumn({ type: 'string', id: 'Duration' });
                dataTable.addColumn({ type: 'date', id: 'Start' });
                dataTable.addColumn({ type: 'date', id: 'End' });

                let data = [];
                interval = new Array();
                // insert m.duration of first interval
                interval.push(symbols[0]);
                let date1 = service.getDateForSymbol(0);
                let date2 = service.getDateForSymbol(durationOfFirstInterval);
                let duration = service.getDiffBetweenDates(date1,date2,true)
                if (!currTirp._TIRP__exist_in_class0)
                {
                    duration = "0 " +  " / " + duration + " " + $rootScope.selcetedDataSet.timestamp
                }
                else if (currTirp._TIRP__exist_in_class1 )
                {
                    let date1Class1 = date1;
                    let date2Class1 = service.getDateForSymbol(durationOfFirstIntervalClass1);
                    duration += " / " + service.getDiffBetweenDates(date1Class1,date2Class1)
                }
                else
                {
                    duration += " / 0 " + $rootScope.selcetedDataSet.timestamp
                }
                interval.push(symbols[0] + " - " + duration);
                interval.push(date1);
                interval.push(date2);
                data.push(interval);
                var j = 2;
                var offset = durationOfFirstInterval;
                var offsetClass1 = durationOfFirstIntervalClass1;
                for (var i = 1; i < symbols.length; i++) {
                    interval = new Array();
                    interval.push(symbols[i]);
                    date1 = service.getDateForSymbol(offset + times[j]);
                    date2 = service.getDateForSymbol(offset + times[j + 1]);
                    duration = service.getDiffBetweenDates(date1,date2, true);
                    if (!currTirp._TIRP__exist_in_class0)
                    {
                        duration = "0 " +  " / " + duration + " " + $rootScope.selcetedDataSet.timestamp
                    }
                    else if (currTirp._TIRP__exist_in_class1 )
                    {
                        date1Class1 = service.getDateForSymbol(offsetClass1 + timesClass1[j]);
                        date2Class1 = service.getDateForSymbol(offsetClass1 + timesClass1[j + 1]);
                        duration += " / " + service.getDiffBetweenDates(date1Class1,date2Class1)
                    }
                    else
                    {
                        duration += " / 0 " + $rootScope.selcetedDataSet.timestamp
                    }
                    interval.push(symbols[i] + " - " + duration);
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
            // set a padding value to cover the height of title and axis values
            var paddingHeight = 100;
            // set the height to be covered by the rows
            var rowHeight = dataTable.getNumberOfRows() * 30;
            // set the total chart height
            var chartHeight = rowHeight + paddingHeight;

              chart.draw(dataTable,{
                timeline: { colorByRowLabel: true,
                    showRowLabels: false,
                    barLabelStyle: {
                        fontSize: 9
                    } },
                hAxis: {
                  minValue: new Date(1900, 1, 1),
                }, height: chartHeight
                });

                //dataTable.setProperty(0, 0, 'style', 'width:800px');
                // dataTable.setProperty(0, 1, 'style', 'width:500px');
                // chart.draw(dataTable, {
                //     // width: '100%', height: '100%',
                //     timeline: { colorByRowLabel: true,
                //         barLabelStyle: {
                //             fontSize: 8
                //         } },
                //     title: $rootScope.selcetedDataSet.class_name,
                //     tooltip: {
                //         isHtml: true
                //       },
                // //     'titleTextStyle': {
                // //       fontSize: 18,
                // //       bold:true,
                // //       italic:false
                // //   },
                //     hAxis: {
                //         minValue: new Date(1900, 1, 1)
                //         //maxValue: new Date()
                //    }
                //});
                //   dataTable.addRows([
                //     [ 'Washington', new Date(1789, 3, 30), new Date(1797, 2, 4) ],
                //     [ 'Adams',      new Date(1797, 2, 4),  new Date(1801, 2, 4) ],
                //               [ 'Washington', new Date(1801, 3, 30), new Date(1809, 2, 4) ],
                //     [ 'Jefferson',  new Date(1801, 2, 4),  new Date(1809, 2, 4) ]]);
            }
        }

        // self.drawAvgTirpClass1 = function () {
        //     let currTirp = $rootScope.ptirpsPathOfTirps[$rootScope.ptirpsPathOfTirps.length - 1];
        //     if (currTirp._TIRP__exist_in_class1)
        //     {
        //     let times = currTirp._TIRP__mean_offset_from_first_symbol_class_1;
        //     let durationOfFirstInterval = currTirp._TIRP__mean_of_first_interval_class_1;
        //     let symbols = currTirp._TIRP__symbols;
        //     google.charts.load('current', { 'packages': ['timeline'] });
        //     google.charts.setOnLoadCallback(drawTimeLine);
        //     function drawTimeLine() { 
        //         // to expand the height of the timeLine
        //             var len = currTirp._TIRP__symbols.filter(function(val, i, arr) { 
        //                 return arr.indexOf(val) === i;
        //             }).length;
        //             let height = (92 + (len-1) * 40) + "px";
        //             if (len == 1)
        //             {
        //                 height = len * 92 + "px";
        //             }
        //             document.getElementById("timelineClass1").style.height  = height;
        //         var container = document.getElementById('timelineClass1');
        //         var chart = new google.visualization.Timeline(container);
        //         var dataTable = new google.visualization.DataTable();

        //         dataTable.addColumn({ type: 'string', id: '' });
        //         dataTable.addColumn({ type: 'string', id: 'Duration' });
        //         dataTable.addColumn({ type: 'date', id: 'Start' });
        //         dataTable.addColumn({ type: 'date', id: 'End' });

        //         let data = [];
        //         interval = new Array();
        //         // insert m.duration of first interval
        //         interval.push(symbols[0]);
        //         let date1 = service.getDateForSymbol(0);
        //         let date2 = service.getDateForSymbol(durationOfFirstInterval);
        //         interval.push(service.getDiffBetweenDates(date1,date2));
        //         interval.push(date1);
        //         interval.push(date2);
        //         data.push(interval);
        //         var j = 2;
        //         var offset = durationOfFirstInterval;
        //         for (var i = 1; i < symbols.length; i++) {
        //             interval = new Array();
        //             interval.push(symbols[i]);
        //             date1 = service.getDateForSymbol(offset + times[j]);
        //             date2 = service.getDateForSymbol(offset + times[j + 1]);
        //             interval.push(service.getDiffBetweenDates(date1,date2));
        //             interval.push(date1);
        //             interval.push(date2);
        //             data.push(interval);
        //             j += 2;
        //         }
        //         dataTable.addRows(data);

        //         // to remove the time axis
        //         google.visualization.events.addListener(chart, 'ready', function () {
        //             var labels = container.getElementsByTagName('text');
        //             Array.prototype.forEach.call(labels, function (label) {
        //                 if (label.getAttribute('text-anchor') === 'middle' || label.getAttribute('font-weight') === 'bold' || label.getAttribute('fill') === '#000000') {
        //                     label.setAttribute('font-size', '0');
        //                 }
        //             });
        //         });

        //         chart.draw(dataTable, {
        //             timeline: { colorByRowLabel: true },
        //             title: $rootScope.selcetedDataSet.second_class_name,
        //         //     'titleTextStyle': {
        //         //       fontSize: 18,
        //         //       bold:true,
        //         //       italic:false
        //         //   },
        //             hAxis: {
        //                 minValue: new Date(1900, 1, 1)
        //                 //maxValue: new Date()
        //             }
        //         });
        //         //   dataTable.addRows([
        //         //     [ 'Washington', new Date(1789, 3, 30), new Date(1797, 2, 4) ],
        //         //     [ 'Adams',      new Date(1797, 2, 4),  new Date(1801, 2, 4) ],
        //         //               [ 'Washington', new Date(1801, 3, 30), new Date(1809, 2, 4) ],
        //         //     [ 'Jefferson',  new Date(1801, 2, 4),  new Date(1809, 2, 4) ]]);
        //         //self.chartsLoaded = true;
        //         //$scope.$apply();
        //     }
        // }
        // }

    //     self.drawMHS = function()
    //     {
    //         let currTirp = $rootScope.ptirpsPathOfTirps[$rootScope.ptirpsPathOfTirps.length - 1];
    //         google.charts.load('current', {'packages':['gauge']});
    //         google.charts.setOnLoadCallback(drawChart);
      
    //         function drawChart() {
    //             var propertiesAsArray = [['Label', 'Value']];
    //             let label = "";
    //             if ($rootScope.selcetedDataSet.class_name != '')
    //                  label += $rootScope.selcetedDataSet.class_name;
    //             else
    //                 label += "Class 0"
    //             propertiesAsArray.push([label, currTirp._TIRP__mean_horizontal_support]);
    //                 label = "";
    //                 if ($rootScope.selcetedDataSet.class_name != '')
    //                      label += $rootScope.selcetedDataSet.second_class_name; 
    //                 else
    //                     label += "Class 1"
    //             //let minVal = 1;
    //             let maxVal = Math.max(currTirp._TIRP__mean_horizontal_support,currTirp._TIRP__mean_horizontal_support_class_1);
    //             maxVal = Math.ceil(maxVal/5)*5;
    //             // if (currTirp._TIRP__exist_in_class1)
    //             // {
    //             //     minVal = 0
    //             // }
    //             propertiesAsArray.push([label, currTirp._TIRP__mean_horizontal_support_class_1]);
    //             var data = google.visualization.arrayToDataTable(propertiesAsArray);
      
    //           var options = {
    //             legend: { position: 'bottom' },
    //             title: "Class 0 " + $rootScope.selcetedDataSet.class_name,
    //             'titleTextStyle': {
    //               fontSize: 18,
    //               bold:true,
    //               italic:false
    //           },
    //             // width: 400, height: 120,
    //   /*           redFrom: 90, redTo: 100,
    //             yellowFrom:75, yellowTo: 90, */
    //             minorTicks: 5,
    //             min: 1,
    //             max: maxVal
    //           };
      
    //           var chart = new google.visualization.Gauge(document.getElementById('chart_MHS'));
      
    //           chart.draw(data, options);
    //   }
    //     }

    // self.drawMHS = function()
    //     {
    //         let currTirp = $rootScope.ptirpsPathOfTirps[$rootScope.ptirpsPathOfTirps.length - 1];
    //         google.charts.load('current', {packages: ['corechart', 'bar']});
    //         google.charts.setOnLoadCallback(drawAnnotations);

    //         function drawAnnotations() {
    //             let labelClass0 = "";
    //             if ($rootScope.selcetedDataSet.class_name != '')
    //             labelClass0 += $rootScope.selcetedDataSet.class_name;
    //             else
    //             labelClass0 += "Class 0"
    //             labelClass1 = "";
    //                 if ($rootScope.selcetedDataSet.class_name != '')
    //                 labelClass1 += $rootScope.selcetedDataSet.second_class_name; 
    //                 else
    //                 labelClass1 += "Class 1"
    //             //let minVal = 1;
    //             var propertiesAsArray = [['m.h.s', labelClass0, {role: 'annotation'},labelClass1, {role: 'annotation'}]];
    //             propertiesAsArray.push([labelClass0, currTirp._TIRP__mean_horizontal_support, currTirp._TIRP__mean_horizontal_support +"",0,'']);
    //             propertiesAsArray.push([labelClass1,0,'', currTirp._TIRP__mean_horizontal_support_class_1, currTirp._TIRP__mean_horizontal_support_class_1 + ""]);
    //             // let maxVal = Math.max(currTirp._TIRP__mean_horizontal_support,currTirp._TIRP__mean_horizontal_support_class_1);
    //             // maxVal = Math.ceil(maxVal/5)*5;
    //             var data = google.visualization.arrayToDataTable(propertiesAsArray);



    // var options = {
    //     'legend': {
    //         'position': 'none'
    //       },
    //     title: 'M.H.S',
    //      chartArea: {weight: '30%'},
    //     hAxis: {
    //       title: 'M.H.S',
    //       minValue: 0,
    //     },
    //     vAxis: {
    //       title: 'Class',
    //       fontSize: 4,
    //     },
    //     bar: { groupWidth: "100%" },
    //   };
    //   var MHSChart = new google.visualization.BarChart(document.getElementById('chart_MHS'));
    //   MHSChart.draw(data, options);
    //   }
    //     }

        self.drawVS = function()
        {
            let currTirp = $rootScope.ptirpsPathOfTirps[$rootScope.ptirpsPathOfTirps.length - 1];
            let numOfEntities = $rootScope.selcetedDataSet.num_of_entities;
            let numOfEntitiesClass1 = $rootScope.selcetedDataSet.num_of_entities_class_1;
            google.charts.load('current', {packages: ['corechart', 'bar']});
            google.charts.setOnLoadCallback(drawRightY);

            function drawRightY() {
                let class0Color = "Blue";
                let class1Color = "Red";
                let labelClass0 = "";
                if ($rootScope.selcetedDataSet.class_name != '')
                    labelClass0 += $rootScope.selcetedDataSet.class_name;
                else
                    labelClass0 += "Class 1"
                let labelClass1 = "";
                if ($rootScope.selcetedDataSet.second_class_name != '')
                    labelClass1 += $rootScope.selcetedDataSet.second_class_name; 
                else
                    labelClass1 += "Class 0"
                //var propertiesAsArray = [['Class', 'V.S','min v.s',{ role: 'annotation' }]];
                let minVS = $rootScope.selcetedDataSet.min_ver_support*100;
                var propertiesAsArray = [['v.s', labelClass0,{role: 'annotation'}, labelClass1, {role: 'annotation'},'min v.s',{role: 'annotation'}]];
                propertiesAsArray.push(['',  ,      ,    ,     ,minVS,minVS+"%"]);
                let vsPrecentClass0 = parseFloat(((currTirp._TIRP__vertical_support/numOfEntities).toFixed(2)*100).toFixed(0));
                let vsPrecentClass1 = currTirp._TIRP__vertical_support_class_1;
                let VSClass0 = currTirp._TIRP__vertical_support;
                let VSClass1 = currTirp._TIRP__vertical_support_class_1;
                if (!currTirp._TIRP__exist_in_class0)
                {
                    VSClass0 = 0
                    vsPrecentClass0 = 0
                    vsPrecentClass1 = parseFloat(((currTirp._TIRP__vertical_support_class_1/numOfEntitiesClass1).toFixed(2)*100).toFixed(0))

                }
                else if (currTirp._TIRP__exist_in_class1)
                {
                    vsPrecentClass1 = parseFloat(((currTirp._TIRP__vertical_support_class_1/numOfEntitiesClass1).toFixed(2)*100).toFixed(0))
                    //propertiesAsArray.push([label,vsPrecent,minVS, vsPrecent + "% " +"(" + currTirp._TIRP__vertical_support_class_1 +")"]);
                }
                else
                {
                    VSClass1 = 0//Math.round(VSClass1*numOfEntitiesClass1)
                    vsPrecentClass1 = 0
                }
                if (currTirp._TIRP__exist_in_class0)
                {
                    propertiesAsArray.push([labelClass0,vsPrecentClass0,vsPrecentClass0 + "% (" + VSClass0 +")", , ,minVS,'']);
                }
                else
                {
                    class0Color = "Gray";
                    propertiesAsArray.push([labelClass0 , 0,"<" + (($rootScope.selcetedDataSet.min_ver_support).toFixed(2)*100).toFixed(0) + "%",,,minVS,'']);
                }
                if (currTirp._TIRP__exist_in_class1 || !currTirp._TIRP__exist_in_class0)
                {
                    propertiesAsArray.push([labelClass1,, , vsPrecentClass1,vsPrecentClass1 + "% ("+ VSClass1+")",minVS,'']);
                }
                else
                {
                    class1Color = "Gray";
                    propertiesAsArray.push([labelClass1,, , 0,"<" + (($rootScope.selcetedDataSet.min_ver_support).toFixed(2)*100).toFixed(0) + "%",minVS,'']);
                }
                propertiesAsArray.push(['',  ,      ,    ,     ,minVS,minVS+"%"]);
                var data = google.visualization.arrayToDataTable(propertiesAsArray);
                let maxVal = Math.max(vsPrecentClass0,vsPrecentClass1)
                // var options = {
                //     title: 'V.S',
                //     chartArea: {width: '50%'},
                //     hAxis: {
                //       title: 'v.s',
                //       minValue: 0,
                //       maxValue: 1
                //     },
                //     vAxis: {
                //       title: 'Class'
                //     }
                //   };
                var options = {
                    'legend': {
                        'position': 'none'
                      },
                    title : 'Vertical Support',
                    // chartArea: {height: '30%'},
                    // chartArea: {weight: '30%'},
                    vAxis: {title: 'V.S (%)',          
                    minValue: 0, 
                    maxValue: maxVal,
                    fontSize: 4,},
                    // hAxis: {
                    // // title: 'Class'
                    // },
                    seriesType: 'bars',
                    bar: { groupWidth: "50%" },
                    series: 
                    {0:{color: class0Color},
                        1:{color: class1Color},
                        2: {type: 'line'}}}


                var chart = new google.visualization.ComboChart(document.getElementById('chart_VS'));
                chart.draw(data,options);
                }
        }

        self.drawMHS = function()
        {
            google.charts.load('current', {'packages':['corechart']});
            google.charts.setOnLoadCallback(drawChart);
            let currTirp = $rootScope.ptirpsPathOfTirps[$rootScope.ptirpsPathOfTirps.length - 1];
            let labelClass0 = "";
            if ($rootScope.selcetedDataSet.class_name != '')
                labelClass0 += $rootScope.selcetedDataSet.class_name;
            else
                labelClass0 += "Class 1"
            let labelClass1 = "";
            if ($rootScope.selcetedDataSet.second_class_name != '')
                labelClass1 += $rootScope.selcetedDataSet.second_class_name; 
            else
                labelClass1 += "Class 0"
            let MHS0 = currTirp._TIRP__mean_horizontal_support;
            let MHS1 = currTirp._TIRP__mean_horizontal_support_class_1;
            let min_interval0 = Math.round(currTirp._TIRP__hs_confidence_interval_low_class_0 * 100) / 100;
            let max_interval0 = Math.round(currTirp._TIRP__hs_confidence_interval_high_class_0 * 100) / 100;
            let min_interval1 = Math.round(currTirp._TIRP__hs_confidence_interval_low_class_1 * 100) / 100;
            let max_interval1 = Math.round(currTirp._TIRP__hs_confidence_interval_high_class_1 * 100) / 100;
            let min0 = Math.round((MHS0-min_interval0) * 100) / 100
            let max0 = Math.round((MHS0+max_interval0) * 100) / 100
            let min1 = min_interval1
            let max1 = max_interval1
            if(!currTirp._TIRP__exist_in_class0)
            {
                min1 =  Math.round((MHS1-min1)* 100) / 100
                max1 = Math.round((MHS1+max1)* 100) / 100
            }
            let maxVal = Math.max( max0,max1)
            
        function drawChart() {
          var data = google.visualization.arrayToDataTable([
            [labelClass0, Math.max(0,min0) , MHS0, MHS0, max0],
            [labelClass1,Math.max(0,min1), MHS1, MHS1, max1]
            // Treat first row as data as well.
            // Math.max((Math.round((MHS0-min0) * 100) / 100)-0.1,0)
          ], true);
          data.insertColumn(2, {type: 'string', role: 'tooltip', p: {html: true}});

          for (var i = 0; i < data.getNumberOfRows(); i++) {
            var tooltip = '<div class="ggl-tooltip"><span>' +
            data.getValue(i, 0) + '</span></div><div class="ggl-tooltip"><span>' +
              "M.H.S: " + data.getValue(i, 3) + '</span></div><div class="ggl-tooltip"><span>' +
              "min value: " + data.getValue(i, 1) + '</span></div><div class="ggl-tooltip"><span>' +
              "max value: " + data.getValue(i, 5) + '</span></div>';

            //   if (currTirp._TIRP__exist_in_class1)
            //   {
            //       tooltip += '<div class="ggl-tooltip"><span> P-Value: ' + currTirp._TIRP__p_value_mhs + '</span></div>';
            //   }
      
              data.setValue(i, 2, tooltip);
          }
          var options = {
            title : 'Mean Horizontal Support',
            legend:'none',                    
            vAxis: {title: 'M.H.S',          
            minValue: 0, 
            maxValue: maxVal,
            fontSize: 1,},
            tooltip: {
                isHtml: true
              },
              candlestick: {
                risingColor: {strokeWidth: 0.0001},
                fallingColor: {strokeWidth: 0.0001}
              },
              bar: {
                strokeWidth: 0.0001,
            },

          };
      
          var chart = new google.visualization.CandlestickChart(document.getElementById('chart_HS'));
      
          chart.draw(data, options);
        }
        }


        self.drawMMD = function()
        {
            google.charts.load('current', {'packages':['corechart']});
            google.charts.setOnLoadCallback(drawChart);
            let currTirp = $rootScope.ptirpsPathOfTirps[$rootScope.ptirpsPathOfTirps.length - 1];
            let labelClass0 = "";
            if ($rootScope.selcetedDataSet.class_name != '')
                labelClass0 += $rootScope.selcetedDataSet.class_name;
            else
                labelClass0 += "Class 1"
            let labelClass1 = "";
            if ($rootScope.selcetedDataSet.second_class_name != '')
                labelClass1 += $rootScope.selcetedDataSet.second_class_name; 
            else
                labelClass1 += "Class 0"
            let MMD0 = currTirp._TIRP__mean_duration;
            let MMD1 = currTirp._TIRP__mean_duration_class_1;
            let min_interval0 = Math.round(currTirp._TIRP__md_confidence_interval_low_class_0 * 100) / 100;
            let max_interval0 = Math.round(currTirp._TIRP__md_confidence_interval_high_class_0 * 100) / 100;
            let min_interval1 = Math.round(currTirp._TIRP__md_confidence_interval_low_class_1 * 100) / 100;
            let max_interval1 = Math.round(currTirp._TIRP__md_confidence_interval_high_class_1 * 100) / 100;
            let min0 = Math.round((MMD0-min_interval0) * 100) / 100
            let max0 = Math.round((MMD0+max_interval0) * 100) / 100
            let min1 = min_interval1
            let max1 = max_interval1
            if(!currTirp._TIRP__exist_in_class0)
            {
                min1 =  Math.round((MMD1-min1)* 100) / 100
                max1 = Math.round((MMD1+max1)* 100) / 100
            }
            let maxVal = Math.max( max0,max1)

        function drawChart() {
          var data = google.visualization.arrayToDataTable([
            [labelClass0, Math.max(0,min0), MMD0, MMD0, max0],
            [labelClass1,Math.max(0,min1), MMD1, MMD1, max1]
            // Treat first row as data as well.
          ], true);
          data.insertColumn(2, {type: 'string', role: 'tooltip', p: {html: true}});

          for (var i = 0; i < data.getNumberOfRows(); i++) {
            var tooltip = '<div class="ggl-tooltip"><span>' +
            data.getValue(i, 0) + '</span></div><div class="ggl-tooltip"><span>' +
              "M.M.D: " + data.getValue(i, 3)  + '</span></div><div class="ggl-tooltip"><span>' +
              "min value: " + data.getValue(i, 1) + '</span><span>' +
              " max value: " + data.getValue(i, 5) + '</span></div>';

            //   if (currTirp._TIRP__exist_in_class1)
            //   {
            //       tooltip += '<div class="ggl-tooltip"><span> P-Value: ' + currTirp._TIRP__p_value_md + '</span></div>';
            //   }
      
              data.setValue(i, 2, tooltip);
          }
          var options = {
            title : 'Mean Mean Duration',
            legend:'none',                    
            vAxis: {title: 'M.M.D',          
            minValue: 0, 
            maxValue: maxVal,
            fontSize: 1,},
            tooltip: {
                isHtml: true
              },
              candlestick: {
                risingColor: {strokeWidth: 0.0001},
                fallingColor: {strokeWidth: 0.0001}
              },
              bar: {
                strokeWidth: 0.0001,
            },
          };
      
          var chart = new google.visualization.CandlestickChart(document.getElementById('chart_MMD'));
      
          chart.draw(data, options);
        }
        }

    }]);