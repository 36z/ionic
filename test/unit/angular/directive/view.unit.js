describe('ionView directive', function() {
  var beforeEnterData;

  beforeEach(module('ionic'));

  function setup(attrs, scopeProps, content) {
    var el;
    inject(function($compile, $rootScope) {
      var scope = angular.extend($rootScope.$new(), scopeProps || {});

      el = angular.element('<ion-view '+(attrs||'')+'>');
      el.data('$ionNavViewController', {
        beforeEnter: function(d) { beforeEnterData = d; },
        showBar: jasmine.createSpy('showBar'),
      });
      content && el.html(content);

      el = $compile(el)(scope);
      $rootScope.$apply();
    });
    return el;
  }

  it('should add pane', inject(function($compile, $rootScope) {
    var el = $compile('<ion-view>')($rootScope.$new());
    $rootScope.$apply();
    expect(el.hasClass('pane')).toBe(true);
  }));

  it('should remove title attribute', inject(function($compile, $rootScope) {
    var el = $compile('<ion-view title="view title">')($rootScope.$new());
    $rootScope.$apply();
    expect(el[0].getAttribute('title')).toBe(null);
  }));

  it('should remove title attribute from view in modal',inject(function($compile, $rootScope) {
    var el = $compile('<ion-modal><ion-view title="1"></ion-modal>')($rootScope.$new());
    var view = jqLite(el[0].querySelector('.pane'));
    $rootScope.$apply();
    expect(view[0].getAttribute('title')).toBe(null);
  }));

  it('should have content inside', function() {
    var el = setup(null, null, '<b>some</b> html');
    expect(el.html()).toBe('<b>some</b> html');
  });

  it('should call ionNavViewController.beforeEnter with title attr', inject(function($rootScope) {
    var el = setup('title="my title"');
    $rootScope.$broadcast('$ionicView.beforeEnter', {
      direction: 'forward'
    });
    expect( beforeEnterData.title ).toBe('my title');
    expect( beforeEnterData.direction ).toBe('forward');
    expect( beforeEnterData.hasHeaderBar ).toBe(false);
    expect( beforeEnterData.navBarDelegate ).toBe(null);
  }));

  it('should call ionNavViewController.beforeEnter with view-title attr', inject(function($rootScope) {
    var el = setup('view-title="my title"');
    $rootScope.$broadcast('$ionicView.beforeEnter', {});
    expect( beforeEnterData.title ).toBe('my title');
  }));

  it('should not showBack with hide-back-button attr', inject(function($rootScope) {
    var el = setup('hide-back-button="true"');
    $rootScope.$broadcast('$ionicView.beforeEnter', {
      showBack: true
    });
    expect( beforeEnterData.showBack ).toBe(false);

    $rootScope.shouldShowBack = false;
    var el = setup('hide-back-button="shouldShowBack"');
    $rootScope.$broadcast('$ionicView.beforeEnter', {
      showBack: true
    });
    expect( beforeEnterData.showBack ).toBe(false);
  }));

  it('should showBack without hide-back-button but no showBack from transition', inject(function($rootScope) {
    var el = setup();
    $rootScope.$broadcast('$ionicView.beforeEnter', {
      showBack: false
    });
    expect( beforeEnterData.showBack ).toBe(false);
  }));

  it('should be receive delegateHandle from child ionNavBar', inject(function($rootScope) {
    var el = setup(null, null, '<ion-nav-bar delegate-handle="myViewNavBar">');
    $rootScope.$broadcast('$ionicView.beforeEnter', {});
    expect( beforeEnterData.navBarDelegate ).toBe('myViewNavBar');
  }));

  it('should be receive header bar init from child ionHeaderBar', inject(function($rootScope) {
    var el = setup(null, null, '<ion-header-bar>');
    $rootScope.$broadcast('$ionicView.beforeEnter', {});
    expect( beforeEnterData.hasHeaderBar ).toBe(true);
  }));

});
