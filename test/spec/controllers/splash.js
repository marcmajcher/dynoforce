'use strict';

describe('Controller: SplashController', function () {

  // load the controller's module
  beforeEach(module('dynoforceApp'));

  var SplashController,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SplashController = $controller('SplashController', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SplashController.awesomeThings.length).toBe(3);
  });
});
