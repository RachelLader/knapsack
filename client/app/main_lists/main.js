angular.module("knapsack.main", [])
  .controller("MainController", ["$scope", "$window", "$location", "$http", "Contents", "snackbar", "Utils", function($scope, $window, $location, $http, Contents, snackbar, Utils) {
    $scope.newBook = {
      title: "",
      author: ""
    };

    $scope.currentCollection = "";
    if ($location.url().split("/")[2]){
      $scope.currentCollection = $location.url().split("/")[2].replace("%20"," ");
      // in the database, we don't want spaces in our collection names, so we replace the space in the url.
      var dbCollection = $location.url().split("/")[2].replace("%20"," ");
    }


    $scope.searchBooks = function(val) {
      return $http.get('https://www.googleapis.com/books/v1/volumes', {
        params: {
          q: val,
          sensor: false,
          key: "AIzaSyAKGN-KPY2u2PEPogviuxh3nyoTsYkYt9Q", // Insert Google API key here
          printType: "books"
        }
      }).then(function(response){
        return response.data.items.map(function(item){
          var data = {
            /* There are often multiple authors for books. This comes from the Google Books API via an array.
            For the sake of time, we are using this function to limit the amount of authors to the first result.
            In the future, this would be good to flush out to allow for storing multiple authors in the DB
            */
            author: item.volumeInfo.authors === undefined? "" : item.volumeInfo.authors[0],
            title: item.volumeInfo.title
          };
          return data;
        });
      })
    };

    var getNytimes = function() {
      Contents.getNytimes().then(function(resp) {
        $scope.displayedCollection = resp;
        $scope.bookCollection = [].concat(resp);
      });
    };



    $scope.addBook = function(book) {
      Contents.addBook(dbCollection, book)
        .then(getBooks);
      $scope.newBook.title = "";
    };

    var getBooks = function() {
      if ($location.url() === "/landing" || $location.url().split("/")[2] === "bestsellers") {
        getNytimes();
      } else {
        Contents.getBooks(dbCollection)
          .then(function(books) {
            $scope.displayedCollection = books;
            $scope.bookCollection = [].concat(books);
          });
      }
    };

    $scope.removeBook = function(book) {
      Contents.removeBook(dbCollection, {
        title: book.title,
        author: book.author
      }).then(getBooks);
    };

    $scope.shareBook = function(book, user) {
      console.log('share book mainjs');
      Contents.shareBook(dbCollection, {
        title: book.title,
        author: book.author
      }, user);
    };

    $scope.newRating = {
      stars: 0
    };

    $scope.heart = false;

    $scope.rateBook = function(book) {
      if ($scope.heart === false){
        $scope.heart = true;
        $scope.newRating.stars = 1;
      } else {
        $scope.newRating.stars = 0
        $scope.heart = false;
      }
      var foo = $scope.newRating.stars;
      Contents.rateBook(book, foo);
      console.log("View sees: " + book.title + " Rating: " + $scope.newRating.stars);
    };


    getBooks();
  }])

.controller("DropdownCtrl", ["$scope", "Contents", "Profile", function($scope, Contents, Profile) {
  $scope.user = Profile.friendDisplay.currentUser;
  $scope.getUsers = function() {
    Contents.getUsers()
      .then(function(users) {
        $scope.users = users;
      });
  };
  $scope.getFriends =  function(){
    Contents.getFriends($scope.user.user_name)
      .then(function(friends){
        $scope.friends = friends;
      });
  };


  $scope.getUsers();
  $scope.getFriends();

  // $scope.getFriends= function(){
  //   Contents.getFriends()
  //   .then(function(friends){
  //     $scope.friends=friends;
  //   });
  // }

  // $scope.getFriends();

}]);
