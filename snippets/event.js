$scope.$on('$locationChangeStart', function(event, newUrl) {
	console.log(event, newUrl);
	//event.preventDefault();
	$scope.$broadcast('currentUser', {user: 'davy engone'});

	//$rootScope.$emit('currentUser', {user: 'davy engone'});
});

// $routeChangeSuccess
// $routeChangeError
// $locationChangeStart
// $locationChangeSuccess

$scope.$on('$routeChangeStart', function(event, route) { 
	debugger
	console.log(event, route);   
});

$scope.$on('currentUser', function(data){
	debugger
});

$rootScope.$on('currentUser', function(event, data){
	debugger
});