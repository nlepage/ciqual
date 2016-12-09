var app = angular.module("ciqual", [ "ngResource", "siyfion.sfTypeahead" ]);

app.factory("Ingredients", [ "$resource" , function($resource) {
	return $resource("ciqual.json");
} ]);

app.controller("CiqualController", [ "$scope", "Ingredients", function($scope, Ingredients) {
	$scope.ingredients = [];
	$scope.selectedIngredient = null;

	var ingredients = new Bloodhound({
		datumTokenizer : function(d) { return Bloodhound.tokenizers.whitespace(d.libelle); },
		queryTokenizer : Bloodhound.tokenizers.whitespace,
		identify : function(d) { return d.id; },
		prefetch : "ciqual.json"
	});

	$scope.ingredientsDataset = {
		displayKey : 'libelle',
		source : ingredients.ttAdapter()
	};

	// FIXME Typeahead options object
	$scope.exampleOptions = {
		highlight: true
	};
} ])