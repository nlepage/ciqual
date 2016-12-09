var app = angular.module("ciqual", [ "ngResource" ]);

app.factory("Ingredients", [ "$resource" , function($resource) {
	return $resource("ciqual.json");
} ]);

app.controller("CiqualController", [ "$scope", "Ingredients", function($scope, Ingredients) {
	$scope.ingredients = Ingredients.query();
} ])