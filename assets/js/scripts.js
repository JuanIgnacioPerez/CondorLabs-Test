/*!
 * CondorLabs-landingPage
 * 
 * 
 * @author Juan Perez
 * @version 1.0.0
 * Copyright 2017. MIT licensed.
 */
angular.module('app', [])
  .controller('SearchController', searchCtrl)
  .service('HttpService', httpSevice);

function searchCtrl() {
  this.courseName = "";
}

function httpSevice($http) {

  this.get = function (url) {
    return $http.get(url);
  }

}
angular.module('app')
.component('featuredCourses', {
  templateUrl: 'featured-courses.html',
  controller: featuredCoursesController,
  controllerAs: 'vm'
});

function featuredCoursesController(HttpService) {
  var vm = this,
  dataInfo = [];
  function getData() {
    HttpService.get('https://api.cebroker.com/v2/featuredCoursesProfession?profession=36')
    .then( function (response) {
      response.data.forEach( function (data) {
        dataInfo.push({
          "name": data.coursePublication.course.name,
          "banner": data.coursePublication.course.featuredBanner,
          "provider": data.coursePublication.course.provider.name,
          "price": data.coursePublication.course.price || "24.95",
          "hours": "26 Hrs • Computer-Based Training"
        });
      });
      vm.data = dataInfo;
    });
  }
  vm.getData = getData();
}
angular.module('app')
.component('heroBanner', {
  templateUrl: 'search.html',
  controller: searchController,
  controllerAs: 'vm',
});

function searchController($scope) {
  var vm = this;
  function search(name) {
    $scope.$parent.searchCtrl.courseName = name;
  }

  vm.search = search;

}
(function($){
   $('.NavBar-menuColapsed').on('click', function (){
    $('.NavBar-content').toggleClass('NavBar-content--show', 7000);
   });
})(jQuery);
angular.module('app')
.component('results', {
  templateUrl: 'results.html',
  controller: resultsController,
  controllerAs: 'vm',
  bindings: {
    courseName: '<',
  }
});

function resultsController(HttpService) {
  var vm = this;
  vm.course = ''; 
   

   vm.$onChanges = function({courseName}){
    vm.course = courseName.currentValue;
    getData('search');
   }

  function getData(type) {
    var url = type === 'load' ? 'https://api.cebroker.com/v2/search/courses/?expand=totalItems&pageIndex=1&pageSize=18&sortField=RELEVANCE&profession=36&courseType=CD_ANYTIME&sortShufflingSeed=27': 'https://api.cebroker.com/v2/search/courses/?expand=totalItems&pageIndex=1&pageSize=18&sortField=RELEVANCE&profession=36&courseType=CD_ANYTIME&courseName='+vm.course+'&sortShufflingSeed=27',
    dataResults = [];

    HttpService.get(url)
    .then( function (response) {
      vm.totalItems = response.data.totalItems;
      response.data.items.forEach( function (data) {
        dataResults.push({
          "name": data.course.name,
          "provider": data.course.provider.name,
          "hours": "26 Hrs",
          "description": data.course.deliveryMethod.description,
          "price": data.price
        });
      });
      vm.data = dataResults;
    });
  }
  vm.getData = getData('load');
}