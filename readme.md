# FasterJS
A lightweight vanilla JavaScript front-end framework that lets you build a simple website with predefined routes.

### Benefits:
- Lightweight size < 10kb.
- Both hash-based and history-mode-based routing system are available.
- Designed to work with simple kinds of basic, static and small webpages that does not really need an enormous frameworks to do just some staff.
- A framework launched today and is being developed everyday, so a lot of new features are on the way. It's now just a fresh start.
- Easy to use (Try it and you'll see!).

___

### Installation
First of all, you need to download the minified version of framework file ___faster.min.js___ then include it before closing the body tag (you can use the normal version ___faster.js___ if you want to see all code under the hood).

I suggest to create a separate js file to setup ___FasterJS___ rather than coding it in `<script>` tag below the script file. It'll be like this way:
```
[index.html]
  <script src="./faster.min.js"></script>
  <script src="./app.js"></script>     <- Your JS setup file
```
Basically, ___FasterJS___ works with a whole root container element having this attribute `[data-faster-app]`. It's a very good idea to use the HTML5 semantic element `<main>` as a direct child of `<body>`, but using `<div>` still a good choice anyway. It'll be like this way:
```
[index.html]
  <body>
    <div data-faster-app>
      <!-- your website components goes here -->
    </div>
    <script src="./faster.min.js"></script>
    <script src="./app.js"></script>
  </body>
```

### Basic Setup
___FasterJS___ divides your pages into components, each one should have the attribute `[data-faster-component]` and `[data-faster-component-id]`.

It's a good idea to create them using `<section>` HTML5 semantic tag.
The root container `[data-faster-app]` **MUST** have the `[data-faster-component]` elements as a direct children of the root. Nesting components is **NOT ALLOWED**. It'll be like this way:
```
[index.html]
  <body>
    <div data-faster-app>
      <section data-faster-component data-faster-component-id="home"></section>
      <section data-faster-component data-faster-component-id="about-us"></section>
      <section data-faster-component data-faster-component-id="contact-us"></section>
    </div>
  </body>
```
You can surround your `[data-faster-app]` with elements that you want to keep them available whatever you browse. ___FasterJS___ will handle `[data-faster-app]` ignoring anything inside `<body>` else. It'll be like this way:
```
[index.html]
  <body>
    <header>Woha! This is static header</header>
    <div data-faster-app>
      <section data-faster-component data-faster-component-id="home"></section>
      <section data-faster-component data-faster-component-id="about-us"></section>
      <section data-faster-component data-faster-component-id="contact-us"></section>
    </div>
    <footer>Woha! This is static footer</footer>
  </body>
```
In fact, you can still use ___FasterJS___ without creating `[data-faster-component]` elements. ___FasterJS___ only handles those elements for pagination-routing system. As long the root `[data-faster-app]` element is found, ___FasterJS___ will function as well.

___

### Getting Started
When you include ___FasterJS___ framework, the variable `FasterJs` will be ready for you. After preparing the basics, you could run your website using `init()` method. It'll be like this way:
```
[index.html]
  <body>
    <div data-faster-app>
      <section data-faster-component data-faster-component-id="index">
        This is the / route showing index content.
      </section>
    </div>
  </body>
  <script src="./faster.min.js"></script>
  <script src="./app.js"></script>
```
```
[app.js]
  // FasterJs is ready with you due to including (faster.min.js)
  FasterJs.init();
```
Although it's good to go, but we missed some basic setup to move on.

Firstly, the routing system is, by default, hash mode. If you want to change it to history mode, it'll be like this way:
```
[app.js]
  FasterJs.config.mode = 'history'; // default is hash
```
> Good to know: ordering codes is not an important matter, but it's desirable to do for a clean code.
> Although it, ___FasterJs.init();___ should be in last!

Then, we have to set `basePathName`, it refers to an absolute path source of your website. If it's in root, set it to `/` (this is default value, anyway). It'll be like this way:
```
[app.js]
  FasterJs.config.basePathName = "/subfolder/";
```
> Slashes around the path above are __IMPORTANT__ TO ASSIGN!

Then, we have to register two things: `routeMap` and `routeMethod`. To understand its concept, let's have a look at this scenario:

Assuming we have this URL requested:
~https://www.example.com/subfolder/
> /subfolder/ is came from the `FasterJs.config.basePathName` that we'd set above. Remember that point.
> 

> In 'hash' routing mode, ___FasterJS___ will inject `#!` delimiter before routes. This is related with `baseRoute` option. We're going to talk about it in a while.
> 
> Nothing will be injected in 'history' mode.

> In ___FasterJS___, `/` route is predefined with `index` ___blank___ method. You can override it.

In fact, ___FasterJS___ will check up if the `/` route is registered before. If it is, it'll fire the `index` method. So, `index` method is triggered. It'll be like this way:


![First image](https://iili.io/5XSC7a.png)

Here, we have to override the `index` method using `registerMethods` method in `router` config. It'll be like this way:
```
[app.js]
  FasterJs.router.registerMethods({
    index: function (FasterCore) {
      console.log("The '/' route triggers 'index' method.");
    },
  });
```
> The formula of `registerMethods()` is an object list with key-value pairs. The key is the name of the method, and value is the `function` to trigger.

> The parameter `FasterCore` represents an object contains:
> { ___view___: FasterJs.view(selector), ___route___: { ... }, ___currentRoute___: '...' }
> 
> We're going to talk about these parameter later. Don't worry about that.

Now, the result would be like this way:


![Second image](https://iili.io/5XU0cF.png)

Let's have a look at `registerMaps()` method in `router` config with this example like this way:
```
[app.js]
  FasterJs.router.registerMaps({
    '/': 'index',             // default predefined route
    '/contact': 'contactUs',  // now-defined route
  });
```
> The formula of `registerMaps()` is an object list with key-value pairs. The key is the route path preceded with `/`, and value is the name of the `function` to trigger.

> All registered routes MUST be preceded by (/) slash.

With this new two routes that is defined above, let's register their methods. It'll be like this way:
```
[app.js]
  FasterJs.router.registerMethods({
    contactUs: function (FasterCore) {
      console.log("The '/contact' route triggers 'contactUs' method.");
    },
  });
```
And so on ...
> Good to know: If you have two or more routes and you want to trigger one method, you can handle this issue using pipeline character `|` like this way:
> ````
> [app.js]
>   FasterJs.router.registerMaps({
>     '/|/home|/index': 'index',
>   });
> ````

In 'hash' routing mode only, you can define `baseRoute` option in `router` config, the default value is `/`.
To understand its concept, let's have a look at this scenario:
When you navigate to the website and the URL does not have `#!` delimiter, ___FasterJS___ will redirect to `baseRoute` route. If the requested URL has `#!`, then `baseRoute` will not effect.

Programmatically, if you need to know the current route, you can use `currentRoute` property in `FasterCore` parameter. It'll be like this way:
```
[app.js]
  FasterJs.router.registerMethods({
    index: function (FasterCore) {
      let route = FasterCore.currentRoute;
      console.log(`The '${route}' route triggers 'index' method.`);
    },
  });
```
Also, if you want to navigate to another route, you can use `goTo` method in `FasterCore` parameter. It'll be like this way:

```
[app.js]
  FasterJs.router.registerMethods({
    index: function (FasterCore) {
      let x = 4;    // for example
      if (x > 3) {  // any logic that returns true
        FasterCore.goTo('/about');
      }
    },
  });
```
This will update the URL and navigate to the desired route path, exactly like when the user manually he does when normal surfing your website.

In another hand, if the user reaches a URL with a route that is not registered yet, ___FasterJS___ will trigger a fallback error. ___FasterJS___ has 4 fallbacks:

 1. noRoutesMap
 2. noRoutesMethods
 3. routeMapNotFound
 4. routeMethodNotFound

Fallback system in ___FasterJS___ will not suspend your website or stop running it, but it'll print an error in Console Panel in the browser. It'll be like this way:


![Third Image](https://iili.io/5X4MAu.png)

Guess what? Instead of waiting for the fallback error to be printed in the Console Panel, you can show up a specific page that's fully customized by you and no error will be printed in Console Panel! Here is how to do this:

 1. Create an element inside `[data-faster-app]` with this attribute `[data-faster-fallback]`. Recently, I've suggested to you that it would be a `<section>` element.
 2. Attach this extra attribute `[data-faster-fallback-type]` to the element with one of the fallbacks above.

It'll be like this way:
```
[index.html]
  <body>
    <div data-faster-app>
      <section data-faster-fallback data-faster-fallback-type="routeMapNotFound">The page that you want is not found. :-(</section>
    </div>
  </body>
```


![Fourth Image](https://iili.io/5X6uUP.png)

Pretty cool! :-)

___

### Navigation
___FasterJS___ uses any kind of elements tags for navigation, depending on built-in system for both hash-mode and history-mode using `[data-faster-link]` attribute with the target route value. It'll be like this way:

```
[index.html]
  <body>
    <div data-faster-app>
      <a href="/contact" data-faster-link="/contact">This is anchor tag targeting to /contact route</a>
      <button data-faster-link="/contact">Also this button targets to /contact route</button>
      <div data-faster-link="/contact">Also with this css-stylized div targets to /contact route</div>
    </div>
  </body>
```

___

### Route Event
You can assign a specific event when a route is requested. For this, and assuming that you'd registered your `routeMap` and its `routeMethod`, all what you have to do is to register an event using `registerEvents` method in `router` config. It'll be like this way:
```
[app.js]
  FasterJs.router.registerMaps({
    '/': 'index',
  });
  FasterJs.router.registerMethods({
    index: function (FasterCore) {
      // index() is fired when the route / is requested
    },
  });
  FasterJs.router.registerEvents({
    '/': function (FasterCore) {
      // this event will be fired when routing to the route /
    },
  });
```

___

### Global Events
___FasterJS___ has 5 types of global events:
- ___beforeInit___: This event is fired when the framework is loaded into the browser and before initializing anything of its methods.
- ___init___: This event is fired after ___beforeInit___ event but before navigating to the requested URL.
- ___beforeRouteEnter___: This event is fired before calling the requested route and ___MUST___ be registered with its method.
- ___routeEntered___: Similar to the previous event but this event is fired after calling an existing route map and its method.
- ___loaded___: At the end, this event is fired after all events and fallbacks.

___Fallbacks___ events are triggered, when needed, before ___loaded___ event, following this order above.

To make this idea clear, let's have a look at this diagram below:


![FasterJS events diagram](https://iili.io/5jD8Ol.jpg)

___

### Views
Recently, we've talked about the basics of HTML tags to initialize ___FasterJS___ with routes and methods. All what we did before is setting up instructions without linking routes with related sections.
Now, to handle views programmatically, we use `view(id)` method. It'll be like this way:
```
[index.html]
  <body>
    <div data-faster-app>
      <section data-faster-component data-faster-component-id='index'>Index page</section>
      <section data-faster-component data-faster-component-id='about'>About page</section>
      <section data-faster-component data-faster-component-id='contact'>Contact page</section>
    </div>
  </body>
```

```
[app.js]
  FasterJs.router.registerMaps({
    '/': 'index',
    '/about': 'about',
    '/contact': 'contact',
  });
  
  FasterJs.router.registerMethods({
    index(FasterCore) {
      FasterCore.view('index');
    },
    about(FasterCore) {
      FasterCore.view('about');
    },
    contact(FasterCore) {
      FasterCore.view('contact');
    },
  });
```

Under the hood, ___FasterJS___ uses CSS `display: block||none;` for toggling elements. The `display` property prevents some of transitions, transforms, animations and any other effects that you need to do.
To avoid this, you have to disable `componentsTransitions` property in `config` object. It'll be like this way:
```
[app.js]
  FasterJs.config.componentsTransitions = false;
  // default is true
```

This will stop using `display` CSS property and still managing `[data-faster-component]` elements using `[data-faster-component-activity]` property effected by `FasterJs.view()` method.

In this case, you're free to handle any animation, transform or transition that you want. For example: prepare a CSS class and manage your effects by adding and removing it using JS. It's up to you.

___

### Loading Layer
___FasterJS___ also provides custom loading layer for your website. All what you have to do is creating an element (again I suggest you to use `<section>`) having this attribute `[data-faster-loading]` and set `loadingLayer` to true into property  `config` key. It'll be like this way:
```
[index.html]
  <body>
    <div data-faster-app>
      <section data-faster-loading>This is loading sample ...</section>
    </div>
  </body>
```

```
[app.js]
  FasterJs.config.loadingLayer = true;
```

___

### Initialization
And now, after this trip together in preparation and processing ___FasterJS___, it's time to initialize it using `init()` method.
`init()` method ___MUST___ be in the end of script app file to ensure that all preceded codes are setup as well. It'll be like this:
```
[app.js]
  FasterJs.init();
```

___

### What's next?
___FasterJS___ has just started and is in a continuous development process, dozens of new features are being tested and improved before officially released into a new versions here in this repo.

This readme file will be updated in each time that ___FasterJS___ has a new release.

So, if you're interested in ___FasterJS___ and you're waiting for the next, please give us a "Star" and click the bell button and set the notifications setting to "Watch" to receive all updates by us.

Would you like to support us? All what you could do for us is mention ___FasterJS___ repo link in your website with <3

Any questions? Feel free to reach me using my email: nael_d@hotmail.com

___

Reached the end of this documentation and still reading? You're amazing! :-D
