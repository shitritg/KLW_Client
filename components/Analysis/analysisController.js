angular.module('Visualization')
 .controller('analysisController', ['$scope', '$rootScope', '$location', '$http', 'service','$timeout', function ($scope, $rootScope, $location, $http, service,$timeout) {

    self = this;
    let serverUrl = service.serverUrl;
    self.propDic = null;
    self.valuesPerClassBinsDic = null;
    self.valuesPerClassesDic = null;
    self.propBar = null;
    self.propID = null;
    self.loaded = false;


    self.classesDataValues = null;
    self.classesOptions = null;
    self.classesY = null;
    self.classesX = null;

    self.dataValues = null;
    self.options = null;
    self.y = null;
    self.x = null;
    self.yMax = null;
    self.prevProp = null;
    self.xMinVal = 0;
    self.xMaxVal = null;
    self.histogramPreHeight = 0.75;
    self.widthOfClassChart = 0.8;
    self.numOfDis = 0;
    self.numOfClasses = 2;
    self.yPrecentTopGap = 5;
    self.lineHeight = 3;
    self.toRoundKey = 10;

    self.linesWidth = ".14em";
    self.colorDic = {
        "equal-width":'#000000',
        "equal-frequency":'#DF013A',
        "sax":'#FF00BF',
        "persist":'#0101DF',
        "td4c-cosine":'#2ECCFA',
        "td4c-entropy":'#00FF00',
        "td4c-entropy-ig":'#31B404',
        "td4c-skl":'#FF8000',
        "td4c-diffsum":'#FF0000',
        "td4c-diffmax":'#8A0808',          
    }
    self.classesColors = {
        0:"#737373",
        1:"#33ccff"
    }

    self.init = function(){
        document.getElementById("classesColor").style.display = "none";
        document.getElementById("RawDataAnalysis").style.display = "none";
        self.getHugobotBounds();
        $scope.selectedBins = "70";
        $scope.xMinVal = 0;     
        var class0Elem = document.getElementById("class0");
        var class1Elem = document.getElementById("class1");
        if ($rootScope.selcetedDataSet.class_name != '' && $rootScope.selcetedDataSet.second_class_name != ''){
            class0Elem.innerHTML = $rootScope.selcetedDataSet.class_name;
            class1Elem.innerHTML = $rootScope.selcetedDataSet.second_class_name;
        }
        else {
            class0Elem.innerHTML = "Class 0";
            class1Elem.innerHTML = "Class 1";
        }
        class0Elem.style.color = self.classesColors[0];
        class1Elem.style.color = self.classesColors[1];
    }

    self.closeLoader = function(){
        document.getElementById("loader").style.display = "none";
    }

    /**
     * This method send a request to the server to get the bounds of the different discretizations 
     * of the raw data (the output of the hugobot)
     */
    self.getHugobotBounds = function(){

        if (self.propDic != null)
            return
        
        let formForStates = new FormData();
        formForStates.append('data_set_name', $rootScope.selcetedDataSet.data_set_name)
        var url = serverUrl + `getHugobotBounds`;
        var request = new Request(url, {
            method: 'POST',
            mode: "cors",
            body: formForStates,
        });
        fetch(request)
        .then(async function (response){
            let jsonString = await response.text().then(s=>s);
            let a = JSON.parse(jsonString);
            self.propDic = JSON.parse(a)
            self.getValuesPerBins();
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

    /**
     * This method sends a request to the server to get the bins values (the number of raw data occurences per bin)
     * per class, in case the data includes information about the classes.
     */
    self.getValuesPerBins = function() {

        let formForStates = new FormData();
        formForStates.append('data_set_name', $rootScope.selcetedDataSet.data_set_name)
        var url = serverUrl + `getValuesPerBinsDic`;
        var request = new Request(url, {
            method: 'POST',
            mode: "cors",
            body: formForStates,
        });
        fetch(request)
        .then(async function (response){
            let jsonString =  await response.text().then(s=>s);            
            if (jsonString != "the file doesn't exists"){
                let a = JSON.parse(jsonString);
                self.valuesPerClassBinsDic = JSON.parse(a);
                self.getValuesPerClass();
                document.getElementById("my_histogram").style.height = '40%';
                document.getElementById("my_classesBarChart").style.display = "block";
                document.getElementById("classesColor").style.display = "block";
                self.histogramPreHeight = 0.4
            }
            else {
                self.disabledTd4cCB(); 
            }
            
            document.getElementById("RawDataAnalysis").style.display = "block";
            document.querySelectorAll('[id=cbTd]')[0].nextElementSibling.childNodes[0].data
            self.closeLoader()
            
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

    /**
     * This method sends a request to the server to get the raw values
     * per class, in case the data includes information about the classes.
     */
    self.getValuesPerClass = function() {

        let formForStates = new FormData();
        formForStates.append('data_set_name', $rootScope.selcetedDataSet.data_set_name)
        var url = serverUrl + `getValuesPerClass`;
        var request = new Request(url, {
            method: 'POST',
            mode: "cors",
            body: formForStates,
        });
        fetch(request)
        .then(async function (response){
            let jsonString = await response.text().then(s=>s);            
            if (jsonString != "the file doesn't exists")
            {
                let a = JSON.parse(jsonString);
                self.valuesPerClassesDic = JSON.parse(a);
            }
                
                ////
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

    /**
     * This method disabels the "TD4C" discretizations check boxes
     */
    self.disabledTd4cCB = function(){

        var td4cList = document.querySelectorAll('[id=cbTd]');     
        for (let i = 0; i < td4cList.length; i++){
            td4cList[i].disabled = true;
            td4cList[i].style.display = "none";
            td4cList[i].nextElementSibling.style.display = "none";
        }
        
    }

    self.getStates = function ()
    {
       if ($rootScope.states.length == 0)
           service.getStates();          
    }

   self.getPropToBar = function(){
       if (self.propBar != null)
            return

        self.propBar = [];
        self.propID = {};
        self.getStates();

        $rootScope.$watch('$root.states', function(){   
            if ($rootScope.states.length == 0)
                return; 
            ($rootScope.states).forEach(value => {
                let hasName = Object.keys(value).includes("TemporalPropertyName")
                if (hasName && !(self.propBar).includes(value["TemporalPropertyName"])){
                    self.propBar.push(value["TemporalPropertyName"]);
                    self.propID[value["TemporalPropertyName"]] = value["TemporalPropertyID"]
                }
                else if (!hasName && !(self.propBar).includes(value["TemporalPropertyID"])){
                    self.propBar.push(value["TemporalPropertyID"]);
                    self.propID[value["TemporalPropertyID"]] = value["TemporalPropertyID"]
                }           
            });
        
        });

   }

   /**
    * This method displayes the chart of the property data 
    * -- number of occurrences per value -- 
    */
    self.displayPropChart = function(){

        if ($scope.selectedProp == this.undefined)
            return;

        if (self.svg != null)
            d3.selectAll("svg").remove(); 
 
        self.dataValues = self.propDic[self.propID[$scope.selectedProp]]["_values"];       
        self.xMinVal = parseFloat($scope.xMinVal);
        if($scope.xMaxVal != undefined && self.prevProp == $scope.selectedProp){
            self.xMaxVal = parseFloat($scope.xMaxVal);
        }
        else {
            self.xMinVal = 0;
            self.xMaxVal = Math.floor(self.propDic[self.propID[$scope.selectedProp]]["_maxVal"] +1);
            $scope.xMinVal = self.xMinVal;
            $scope.xMaxVal = self.xMaxVal;
        }

        self.prevProp = $scope.selectedProp;
        self.margin = {top: 20, right: 10, bottom: 20, left: 50};
        var yPadding = 30;
        var xPadding = 50;
        
        self.width = window.innerWidth*0.75 - self.margin.left - self.margin.right,
        self.height = window.innerHeight*self.histogramPreHeight - self.margin.top - self.margin.bottom;
        self.totWidth = self.width + self.margin.left + self.margin.right;
        // append the svg object to the body of the page
        self.svg = d3.select("#my_histogram")
        .append("svg")
            .attr("width", self.width + self.margin.left + self.margin.right)
            .attr("height", self.height + self.margin.top + self.margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + self.margin.left + "," + self.margin.top +")");

        self.x = d3.scaleLinear()
            .domain([self.xMinVal, self.xMaxVal])     
            .range([xPadding, self.width]);

        self.svg.append("g")
                .attr("transform", "translate(0," + (self.height-yPadding) + ")")
                .call(d3.axisBottom(self.x));

        // set the parameters for the histogram
        var histogram = d3.histogram()
            .domain(self.x.domain())  // then the domain of the graphic
            .thresholds(self.x.ticks(100)); // then the numbers of bins

        // And apply this function to data to get the bins
        var bins = histogram(self.dataValues);

        self.yMax = d3.max(bins, function(d) { return d.length; });
        //create Y axis
        self.y = d3.scaleLinear()
            .range([self.height, xPadding])
            .domain([0, self.yMax]);
        //add Y axis
        self.svg.append("g")
            .attr("transform", "translate(" + xPadding + ", -" + yPadding + ")")
            .call(d3.axisLeft(self.y));
        // y axis title
        self.svg.append('g')
        .attr('transform', 'translate(' + 0 + ', ' + (self.height-yPadding)/2 + ')')
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .text('Number Of Occurrences');
        // x axis title
        self.svg.append('g')
        .attr('transform', 'translate(' + (self.width+xPadding)/2 + ', ' + self.height + ')')
        .append('text')
        .attr('text-anchor', 'middle')
        .text('Value');
        // graph axis
        self.svg.append('g')
        .attr('transform', 'translate(' + (self.width)/2 + ', ' + 0 + ')')
        .append('text')
        .attr('text-anchor', 'middle')
        .style("fill", "#000000")
        .style("font-weight","bold")
        .text('All Data Histogram');

        // append the bar rectangles to the svg element - add data
        self.svg.selectAll("rect")
            .data(bins)
            .enter()
            .append("rect")
                .attr("x", 1)
                .attr("transform", function(d) { return "translate(" + self.x(d.x0) + "," + (self.y(d.length)-yPadding) + ")"; })
                .attr("width", function(d) { return self.x(d.x1) - self.x(d.x0) ; })
                .attr("height", function(d) { return self.height - self.y(d.length); })
                .style("fill", "#A4A4A4")
       
        
        self.drawBounds();
        if (self.valuesPerClassBinsDic != null && self.numOfDis > 0){
            self.selectdDisNames.forEach(value => {
                self.displayDiscretizationChart(value);
            });
        }

        self.displayClassesChart();
    }

    /**
     * This method dispalys the classes chart in case there is information about the classes
     */
    self.displayClassesChart = function(){

        if (self.valuesPerClassesDic == undefined)
            return;
            
        let class0_key = "('" + self.propID[$scope.selectedProp] + "', 0.0)";
        let class1_key = "('" + self.propID[$scope.selectedProp] + "', 1.0)";
        var keys = [class0_key , class1_key];

        var width = self.totWidth - self.margin.left - self.margin.right;
        var classesDensity = {}
        var maxY = 0;
        var yPadding = 30;
        var xPadding = 50;

        self.svg = d3.select("#my_histogram")
        .append("svg")
            .attr("width", width + self.margin.left + self.margin.right)
            .attr("height", self.height + self.margin.top + self.margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + self.margin.left + "," + self.margin.top + ")"); 
        
        // create x Axis
        var x = d3.scaleLinear()
            .domain([self.xMinVal, self.xMaxVal]) 
            .range([xPadding, width]);
        // add x axis
        self.svg.append("g")
            .attr("transform", "translate(0," + (self.height-yPadding) + ")")
            .call(d3.axisBottom(x));        

        for (let i = 0; i < keys.length; i++){

            // get the data
            var data = self.valuesPerClassesDic[keys[i]];
      
            // Compute kernel density estimation
            var kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(100))
            var density =  kde( data.map(function(d){  return d; }) )
            classesDensity[i] = density;

            // find y max value
            var currY = 100*d3.max(density, function(d) { return d[1]; });
            if (currY > maxY)
                maxY = currY;

        }

        //create y axis
        var y = d3.scaleLinear()
            .range([self.height, xPadding])
            .domain([0, maxY]); 
        //add y axis
        self.svg.append("g")
            .attr("transform", "translate(" + xPadding + ", -" + yPadding + ")")
            .call(d3.axisLeft(y));

        for (let i = 0; i < keys.length; i++){
            // add the data to the graph
            self.svg.append("path")
                    .datum(classesDensity[i])
                    .attr("opacity", ".9")
                    .attr("fill", "none")
                    .attr("stroke", self.classesColors[i])
                    .attr("stroke-width", 2.3)
                    .attr("stroke-linejoin", "round")
                    .attr("d",  d3.line()
                        .curve(d3.curveBasis)
                        .x(function(d) { return x(d[0]); })
                        .y(function(d) { return y(d[1]*100) - yPadding; })
                );
        }

        //x axis title
        self.svg.append("text")
            .attr("x", width / 2 )
            .attr("y", 0)
            .style("fill", "#0066ff")
            .style("font-weight","bold")
            .style("text-anchor", "middle")
            .text("Classes Density Distribution");
        //y axis title
        self.svg.append('g')
            .attr('transform', 'translate(' + 0 + ', ' + (self.height-yPadding)/2 + ')')
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('transform', 'rotate(-90)')
            .text('Precentage');
        //Grtaph Title
        self.svg.append('g')
            .attr('transform', 'translate(' + (width+xPadding)/2 + ', ' + self.height + ')')
            .append('text')
            .attr('text-anchor', 'middle')
            .text('Value');
        
    }

    //Functions to compute density
    function kernelDensityEstimator(kernel, X) {
        return function(V) {
            return X.map(function(x) {
                var x = [x, d3.mean(V, function(v) { 
                    return kernel(x - v); })];
                return x;
            });
        };
    }
    function kernelEpanechnikov(k) {
        return function(v) {
            var x = Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
            return x;  
        };
    }
    //adds the hougobot bounds to the property graph 
    self.drawBounds = function(){

        if (self.svg == null)
            return;
        
        var selectList = document.getElementById("cbf");
        self.svg.selectAll("line").remove();
        self.numOfDis = 0;
        self.selectdDisNames = [];
        self.tooltipDic = {};
        self.boundsTooltip = {}
        for (let i = 0; i < selectList.length ; i++){           
            if (selectList[i].checked == true){
                self.numOfDis += 1;
                self.selectdDisNames.push(selectList[i].value);
                var bounds = self.propDic[self.propID[$scope.selectedProp]]["_bounds_dic"]
                    for (let j = 0 ; j < bounds[selectList[i].value].length ; j++){
                        if (bounds[selectList[i].value][j] >= self.xMinVal && bounds[selectList[i].value][j] <= self.xMaxVal){
                            self.boundsTooltip[bounds[selectList[i].value][j]] = self.getTooltip(bounds[selectList[i].value][j])
                            self.svg.append("line")
                                .attr("x1", self.x(bounds[selectList[i].value][j]))
                                .attr("x2", self.x(bounds[selectList[i].value][j]))
                                .attr("y1", self.y(0)-30)
                                .attr("y2", self.y(self.yMax)-30)
                                .attr("stroke", self.colorDic[selectList[i].value])
                                .attr("stroke-width", self.linesWidth)
                                .on("mouseover", function(d){
                                    return self.boundsTooltip[bounds[selectList[i].value][j]].style("visibility", "visible");})
                                .on("mousemove", function(d){
                                    return self.boundsTooltip[bounds[selectList[i].value][j]].style("top", (d3.event.pageY-25)+"px").style("left",(d3.event.pageX+10)+"px");})
                                .on("mouseout", function(d){
                                    return self.boundsTooltip[bounds[selectList[i].value][j]].style("visibility", "hidden");});
                    }
                }
            }
        }
        if (self.numOfDis == 1)
            self.numOfDis = 2;

    }
    /**
     * This method gets a discretization name and displays the graph of that
     * discretization data per bins (only in case there is inforamtion about the classes) 
     */
    self.displayDiscretizationChart = function(disName){       
        
        self.getClassesDataPerPropAndDis(self.propID[self.prevProp], disName);

        var width = (self.totWidth / self.numOfDis) - self.margin.left - self.margin.right;
        self.height = window.innerHeight*self.histogramPreHeight - self.margin.top - self.margin.bottom;
        
        var stackedData = d3.stack()
            .keys(self.subGroups)
            .value(function(d, key){
                return d[key];
            })
            (self.propBinData);

        var yPadding = 30;
        var xPadding = 40;

        var color = d3.scaleOrdinal()
            .domain(self.subGroups)
            .range([self.classesColors[0],self.classesColors[1]])

        // append the svg object to the body of the page
        self.svg1 = d3.select("#my_classesBarChart")
        .append("svg")
            .attr("width", width + self.margin.left + self.margin.right)
            .attr("height", self.height + self.margin.top + self.margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + self.margin.left + "," + self.margin.top + ")"); 

        var x = d3.scaleBand()
            .domain(self.propBinLabels)   
            .range([xPadding, width])
            .padding([0.1]);
        //add x axis
        self.svg1.append("g")
                .attr("transform", "translate(0," + (self.height-yPadding) + ")")
                .call(d3.axisBottom(x));

        // create y axis
        var y = d3.scaleLinear()
            .range([self.height, xPadding]);
        y.domain([0, self.classYMax+self.yPrecentTopGap]);  
        //add y axis
        self.svg1.append("g")
            .attr("transform", "translate(" + xPadding + ", -" + yPadding + ")")
            .call(d3.axisLeft(y));
        //add graph title
        self.svg1.append("text")
            .attr("x", width / 2 )
            .attr("y", 0)
            .style("fill", self.colorDic[disName])
            .style("font-weight","bold")
            .style("text-anchor", "middle")
            .text(disName);
        //add y axis title
        self.svg1.append('g')
            .attr('transform', 'translate(' + 0 + ', ' + (self.height-yPadding)/2 + ')')
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('transform', 'rotate(-90)')
            .text('Precentage');
        //add x axis title
        self.svg1.append('g')
            .attr('transform', 'translate(' + (width+xPadding)/2 + ', ' + self.height + ')')
            .append('text')
            .attr('text-anchor', 'middle')
            .text('Labels');

        self.svg1.append("g")
        .selectAll("g")
        .data(stackedData)
        .enter().append("g")
          .attr("fill", function(d) { return color(d.key); })
          .selectAll("rect")
          .data(function(d) { 
              return d; })
          .enter().append("rect")
            .attr("x", function(d) { return x(d.data.binLabel); })
            .attr("y", function(d) { return y(d[1]-d[0]) - yPadding; })
            .attr("height", self.lineHeight)
            .attr("width",x.bandwidth())
            .on("mouseover", function(d){ return self.tooltipDic[Number((d[1]-d[0]).toFixed(self.toRoundKey))].style("visibility", "visible");})
            .on("mousemove", function(d){ return self.tooltipDic[Number((d[1]-d[0]).toFixed(self.toRoundKey))].style("top", (event.pageY-25)+"px").style("left",(event.pageX+10)+"px");})
            .on("mouseout", function(d){ return self.tooltipDic[Number((d[1]-d[0]).toFixed(self.toRoundKey))].style("visibility", "hidden");});
        

    }
        
    /**
     * This method sets to the relevant fields the data about
     * the bins (labels and values)
     */
    self.getClassesDataPerPropAndDis = function(propID, disName){
        self.propBinData = [];
        self.propBinLabels = [];
        ($rootScope.states).forEach(value => {
            let hasName = Object.keys(value).includes("BinLabel");
            let isRightProp = propID == value["TemporalPropertyID"];
            if (isRightProp && hasName && !(self.propBar).includes(value["BinLabel"]))
                self.propBinLabels.push(value["BinLabel"]);
            else if (isRightProp && !hasName) 
                self.propBinLabels.push(value["BinID"]);
            if (isRightProp)
                self.propBinData.push({"binLabel":self.propBinLabels[self.propBinLabels.length-1]});  

            
        });
        self.subGroups = [];
        self.classYMax = 0;
        for (let i = 0; i < self.numOfClasses; i++){
            key = "('" + propID + "', '" + disName + "', " + i + ".0)";
            var classAllValuesNum = 0;
            self.subGroups.push("class" + i);
            for (let j = 0; j < self.valuesPerClassBinsDic[key].length; j++)              
                classAllValuesNum += self.valuesPerClassBinsDic[key][j];
            // get Y axis values (precent)
            for (let j = 0; j < self.valuesPerClassBinsDic[key].length; j++){              
                self.propBinData[j]["class" + i] = (self.valuesPerClassBinsDic[key][j]/classAllValuesNum)*100;
                //find Maximum value at y axis
                if (self.propBinData[j]["class" + i] > self.classYMax)  
                    self.classYMax = self.propBinData[j]["class" + i];
            }
            for (let j = 0; j < self.propBinData.length; ++j){
                self.tooltipDic[Number((self.propBinData[j]["class" + i]).toFixed(self.toRoundKey))] = 
                self.getTooltip(Number((self.propBinData[j]["class" + i]).toFixed(2)) + "%");
            }
        }

    }
    /**
     * tooltips style 
     */
    self.getTooltip = function(value){
           
        var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("background", "#fff")
        .text(value)

        return tooltip;
    }


    window.onresize = function(){ 
        self.displayPropChart();
    }

}]);