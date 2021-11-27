function typed(el, textsArr) {
  new Typed(el, {
    strings: textsArr,
    typeSpeed: 1,
    backSpeed: 0,
    startDelay: 200,
    cursorChar: '&nbsp;>_',
  });
}

function code(section, id = null) {
  if (id) {
    return el(`section[data-faster-component-id=${section}] code.code-window-board-sample#${id}`);
  }
  else {
    return el(`section[data-faster-component-id=${section}] code.code-window-board-sample`);
  }
}

function el(selector, all = false) {
  return all ? document.querySelectorAll(selector) : document.querySelector(selector);
}

function asideOpen() {
  let header = el('header');
  header.classList.add('opened');
    el('header aside nav a', true).forEach(a => {
      a.classList.add('animate__animated');
      a.classList.add('animate__fadeInLeft');
    });
}

function asideClose() {
  let header = el('header');
  header.classList.remove('opened');
    el('header aside nav a', true).forEach(a => {
      a.classList.remove('animate__animated');
      a.classList.remove('animate__fadeInLeft');
    });
}

el('code[contenteditable]', true).forEach(code => {
  code.addEventListener('keypress', e => {
    if (e.which === 13) {
      e.preventDefault();
      //
      let
        terminal = code.innerText.toLowerCase(),
        routes = Object.keys(FasterJs.router.routesMap),
        currentRoute = FasterJs.router.currentRoute();
      code.innerText = '';
      //
      if (terminal === 'next') {
        routes.forEach((route, i) => {
          if (route === currentRoute) {
            routeToGo = i+1;
          }
        });
        FasterJs.router.goTo(routes[routeToGo]);
      }
      else if (terminal === 'prev') {
        routes.forEach((route, i) => {
          if (route === currentRoute) {
            routeToGo = (i-1) >= 0 ? (i-1) : 0;
          }
        });
        FasterJs.router.goTo(routes[routeToGo]);
      }
      else {
        terminal = terminal !== '/' ? terminal : '';
        FasterJs.router.goTo(`/${terminal}`);
      }
      code.blur();
    }
  });
});

el('.code-window-board', true).forEach(code => {
  code.addEventListener('click', e => {
    let selection = window.getSelection();
    //
    if (selection.type === 'Caret') {
      // user just clicked on the area
      code.querySelector('code[contenteditable]').focus();
    }
    else {
      // user selected code from the area
    }
  });
});

el('header button').addEventListener('click', e => {
  let header = el('header');
  //
  if (!header.classList.contains('opened')) {
    asideOpen();
  }
  else {
    asideClose();
  }
});

el('.aside-backlayer').addEventListener('click', () => asideClose());

// document.querySelector('#currentYear').innerText = '-' + new Date().getFullYear();



// FasterJs setup

FasterJs.config.basePathName = '/my-projects/faster-js/doc/';
FasterJs.config.mode = 'hash';
FasterJs.config.componentsTransitions = true;
FasterJs.config.loadingLayer = true;

FasterJs.router.registerMaps({
  '/'                   : 'index',
  '/benefits'           : 'benefits',
  '/upcoming-features'  : 'upcoming_features',
  '/installation'       : 'installation',
  '/basic-setup'        : 'basic_setup',
  '/getting_started'    : 'getting_started',
  '/navigation'         : 'navigation',
  '/router-events'      : 'router_events',
  '/global-events'      : 'global_events',
  '/views'              : 'views',
  '/loading-layer'      : 'loading_layer',
  '/initialization'     : 'initialization',
  '/whats-next'         : 'what_is_next',
});

FasterJs.router.registerMethods({
  index(FasterCore) {
    let view = 'index', codeTag = code(view);
    //
    if (!el(`[data-faster-component-id=${view}]`).classList.contains('initiated')) {
      el(`[data-faster-component-id=${view}]`).classList.add('initiated');
      typed(codeTag, [`
        // basic code ...<br />
        
        FasterJs.router.registerMaps({<br />
          &nbsp;&nbsp;'/': 'index',<br />
        });<br />
        
        FasterJs.router.registerMethods({<br />
          &nbsp;&nbsp;index: function (FasterCore) {<br />
            &nbsp;&nbsp;&nbsp;&nbsp;// code to run in "/" route<br />
          &nbsp;&nbsp;},<br />
        });<br />
        FasterJs.init(); // init the framework
      `]);
    }
    //
    FasterCore.view(view);
  },
  benefits(FasterCore) {
    let view = 'benefits', codeTag = code(view);
    //
    if (!el(`[data-faster-component-id=${view}]`).classList.contains('initiated')) {
      el(`[data-faster-component-id=${view}]`).classList.add('initiated');
      typed(codeTag, [`
        // Benefits of using FasterJS ...
        <br />
        -> FasterJS.size ~= 10kb<br />
        -> FasterJs.config.modes = ['hash', 'history'];<br />
        -> console.log("Is this website built with FasterJS? Answer is " + (FasterJs ? 'Yes' : 'No'));<br />
        // Is this website built with FasterJS? Answer is Yes
      `]);
    }
    //
    FasterCore.view(view);
  },
  upcoming_features(FasterCore) {
    let view = 'upcoming-features', codeTag = code(view);
    //
    if (!el(`[data-faster-component-id=${view}]`).classList.contains('initiated')) {
      el(`[data-faster-component-id=${view}]`).classList.add('initiated');
      typed(codeTag, [`
        // Upcoming features to FasterJS ...<br />
        
        FasterJS.router.registerMaps({<br />
          &nbsp;&nbsp;'/route/<b>{id:number}?</b>/<b>{title:text}?</b>': 'method_to_run',<br />
        });<br />
        
        FasterJs.router.registerMethods({<br />
          &nbsp;&nbsp;'method_to_run': function (FasterCore) {<br />
          &nbsp;&nbsp;&nbsp;&nbsp;let params = FasterCore.route.params;<br />
          &nbsp;&nbsp;&nbsp;&nbsp;// params = {id: '', title: ''};<br />
          &nbsp;&nbsp;},<br />
        });
      `]);
    }
    //
    FasterCore.view(view);
  },
  installation(FasterCore) {
    let view = 'installation', codeTag = code(view);
    //
    if (!el(`[data-faster-component-id=${view}]`).classList.contains('initiated')) {
      el(`[data-faster-component-id=${view}]`).classList.add('initiated');
      typed(codeTag, [`
        // Installing FasterJS ...<br />
        [index.html]<br />
        &lt;head&gt;<br/>
        &nbsp;&nbsp;&lt;base href="https://yourwebsite.com/your/folder/if/exists/" /&gt;<br />
        &nbsp;&nbsp;&lt;!-- The slash in the end is necessary --&gt;<br />
        &lt;/head&gt;<br/>
        <br />
        &lt;body&gt;<br/>
        &nbsp;&nbsp;&lt;div data-faster-app&gt;<br />
        &nbsp;&nbsp;&nbsp;&nbsp;&lt;!-- your website components goes here ... --&gt;<br/>
        &nbsp;&nbsp;&lt;/div&gt;<br />
        &nbsp;&nbsp;&lt;script src="./faster.min.js"&gt;&lt;/script&gt;<br/>
        &nbsp;&nbsp;&lt;script src="./app.js"&gt;&lt;/script&gt;     &lt;- Your FasterJS setup file<br/>
        &lt;/body&gt;<br/>
      `]);
    }
    //
    FasterCore.view(view);
  },
  basic_setup(FasterCore) {
    let view = 'basic-setup', codeTag = code(view);
    //
    if (!el(`[data-faster-component-id=${view}]`).classList.contains('initiated')) {
      el(`[data-faster-component-id=${view}]`).classList.add('initiated');
      typed(codeTag, [`
        // Basic setup ...<br />
        [index.html]<br />
        &lt;body&gt;<br />
          &nbsp;&nbsp;&lt;header&gt;This is header&lt;/header&gt;<br />
          &nbsp;&nbsp;&lt;div data-faster-app&gt;<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&lt;section data-faster-component data-faster-component-id="home"&gt;&lt;/section&gt;<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&lt;section data-faster-component data-faster-component-id="about-us"&gt;&lt;/section&gt;<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&lt;section data-faster-component data-faster-component-id="contact-us"&gt;&lt;/section&gt;<br />
          &nbsp;&nbsp;&lt;/div&gt;<br />
          &nbsp;&nbsp;&lt;footer&gt;This is footer&lt;/footer&gt;<br />
        &lt;/body&gt;<br />
      `]);
    }
    //
    FasterCore.view(view);
  },
  getting_started(FasterCore) {
    let view = 'getting-started';
    //
    if (!el(`[data-faster-component-id=${view}]`).classList.contains('initiated')) {
      el(`[data-faster-component-id=${view}]`).classList.add('initiated');
      typed(code(view, 'code1'), [`
        [index.html]<br />
        &lt;body&gt;<br />
          &nbsp;&nbsp;&lt;div data-faster-app&gt;<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&lt;section data-faster-component data-faster-component-id="index"&gt;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This is the / route showing index content.<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&lt;/section&gt;<br />
          &nbsp;&nbsp;&lt;/div&gt;<br />
        &lt;/body&gt;<br />
        &lt;script src="./faster.min.js"&gt;&lt;/script&gt;<br />
        &lt;script src="./app.js"&gt;&lt;/script&gt;<br />
        <hr />
        [app.js]<br />
        // FasterJs is ready with you due to including (faster.min.js)<br />
        FasterJs.init();
      `]);
      typed(code(view, 'code2'), [`
        [app.js]<br />
        FasterJs.config.mode = 'history'; // default is hash
      `]);
      typed(code(view, 'code3'), [`
        [app.js]<br />
        FasterJs.config.basePathName = "/subfolder/";<br />
        // If your website is located in a sub folder (not subdomain because it treats as an independent root website), you have to set an absolute path starting from the root path of your host.
      `]);
      typed(code(view, 'code4-1'), [`
        [app.js]<br />
        &nbsp;&nbsp;FasterJs.router.registerMethods({<br />
          &nbsp;&nbsp;&nbsp;&nbsp;index: function (FasterCore) {<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;console.log("The '/' route triggers 'index' method.");<br />
          &nbsp;&nbsp;&nbsp;&nbsp;}<br />
        &nbsp;&nbsp;});
      `]);
      typed(code(view, 'code4-2'), [`
        [app.js]<br />
        &nbsp;&nbsp;FasterJs.router.registerMaps({<br />
          &nbsp;&nbsp;&nbsp;&nbsp;'/': 'index',  // default predefined route<br />
          &nbsp;&nbsp;&nbsp;&nbsp;'/contact': 'contactUs',  // now-defined route<br />
        &nbsp;&nbsp;});
      `]);
      typed(code(view, 'code4-3'), [`
        [app.js]<br />
        &nbsp;&nbsp;FasterJs.router.registerMethods({<br />
          &nbsp;&nbsp;&nbsp;&nbsp;contactUs: function (FasterCore) {<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;console.log("The '/contact' route triggers 'contactUs' method.");<br />
          &nbsp;&nbsp;&nbsp;&nbsp;}<br />
        &nbsp;&nbsp;});
      `]);
      typed(code(view, 'code4-4'), [`
        [app.js]<br />
        &nbsp;&nbsp;FasterJs.router.registerMaps({<br />
          &nbsp;&nbsp;&nbsp;&nbsp;'/|/home|/index': 'index',<br />
        &nbsp;&nbsp;});
      `]);
      typed(code(view, 'code5-1'), [`
        [app.js]<br />
        &nbsp;&nbsp;FasterJs.router.baseRoute = '/';
      `]);
      typed(code(view, 'code5-2'), [`
        [app.js]<br />
        &nbsp;&nbsp;FasterJs.router.registerMethods({<br />
          &nbsp;&nbsp;&nbsp;&nbsp;contactUs: function (FasterCore) {<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;let route = FasterCore.currentRoute;<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;console.log(&#x60;The '\$\{route\}' route triggers 'contactUs' method.&#x60;);<br />
          &nbsp;&nbsp;&nbsp;&nbsp;}<br />
        &nbsp;&nbsp;});
      `]);
      typed(code(view, 'code5-3'), [`
        [app.js]<br />
        &nbsp;&nbsp;FasterJs.router.registerMethods({<br />
          &nbsp;&nbsp;&nbsp;&nbsp;contactUs: function (FasterCore) {<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;let x = 4;&nbsp;&nbsp;&nbsp;// for example<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if (x > 3) {&nbsp;// any logic that returns true<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FasterCore.goTo('/about');<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br />
          &nbsp;&nbsp;&nbsp;&nbsp;}<br />
        &nbsp;&nbsp;});
      `]);
      typed(code(view, 'code6-1'), [`
        [index.html]<br />
        &nbsp;&nbsp;&lt;body&gt;<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&lt;div data-faster-app&gt;<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;section data-faster-fallback data-faster-fallback-type="routeMapNotFound"&gt;<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The page that you want is not found. :-(<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/section&gt;<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&lt;/div&gt;<br />
        &nbsp;&nbsp;&lt;/body&gt;<br />
      `]);
    }
    //
    FasterCore.view(view);
  },
  navigation(FasterCore) {
    let view = 'navigation', codeTag = code(view);
    //
    if (!el(`[data-faster-component-id=${view}]`).classList.contains('initiated')) {
      el(`[data-faster-component-id=${view}]`).classList.add('initiated');
      typed(codeTag, [`
        // Navigation in FasterJS<br />
        [index.html]<br />
        &nbsp;&nbsp;&lt;body&gt;<br />
        &nbsp;&nbsp;&nbsp;&nbsp;&lt;div data-faster-app&gt;<br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;a href="/contact" data-faster-link="/contact"&gt;This is anchor tag targeting to /contact route&lt;/a&gt;<br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;button data-faster-link="/contact"&gt;Also this button targets to /contact route&lt;/button&gt;<br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;div data-faster-link="/contact"&gt;Also with this css-styled div targets to /contact route&lt;/div&gt;<br />
        &nbsp;&nbsp;&nbsp;&nbsp;&lt;/div&gt;<br />
        &nbsp;&nbsp;&lt;/body&gt;<br />
      `]);
    }
    //
    FasterCore.view(view);
  },
  router_events(FasterCore) {
    let view = 'router-events', codeTag = code(view);
    //
    if (!el(`[data-faster-component-id=${view}]`).classList.contains('initiated')) {
      el(`[data-faster-component-id=${view}]`).classList.add('initiated');
      typed(codeTag, [`
        // Router Events in FasterJS<br />
        [app.js]<br />
        &nbsp;&nbsp;FasterJs.router.registerMaps({<br />
        &nbsp;&nbsp;&nbsp;&nbsp;'/': 'index',<br />
        &nbsp;&nbsp;});<br />
        &nbsp;&nbsp;FasterJs.router.registerMethods({<br />
        &nbsp;&nbsp;&nbsp;&nbsp;index: function (FasterCore) {<br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// index() is fired when the route / is requested<br />
        &nbsp;&nbsp;&nbsp;&nbsp;},<br />
        &nbsp;&nbsp;});<br />
        &nbsp;&nbsp;FasterJs.router.registerEvents({<br />
        &nbsp;&nbsp;&nbsp;&nbsp;'/': function (FasterCore) {<br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// this event will be fired when routing to the route /<br />
        &nbsp;&nbsp;&nbsp;&nbsp;},<br />
        &nbsp;&nbsp;});<br />
      `]);
    }
    //
    FasterCore.view(view);
  },
  global_events(FasterCore) {
    let view = 'global-events', codeTag = code(view);
    //
    if (!el(`[data-faster-component-id=${view}]`).classList.contains('initiated')) {
      el(`[data-faster-component-id=${view}]`).classList.add('initiated');
      typed(codeTag, [`
        // Global Events in FasterJS<br />
        [app.js]<br />
        &nbsp;&nbsp;FasterJs.events.beforeInit = FasterCore => {<br />
        &nbsp;&nbsp;&nbsp;&nbsp;// will fire when FasterJS is loaded into the browser and before initializing anything of its methods.<br />
        &nbsp;&nbsp;};<br />
        &nbsp;&nbsp;FasterJs.events.init = FasterCore => {<br />
        &nbsp;&nbsp;&nbsp;&nbsp;// will fire after \`beforeInit\` event but before navigating to the requested URL.<br />
        &nbsp;&nbsp;};<br />
        &nbsp;&nbsp;FasterJs.events.beforeRouteEnter = FasterCore => {<br />
        &nbsp;&nbsp;&nbsp;&nbsp;// will fire before starting Router core and matching routes.<br />
        &nbsp;&nbsp;};<br />
        &nbsp;&nbsp;FasterJs.events.routeEntered = FasterCore => {<br />
        &nbsp;&nbsp;&nbsp;&nbsp;// will fire after calling an existing route map and its method.<br />
        &nbsp;&nbsp;};<br />
        &nbsp;&nbsp;FasterJs.events.loaded = FasterCore => {<br />
        &nbsp;&nbsp;&nbsp;&nbsp;// will fire after all events and fallbacks.<br />
        &nbsp;&nbsp;};<br />
      `]);
    }
    //
    FasterCore.view(view);
  },
  views(FasterCore) {
    let view = 'views';
    //
    if (!el(`[data-faster-component-id=${view}]`).classList.contains('initiated')) {
      el(`[data-faster-component-id=${view}]`).classList.add('initiated');
      typed(code(view, 'views-1'), [`
        [index.html]<br />
        &nbsp;&nbsp;&lt;body&gt;<br />
        &nbsp;&nbsp;&nbsp;&nbsp;&lt;div data-faster-app&gt;<br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;section data-faster-component data-faster-component-id='index'&gt;Index page&lt;/section><br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;section data-faster-component data-faster-component-id='about'&gt;About page&lt;/section><br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;section data-faster-component data-faster-component-id='contact'&gt;Contact page&lt;/section><br />
        &nbsp;&nbsp;&nbsp;&nbsp;&lt;/div&gt;<br />
        &nbsp;&nbsp;&lt;/body&gt;<br /><br />

        [app.js]<br />
        &nbsp;&nbsp;FasterJs.router.registerMaps({<br />
        &nbsp;&nbsp;&nbsp;&nbsp;'/': 'index',<br />
        &nbsp;&nbsp;&nbsp;&nbsp;'/about': 'about',<br />
        &nbsp;&nbsp;&nbsp;&nbsp;'/contact': 'contact',<br />
        &nbsp;&nbsp;});<br /><br />

        &nbsp;&nbsp;FasterJs.router.registerMethods({<br />
        &nbsp;&nbsp;&nbsp;&nbsp;index(FasterCore) {<br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FasterCore.view('index');<br />
        &nbsp;&nbsp;&nbsp;&nbsp;},<br />
        &nbsp;&nbsp;&nbsp;&nbsp;about(FasterCore) {<br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FasterCore.view('about');<br />
        &nbsp;&nbsp;&nbsp;&nbsp;},<br />
        &nbsp;&nbsp;&nbsp;&nbsp;contact(FasterCore) {<br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FasterCore.view('contact');<br />
        &nbsp;&nbsp;&nbsp;&nbsp;},<br />
        &nbsp;&nbsp;});<br />
      `]);
      typed(code(view, 'views-2'), [`
        [app.js]<br />
        &nbsp;&nbsp;FasterJs.config.componentsTransitions = true; // default is false<br />
      `]);
    }
    //
    FasterCore.view(view);
  },
  loading_layer(FasterCore) {
    let view = 'loading-layer', codeTag = code(view);
    //
    if (!el(`[data-faster-component-id=${view}]`).classList.contains('initiated')) {
      el(`[data-faster-component-id=${view}]`).classList.add('initiated');
      typed(codeTag, [`
        [index.html]<br />
        &nbsp;&nbsp;&lt;body&gt;<br />
        &nbsp;&nbsp;&nbsp;&nbsp;&lt;div data-faster-app&gt;<br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;section data-faster-loading&gt;Loading ...&lt;/section><br />
        &nbsp;&nbsp;&nbsp;&nbsp;&lt;/div&gt;<br />
        &nbsp;&nbsp;&lt;/body&gt;<br /><br />

        [app.js]<br />
        &nbsp;&nbsp;FasterJs.config.loadingLayer = true; // default is false<br />
      `]);
    }
    //
    FasterCore.view(view);
  },
  initialization(FasterCore) {
    let view = 'initialization', codeTag = code(view);
    //
    if (!el(`[data-faster-component-id=${view}]`).classList.contains('initiated')) {
      el(`[data-faster-component-id=${view}]`).classList.add('initiated');
      typed(codeTag, [`
        [app.js]<br />
        &nbsp;&nbsp;FasterJs.init();
      `]);
    }
    //
    FasterCore.view(view);
  },
  what_is_next(FasterCore) {
    let view = 'whats-next', codeTag = code(view);
    //
    if (!el(`[data-faster-component-id=${view}]`).classList.contains('initiated')) {
      el(`[data-faster-component-id=${view}]`).classList.add('initiated');
      typed(codeTag, [`
        //
      `]);
    }
    //
    FasterCore.view(view);
  },
});

FasterJs.events.beforeRouteEnter = () => asideClose();

FasterJs.init();
