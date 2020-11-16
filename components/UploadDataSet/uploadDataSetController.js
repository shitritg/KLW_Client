angular.module('Visualization')
    .controller('uploadDataSetController', ['$scope', '$rootScope', '$location', '$http', 'service','localStorageModel','$timeout', function ($scope, $rootScope, $location, $http, service,localStorageModel,$timeout) {
 

        let self = this;
        let serverUrl = service.serverUrl;
        self.editMode = $rootScope.editMode;

        self.initForm = function(){
            if ($rootScope.editMode == false)
            {
                $scope.dataSetName = "";
                document.getElementsByName("dataSetName")[0].value = "";
                $scope.className = "";
                document.getElementsByName("timestamp")[0].value = "Years";
                $scope.timestamp = "Years";
                document.getElementsByName("className")[0].value = "";
                $scope.secclassName = "";
                document.getElementsByName("secclassName")[0].value = "";
                $scope.userName = "";
                document.getElementsByName("userName")[0].value = "";
                $scope.Comments = ""
                document.getElementsByName("Comments")[0].value = "";
                $scope.file1 = undefined
                $scope.file2 = undefined
                $scope.file3 = undefined
                $scope.file4 = undefined
                $scope.file5 = undefined
                //$scope.file6 = undefined
              $("input[type='file']").val('');
            }
            else
            {
                dataSet = $rootScope.selcetedDataSet; 
                //reset all models
                $scope.file1 = undefined
                $scope.file2 = undefined
                $scope.file3 = undefined
                $scope.file4 = undefined
                $scope.file5 = undefined
                $scope.file6 = undefined
                //insert old values to te edit form
                document.getElementById("dataSetName").value = dataSet.data_set_name;
                $scope.dataSetName = dataSet.data_set_name;
                document.getElementById("className").value = dataSet.class_name;
                $scope.className = dataSet.class_name;
                document.getElementById("timestamp").value = dataSet.timestamp;
                $scope.timestamp = dataSet.timestamp;
                document.getElementById("userName").value = dataSet.username;
                $scope.userName = dataSet.username;
                document.getElementById("secclassName").value = dataSet.second_class_name;
                $scope.secclassName = dataSet.second_class_name;
                document.getElementById("Comments").value = dataSet.comments;
                $scope.Comments =  dataSet.comments;
                $("input[type='file']").val('');
            }
        }
        $('.custom-file input').change(function (e) {
            if(e.target.files[0] != undefined)
            {
                $(this).next('.custom-file-label').html(e.target.files[0].name);
            }
            else
            {
                switch(e.target.id) {
                    case 'file1':
                            if (!self.editMode || $rootScope.selcetedDataSet.output_file_name == 'File does not exist')
                            {
                                $(this).next('.custom-file-label').html('KL output file');
                            }
                            break;
                    case 'file2':
                            if (!self.editMode || $rootScope.selcetedDataSet.states_file_name == 'File does not exist')
                            {
                                $(this).next('.custom-file-label').html('states file');
                            }
                            break;
                    case 'file3':
                            if (!self.editMode || $rootScope.selcetedDataSet.entities_file_name == 'File does not exist')
                            {
                                $(this).next('.custom-file-label').html('entities file');
                            }
                            break;
                    case 'file4':
                            if (!self.editMode || $rootScope.selcetedDataSet.raw_data_file_name == 'File does not exist')
                            {
                                $(this).next('.custom-file-label').html('raw data file');
                            }
                            break;
                    case 'file5':
                            if (!self.editMode || $rootScope.selcetedDataSet.second_class_output_file_name == 'File does not exist')
                            {
                                $(this).next('.custom-file-label').html('KL output file class 1');
                            }
                            break;
                    // case 'file6':
                    //     $(this).next('.custom-file-label').html('time intervals file');
                    //     break;
                  }



            }

        });

        self.submit = function (mode,validation) {
            if (validation)
            {
                if (!self.editMode)
                {
                    if ($scope.file1 == undefined && $scope.file5 != undefined)
                    {
                        alert("Do not upload a dataset with KL output file for class 0 without KL output file for class 1");
                        return;
                    }
                    if ($scope.file1 != undefined)
                    {
                        if ($scope.file2 == undefined)
                        {
                            alert("Do not upload a dataset with KL output file for class 1 without state file");
                            return;
                        }
                    }
                    if ($scope.file4 != undefined)
                    {
                        if ($scope.file2 == undefined)
                        {
                            alert("Do not upload a dataset with rawData file without state file");
                            return;
                        }
                    }

                }
                else
                {
                    if (($scope.file1 == undefined && $rootScope.selcetedDataSet.output_file_name == 'File does not exist') && $scope.file5 != undefined)
                    {
                        alert("Do not upload a dataset with KL output file for class 0 without KL output file for class 1");
                        return;
                    }
                    if ($scope.file1 != undefined && $rootScope.selcetedDataSet.output_file_name != 'File does not exist')
                    {
                        if ($scope.file2 == undefined && $rootScope.selcetedDataSet.states_file_name == 'File does not exist') 
                        alert("Do not upload a dataset with KL output file without state file");
                        return;
                    }
                    if ($scope.file4 != undefined)
                    {
                        if ($scope.file2 == undefined && $rootScope.selcetedDataSet.states_file_name == 'File does not exist')
                        alert("Do not upload a dataset with rawData file without state file");
                        return;
                    } 
                }

            let form = new FormData();
            form.append('data_set_name', $scope.dataSetName)
            form.append('className', $scope.className)
            form.append('timestamp', $scope.timestamp)
            form.append('secondclassName', $scope.secclassName)
            form.append('username', $scope.userName)
            form.append('comments', $scope.Comments)
            form.append('output', $scope.file1)
            form.append('states', $scope.file2)
            form.append('entities', $scope.file3)
            form.append('rawData', $scope.file4)
            // form.append('data_set_to_copy_from', "Sepsis_Cohorts_v.s_0.4_gap_90")
            form.append('secondClassOutput', $scope.file5)
            if(mode == 'edit')
            {
                form.append('old_data_set_name',$rootScope.selcetedDataSet.data_set_name)
            }
            $('#myModal').modal({
                backdrop: 'static',
                keyboard: false
            })
            //let dataSet = $rootScope.selcetedDataSet;
            $rootScope.selcetedDataSet = undefined;
            var url = serverUrl + `upload`;
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
                    $("#myModal").modal("hide");
                    //$rootScope.selcetedDataSet = dataSet;
                    $rootScope.uploadedDataSetName = $scope.dataSetName;
                    self.initilizeRootScope();
                    alert("Upload completed");
                    //$rootScope.selcetedDataSet.data_set_name
                    $rootScope.location = 'Files';
                    $timeout(function(){
                        $location.path('/'); 
                        return;
                     })
                    
                }
            })
            .catch(async (response)=> {
                //error   
                try{
                msg= await response.json()
                } catch(e){
                    msg={errMsg:'Internal Error'};
                }
                $("#myModal").modal("hide");
                $timeout(function(){
                alert("Something went wrong.\n"+ msg.errMsg+ "\nPlease Try Again") 
                //$rootScope.location = 'Files';
                //$scope.$apply(function () { $location.path('/')} );
                return;
            })
            });   
            }
            // $http.post(serverUrl + "upload", form)
            //     .then(function (response) {
            //         //self.reg.content = response.data;
            //         if (response.data.status == 'OK')
            //         {
            //             window.alert("uploaded successfully")
            //             $location.path('/tirps')
            //         }
            //         else 
            //         window.alert("uploaded failed - DataSet already Exist!")
        
            //     }, function (response) {
            //  //       self.reg.content = response.data
            //         //Second function handles error
            //         // self.reg.content = "Something went wrong";
            //         window.alert("something went wrong")
            //     });
        }

        self.initilizeRootScope = function()
        {
          $rootScope.entities = [];
          $rootScope.states = [];
          $rootScope.rootElements = [];
          $rootScope.pathOfTirps = [];
          $rootScope.ptirpsRootElements = [];
          $rootScope.ptirpsPathOfTirps = [];
          $rootScope.weights = [0.34,0.33,0.33]
        }
}]);