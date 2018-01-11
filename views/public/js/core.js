// uncomment this line if the directive ends up working
// var app = angular.module('GXLeads', ['app.directives']);
var app = angular.module('GXLeads', ['ui.router', 'chart.js']);

// Beginning of router

app.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/home/stats');
  
  // First Page
  $stateProvider.state('home', {
    url: '/home',
    templateUrl: 'ui-navbar.ejs'
  })
  .state('home.stats', {
  	url: '/stats',
  	templateUrl: 'stats.ejs',
  	controller: 'statsController'
  })
    .state('home.leads', {
    url: '/leads',
    templateUrl: 'leads.ejs',
  })
    .state('home.dashboard', {
    url: '/dashboard',
    templateUrl: 'dashboard.ejs',
    controller: 'dashboardController'
  })
});


function dropdownController($scope, $http, $sce, dropdownFactory){


	$scope.kullanici = dropdownFactory.kullanici;
	$scope.access_code = dropdownFactory.access_code;
			
		// Populate client's campaigns in the dropdown
	$http.get('/api/campaigns')
		.success(function(data){
			$scope.campaigns = data;
			console.log('These are the camapaigns: ',data)
		})
		.error(function(data){
	});

	// Creating the initial iframe on page load
	 	$(function(){
    var $select = $(".1-100");
    // $select.prepend("<option value='allTime'>Always</option>");
    for (i=1;i<=100;i++){
     	   $select.append($("<option value='i'></option>").val(i).html("Last "+i+" Days"))
   		 }
   	});

		// Reset any or all of the 3 variable
	$scope.resetCampaign = function(){
        delete dropdownFactory.selectedCampaign;
	};

	$scope.resetUser = function(){
        delete dropdownFactory.selectedUser;
	};	

	$scope.resetDay = function(){
        delete dropdownFactory.selectedDay;
	};
	$(function(){
    var $select = $(".1-100");
    // $select.prepend("<option value='allTime'>Always</option>");
    for (i=1;i<=100;i++){
     	   $select.append($("<option value='i'></option>").val(i).html("Last "+i+" Days"))
   		 }
   	});

		// Reset any or all of the 3 variable
	$scope.resetCampaign = function(){
        delete dropdownFactory.selectedCampaign;
	};

	$scope.resetUser = function(){
        delete dropdownFactory.selectedUser;
	};	

	$scope.resetDay = function(){
        delete dropdownFactory.selectedDay;
	};

	// Change the iframe based on the user's selected 'Past X Days'
	$scope.daySelected = function() {
		// var selectedUser = $scope.selectedUser;
		console.log('you ran the daySelected function');
		dropdownFactory.updateIframe();
	};


	// Change the iframe based on the user's selected LinkedIn user

	$scope.userSelected = function() {
		// var selectedUser = $scope.selectedUser;
		console.log('you ran the userSelected function');
		dropdownFactory.updateIframe();
	};



	// Change the iframe based on the user's selected campaigns

	$scope.campaignSelected = function() {
		  // var selectedCampaign = $scope.selectedCampaign;
		  console.log('you ran the campaignSelected function');
		  dropdownFactory.updateIframe();	       		
	};

	

	// Populate client's LinkedIn users in the dropdown
	$http.get('/api/users')
		.success(function(data){
			$scope.users = data;
			dropdownFactory.users = $scope.users;
			console.log("hey from users function in core.js!")
			console.log('These are the users: ',data)
			})
		.error(function(data){
	});


};


function statsController($scope, $http, $sce){
	
	  $http.get('/api/intercom')
		.success(function(data){
			$scope.intercom = data;
			console.log('This is the object from intercom: ',data)
		})
		.error(function(data){
	  });

      $http.get('/api/messageStats')
        .success(function(data) {
            var datesArray = new Array;
                for(var i in data) {
                    datesArray.push(data[i].message_date);
            };
            console.log('this is the dates Array', datesArray);

            $scope.labels = datesArray;
            $scope.series = ['Invites', 'Followups','Second_Followups','Responses'];
            
            $scope.stats = data;
            
            var invitesArray = new Array;
                for(var i in data) {
                    invitesArray.push(data[i].invites);
            };
            var followupsArray = new Array;
                for(var i in data) {
                    followupsArray.push(data[i].followups);
            };
            var second_followupsArray = new Array;
                for(var i in data) {
                    second_followupsArray.push(data[i].second_followups);
            };
            var responsesArray = new Array;
                for(var i in data) {
                    responsesArray.push(data[i].responses);
            };

            console.log('these are the stats',data);
            console.log('This is the array with # of invites per day',invitesArray);
            console.log('This is the array with # of followups per day',followupsArray);
            
            var combinedArray = [invitesArray, followupsArray,second_followupsArray,responsesArray];
            console.log('this is the combinedArray',combinedArray);
            
            $scope.data = combinedArray;



        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

};


app.controller('dashboardController', function ($scope, $http, $sce, dropdownFactory){	

});	


function socialController($scope, $http, $sce, $document){

	$scope.formData = {};

	// Hiç bir şeye basılmadığında yani direk site açılğında router.js içerisine direk get methoduna gidiyor . 
	$http.get('/api/todos')
		.success(function(data) {
			$scope.gonderi = data;
			console.log($scope.gonderi.length,'veri geldi')
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});



	$scope.createTodo = function() { 
		$http.post('/api/todos', $scope.formData)
			.success(function(data) {
				$scope.formData = {}; // clear the form so our user is ready to enter another
				$scope.gonderi = data;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};
	


	
	$scope.addcomment = function(id) { 
		console.log("id"+id);
		$http.post('/api/comments/' + id, $scope.formData)
			.success(function(data) {
				$scope.formData = {}; // clear the form so our user is ready to enter another
				$scope.comment = data;
				
				console.log(data,'kadar');
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};
	
	

	
	$scope.viewcomment=function(id){
		console.log("id"+id);
		$http.get('/api/viewcomments/'+ id, $scope.formData)
			.success(function(data) {
				$scope.formData = {};
				$scope.comments = data;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};
	
	$scope.viewlikes=function(id){
		console.log("id"+id);
		$http.get('/api/viewlikes/'+ id, $scope.formData)
			.success(function(data) {
				$scope.formData = {};
				$scope.likes = data;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};
	
		
	$scope.likepost=function(id){
		console.log("id"+id);
		$http.get('/api/like/'+ id, $scope.formData)
			.success(function(data) {
				$scope.formData = {};
				$scope.likes = data;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};
};


app.factory('dropdownFactory', ['$http','$sce', function($http, $sce){
	console.log('instantiating dropdownFactory');

	var dropdownFactory = {};

	dropdownFactory.baseurl = 'https://meta-g.herokuapp.com/public/dashboard/7431c8e3-542e-4d21-a664-1abeccbac880';
	// var baseurl = 'https://meta-g.herokuapp.com/public/question/b71f7fda-4dfd-419e-b4ff-1b3418d1c147'
	dropdownFactory.selectedCampaign = '';
	dropdownFactory.selectedUser = '';
	dropdownFactory.newurl = '';
	dropdownFactory.newesturl = '';
	dropdownFactory.url = '';


	//get the client analytics code
	$http.get('/api/user')
		.success(function(data){
			dropdownFactory.kullanici = data;			
			dropdownFactory.access_code = data[0].client_analytics_code;

			var access_code = dropdownFactory.access_code;
			var baseurl = dropdownFactory.baseurl
			console.log("These are the user's details",data);
			
	        console.log('This is the analytics code:',access_code);
			
			var newurl = baseurl.concat('?access_code=',access_code);
			console.log(newurl);
			
        	dropdownFactory.url = $sce.trustAsResourceUrl(newurl);

        	
        	})
		.error(function(data){
	});


		// function for replacing all occurences of a specific substring
	String.prototype.replaceAll = function(target, replacement) {
		  return this.split(target).join(replacement);
	};


	dropdownFactory.updateIframe = function() {
		var currentUrl = $sce.valueOf(dropdownFactory.url);
		console.log('This is the url before anything changes',currentUrl);
         var access_code = $scope.access_code;
		 var newurl = baseurl.concat('?access_code=',access_code);

// campaign is selected, but not user or day
          if ((typeof dropdownFactory.selectedCampaign !== 'undefined') && (typeof dropdownFactory.selectedUser === 'undefined')
          			&& (typeof dropdownFactory.selectedDay === 'undefined') ) {
          	console.log('campaign is selected, but not user or day');
          	var selectedCampaign = $scope.selectedCampaign;
          	console.log('currently a campaign is selected');
          	var selectedCampaign = selectedCampaign.replaceAll('+', '%2B');
			var selectedCampaign = selectedCampaign.replaceAll('#', '%23');
			var newesturl = newurl.concat('&campaign_name=',selectedCampaign);
			
          }
// user is selected, but not campaign or day
          else if ((typeof dropdownFactory.selectedCampaign === 'undefined') && (typeof dropdownFactory.selectedUser !== 'undefined')
          			&& (typeof dropdownFactory.selectedDay === 'undefined')	) {
          	console.log('user is selected, but not campaign or day');
          	var selectedUser = $scope.selectedUser;
          	console.log('currently, a user is selected');
          	var newesturl = newurl.concat('&user_name=',selectedUser);
          
          } 

// Day is selected, but not user or campaign
 	else if ((typeof dropdownFactory.selectedCampaign === 'undefined') && (typeof dropdownFactory.selectedUser === 'undefined')
          			&& (typeof dropdownFactory.selectedDay !== 'undefined')	) {
 			// if(typeof $scope.muchacho === 'undefined') {
 			// var select = $document[0].getElementById('1-100');
 			// var opt = new Option('All Time', 'my-option');
 			// select.insertBefore(opt, select.firstChild);
 			// $scope.muchacho = 'mister muchacho';
 			// 									}
          	console.log('Day is selected, but not user or campaign');
          	$scope.selectedDay = $(".1-100").find(":selected").val();// set this equal to scope.selected Day
          	var selectedDay = dropdownFactory.selectedDay;
          	console.log(selectedDay);
          	var newesturl = newurl.concat('&last_x_days=',selectedDay);
          	console.log(newesturl);
          } 


// User and campaign are selected, but not day
          else if ((typeof dropdownFactory.selectedCampaign !== 'undefined') && (typeof dropdownFactory.selectedUser !== 'undefined') 
          			&& (typeof dropdownFactory.selectedDay === 'undefined')	) {
          	console.log('User and campaign are selected, but not day');
          	var selectedCampaign = dropdownFactory.selectedCampaign;
          	console.log(selectedCampaign);
          	var selectedUser = dropdownFactory.selectedUser;
          	console.log(selectedUser);
          	var selectedCampaign = selectedCampaign.replaceAll('+', '%2B');
			var selectedCampaign = selectedCampaign.replaceAll('#', '%23');

			// var currentUrl = $sce.valueOf($scope.url);
			var newesturl = newurl.concat('&campaign_name=',selectedCampaign);
			var newesturl = newesturl.concat('&user_name=',selectedUser);
			dropdownFactory.url = $sce.trustAsResourceUrl(newesturl);
			// $scope.url = $sce.trustAsResourceUrl(newesturl);
			
          } 

// User and campaign are selected, but not day
          else if ((typeof dropdownFactory.selectedCampaign !== 'undefined') && (typeof dropdownFactory.selectedUser !== 'undefined') 
          			&& (typeof dropdownFactory.selectedDay === 'undefined')	) {
          	console.log('User and campaign are selected, but not day');
          	var selectedCampaign = dropdownFactory.selectedCampaign;
          	console.log(selectedCampaign);
          	var selectedUser = dropdownFactory.selectedUser;
          	console.log(selectedUser);
          	var selectedCampaign = selectedCampaign.replaceAll('+', '%2B');
			var selectedCampaign = selectedCampaign.replaceAll('#', '%23');

			// var currentUrl = $sce.valueOf($scope.url);
			var newesturl = newurl.concat('&campaign_name=',selectedCampaign);
			var newesturl = newesturl.concat('&user_name=',selectedUser);
			

		}

//Campaign and Day
		 else if ((typeof dropdownFactory.selectedCampaign !== 'undefined') && (typeof dropdownFactory.selectedUser === 'undefined') 
          			&& (typeof dropdownFactory.selectedDay !== 'undefined')	) {
		 	var selectedCampaign = dropdownFactory.selectedCampaign;
		 	dropdownFactory.selectedDay = $(".1-100").find(":selected").val();// set this equal to scope.selected Day
          	var selectedDay = dropdownFactory.selectedDay;
          	console.log(selectedDay);
          	var selectedCampaign = selectedCampaign.replaceAll('+', '%2B');
			var selectedCampaign = selectedCampaign.replaceAll('#', '%23');
          	var newurl = newurl.concat('&last_x_days=',selectedDay);
          	var newesturl = newurl.concat('&campaign_name=',selectedCampaign);
		 }

//User and Day
		 else if ((typeof dropdownFactory.selectedCampaign === 'undefined') && (typeof dropdownFactory.selectedUser !== 'undefined') 
          			&& (typeof dropdownFactory.selectedDay !== 'undefined')	) {
		 	var selectedUser = dropdownFactory.selectedUser;
		 	dropdownFactory.selectedDay = $(".1-100").find(":selected").val();// set this equal to scope.selected Day
          	var selectedDay = dropdownFactory.selectedDay;
          	var newesturl = newurl.concat('&last_x_days=',selectedDay);
		 	var newesturl = newesturl.concat('&user_name=',selectedUser);
		 }
// All 3
          else {
          	console.log('All 3 are selected');
          	var selectedUser = dropdownFactory.selectedUser;
		 	dropdownFactory.selectedDay = $(".1-100").find(":selected").val();// set this equal to scope.selected Day
          	var selectedDay = dropdownFactory.selectedDay;
          	var selectedCampaign = dropdownFactory.selectedCampaign;
          	var selectedCampaign = selectedCampaign.replaceAll('+', '%2B');
			var selectedCampaign = selectedCampaign.replaceAll('#', '%23');
          	var newesturl = newurl.concat('&last_x_days=',selectedDay);
		 	var newesturl = newesturl.concat('&user_name=',selectedUser);
		 	var newesturl = newesturl.concat('&campaign_name=',selectedCampaign);
          }

          dropdownFactory.url = $sce.trustAsResourceUrl(newesturl);

	};

	return dropdownFactory;

}]);