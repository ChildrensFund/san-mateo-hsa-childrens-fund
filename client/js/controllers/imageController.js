app.controller('imageController', ['$scope', '$upload', '$cookies', 'randNum', function($scope, $upload, $cookies, randNum) {

  var fileName;

  var getMimetype = function (file) {
    var uploadedFilename = file.name;
    for (var i = uploadedFilename.length; i >= 0; i--) {
      if (uploadedFilename[i] === '.') {
        return uploadedFilename.slice(i,uploadedFilename.length);
      }
    }
  };


  $scope.onFileSelect = function($files) {
    $scope.file = $files[0];
  };

  $scope.updatePhoto = function (id) {
    var imageNumber = randNum();
    var newName = '';
    newName += imageNumber;
    newName += getMimetype($scope.file);
    delete $scope.file.name
    $scope.file.name = newName;
    $upload.upload({
      url: '/images',
      method: 'POST',
      file: $scope.file,
    }).success(function(data, status, headers, config) {
      console.log('Image Upload Success!...Updating kid now...');
      $scope.$parent.update(id, 'image', $scope.file.name);
    });

  };

  $scope.uploadImageThenCreateChild = function () {
    $scope.error = '';
    if (
      !$scope.$parent.tempChildObj.firstName ||
      !$scope.$parent.tempChildObj.lastName ||
      !$scope.$parent.tempChildObj.gender ||
      $scope.$parent.tempChildObj.gender === '' ||
      !$scope.$parent.tempChildObj.dob ||
      !$scope.$parent.tempChildObj.age ||
      !$scope.$parent.tempChildObj.location ||
      !$scope.$parent.tempChildObj.programArea ||
      !$scope.$parent.tempChildObj.bio ||
      $scope.$parent.tempChildObj.bio.length > 600 ||
      (!$scope.$parent.tempChildObj.firstItemName && $scope.$parent.tempChildObj.firstItemName.length > 16) ||
      ($scope.$parent.tempChildObj.secondItemName && $scope.$parent.tempChildObj.secondItemName.length > 16) ||
      ($scope.$parent.tempChildObj.thirdItemName && $scope.$parent.tempChildObj.thirdItemName.length > 16) ||
      !$scope.$parent.tempChildObj.firstItemPrice 
    )
      {
        if (!$scope.$parent.tempChildObj.firstName) {
          $scope.error += 'First Name: ' + $scope.$parent.tempChildObj.firstName;
          return;
        }
        if (!$scope.$parent.tempChildObj.lastName) {
          $scope.error += 'Last Name: ' + $scope.$parent.tempChildObj.lastName;
          return;
        }
        if (!$scope.$parent.tempChildObj.gender) {
          $scope.error += 'Gender: ' + $scope.$parent.tempChildObj.gender;
          return;
        }
        if ($scope.$parent.tempChildObj.gender === '') {
          $scope.error += 'Gender: ' + $scope.$parent.tempChildObj.gender;
          return;
        }
        if (!$scope.$parent.tempChildObj.dob) {
          $scope.error += 'Date of Birth: ' + $scope.$parent.tempChildObj.dob;
          return;
        }
        if (!$scope.$parent.tempChildObj.age) {
          $scope.error += 'Age: ' + $scope.$parent.tempChildObj.age;
          return;
        }
        if (!$scope.$parent.tempChildObj.location) {
          $scope.error += 'Location: ' + $scope.$parent.tempChildObj.location;
          return;
        }
        if (!$scope.$parent.tempChildObj.programArea) {
          $scope.error += 'Program Area: ' + $scope.$parent.tempChildObj.programArea;
          return;
        }
        if (!$scope.$parent.tempChildObj.bio) {
          $scope.error += 'Bio: ' + $scope.$parent.tempChildObj.bio;
          return;
        }
        if ($scope.$parent.tempChildObj.bio.length > 600) {
          $scope.error += 'Bio:'  + $scope.$parent.tempChildObj.bio;
          return;
        }
        if ((!$scope.$parent.tempChildObj.firstItemName && $scope.$parent.tempChildObj.firstItemName.length > 16)) {
          $scope.error += 'First Item Name: ' + $scope.$parent.tempChildObj.firstItemName;
          return;
        }
        if (($scope.$parent.tempChildObj.secondItemName && $scope.$parent.tempChildObj.secondItemName.length > 16)) {
          $scope.error += 'Second Item Name: ' + $scope.$parent.tempChildObj.secondItemName;
          return;
        }
        if (($scope.$parent.tempChildObj.thirdItemName && $scope.$parent.tempChildObj.thirdItemName.length > 16)) {
          $scope.error += 'Third Item Name: ' + $scope.$parent.tempChildObj.thirdItemName;
          return;
        }
        if (!$scope.$parent.tempChildObj.firstItemPrice) {
          $scope.error += 'First Item Price: ' + $scope.$parent.tempChildObj.firstItemPrice;
          return;
        }
      }

    if ($scope.file) {
      $scope.$parent.tempChildObj.image = '';
      $scope.$parent.tempChildObj.image += randNum();
      $scope.$parent.tempChildObj.image += getMimetype($scope.file);
      delete $scope.file.name
      $scope.file.name = $scope.$parent.tempChildObj.image;
      $upload.upload({
        url: '/images',
        method: 'POST',
        file: $scope.file,
      }).success(function(data, status, headers, config) {
        console.log('Image Upload Success!...Creating kid now...');
        // upload kid to db
        $scope.$parent.create();
      });
    } else {
        console.log('No Image Upload...Creating kid...');
        $scope.$parent.create();
    }
  };

}]);