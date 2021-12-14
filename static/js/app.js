var app = angular.module('myApp', ['ngRoute', 'ngCookies']);


app.service('data', function() {
  this.msg = null;
  this.name = null;
  this.addData = function (x) {
    this.msg = x;
  }
  this.getData = function () {
    return this.msg
  }
  this.getName = function () {
    return this.name
  }
  this.addName = function (x) {
    this.name = x;
  }
});

app.config(function($routeProvider) {
  $routeProvider
  .when("/", {
    templateUrl : "templates/product.html"
  })
  .when("/products", {
    templateUrl: "templates/products.html"
  });
});


// register
app.controller('register', function($scope, $http){
  $scope.myFunc = function(username, password) {
    $http({
      method: 'GET',
      url: 'http://localhost:8000/register?username='+username+'&password='+password,
    }).then(function success(response){
      $scope.flag = "Signup Successfull";
      $scope.sign_email = "";
      $scope.sign_password = "";
    }, function failure(response){
      $scope.flag = "User Already Exists!!";
      $scope.sign_email = "";
      $scope.sign_password = "productdetails";
    });
  }
});

app.controller('login', function($scope, $http, data, $cookies){
  $scope.myFunc = function(username, password) {
    console.log("event triggered1");
    $http({
      method: 'GET',
      url: 'http://localhost:8000/login?username='+username+'&password='+password,
    }).then(function success(response){
      $scope.flag = "Signin Successfull";
      $scope.log_email = "";
      $scope.log_password = "";
      data.addName(username);
      $cookies.put('username', username)
      window.location.href = "user.html";

    }, function failure(response){
      $scope.flag = "User Authentication Failed!!";
      $scope.log_email = "";
      $scope.log_password = "";
    });
  }
});

app.controller('category', function($scope, $http, data) {
  $scope

  $http({
    method: 'GET',
    url: 'http://localhost:8000/category',
  }).then(function success(response){
    $scope.cat = response.data;
  }, function failure(response){
    alert('fetch cat failed');
  });
  $scope.statechange = function(category_val) {
    $scope.cat_value = category_val;
    $http({
      method: 'GET',
      url: 'http://localhost:8000/products?id='+$scope.cat_value,
    }).then(function success(response){
      $scope.products = response.data;
    });
  }
  $scope.sendData = function(x) {
    data.addData(x);
  }
});

app.controller('productdetails', function($scope, data, $http, $cookies){
  $scope.data = data.getData();
  $scope.name = $cookies.get('username');
  $http({
    method: 'GET',
    url: 'http://localhost:8000/reviews?id='+$scope.data.id,
  }).then(function success(response){
    $scope.reviews = response.data;
  });

  $scope.saveReview = function(user_review, star) {
    // alert('clicked');
    // $scope.name = data.getName();
    $http({
      method: 'GET',
      url: 'http://localhost:8000/sreviews?id='+$scope.data.id+'&rate='+star+'&review='+user_review+'&name='+$scope.name,
    }).then(function success(response){
      if (response.status != 500)
        $scope.reviews1 = response.data;
      else
        $scope.reviews1 = "User already Rated this item";
      $http({
        method: 'GET',
        url: 'http://localhost:8000/reviews?id='+$scope.data.id,
      }).then(function success(response){
        $scope.reviews = response.data;
      });
    }, function failure(response){
        $scope.reviews1 = "User already Rated this item";
    });
  }
});


app.controller('menu', function($scope, $cookies){
  $scope.logout = function() {
    $cookies.remove('username');
    window.location.href = "/"
  }
});
