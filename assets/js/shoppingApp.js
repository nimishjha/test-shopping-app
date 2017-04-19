var shoppingAppModule = angular.module('shoppingApp', ["ngRoute"]);

shoppingAppModule.config(function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl: "assets/views/grid.html",
		controller: "gridController as gridCtrl",
		activeTab: "grid"
	})
	.when('/cart', {
		templateUrl: "assets/views/cart.html",
		controller: "cartController as cartCtrl",
		activeTab: "cart"
	});
});

shoppingAppModule.controller('MainController', ['$log', function($log) {
	var self = this;
	self.products = [];
	self.recommendedProducts = [];
	self.cart = {
		items: [],
		totalCost: 0
	};
	self.recommendedProductsPercentage = 0;
	var productItem;
	self.productsData = [
	 	{ "recommendation": { "currentLevel": 79, "maxLevel": 100 }, "items": [ { "id": "10600", "title": "Hampton Cookset - 8 Piece", "category": "STAINLESS STEEL", "imageUrl": "http://localhost/unico/assets/images/001.jpg", "unitsInCartons": 10, "unitCost": 4.52, "packSize": 10, "secondaryCategory": "Chairs" }] },
	 	{ "recommendation": { "currentLevel": 79, "maxLevel": 100 }, "items": [ { "id": "10870", "title": "MELAMINE BOWL", "category": "BOWLS", "imageUrl": "http://localhost/unico/assets/images/002.jpg", "unitsInCartons": 6, "unitCost": 0.93, "packSize": 5, "secondaryCategory": "Kids Home" }, { "id": "10820", "title": "PP YUM YUM CUP", "category": "CUPS/MUGS", "imageUrl": "http://localhost/unico/assets/images/003.jpg", "unitsInCartons": 12, "unitCost": 0.7, "packSize": 25, "secondaryCategory": "Kids Home" }] }
	];
	angular.forEach(self.productsData, function(product){
		if(product.items.length === 1)
		{
			productItem = angular.copy(product.items[0]);
			productItem.recommendationPercentage = product.recommendation.currentLevel;
			self.products.push(productItem);
			// $log.info(self.products);
		}
		else
		{
			var recommendationPerc = product.recommendation.currentLevel;
			angular.forEach(product.items, function(product){
				productItem = angular.copy(product);
				self.recommendedProductsPercentage = recommendationPerc;
				self.recommendedProducts.push(productItem);
			});
			// $log.info(self.recommendedProducts);
		}
	});

	self.addToCart = function(itemId){
		$log.info("Adding item id " + itemId + " to cart");
		var item = self.getItemById(itemId);
		var isItemAlreadyInCart = false;
		for(var i = 0, ii = self.cart.items.length; i < ii; i++)
		{
			if(self.cart.items[i].id === itemId)
			{
				isItemAlreadyInCart = true;
				$log.info("already in cart");
				self.cart.items[i].quantity++;
				break;
			}
		}
		if(!isItemAlreadyInCart)
		{
			item.quantity = 1;
			self.cart.items.push(item);
		}
		self.cart.totalCost += item.unitCost * item.unitsInCartons;
		$log.info(self.cart);
	};

	self.deleteItemFromCart = function(itemId){
		for(var i = 0, ii = self.cart.items.length; i < ii; i++)
		{
			if(self.cart.items[i].id === itemId)
			{
				self.cart.items.splice(i, 1);
				break;
			}
		}
		self.updateCartTotal();
		$log.info(self.cart);
	};

	self.updateCartTotal = function(){
		var totalCost = 0;
		angular.forEach(self.cart.items, function(item){
			if(isNaN(item.quantity))
				item.quantity = 0;
			totalCost += item.quantity * item.unitsInCartons * item.unitCost;
		});
		self.cart.totalCost = totalCost;
		$log.info("Total cost of items in cart is now " + totalCost);
	};

	self.getItemById = function(itemId){
		for(var i = 0, ii = self.products.length; i < ii; i++)
		{
			if(self.products[i].id === itemId)
			{
				return self.products[i];
			}
		}
		for(i = 0, ii = self.recommendedProducts.length; i < ii; i++)
		{
			if(self.recommendedProducts[i].id === itemId)
			{
				return self.recommendedProducts[i];
			}
		}
	};

}]);

shoppingAppModule.directive('integer', function() {
	return {
		require: 'ngModel',
		link: function(scope, elm, attrs, ctrl) {
			ctrl.$validators.integer = function(modelValue, viewValue) {
				var INTEGER_REGEXP = /^-?\d+$/;
				if (ctrl.$isEmpty(modelValue))
				{
					return true;
				}
				if(INTEGER_REGEXP.test(viewValue))
				{
					return true;
				}
				return false;
			};
		}
	};
});

shoppingAppModule.controller('gridController', ['$log', '$route', '$rootScope', function($log, route, rootScope) {
	$log.info("View: " + route.current.activeTab);
	rootScope.activeTab = route.current.activeTab;
}]);

shoppingAppModule.controller('cartController', ['$log', '$route', '$rootScope', function($log, route, rootScope) {
	$log.info("View: " + route.current.activeTab);
	rootScope.activeTab = route.current.activeTab;
}]);

