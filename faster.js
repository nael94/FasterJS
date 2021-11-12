let FasterJs = {
  config: {
    basePathName: null, // use / as a prefix and suffix of your path
    mode: 'hash',
    modes: ['hash', 'history'],
    componentsTransitions: false,
    loadingLayer: false,
  },
  router: {
    baseRoute: '/',
    routesMap: {
      '/': 'index',
    },
    routesMethods: {
      index() {
        //
      },
    },
    fallbacks: {
      noRoutesMap: null,
      noRoutesMethods: null,
      routeMapNotFound: null,
      routeMethodNotFound: null,
    },
    currentRoute() {
      if (FasterJs.config.mode === 'hash') {
        return window.location.hash.replace('#!', '');
      }
      else {
        let origin = window.location.origin,
          currentRoute = window.location.href.replace(`${origin + FasterJs.config.basePathName}`, '');
        return currentRoute !== '' ? ('/' + currentRoute.replace(/\/+$/, '')) : '/';
      }
    },
    registerMaps(maps) {
      return Object.assign(this.routesMap, maps);
    },
    registerMethods(methods) {
      return Object.assign(this.routesMethods, methods);
    },
    goTo(route = '', params = {}) {
      if (FasterJs.config.mode === 'history') {
        route = route === '' ? '/' : route;
        let passedRoute = window.location.origin + (FasterJs.config.basePathName + route).replace('//', '/');
        history.pushState({route: route, params: params}, '', passedRoute);
      }
      else {
        route = `#!/${route}`.replace('//', '/');
        window.location.hash = route;
      }
    },
    throwError(error) {
      if (this.fallbacks[error]) { this.fallbacks[error](); }
      else if (document.querySelectorAll('[data-faster-fallback]').length > 0) {
        // if [data-faster-fallback] is exist, call the specified related element.
        FasterJs.view(error);
      }
      else { console.log(`router fallback error: ${error}`); }
      return;
    },
    init() {
      let methodToRun = null, errorToThrow = null, e = {
        view: FasterJs.view,
        route: history.state ? history.state : {},
      };

      if (Object.keys(this.routesMap).length > 0) {
        if (FasterJs.config.mode === 'hash') {
          // hash mode is activated
          if (['', '#', '#!'].includes(window.location.hash)) { // (/) blank hash
            this.goTo(this.baseRoute); // example.com => /#!/
            return; // to kill all next scripts
          }
        }

        // both hash and history modes are using the code below to move on ...
        if (Object.keys(this.routesMethods).length > 0) {
          let routes = Object.keys(this.routesMap);
          routes.forEach((route, i) => {
            let routeSplitted = route.split('|'), routeKey = routes[i];
            if (routeSplitted.includes(this.currentRoute())) {
              let routeMethod = this.routesMap[routeKey];
              if (this.routesMethods[routeMethod] !== undefined) {
                methodToRun = this.routesMethods[routeMethod];
              }
              else {
                errorToThrow = 'routeMethodNotFound';
              }
            }
          });

          if (!methodToRun) { errorToThrow = errorToThrow ? errorToThrow : 'routeMapNotFound'; }
        }
        else {
          methodToRun = null;
          errorToThrow = 'noRoutesMethods';
        }
      }
      else {
        methodToRun = null;
        errorToThrow = 'noRoutesMap';
      }

      if (errorToThrow) { this.throwError(errorToThrow); }
      else { methodToRun(FaterCore = e); }
    },
  },
  events: {
    beforeInit: null,
    init: null,
    loaded: null,
    beforeRouteEnter: null,
    routeEntered: null,
  },
  view(selector) {
    let components = document.querySelectorAll(`[data-faster-app] [data-faster-component]`),
        fallbacks  = document.querySelectorAll(`[data-faster-app] [data-faster-fallback]`);
    //
    [...components, ...fallbacks].forEach(component => {
      if (
        component.getAttribute('data-faster-component-id') === selector
        ||
        component.getAttribute('data-faster-fallback-type') === selector
      ) {
        if (!FasterJs.config.componentsTransitions) { component.style.display = 'block'; }
        component.setAttribute('data-faster-component-activity', 'active');
      }
      else {
        if (!FasterJs.config.componentsTransitions) { component.style.display = 'none'; }
        component.setAttribute('data-faster-component-activity', '');
      }
    });
  },
  init() {
    if (document.querySelectorAll('[data-faster-app]').length === 0) {
      document.body.innerHTML = "Error: open console tool to review it.";
      console.log("Error: no ([data-faster-app]) element detected in <body>.");
      return;
    }
    else if (document.querySelectorAll('[data-faster-app]').length > 1) {
      document.body.innerHTML = "Error: open console tool to review it.";
      console.log("Error: more than one ([data-faster-app]) element detected in <body>. Only one element should be.");
      return;
    }

    if (this.config.basePathName === null) {
      // no basePathName, this will lead to app failure.
      let allElems = document.querySelectorAll('[data-faster-app] > *');
      [...allElems].forEach(e => {
        e.remove();
      });
      document.querySelector('[data-faster-app]').innerHTML = 'Error: open console tool to review it.';
      console.log("Error: no (Faster.config.basePathName) path value passed.");
      return;
    }

    // before beginning, let's hide all direct children items of [data-faster-app]
    document.querySelectorAll('[data-faster-app] > *').forEach(e => {
      e.style.display = 'none';
    });
    
    let FasterLinks = document.querySelectorAll('[data-faster-link]'),
    param = () => {
      let e = {};
      e.config = {};
      e.config.mode = this.config.mode;
      e.config.el = document.querySelector('[data-faster-app]');
      e.router = {};
      e.router.baseRoute = this.router.baseRoute;
      e.router.currentRoute = this.router.currentRoute();
      return e;
    };

    if (this.config.mode === 'history') {
      if (window.location.hash !== '') {
        // in history mode, we should remove hash value by redirecting to the pathname
        window.location.href = window.location.origin + window.location.pathname;
        return;
      }

      FasterLinks.forEach(link => {
        let href = window.location.origin + (this.config.basePathName + link.getAttribute('href')).replace('//', '/');
        link.setAttribute('href', href);
        link.addEventListener('click', event => {
          event.preventDefault();
          this.router.goTo(link.getAttribute('data-faster-link'));
          this.router.init();
        });
      });

      // history mode requires onpopstate window event
      window.onpopstate = e => {
        this.router.init();
      };
    }
    else {
      if (window.location.pathname !== FasterJs.config.basePathName) {
        window.location.href = window.location.origin + FasterJs.config.basePathName;
        return;
      }

      FasterLinks.forEach(link => {
        link.setAttribute('href', ('#!/' + link.getAttribute('href')).replace('//', '/'));
      });

      // hash mode requires onhashchange window event
      window.onhashchange = () => {
        if (this.events.beforeRouteEnter) { this.events.beforeRouteEnter(param()); }
        this.router.init();
        if (this.events.routeEntered) { this.events.routeEntered(param()); }
      };
    }

    // triggering events if they'd defined by user
    if (this.events.beforeInit) { this.events.beforeInit(param()); }

    window.onload       = () => {
      if (this.events.init) { this.events.init(param()); }
      this.router.init();
      if (this.events.loaded) { this.events.loaded(param()); }
      if (this.config.loadingLayer) {
        setTimeout(() => {
          document.querySelector('[data-faster-loading]').style.display = 'none';
        }, 2500);
      }
    };
  },
};
