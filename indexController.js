angular.module('Visualization')
    .controller('indexController',['$location','$http','localStorageModel','service','$rootScope','$scope','$timeout' ,function ($location,$http,localStorageModel,service,$rootScope,$scope,$timeout) {


        self = this;
         $rootScope.homePath= "#/";
        //  $rootScope.dataSetLoaded = false;
        //  $rootScope.test = false;
        //  $rootScope.loginPressed = false
        // $rootScope.loglbl = "login"
        $rootScope.entities = [];

    // self.goHome = function () {
    //     $location.path('/')
    // }


    self.changeLocation = function (location) {
        if ($rootScope.selcetedDataSet == this.undefined)
        {
            if (location != 'Files' && location !='upload')
            {
                alert('Please select a dataset!')
                return;
            }
        }
        switch(location) {
            case 'Files':
                    if($rootScope.data_set_name_from_url)
                    {
                        $location.path('/'+$rootScope.data_set_name_from_url);
                        $rootScope.location = location;
                        break;
                    }
                    else
                    {
                        $location.path('/');
                        $rootScope.location = location;
                        break;
                    }
            case 'upload':
                $rootScope.editMode = false;
                $location.path('/upload');
                $rootScope.location = location;
                break;
            case 'Analysis':
                if (($rootScope.selcetedDataSet.raw_data_file_name != 'File does not exist') & $rootScope.selcetedDataSet.states_file_name != 'File does not exist')
                {
                    $location.path('/analysis');
                    $rootScope.location = location;
                }
                else
                {
                    alert('You are missing files! Please check if the selected dataSet has raw data and states files');
                }
                break;
            case 'states':
                if ($rootScope.selcetedDataSet.states_file_name != 'File does not exist')
                {
                    $location.path('/states')
                    $rootScope.location = location;
                }
                else
                {
                    alert('No state file exists for the selected dataSet');
                }
                break;
            case 'entities':
                if ($rootScope.selcetedDataSet.entities_file_name != 'File does not exist')
                {
                    $location.path('/entities')
                    $rootScope.location = location;
                    
                }
                else
                {
                    alert('No entities file exists for the selected dataSet');
                }
                break;
            case 'TIRPs':
                if ($rootScope.selcetedDataSet.output_file_name != 'File does not exist' & $rootScope.selcetedDataSet.states_file_name != 'File does not exist')// & $rootScope.selcetedDataSet.entities_file_name != 'File does not exist')
                {
                    $timeout(function () {
                    $location.path('/tirps')
                    $rootScope.location = location;
                    })
                }
                else
                {
                    alert('You are missing files! Please check if the selected dataSet has the following files -KL output, entities and states');
                }
                break;
            case 'TIRP entities':
                if ( $rootScope.pathOfTirps.length > 0 && $rootScope.selcetedDataSet.entities_file_name != 'File does not exist')
                {
                    $location.path('/tirpEntities')
                    $rootScope.location = location;
                }
                else if ( $rootScope.pathOfTirps.length == 0)
                {
                    alert('No TIRP was selected from the TIRPs tab');
                }
                else
                {
                    alert('No entities file exists for the selected dataSet');
                }
                break;
            case 'search':
                if ($rootScope.selcetedDataSet.output_file_name != 'File does not exist' & $rootScope.selcetedDataSet.states_file_name != 'File does not exist')// && $rootScope.selcetedDataSet.entities_file_name != 'File does not exist')
                {
                    $location.path('/search')
                    $rootScope.location = location;
                }
                else
                {
                    alert('You are missing files! Please check if the selected data has the following files -KL output file, entities file and states file');
                }
                break;
            case 'searchTbl':
                if ($rootScope.selcetedDataSet.output_file_name != 'File does not exist' & $rootScope.selcetedDataSet.states_file_name != 'File does not exist')// && $rootScope.selcetedDataSet.entities_file_name != 'File does not exist')
                {
                    $location.path('/searchTbl')
                    $rootScope.location = location;
                }
                else
                {
                    alert('You are missing files! Please check if the selected data has the following files -KL output file, entities file and states file');
                }
                break;
            case 'psearch':
                if ($rootScope.selcetedDataSet.output_file_name != 'File does not exist' & $rootScope.selcetedDataSet.second_class_output_file_name != 'File does not exist' & $rootScope.selcetedDataSet.states_file_name != 'File does not exist')//& $rootScope.selcetedDataSet.entities_file_name != 'File does not exist')
                {
                    $location.path('/psearch')
                    $rootScope.location = location;
                }
                else
                {
                    alert('You are missing files! Please check if the selected data has the following files -KL output from both classes, entities file and states file');
                }
                break;
            case 'psearchTbl':
                if ($rootScope.selcetedDataSet.output_file_name != 'File does not exist' & $rootScope.selcetedDataSet.second_class_output_file_name != 'File does not exist' & $rootScope.selcetedDataSet.states_file_name != 'File does not exist')//& $rootScope.selcetedDataSet.entities_file_name != 'File does not exist')
                {
                    $location.path('/psearchTbl')
                    $rootScope.location = location;
                }
                else
                {
                    alert('You are missing files! Please check if the selected data has the following files -KL output from both classes, entities file and states file');
                }
                break;
            case 'predictive TIRPs':
                if ($rootScope.selcetedDataSet.output_file_name != 'File does not exist' & $rootScope.selcetedDataSet.second_class_output_file_name != 'File does not exist' & $rootScope.selcetedDataSet.states_file_name != 'File does not exist')// & $rootScope.selcetedDataSet.entities_file_name != 'File does not exist') & $rootScope.selcetedDataSet.class_name != "" & $rootScope.selcetedDataSet.second_class_name != "")
                {
                    $location.path('/predictive')
                    $rootScope.location = location;
                }
                else
                {//the selected data has the names of both classes and
                    alert('You are missing files! Please check if the following files -KL output from both classes and states');
                }
                break;
            default:
                $location.path('/');
                $rootScope.location = 'Files';
          }
    }

    $scope.is_highlight = function(location) {
        if ($rootScope.location == location)
        {
            return true;
        }
        else
        {
              return false;
        }
    
      };

      self.goHome = function()
      {
        $rootScope.location = 'Files';
        $location.path('/');
      }


    }]);
