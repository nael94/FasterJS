let FasterJs = {
  config: {
    basePathName: null,
    mode: 'hash',
    modes: ['hash', 'history'],
    componentsTransitions: false,
    title: null,
    titleSeparator: ' :: ',
  },
  tools: {
    core: {
      refreshLinks() {
        let
          $this = FasterJs,
          fasterLinks = document.querySelectorAll('[data-faster-link]');

        fasterLinks.forEach(link => {
          if (!link.hasAttribute('data-faster-link-refresh-excluded') || link.getAttribute('data-faster-link-refresh-excluded') !== "true") {
            // this to clone the link and recreate it without having any events
            let l = link.cloneNode(true);
            link.parentNode.replaceChild(l, link);
            
            if ($this.config.mode === 'history') {
              let href = window.location.origin + ($this.config.basePathName + l.getAttribute('href')).replace('//', '/');
              if (l.tagName.toLowerCase() === 'a') {
                l.setAttribute('href', href);
              }
            }
            else {
              if (l.tagName.toLowerCase() === 'a') {
                l.setAttribute('href', ('#!/' + (l.getAttribute('href')).replace('#!', '')).replace('//', '/'));
              }
            }
  
            l.addEventListener('click', event => {
              if ($this.config.mode === 'history') { event.preventDefault(); }
              $this.router.goTo(l.getAttribute('data-faster-link'));
            });

            if (l.hasAttribute('data-faster-link-refresh-excluded')) {
              l.setAttribute('data-faster-link-refresh-excluded', true);
            }
          }
        });
      },
      generateLinks() {
        let
          $this = FasterJs,
          fasterLinks = document.querySelectorAll('[data-faster-link]');
        //
        fasterLinks.forEach(link => {
          if (!link.getAttribute('data-faster-link').includes('/')) {
            // this is named route and it may has data-faster-link-* params to be processed
            let paramsArr = link.getAttributeNames().filter(attr => attr.includes('data-faster-link'));
            if (paramsArr.length === 1) {
              // === 1 => means that the passed value is only [data-faster-link] named route without params
              // so, the value will be replaced with the path key using refreshLinks(), nothing here to do
            }
            else {
              let
                routePath = $this.router.routes.filter(r => r.name === link.getAttribute('data-faster-link'))[0].path,
                paramsObj = {}; // to collect all parameters to be processed multiply at once
              // > 1 => means that there's a parameters passed with the named-route value, so, let's process it.
              // but let's firstly remove the [data-faster-link] itself, we don't need it here
              paramsArr = paramsArr.filter((param) => param !== 'data-faster-link'); // catching all parameters
              paramsArr.forEach(param => {
                let
                  paramKey = param.replace('data-faster-link-', ''),
                  paramVal = link.getAttribute(`data-faster-link-${paramKey}`);
                //
                if (!['refresh-excluded'].includes(paramKey)) {
                  // reserved core key, not to be handled as a user-passed parameter
                  if (paramKey !== 'params') {
                    // it's just a single value to be processed
                    paramsObj[paramKey] = paramVal;
                  }
                  else {
                    // it's a key-value parameters pair object to be processed
                    paramsObj = Object.assign({}, JSON.parse(paramVal), paramsObj);
                  }
                  // remove the paramKey from the link tag
                  link.removeAttribute(`data-faster-link-${paramKey}`);
                }
              });
              for (let pk in paramsObj) {
                routePath = routePath.replace(`:${pk}`, paramsObj[pk]);
              }
              // after processing the dynamic route with all parameters passed as data-faster-link-* attributes,
              // let's inject the parsed final processed path link in [data-faster-link-parsed]
              // keeping [data-faster-link] value is the name of this route
              link.setAttribute('data-faster-link-parsed', routePath);
              if (link.tagName.toLowerCase() === 'a') {
                // if the link tag is <a>, set its href to routePath
                link.setAttribute('href', routePath);
              }
            }
          }
        });
      },
      refresh() {
        this.generateLinks();
        this.refreshLinks();
      },
    },
    dom: {
      append(parent, child, triggerCoreRefresh = false) {
        let $this = FasterJs;
        document.querySelectorAll(parent).forEach(el => {
          el.insertAdjacentHTML('beforeend', child);
        });
        if (triggerCoreRefresh) { $this.tools.core.refresh(); }
      },
      prepend(parent, child, triggerCoreRefresh = false) {
        let $this = FasterJs;
        document.querySelectorAll(parent).forEach(el => {
          el.insertAdjacentHTML('afterbegin', child);
        });
        if (triggerCoreRefresh) { $this.tools.core.refresh(); }
      },
      before(parent, child, triggerCoreRefresh = false) {
        let $this = FasterJs;
        document.querySelectorAll(parent).forEach(el => {
          el.insertAdjacentHTML('beforebegin', child);
        });
        if (triggerCoreRefresh) { $this.tools.core.refresh(); }
      },
      after(parent, child, triggerCoreRefresh = false) {
        let $this = FasterJs;
        document.querySelectorAll(parent).forEach(el => {
          el.insertAdjacentHTML('afterend', child);
        });
        if (triggerCoreRefresh) { $this.tools.core.refresh(); }
      },
      setPageTitle(title, keepSeparator = true) {
        let $this = FasterJs;
        document.title = title + (keepSeparator ? `${$this.config.titleSeparator}${$this.config.title}` : '');
      },
    },
  },
  router: {
    baseRoute: '/',
    routes: [
      // { name: 'index', path: '/', view: 'index', on: null, before: null, after: null, module: null, },
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
          this.init(); // firing router.init() has to be fired
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
          for (let paramKey in params) {
            routeToGo = routeToGo.replace(`:${paramKey}`, params[paramKey]);
          }
          $this.router.goTo(routeToGo, params);
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
       *   module: null,
       * }
       */
      // wrote this function to avoid duplication below
      let routeObj = r => {
        return {
          name    : r.name,
          path    : r.path,
          view    : r.view ? r.view : null,
          on      : r.on ? r.on : null,
          before  : r.before ? r.before : null,
          after   : r.after ? r.after : null,
          module  : r.module ? r.module : null,
        };
      };

      if (this.routes.length > 0) {
        routes.forEach((route, i) => {
          this.routes.forEach(($route, j) => {
            if (route.name === $route.name) {
              /**
               * Passed route name are duplicated.
               * So, let's overwrite the passed route with stored route with same key
               */
               this.routes[j] = routeObj(route);
            }
            else {
              this.routes.push(routeObj(route));
            }
          });
        });
      }
      else {
        routes.forEach((route, i) => {
          this.routes.push(routeObj(route));
        });
      }
    },
    throwError(error) {
      let $this = FasterJs;
      //
      let FasterCore = {
        config: {
          mode: $this.config.mode,
          el: $this.tools.dom.el,
        },
        router: {
          baseRoute: this.baseRoute,
          currentRoute: this.currentRoute(),
          fallback: error,
          goTo: this.goTo,
        },
        tools: this.tools,
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
        errorToThrow = 'routeNotRegistered', // default error to throw
        routeToExecute = {},
        FasterCore = {
          config: {
            mode: $this.config.mode,
            el: $this.tools.dom.el,
          },
          route: {},
          router: {
            baseRoute: this.baseRoute,
            currentRoute: this.currentRoute(),
            goTo: this.goTo,
          },
          tools: $this.tools,
          view: $this.view,
        };

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
        if (routeToExecute.module) {
          let
            module = routeToExecute.module({ parameters: FasterCore.route.params }),
            route = FasterCore.router.currentRoute,
            selector = `[data-faster-app] [data-faster-component][data-faster-component-id="${module.name}"][data-faster-component-route="${route}"]`;
            // console.log(module);return;
          //
          if (module.beforeMount) {
            // created this now-defined property and injected it into FasterCore
            // to be ready on-demand in the module object file
            // this could be useful if the developer wants to kill the module processing in beforeMount() hook
            // for any logical reason or permission 
            FasterCore.tools.core.kill = false; // default value is false => keep going
            module.beforeMount(FasterCore);
          }
          if (FasterCore.tools.core.kill !== true) {
            // checking if the module section is not exist before ...
            if (!document.querySelector(selector)) {
              // the module section is not injected before, so let's do that
              // injecting template into user dom
              FasterCore.tools.dom.append('[data-faster-app]', `
                <section
                  data-faster-component
                  data-faster-component-id="${module.name}"
                  data-faster-component-route="${route}"
                  data-faster-component-keep-alive="${module.keepAlive === true}"
                >${module.template}</section>
              `, true);
            }

            document.querySelectorAll(`[data-faster-app] [data-faster-component][data-faster-component-id="${module.name}"] *`)
            .forEach(ref => {
              // let's detect all properties that starts with @
              ref.getAttributeNames().forEach(attr => {
                if (attr.startsWith('@')) {
                  // this is event
                  let evFunc = module.methods[ref.getAttribute(attr)];
                  attr = attr.replace('@', '');
                  ref.addEventListener(attr, evFunc.bind(null, FasterCore), false);
                  ref.removeAttribute(`@${attr}`);
                }
              });
            });

            FasterCore.view(module.name, route); // show this module section after checking/injecting it
          }
          // invoking all methods into module template
          if (module.mounted) { module.mounted(FasterCore); }
        }
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
  view(selector, route = null) {
    let
      $this = FasterJs,
      components = document.querySelectorAll(`[data-faster-app] [data-faster-component]`),
      fallbacks  = document.querySelectorAll(`[data-faster-app] [data-faster-fallback]`),
      all = [...components, ...fallbacks];
    //
    all.forEach(component => {
      let componentsArray = [
        component.getAttribute('data-faster-component-id'),
        component.getAttribute('data-faster-fallback-type'),
      ];
      //
      if (
        (!route && componentsArray.includes(selector)) ||
        (componentsArray.includes(selector) && route && component.getAttribute('data-faster-component-route') === route)
      ) {
        if (!$this.config.componentsTransitions) { component.style.display = 'block'; }
        else { component.style.visibility = 'visible'; }
        component.setAttribute('data-faster-component-activity', 'active');
      }
      else {
        if (component.getAttribute('data-faster-component-route') !== null && component.getAttribute('data-faster-component-keep-alive') === 'false') {
          component.remove();
        }
        if (!$this.config.componentsTransitions) { component.style.display = 'none'; }
        else { component.style.visibility = 'hidden'; }
        component.setAttribute('data-faster-component-activity', '');
      }
    });
  },
  init() {
    this.tools.dom.el = document.querySelectorAll('[data-faster-app]');
    document.querySelector('html').style.scrollBehavior = 'smooth';
    this.view('스크립팅'); // not exist component id to be shown => hide all components as easy as lazy :-P

    if (this.tools.dom.el.length === 0) {
      document.body.innerHTML = "Error: open console tool to review it.";
      console.log("Error: no ([data-faster-app]) element detected in <body>.");
      return;
    }
    else if (this.tools.dom.el.length > 1) {
      document.body.innerHTML = "Error: open console tool to review it.";
      console.log("Error: more than one ([data-faster-app]) element detected in <body>. Only one element should be.");
      return;
    }

    this.tools.dom.el = this.tools.dom.el[0];

    if (this.config.basePathName === null) {
      // no basePathName, this will lead to app failure.
      document.querySelector('[data-faster-app]').innerHTML = 'Error: open console tool to review it.';
      console.log("Error: no (Faster.config.basePathName) path value passed.");
      return;
    }

    let FasterCore = {
      config: {
        mode: this.config.mode,
        el: this.tools.dom.el,
      },
      router: {
        baseRoute: this.router.baseRoute,
        currentRoute: this.router.currentRoute(),
        goTo: this.router.goTo,
      },
      tools: this.tools,
      view: this.view,
    };

    // calling refresh() to init basic tasks of the core
    this.tools.core.refresh();

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

      if (location.origin + location.pathname !== location.origin + this.config.basePathName) {
        // current full path does not match with basePathName
        // we've to redirect to basePathName
        location.href = location.origin + this.config.basePathName + location.hash;
      }
    }

    //

    // triggering events if they'd defined by user
    if (this.events.beforeInit) { this.events.beforeInit(FasterCore); }

    window.onload = () => {
      if (this.events.init) { this.events.init(FasterCore); }
      this.router.init();
      if (this.events.loaded) { this.events.loaded(FasterCore); }
      if (document.querySelector('[data-faster-loading]')) {
        setTimeout(() => {
          document.querySelector('[data-faster-loading]').classList.add('loaded');
        }, 1);
      }
    };

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
