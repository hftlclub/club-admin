angular.module('app.cis').controller('LoginController', function($scope, $http, $location, clubAuth, $modal, $timeout, ngAudio, appConf) {

    $scope.login = {};
    $scope.login.data = {};
    $scope.login.message = null;
    $scope.login.status = null;

    $scope.login.submit = submit;

    $scope.chord = ngAudio.load('media/cismajor.mp3');

    clubAuth.refresh().then(function(){}, function(){});

    function submit() {
        //fixAutofillBug();
        $http.post(appConf.api + '/login', {
            'username': $scope.login.data.username,
            'password': $scope.login.data.password
        }).
        success(function(data) {
            localStorage.setItem('accessToken', data.token);
            $http.defaults.headers.common['X-Access-Token'] = data.token;


            $scope.chord.play();

            clubAuth.refresh().then(function(){}, function(){});
        }).
        error(function(data, status) {  });

    }

    var setMessagePromise;

    function setMessage(key) {
        if (setMessagePromise) {
            $timeout.cancel(setMessagePromise);
            setMessagePromise = null;
        }

        $scope.login.message = key;
        setMessagePromise = $timeout(function() {
            $scope.login.message = null;
        }, 5000);
    }

});
