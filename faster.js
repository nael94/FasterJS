let FasterJs = {
  config: {
    basePathName: null,
    mode: 'hash',
    modes: ['hash', 'history'],
    componentsTransitions: false,
    loadingLayer: false,
  },
  tools: {
    refreshLinks() {
      let
        $this = FasterJs,
        fasterLinks = document.querySelectorAll('[data-faster-link]');
      //
      fasterLinks.forEach(link => {
        // this to clone the link and recreate it without having any events
        let l = link.cloneNode(true);
        link.parentNode.replaceChild(l, link);
        
        //
  
        if ($this.config.mode === 'history') {
          let href = window.location.origin + ($this.config.basePathName + l.getAttribute('href')).replace('//', '/');
          if (l.tagName.toLowerCase() === 'a') {
            l.setAttribute('href', href);
          }
          l.addEventListener('click', event => {
            event.preventDefault();
            $this.router.goTo(l.getAttribute('data-faster-link'));
          });
        }
        else {
          if (l.tagName.toLowerCase() === 'a') {
            l.setAttribute('href', ('#!/' + l.getAttribute('href')).replace('//', '/'));
          }
        }
        //
        l.addEventListener('click', event => {
          if ($this.config.mode === 'history') { event.preventDefault(); }
          $this.router.goTo(l.getAttribute('data-faster-link'));
        });
      });
    },
  },
  router: {
    baseRoute: '/',
    routes: [
      // { name: 'index', path: '/', view: 'index', on: null, before: null, after: null, },
    ],
    fallbacks: {
      noRoutes: null,
      routeNameNotFound: null,
      routeNotRegistered: null,
    },
    currentRoute() {
      let $this = FasterJs;
      //
      if ($this.config.mode === 'hash') {
        return window.location.hash.replace('#!', '');
      }
      else {
        let origin = window.location.origin,
          currentRoute = window.location.href.replace(`${origin + $this.config.basePathName}`, '');
        return currentRoute !== '' ? ('/' + currentRoute.replace(/\/+$/, '')) : '/';
      }
    },
    goTo(routeName, params = {}) {
      let $this = FasterJs;
      //
      if (routeName.includes('/')) {
        // this is path to go
        // here, we treat routeName as route path
        if ($this.config.mode === 'history') {
          let passedRoute = window.location.origin + ($this.config.basePathName + routeName).replace('//', '/');
          history.pushState({route: routeName, params: params}, '', passedRoute);
        }
        else {
          window.location.hash = `#!/${routeName}`.replace('//', '/');
        }
        return;
      }
      else {
        // this is route name to go
        let
          routes = $this.router.routes,
          routeToGo = null;
        //
        routes.forEach((route, i) => {
          if (route.name === routeName) {
            routeToGo = route.path;
          }
        });
        if (routeToGo) {
          $this.router.goTo(routeToGo);
        }
        else {
          $this.router.throwError('routeNameNotFound');
        }
      }
    },
    register(routes) {
      // this.routes = this.routes.concat(routes);
      /** All routes data have to be unique!
       * Each route structure is:
       * {
       *   name: '',
       *   path: '',
       *   view: null,
       *   on(FasterCore) {},
       *   before(FasterCore) {},
       *   after(FasterCore) {},
       * }
       */
      if (this.routes.length > 0) {
        this.routes.forEach(($route, j) => {
          routes.forEach((route, i) => {
            if (route.name === $route.name) {
              /**
               * Passed route name are duplicated.
               * So, let's overwrite the passed route with stored route with same key
               */
               this.routes[j] = {
                name    : route.name,
                path    : route.path,
                view    : route.view ? route.view : null,
                on      : route.on ? route.on : null,
                before  : route.before ? route.before : null,
                after   : route.after ? route.after : null,
              };
            }
            else {
              this.routes.push({
                name    : route.name,
                path    : route.path,
                view    : route.view ? route.view : null,
                on      : route.on ? route.on : null,
                before  : route.before ? route.before : null,
                after   : route.after ? route.after : null,
              });
            }
          });
        });
      }
      else {
        routes.forEach((route, i) => {
          this.routes.push({
            name    : route.name,
            path    : route.path,
            view    : route.view ? route.view : null,
            on      : route.on ? route.on : null,
            before  : route.before ? route.before : null,
            after   : route.after ? route.after : null,
          });
        });
      }
    },
    throwError(error) {
      let $this = FasterJs;
      //
      let FasterCore = {
        config: {
          mode: $this.config.mode,
          el: document.querySelector('[data-faster-app]'),
        },
        router: {
          baseRoute: this.baseRoute,
          currentRoute: this.currentRoute(),
          fallback: error,
          goTo: this.goTo,
        },
      };
      //
      if (this.fallbacks[error]) { this.fallbacks[error](FasterCore); }
      else if (document.querySelector(`[data-faster-fallback][data-faster-fallback-type=${error}]`)) {
        // if [data-faster-fallback] is exist, call the specified related element.
        $this.view(error);
      }
      else { console.log(`router fallback error: ${error}`); }
      return;
    },
    init() {
      let
        $this = FasterJs,
        loadingLayer = document.querySelector('[data-faster-app] > [data-faster-loading]'),
        errorToThrow = 'routeNotRegistered', // default error to throw
        routeToExecute = {},
        FasterCore = {
          config: {
            mode: $this.config.mode,
            el: document.querySelector('[data-faster-app]'),
          },
          route: {},
          router: {
            baseRoute: this.baseRoute,
            currentRoute: this.currentRoute(),
            goTo: this.goTo,
          },
          view: $this.view,
        };

      // each time routing, let's hide all direct children items with [data-faster-*] of [data-faster-app]
      [...document.querySelectorAll('[data-faster-component], [data-faster-fallback], [data-faster-event]')]
      .forEach(e => {
        if (!$this.config.componentsTransitions) { e.style.display = 'none'; }
        else { e.style.visibility = 'hidden'; }
      });

      // hide loadingLayer if the config.loadingLayer is set to false
      if (loadingLayer) {
        if (!$this.config.loadingLayer) {
          loadingLayer.style.display = 'none';
        }
      }

      // bootstrapping the router core
      // but before, let's fire the routeBeforeEnter global event, passing FasterCore object
      if ($this.events.beforeRouteEnter) { $this.events.beforeRouteEnter(FasterCore); }

      if ($this.config.mode === 'hash') {
        if (['', '#', '#!'].includes(window.location.hash)) { // (/) blank hash
          this.goTo(this.baseRoute); // example.com => /#!/
          return; // to kill all next scripts
        }
      }

      if (this.routes.length > 0) {
        let
          normalRoutes  = this.routes.filter(route => !route.path.includes(':')),
          dynamicRoutes = this.routes.filter(route => route.path.includes(':'));
        //
        for (let i in normalRoutes) {
          if (normalRoutes[i].path === this.currentRoute()) {
            errorToThrow = null; // just to deactivate error due to calling exist route
            routeToExecute = normalRoutes[i];
            FasterCore.route = { name: normalRoutes[i].name, path: normalRoutes[i].path, };
            break;
          }
        }
        if (errorToThrow) {
          // still route is not found in normalRoutes
          // maybe it's a dynamic route
          let cRoute = this.currentRoute(), cRouteS = cRoute.split('/').slice(1);
          //
          for (let i in dynamicRoutes) {
            let
              routePath = dynamicRoutes[i].path,
              regex = new RegExp(routePath.replace(/:[^\s/]+/g, '([\\w-]+)')),
              segments = routePath.split('/').slice(1),
              dynamicSegments = routePath.match(/:[^\s/]+/g),
              routeMatched = cRoute.match(regex);
            //
            if (cRouteS.length === segments.length) {
              // supposed to find suitable route
              if (routeMatched) {
                routeToExecute = dynamicRoutes[i];
                //
                let params = {}, dParams = [...routeMatched.slice(1)];
                dynamicSegments.forEach((d, i) => {
                  params[d.replace(':', '')] = dParams[i];
                });
                //
                FasterCore.route = {
                  name: routeToExecute.name,
                  path: routeMatched[0],
                  params: params,
                };
                break;
              }
            }
          }
          //
          if (Object.keys(routeToExecute).length > 0) {
            // dynamic route found
            errorToThrow = null;
          }
        }
      }
      else {
        errorToThrow = 'noRoutes';
      }

      if (errorToThrow) { this.throwError(errorToThrow); }
      else {
        if (routeToExecute.before) { routeToExecute.before(FasterCore); }
        if (routeToExecute.view) { $this.view(routeToExecute.view); }
        if (routeToExecute.on) { routeToExecute.on(FasterCore); }
        if (routeToExecute.after) { routeToExecute.after(FasterCore); }
      }

      if ($this.events.routeEntered) { $this.events.routeEntered(FasterCore); }
    },
  },
  events: {
    beforeInit: null,
    init: null,
    beforeRouteEnter: null,
    routeEntered: null,
    loaded: null,
    ononline: null,
    onoffline: null,
  },
  view(selector) {
    let
      $this = FasterJs,
      components = document.querySelectorAll(`[data-faster-app] [data-faster-component]`),
      fallbacks  = document.querySelectorAll(`[data-faster-app] [data-faster-fallback]`),
      all = [...components, ...fallbacks];
    //
    all.forEach(component => {
      if (
        component.getAttribute('data-faster-component-id') === selector
        ||
        component.getAttribute('data-faster-fallback-type') === selector
      ) {
        if (!$this.config.componentsTransitions) { component.style.display = 'block'; }
        else { component.style.visibility = 'visible'; }
        component.setAttribute('data-faster-component-activity', 'active');
      }
      else {
        if (!$this.config.componentsTransitions) { component.style.display = 'none'; }
        else { component.style.visibility = 'hidden'; }
        component.setAttribute('data-faster-component-activity', '');
      }
    });
  },
  
  init() {
    document.querySelector('html').style.scrollBehavior = 'smooth';

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
      document.querySelector('[data-faster-app]').innerHTML = 'Error: open console tool to review it.';
      console.log("Error: no (Faster.config.basePathName) path value passed.");
      return;
    }

    let FasterCore = {
      config: {
        mode: this.config.mode,
        el: document.querySelector('[data-faster-app]'),
      },
      router: {
        baseRoute: this.router.baseRoute,
        currentRoute: this.router.currentRoute(),
        goTo: this.router.goTo,
      },
      view: this.view,
    };

    // attach link event to all [data-faster-link]
    this.tools.refreshLinks();

    if (this.config.mode === 'history') {
      if (window.location.hash !== '') {
        // in history mode, we should remove hash value by redirecting to the pathname
        window.location.href = window.location.origin + window.location.pathname;
        return;
      }

      // history mode requires onpopstate window event
      window.onpopstate = e => {
        this.router.init();
      };
    }
    else {
      // hash mode requires onhashchange window event
      window.onhashchange = () => {
        this.router.init();
      };
    }

    //

    // triggering events if they'd defined by user
    if (this.events.beforeInit) { this.events.beforeInit(FasterCore); }

    window.onload = () => {
      if (this.events.init) { this.events.init(FasterCore); }
      this.router.init();
      if (this.events.loaded) { this.events.loaded(FasterCore); }
      if (this.config.loadingLayer) {
        setTimeout(() => {
          document.querySelector('[data-faster-loading]').classList.add('loaded');
        }, 1);
      }
    };

    //

    //handling ononline and onoffline events
    window.addEventListener('online', e => {
      if (this.events.ononline) { this.events.ononline(FasterCore, e); }
      else { console.log(`router event key: ononline`); }
    });

    window.addEventListener('offline', e => {
      if (this.events.onoffline) { this.events.onoffline(FasterCore, e); }
      else { console.log(`router event key: onoffline`); }
    });
  },
};
