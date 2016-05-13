/*!
 * IstanbulPHP
 * Emir Karşıyakalı
 * Version 0.0.1
 */
(function(){

  'use strict';

  var app = angular.module('PHPKonfApp', [
    'pascalprecht.translate',
    'ngDialog',
    'ngSanitize',
    'ngRoute'
  ])

  app.config(function($translateProvider) {
    $translateProvider.useStaticFilesLoader({
      prefix: 'languages/',
      suffix: '.json'
    });

    $translateProvider.preferredLanguage('en');
  });

  app.config(['$routeProvider',
    function($routeProvider) {
      $routeProvider.
        when('/speakers/:id', {
          templateUrl: 'speaker.html',
          controller: 'SpeakersController'
        }).
        otherwise({
          redirectTo: '/'
        });
    }]);

  app.filter('html', ['$sce', function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    };
  }]);

  app.filter('toArray', function () {
    return function (obj, addKey) {
      if (!angular.isObject(obj)) return obj;
      if ( addKey === false ) {
        return Object.keys(obj).map(function(key) {
          return obj[key];
        });
      } else {
        return Object.keys(obj).map(function (key) {
          var value = obj[key];
          return angular.isObject(value) ?
              Object.defineProperty(value, '$key', { enumerable: false, value: key}) :
          { $key: key, $value: value };
        });
      }
    };
  });

  app.controller('MainController', ['$http', '$scope', '$translate', 'ngDialog', '$rootScope', function ($http, $scope, $translate, ngDialog, $rootScope) {

    changeSpeakersLang($translate.preferredLanguage());
    $scope.limit = 8;

    function changeSpeakersLang(lang) {
      $http.get("languages/speakers_" + lang + ".json")
        .success (function (data) {
          $rootScope.speakers = data.speakers;
      });
    }

    $scope.changeLanguage = function (langKey) {
      $translate.use(langKey);
      changeSpeakersLang(langKey);
    };

    $scope.clickToOpen = function (speaker) {
      var speakerDialog = ngDialog.open({
        template  : 'modal.html',
        appendTo  : '#speakers',
        controller : function ($scope) {
          $scope.speaker = speaker;
        },
        showClose : false
      });
    };

  }]);

  app.controller('SpeakersController', ['$http', '$scope', '$translate', 'ngDialog', '$rootScope', function ($http, $scope, $translate, ngDialog, $rootScope) {
  }]);

  $("#tabbed-nav").zozoTabs({
    theme: "white",
    orientation: "horizantal",
    position: "top-left",
    size: "medium",
    shadows: false,
    type: "css",
    animation: {
      easing: "easeInOutExpo",
      duration: 400,
      effects: "slideH"
    },
    defaultTab: "tab1"
  });

}());

