
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function get_binding_group_value(group, __value, checked) {
        const value = new Set();
        for (let i = 0; i < group.length; i += 1) {
            if (group[i].checked)
                value.add(group[i].__value);
        }
        if (!checked) {
            value.delete(__value);
        }
        return Array.from(value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }
    class HtmlTag {
        constructor(anchor = null) {
            this.a = anchor;
            this.e = this.n = null;
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.h(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.29.4' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn, basedir, module) {
    	return module = {
    	  path: basedir,
    	  exports: {},
    	  require: function (path, base) {
          return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
        }
    	}, fn(module, module.exports), module.exports;
    }

    function commonjsRequire () {
    	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
    }

    var page = createCommonjsModule(function (module, exports) {
    (function (global, factory) {
    	 module.exports = factory() ;
    }(commonjsGlobal, (function () {
    var isarray = Array.isArray || function (arr) {
      return Object.prototype.toString.call(arr) == '[object Array]';
    };

    /**
     * Expose `pathToRegexp`.
     */
    var pathToRegexp_1 = pathToRegexp;
    var parse_1 = parse;
    var compile_1 = compile;
    var tokensToFunction_1 = tokensToFunction;
    var tokensToRegExp_1 = tokensToRegExp;

    /**
     * The main path matching regexp utility.
     *
     * @type {RegExp}
     */
    var PATH_REGEXP = new RegExp([
      // Match escaped characters that would otherwise appear in future matches.
      // This allows the user to escape special characters that won't transform.
      '(\\\\.)',
      // Match Express-style parameters and un-named parameters with a prefix
      // and optional suffixes. Matches appear as:
      //
      // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
      // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
      // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
      '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))'
    ].join('|'), 'g');

    /**
     * Parse a string for the raw tokens.
     *
     * @param  {String} str
     * @return {Array}
     */
    function parse (str) {
      var tokens = [];
      var key = 0;
      var index = 0;
      var path = '';
      var res;

      while ((res = PATH_REGEXP.exec(str)) != null) {
        var m = res[0];
        var escaped = res[1];
        var offset = res.index;
        path += str.slice(index, offset);
        index = offset + m.length;

        // Ignore already escaped sequences.
        if (escaped) {
          path += escaped[1];
          continue
        }

        // Push the current path onto the tokens.
        if (path) {
          tokens.push(path);
          path = '';
        }

        var prefix = res[2];
        var name = res[3];
        var capture = res[4];
        var group = res[5];
        var suffix = res[6];
        var asterisk = res[7];

        var repeat = suffix === '+' || suffix === '*';
        var optional = suffix === '?' || suffix === '*';
        var delimiter = prefix || '/';
        var pattern = capture || group || (asterisk ? '.*' : '[^' + delimiter + ']+?');

        tokens.push({
          name: name || key++,
          prefix: prefix || '',
          delimiter: delimiter,
          optional: optional,
          repeat: repeat,
          pattern: escapeGroup(pattern)
        });
      }

      // Match any characters still remaining.
      if (index < str.length) {
        path += str.substr(index);
      }

      // If the path exists, push it onto the end.
      if (path) {
        tokens.push(path);
      }

      return tokens
    }

    /**
     * Compile a string to a template function for the path.
     *
     * @param  {String}   str
     * @return {Function}
     */
    function compile (str) {
      return tokensToFunction(parse(str))
    }

    /**
     * Expose a method for transforming tokens into the path function.
     */
    function tokensToFunction (tokens) {
      // Compile all the tokens into regexps.
      var matches = new Array(tokens.length);

      // Compile all the patterns before compilation.
      for (var i = 0; i < tokens.length; i++) {
        if (typeof tokens[i] === 'object') {
          matches[i] = new RegExp('^' + tokens[i].pattern + '$');
        }
      }

      return function (obj) {
        var path = '';
        var data = obj || {};

        for (var i = 0; i < tokens.length; i++) {
          var token = tokens[i];

          if (typeof token === 'string') {
            path += token;

            continue
          }

          var value = data[token.name];
          var segment;

          if (value == null) {
            if (token.optional) {
              continue
            } else {
              throw new TypeError('Expected "' + token.name + '" to be defined')
            }
          }

          if (isarray(value)) {
            if (!token.repeat) {
              throw new TypeError('Expected "' + token.name + '" to not repeat, but received "' + value + '"')
            }

            if (value.length === 0) {
              if (token.optional) {
                continue
              } else {
                throw new TypeError('Expected "' + token.name + '" to not be empty')
              }
            }

            for (var j = 0; j < value.length; j++) {
              segment = encodeURIComponent(value[j]);

              if (!matches[i].test(segment)) {
                throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
              }

              path += (j === 0 ? token.prefix : token.delimiter) + segment;
            }

            continue
          }

          segment = encodeURIComponent(value);

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
          }

          path += token.prefix + segment;
        }

        return path
      }
    }

    /**
     * Escape a regular expression string.
     *
     * @param  {String} str
     * @return {String}
     */
    function escapeString (str) {
      return str.replace(/([.+*?=^!:${}()[\]|\/])/g, '\\$1')
    }

    /**
     * Escape the capturing group by escaping special characters and meaning.
     *
     * @param  {String} group
     * @return {String}
     */
    function escapeGroup (group) {
      return group.replace(/([=!:$\/()])/g, '\\$1')
    }

    /**
     * Attach the keys as a property of the regexp.
     *
     * @param  {RegExp} re
     * @param  {Array}  keys
     * @return {RegExp}
     */
    function attachKeys (re, keys) {
      re.keys = keys;
      return re
    }

    /**
     * Get the flags for a regexp from the options.
     *
     * @param  {Object} options
     * @return {String}
     */
    function flags (options) {
      return options.sensitive ? '' : 'i'
    }

    /**
     * Pull out keys from a regexp.
     *
     * @param  {RegExp} path
     * @param  {Array}  keys
     * @return {RegExp}
     */
    function regexpToRegexp (path, keys) {
      // Use a negative lookahead to match only capturing groups.
      var groups = path.source.match(/\((?!\?)/g);

      if (groups) {
        for (var i = 0; i < groups.length; i++) {
          keys.push({
            name: i,
            prefix: null,
            delimiter: null,
            optional: false,
            repeat: false,
            pattern: null
          });
        }
      }

      return attachKeys(path, keys)
    }

    /**
     * Transform an array into a regexp.
     *
     * @param  {Array}  path
     * @param  {Array}  keys
     * @param  {Object} options
     * @return {RegExp}
     */
    function arrayToRegexp (path, keys, options) {
      var parts = [];

      for (var i = 0; i < path.length; i++) {
        parts.push(pathToRegexp(path[i], keys, options).source);
      }

      var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

      return attachKeys(regexp, keys)
    }

    /**
     * Create a path regexp from string input.
     *
     * @param  {String} path
     * @param  {Array}  keys
     * @param  {Object} options
     * @return {RegExp}
     */
    function stringToRegexp (path, keys, options) {
      var tokens = parse(path);
      var re = tokensToRegExp(tokens, options);

      // Attach keys back to the regexp.
      for (var i = 0; i < tokens.length; i++) {
        if (typeof tokens[i] !== 'string') {
          keys.push(tokens[i]);
        }
      }

      return attachKeys(re, keys)
    }

    /**
     * Expose a function for taking tokens and returning a RegExp.
     *
     * @param  {Array}  tokens
     * @param  {Array}  keys
     * @param  {Object} options
     * @return {RegExp}
     */
    function tokensToRegExp (tokens, options) {
      options = options || {};

      var strict = options.strict;
      var end = options.end !== false;
      var route = '';
      var lastToken = tokens[tokens.length - 1];
      var endsWithSlash = typeof lastToken === 'string' && /\/$/.test(lastToken);

      // Iterate over the tokens and create our regexp string.
      for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];

        if (typeof token === 'string') {
          route += escapeString(token);
        } else {
          var prefix = escapeString(token.prefix);
          var capture = token.pattern;

          if (token.repeat) {
            capture += '(?:' + prefix + capture + ')*';
          }

          if (token.optional) {
            if (prefix) {
              capture = '(?:' + prefix + '(' + capture + '))?';
            } else {
              capture = '(' + capture + ')?';
            }
          } else {
            capture = prefix + '(' + capture + ')';
          }

          route += capture;
        }
      }

      // In non-strict mode we allow a slash at the end of match. If the path to
      // match already ends with a slash, we remove it for consistency. The slash
      // is valid at the end of a path match, not in the middle. This is important
      // in non-ending mode, where "/test/" shouldn't match "/test//route".
      if (!strict) {
        route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?';
      }

      if (end) {
        route += '$';
      } else {
        // In non-ending mode, we need the capturing groups to match as much as
        // possible by using a positive lookahead to the end or next path segment.
        route += strict && endsWithSlash ? '' : '(?=\\/|$)';
      }

      return new RegExp('^' + route, flags(options))
    }

    /**
     * Normalize the given path string, returning a regular expression.
     *
     * An empty array can be passed in for the keys, which will hold the
     * placeholder key descriptions. For example, using `/user/:id`, `keys` will
     * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
     *
     * @param  {(String|RegExp|Array)} path
     * @param  {Array}                 [keys]
     * @param  {Object}                [options]
     * @return {RegExp}
     */
    function pathToRegexp (path, keys, options) {
      keys = keys || [];

      if (!isarray(keys)) {
        options = keys;
        keys = [];
      } else if (!options) {
        options = {};
      }

      if (path instanceof RegExp) {
        return regexpToRegexp(path, keys)
      }

      if (isarray(path)) {
        return arrayToRegexp(path, keys, options)
      }

      return stringToRegexp(path, keys, options)
    }

    pathToRegexp_1.parse = parse_1;
    pathToRegexp_1.compile = compile_1;
    pathToRegexp_1.tokensToFunction = tokensToFunction_1;
    pathToRegexp_1.tokensToRegExp = tokensToRegExp_1;

    /**
       * Module dependencies.
       */

      

      /**
       * Short-cuts for global-object checks
       */

      var hasDocument = ('undefined' !== typeof document);
      var hasWindow = ('undefined' !== typeof window);
      var hasHistory = ('undefined' !== typeof history);
      var hasProcess = typeof process !== 'undefined';

      /**
       * Detect click event
       */
      var clickEvent = hasDocument && document.ontouchstart ? 'touchstart' : 'click';

      /**
       * To work properly with the URL
       * history.location generated polyfill in https://github.com/devote/HTML5-History-API
       */

      var isLocation = hasWindow && !!(window.history.location || window.location);

      /**
       * The page instance
       * @api private
       */
      function Page() {
        // public things
        this.callbacks = [];
        this.exits = [];
        this.current = '';
        this.len = 0;

        // private things
        this._decodeURLComponents = true;
        this._base = '';
        this._strict = false;
        this._running = false;
        this._hashbang = false;

        // bound functions
        this.clickHandler = this.clickHandler.bind(this);
        this._onpopstate = this._onpopstate.bind(this);
      }

      /**
       * Configure the instance of page. This can be called multiple times.
       *
       * @param {Object} options
       * @api public
       */

      Page.prototype.configure = function(options) {
        var opts = options || {};

        this._window = opts.window || (hasWindow && window);
        this._decodeURLComponents = opts.decodeURLComponents !== false;
        this._popstate = opts.popstate !== false && hasWindow;
        this._click = opts.click !== false && hasDocument;
        this._hashbang = !!opts.hashbang;

        var _window = this._window;
        if(this._popstate) {
          _window.addEventListener('popstate', this._onpopstate, false);
        } else if(hasWindow) {
          _window.removeEventListener('popstate', this._onpopstate, false);
        }

        if (this._click) {
          _window.document.addEventListener(clickEvent, this.clickHandler, false);
        } else if(hasDocument) {
          _window.document.removeEventListener(clickEvent, this.clickHandler, false);
        }

        if(this._hashbang && hasWindow && !hasHistory) {
          _window.addEventListener('hashchange', this._onpopstate, false);
        } else if(hasWindow) {
          _window.removeEventListener('hashchange', this._onpopstate, false);
        }
      };

      /**
       * Get or set basepath to `path`.
       *
       * @param {string} path
       * @api public
       */

      Page.prototype.base = function(path) {
        if (0 === arguments.length) return this._base;
        this._base = path;
      };

      /**
       * Gets the `base`, which depends on whether we are using History or
       * hashbang routing.

       * @api private
       */
      Page.prototype._getBase = function() {
        var base = this._base;
        if(!!base) return base;
        var loc = hasWindow && this._window && this._window.location;

        if(hasWindow && this._hashbang && loc && loc.protocol === 'file:') {
          base = loc.pathname;
        }

        return base;
      };

      /**
       * Get or set strict path matching to `enable`
       *
       * @param {boolean} enable
       * @api public
       */

      Page.prototype.strict = function(enable) {
        if (0 === arguments.length) return this._strict;
        this._strict = enable;
      };


      /**
       * Bind with the given `options`.
       *
       * Options:
       *
       *    - `click` bind to click events [true]
       *    - `popstate` bind to popstate [true]
       *    - `dispatch` perform initial dispatch [true]
       *
       * @param {Object} options
       * @api public
       */

      Page.prototype.start = function(options) {
        var opts = options || {};
        this.configure(opts);

        if (false === opts.dispatch) return;
        this._running = true;

        var url;
        if(isLocation) {
          var window = this._window;
          var loc = window.location;

          if(this._hashbang && ~loc.hash.indexOf('#!')) {
            url = loc.hash.substr(2) + loc.search;
          } else if (this._hashbang) {
            url = loc.search + loc.hash;
          } else {
            url = loc.pathname + loc.search + loc.hash;
          }
        }

        this.replace(url, null, true, opts.dispatch);
      };

      /**
       * Unbind click and popstate event handlers.
       *
       * @api public
       */

      Page.prototype.stop = function() {
        if (!this._running) return;
        this.current = '';
        this.len = 0;
        this._running = false;

        var window = this._window;
        this._click && window.document.removeEventListener(clickEvent, this.clickHandler, false);
        hasWindow && window.removeEventListener('popstate', this._onpopstate, false);
        hasWindow && window.removeEventListener('hashchange', this._onpopstate, false);
      };

      /**
       * Show `path` with optional `state` object.
       *
       * @param {string} path
       * @param {Object=} state
       * @param {boolean=} dispatch
       * @param {boolean=} push
       * @return {!Context}
       * @api public
       */

      Page.prototype.show = function(path, state, dispatch, push) {
        var ctx = new Context(path, state, this),
          prev = this.prevContext;
        this.prevContext = ctx;
        this.current = ctx.path;
        if (false !== dispatch) this.dispatch(ctx, prev);
        if (false !== ctx.handled && false !== push) ctx.pushState();
        return ctx;
      };

      /**
       * Goes back in the history
       * Back should always let the current route push state and then go back.
       *
       * @param {string} path - fallback path to go back if no more history exists, if undefined defaults to page.base
       * @param {Object=} state
       * @api public
       */

      Page.prototype.back = function(path, state) {
        var page = this;
        if (this.len > 0) {
          var window = this._window;
          // this may need more testing to see if all browsers
          // wait for the next tick to go back in history
          hasHistory && window.history.back();
          this.len--;
        } else if (path) {
          setTimeout(function() {
            page.show(path, state);
          });
        } else {
          setTimeout(function() {
            page.show(page._getBase(), state);
          });
        }
      };

      /**
       * Register route to redirect from one path to other
       * or just redirect to another route
       *
       * @param {string} from - if param 'to' is undefined redirects to 'from'
       * @param {string=} to
       * @api public
       */
      Page.prototype.redirect = function(from, to) {
        var inst = this;

        // Define route from a path to another
        if ('string' === typeof from && 'string' === typeof to) {
          page.call(this, from, function(e) {
            setTimeout(function() {
              inst.replace(/** @type {!string} */ (to));
            }, 0);
          });
        }

        // Wait for the push state and replace it with another
        if ('string' === typeof from && 'undefined' === typeof to) {
          setTimeout(function() {
            inst.replace(from);
          }, 0);
        }
      };

      /**
       * Replace `path` with optional `state` object.
       *
       * @param {string} path
       * @param {Object=} state
       * @param {boolean=} init
       * @param {boolean=} dispatch
       * @return {!Context}
       * @api public
       */


      Page.prototype.replace = function(path, state, init, dispatch) {
        var ctx = new Context(path, state, this),
          prev = this.prevContext;
        this.prevContext = ctx;
        this.current = ctx.path;
        ctx.init = init;
        ctx.save(); // save before dispatching, which may redirect
        if (false !== dispatch) this.dispatch(ctx, prev);
        return ctx;
      };

      /**
       * Dispatch the given `ctx`.
       *
       * @param {Context} ctx
       * @api private
       */

      Page.prototype.dispatch = function(ctx, prev) {
        var i = 0, j = 0, page = this;

        function nextExit() {
          var fn = page.exits[j++];
          if (!fn) return nextEnter();
          fn(prev, nextExit);
        }

        function nextEnter() {
          var fn = page.callbacks[i++];

          if (ctx.path !== page.current) {
            ctx.handled = false;
            return;
          }
          if (!fn) return unhandled.call(page, ctx);
          fn(ctx, nextEnter);
        }

        if (prev) {
          nextExit();
        } else {
          nextEnter();
        }
      };

      /**
       * Register an exit route on `path` with
       * callback `fn()`, which will be called
       * on the previous context when a new
       * page is visited.
       */
      Page.prototype.exit = function(path, fn) {
        if (typeof path === 'function') {
          return this.exit('*', path);
        }

        var route = new Route(path, null, this);
        for (var i = 1; i < arguments.length; ++i) {
          this.exits.push(route.middleware(arguments[i]));
        }
      };

      /**
       * Handle "click" events.
       */

      /* jshint +W054 */
      Page.prototype.clickHandler = function(e) {
        if (1 !== this._which(e)) return;

        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        if (e.defaultPrevented) return;

        // ensure link
        // use shadow dom when available if not, fall back to composedPath()
        // for browsers that only have shady
        var el = e.target;
        var eventPath = e.path || (e.composedPath ? e.composedPath() : null);

        if(eventPath) {
          for (var i = 0; i < eventPath.length; i++) {
            if (!eventPath[i].nodeName) continue;
            if (eventPath[i].nodeName.toUpperCase() !== 'A') continue;
            if (!eventPath[i].href) continue;

            el = eventPath[i];
            break;
          }
        }

        // continue ensure link
        // el.nodeName for svg links are 'a' instead of 'A'
        while (el && 'A' !== el.nodeName.toUpperCase()) el = el.parentNode;
        if (!el || 'A' !== el.nodeName.toUpperCase()) return;

        // check if link is inside an svg
        // in this case, both href and target are always inside an object
        var svg = (typeof el.href === 'object') && el.href.constructor.name === 'SVGAnimatedString';

        // Ignore if tag has
        // 1. "download" attribute
        // 2. rel="external" attribute
        if (el.hasAttribute('download') || el.getAttribute('rel') === 'external') return;

        // ensure non-hash for the same path
        var link = el.getAttribute('href');
        if(!this._hashbang && this._samePath(el) && (el.hash || '#' === link)) return;

        // Check for mailto: in the href
        if (link && link.indexOf('mailto:') > -1) return;

        // check target
        // svg target is an object and its desired value is in .baseVal property
        if (svg ? el.target.baseVal : el.target) return;

        // x-origin
        // note: svg links that are not relative don't call click events (and skip page.js)
        // consequently, all svg links tested inside page.js are relative and in the same origin
        if (!svg && !this.sameOrigin(el.href)) return;

        // rebuild path
        // There aren't .pathname and .search properties in svg links, so we use href
        // Also, svg href is an object and its desired value is in .baseVal property
        var path = svg ? el.href.baseVal : (el.pathname + el.search + (el.hash || ''));

        path = path[0] !== '/' ? '/' + path : path;

        // strip leading "/[drive letter]:" on NW.js on Windows
        if (hasProcess && path.match(/^\/[a-zA-Z]:\//)) {
          path = path.replace(/^\/[a-zA-Z]:\//, '/');
        }

        // same page
        var orig = path;
        var pageBase = this._getBase();

        if (path.indexOf(pageBase) === 0) {
          path = path.substr(pageBase.length);
        }

        if (this._hashbang) path = path.replace('#!', '');

        if (pageBase && orig === path && (!isLocation || this._window.location.protocol !== 'file:')) {
          return;
        }

        e.preventDefault();
        this.show(orig);
      };

      /**
       * Handle "populate" events.
       * @api private
       */

      Page.prototype._onpopstate = (function () {
        var loaded = false;
        if ( ! hasWindow ) {
          return function () {};
        }
        if (hasDocument && document.readyState === 'complete') {
          loaded = true;
        } else {
          window.addEventListener('load', function() {
            setTimeout(function() {
              loaded = true;
            }, 0);
          });
        }
        return function onpopstate(e) {
          if (!loaded) return;
          var page = this;
          if (e.state) {
            var path = e.state.path;
            page.replace(path, e.state);
          } else if (isLocation) {
            var loc = page._window.location;
            page.show(loc.pathname + loc.search + loc.hash, undefined, undefined, false);
          }
        };
      })();

      /**
       * Event button.
       */
      Page.prototype._which = function(e) {
        e = e || (hasWindow && this._window.event);
        return null == e.which ? e.button : e.which;
      };

      /**
       * Convert to a URL object
       * @api private
       */
      Page.prototype._toURL = function(href) {
        var window = this._window;
        if(typeof URL === 'function' && isLocation) {
          return new URL(href, window.location.toString());
        } else if (hasDocument) {
          var anc = window.document.createElement('a');
          anc.href = href;
          return anc;
        }
      };

      /**
       * Check if `href` is the same origin.
       * @param {string} href
       * @api public
       */
      Page.prototype.sameOrigin = function(href) {
        if(!href || !isLocation) return false;

        var url = this._toURL(href);
        var window = this._window;

        var loc = window.location;

        /*
           When the port is the default http port 80 for http, or 443 for
           https, internet explorer 11 returns an empty string for loc.port,
           so we need to compare loc.port with an empty string if url.port
           is the default port 80 or 443.
           Also the comparition with `port` is changed from `===` to `==` because
           `port` can be a string sometimes. This only applies to ie11.
        */
        return loc.protocol === url.protocol &&
          loc.hostname === url.hostname &&
          (loc.port === url.port || loc.port === '' && (url.port == 80 || url.port == 443)); // jshint ignore:line
      };

      /**
       * @api private
       */
      Page.prototype._samePath = function(url) {
        if(!isLocation) return false;
        var window = this._window;
        var loc = window.location;
        return url.pathname === loc.pathname &&
          url.search === loc.search;
      };

      /**
       * Remove URL encoding from the given `str`.
       * Accommodates whitespace in both x-www-form-urlencoded
       * and regular percent-encoded form.
       *
       * @param {string} val - URL component to decode
       * @api private
       */
      Page.prototype._decodeURLEncodedURIComponent = function(val) {
        if (typeof val !== 'string') { return val; }
        return this._decodeURLComponents ? decodeURIComponent(val.replace(/\+/g, ' ')) : val;
      };

      /**
       * Create a new `page` instance and function
       */
      function createPage() {
        var pageInstance = new Page();

        function pageFn(/* args */) {
          return page.apply(pageInstance, arguments);
        }

        // Copy all of the things over. In 2.0 maybe we use setPrototypeOf
        pageFn.callbacks = pageInstance.callbacks;
        pageFn.exits = pageInstance.exits;
        pageFn.base = pageInstance.base.bind(pageInstance);
        pageFn.strict = pageInstance.strict.bind(pageInstance);
        pageFn.start = pageInstance.start.bind(pageInstance);
        pageFn.stop = pageInstance.stop.bind(pageInstance);
        pageFn.show = pageInstance.show.bind(pageInstance);
        pageFn.back = pageInstance.back.bind(pageInstance);
        pageFn.redirect = pageInstance.redirect.bind(pageInstance);
        pageFn.replace = pageInstance.replace.bind(pageInstance);
        pageFn.dispatch = pageInstance.dispatch.bind(pageInstance);
        pageFn.exit = pageInstance.exit.bind(pageInstance);
        pageFn.configure = pageInstance.configure.bind(pageInstance);
        pageFn.sameOrigin = pageInstance.sameOrigin.bind(pageInstance);
        pageFn.clickHandler = pageInstance.clickHandler.bind(pageInstance);

        pageFn.create = createPage;

        Object.defineProperty(pageFn, 'len', {
          get: function(){
            return pageInstance.len;
          },
          set: function(val) {
            pageInstance.len = val;
          }
        });

        Object.defineProperty(pageFn, 'current', {
          get: function(){
            return pageInstance.current;
          },
          set: function(val) {
            pageInstance.current = val;
          }
        });

        // In 2.0 these can be named exports
        pageFn.Context = Context;
        pageFn.Route = Route;

        return pageFn;
      }

      /**
       * Register `path` with callback `fn()`,
       * or route `path`, or redirection,
       * or `page.start()`.
       *
       *   page(fn);
       *   page('*', fn);
       *   page('/user/:id', load, user);
       *   page('/user/' + user.id, { some: 'thing' });
       *   page('/user/' + user.id);
       *   page('/from', '/to')
       *   page();
       *
       * @param {string|!Function|!Object} path
       * @param {Function=} fn
       * @api public
       */

      function page(path, fn) {
        // <callback>
        if ('function' === typeof path) {
          return page.call(this, '*', path);
        }

        // route <path> to <callback ...>
        if ('function' === typeof fn) {
          var route = new Route(/** @type {string} */ (path), null, this);
          for (var i = 1; i < arguments.length; ++i) {
            this.callbacks.push(route.middleware(arguments[i]));
          }
          // show <path> with [state]
        } else if ('string' === typeof path) {
          this['string' === typeof fn ? 'redirect' : 'show'](path, fn);
          // start [options]
        } else {
          this.start(path);
        }
      }

      /**
       * Unhandled `ctx`. When it's not the initial
       * popstate then redirect. If you wish to handle
       * 404s on your own use `page('*', callback)`.
       *
       * @param {Context} ctx
       * @api private
       */
      function unhandled(ctx) {
        if (ctx.handled) return;
        var current;
        var page = this;
        var window = page._window;

        if (page._hashbang) {
          current = isLocation && this._getBase() + window.location.hash.replace('#!', '');
        } else {
          current = isLocation && window.location.pathname + window.location.search;
        }

        if (current === ctx.canonicalPath) return;
        page.stop();
        ctx.handled = false;
        isLocation && (window.location.href = ctx.canonicalPath);
      }

      /**
       * Escapes RegExp characters in the given string.
       *
       * @param {string} s
       * @api private
       */
      function escapeRegExp(s) {
        return s.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1');
      }

      /**
       * Initialize a new "request" `Context`
       * with the given `path` and optional initial `state`.
       *
       * @constructor
       * @param {string} path
       * @param {Object=} state
       * @api public
       */

      function Context(path, state, pageInstance) {
        var _page = this.page = pageInstance || page;
        var window = _page._window;
        var hashbang = _page._hashbang;

        var pageBase = _page._getBase();
        if ('/' === path[0] && 0 !== path.indexOf(pageBase)) path = pageBase + (hashbang ? '#!' : '') + path;
        var i = path.indexOf('?');

        this.canonicalPath = path;
        var re = new RegExp('^' + escapeRegExp(pageBase));
        this.path = path.replace(re, '') || '/';
        if (hashbang) this.path = this.path.replace('#!', '') || '/';

        this.title = (hasDocument && window.document.title);
        this.state = state || {};
        this.state.path = path;
        this.querystring = ~i ? _page._decodeURLEncodedURIComponent(path.slice(i + 1)) : '';
        this.pathname = _page._decodeURLEncodedURIComponent(~i ? path.slice(0, i) : path);
        this.params = {};

        // fragment
        this.hash = '';
        if (!hashbang) {
          if (!~this.path.indexOf('#')) return;
          var parts = this.path.split('#');
          this.path = this.pathname = parts[0];
          this.hash = _page._decodeURLEncodedURIComponent(parts[1]) || '';
          this.querystring = this.querystring.split('#')[0];
        }
      }

      /**
       * Push state.
       *
       * @api private
       */

      Context.prototype.pushState = function() {
        var page = this.page;
        var window = page._window;
        var hashbang = page._hashbang;

        page.len++;
        if (hasHistory) {
            window.history.pushState(this.state, this.title,
              hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
        }
      };

      /**
       * Save the context state.
       *
       * @api public
       */

      Context.prototype.save = function() {
        var page = this.page;
        if (hasHistory) {
            page._window.history.replaceState(this.state, this.title,
              page._hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
        }
      };

      /**
       * Initialize `Route` with the given HTTP `path`,
       * and an array of `callbacks` and `options`.
       *
       * Options:
       *
       *   - `sensitive`    enable case-sensitive routes
       *   - `strict`       enable strict matching for trailing slashes
       *
       * @constructor
       * @param {string} path
       * @param {Object=} options
       * @api private
       */

      function Route(path, options, page) {
        var _page = this.page = page || globalPage;
        var opts = options || {};
        opts.strict = opts.strict || _page._strict;
        this.path = (path === '*') ? '(.*)' : path;
        this.method = 'GET';
        this.regexp = pathToRegexp_1(this.path, this.keys = [], opts);
      }

      /**
       * Return route middleware with
       * the given callback `fn()`.
       *
       * @param {Function} fn
       * @return {Function}
       * @api public
       */

      Route.prototype.middleware = function(fn) {
        var self = this;
        return function(ctx, next) {
          if (self.match(ctx.path, ctx.params)) {
            ctx.routePath = self.path;
            return fn(ctx, next);
          }
          next();
        };
      };

      /**
       * Check if this route matches `path`, if so
       * populate `params`.
       *
       * @param {string} path
       * @param {Object} params
       * @return {boolean}
       * @api private
       */

      Route.prototype.match = function(path, params) {
        var keys = this.keys,
          qsIndex = path.indexOf('?'),
          pathname = ~qsIndex ? path.slice(0, qsIndex) : path,
          m = this.regexp.exec(decodeURIComponent(pathname));

        if (!m) return false;

        delete params[0];

        for (var i = 1, len = m.length; i < len; ++i) {
          var key = keys[i - 1];
          var val = this.page._decodeURLEncodedURIComponent(m[i]);
          if (val !== undefined || !(hasOwnProperty.call(params, key.name))) {
            params[key.name] = val;
          }
        }

        return true;
      };


      /**
       * Module exports.
       */

      var globalPage = createPage();
      var page_js = globalPage;
      var default_1 = globalPage;

    page_js.default = default_1;

    return page_js;

    })));
    });

    /* src\components\Nav.svelte generated by Svelte v3.29.4 */

    const file = "src\\components\\Nav.svelte";

    function create_fragment(ctx) {
    	let nav;
    	let ul5;
    	let ul0;
    	let a0;
    	let t1;
    	let ul1;
    	let a1;
    	let t3;
    	let ul2;
    	let a2;
    	let t5;
    	let ul3;
    	let a3;
    	let t7;
    	let ul4;
    	let a4;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			ul5 = element("ul");
    			ul0 = element("ul");
    			a0 = element("a");
    			a0.textContent = "Home";
    			t1 = space();
    			ul1 = element("ul");
    			a1 = element("a");
    			a1.textContent = "Tempat Kos";
    			t3 = space();
    			ul2 = element("ul");
    			a2 = element("a");
    			a2.textContent = "Contact";
    			t5 = space();
    			ul3 = element("ul");
    			a3 = element("a");
    			a3.textContent = "About";
    			t7 = space();
    			ul4 = element("ul");
    			a4 = element("a");
    			img = element("img");
    			attr_dev(a0, "href", "/");
    			attr_dev(a0, "class", "nav-link text-white");
    			add_location(a0, file, 6, 3, 187);
    			attr_dev(ul0, "class", "nav-item");
    			add_location(ul0, file, 5, 2, 161);
    			attr_dev(a1, "href", "/listkos");
    			attr_dev(a1, "class", "nav-link text-white");
    			add_location(a1, file, 9, 3, 275);
    			attr_dev(ul1, "class", "nav-item");
    			add_location(ul1, file, 8, 2, 249);
    			attr_dev(a2, "href", "/contact");
    			attr_dev(a2, "class", "nav-link text-white");
    			add_location(a2, file, 12, 3, 375);
    			attr_dev(ul2, "class", "nav-item");
    			add_location(ul2, file, 11, 2, 349);
    			attr_dev(a3, "href", "/about");
    			attr_dev(a3, "class", "nav-link text-white");
    			add_location(a3, file, 15, 3, 472);
    			attr_dev(ul3, "class", "nav-item");
    			add_location(ul3, file, 14, 2, 446);
    			if (img.src !== (img_src_value = "../assets/brand.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "width", "123");
    			attr_dev(img, "height", "39");
    			attr_dev(img, "alt", "brand");
    			add_location(img, file, 18, 43, 605);
    			attr_dev(a4, "href", "/");
    			attr_dev(a4, "class", "nav-link text-white");
    			add_location(a4, file, 18, 3, 565);
    			attr_dev(ul4, "class", "nav-item");
    			add_location(ul4, file, 17, 2, 539);
    			attr_dev(ul5, "class", "navbar-nav ml-auto hover");
    			add_location(ul5, file, 4, 4, 120);
    			attr_dev(nav, "class", "navbar fixed-top navbar-expand navbar-custom");
    			add_location(nav, file, 3, 0, 56);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, ul5);
    			append_dev(ul5, ul0);
    			append_dev(ul0, a0);
    			append_dev(ul5, t1);
    			append_dev(ul5, ul1);
    			append_dev(ul1, a1);
    			append_dev(ul5, t3);
    			append_dev(ul5, ul2);
    			append_dev(ul2, a2);
    			append_dev(ul5, t5);
    			append_dev(ul5, ul3);
    			append_dev(ul3, a3);
    			append_dev(ul5, t7);
    			append_dev(ul5, ul4);
    			append_dev(ul4, a4);
    			append_dev(a4, img);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Nav", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Nav> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Nav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Nav",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    /**
     * Class Tsukamoto
     * menghitung prediksi harga kos metode fuzzy tsukamoto
     * @param jarak
     * @param ukuran
     * @param fasilitas
     */
    class Tsukamoto {
        // konstructor untuk class Tsukamoto
        constructor(jarak, ukuran, fasilitas) {
            this._fasilitas = 0;
            this.alpha_arr = new Array(18);
            this.z_arr = new Array(18);
            this._jarak = jarak;
            this._ukuran = ukuran;
            this._fasilitas = fasilitas;
        }
        /**
         * setter nilai jarak
         */
        set jarak(j) {
            this._jarak = j;
        }
        /**
         * setter nilai ukuran
         */
        set ukuran(u) {
            this._ukuran = u;
        }
        /**
         * setter nilai fasilitas
         */
        set fasilitas(f) {
            this._fasilitas = f;
        }
        /**
         * get nilai jarak
         * @return jarak
         */
        get jarak() {
            return this._jarak;
        }
        /**
         * get nilai ukuran
         * @return ukuran
         */
        get ukuran() {
            return this._ukuran;
        }
        /**
         * get nilai fasilitas
         * @return fasilitas
         */
        get fasilitas() {
            return this._fasilitas;
        }
        /**
         * Mencari nilai terkecil dari tiga variabel
         * @param x
         * @param y
         * @param z
         * @return nilai terkecil
         */
        CariMin(x, y, z) {
            if (x <= y && x <= z) {
                return x;
            }
            else if (y <= x && y <= z) {
                return y;
            }
            else {
                return z;
            }
        }
        /**
         * Mencari nilai keanggotaan himpunan fasilitas biasa
         * @return nilai keanggotaan pada himpunan fasilitas biasa
         */
        FasilitasBiasa() {
            if (this.fasilitas <= 20) {
                return 1;
            }
            else if (this.fasilitas > 20 && this.fasilitas < 70) {
                return (70 - this.fasilitas) / 50;
            }
            else {
                return 0;
            }
        }
        /**
         * Mencari nilai keanggotaan himpunan fasilitas lengkap
         * @return nilai keanggotaan pada himpunan fasilitas lengkap
         */
        FasilitasLengkap() {
            if (this.fasilitas >= 70) {
                return 1;
            }
            else if (this.fasilitas > 20 && this.fasilitas < 70) {
                return (this.fasilitas - 20) / 50;
            }
            else {
                return 0;
            }
        }
        /**
         *  mencari nilai keanggotaan himpunan jarak dekat
         *  @return nilai keanggotaan di himpunan jarak dekat
         */
        JarakDekat() {
            if (this.jarak <= 1) {
                return 1;
            }
            else if (this.jarak > 1 && this.jarak < 3) {
                return (3 - this.jarak) / 2;
            }
            else {
                return 0;
            }
        }
        /**
         *  mencari nilai keanggotaan himpunan jarak sedang
         *  @return nilai keanggotaan di himpunan jarak sedang
         */
        JarakSedang() {
            if (this.jarak >= 3 && this.jarak <= 5) {
                return 1;
            }
            else if (this.jarak > 1 && this.jarak < 3) {
                return (this.jarak - 1) / 2;
            }
            else if (this.jarak > 5 && this.jarak < 7) {
                return (7 - this.jarak) / 2;
            }
            else {
                return 0;
            }
        }
        /**
         *  mencari nilai keanggotaan himpunan jarak jauh
         *  @return nilai keanggotaan di himpunan jarak jauh
         */
        JarakJauh() {
            if (this.jarak >= 7) {
                return 1;
            }
            else if (this.jarak > 5 && this.jarak < 7) {
                return (this.jarak - 5) / 2;
            }
            else {
                return 0;
            }
        }
        /**
         *  mencari nilai keanggotaan himpunan ukuran sempit
         *  @return nilai keanggotaan di himpunan ukuran sempit
         */
        UkuranSempit() {
            if (this.ukuran <= 4) {
                return 1;
            }
            else if (this.ukuran > 4 && this.ukuran < 8) {
                return (8 - this.ukuran) / 4;
            }
            else {
                return 0;
            }
        }
        /**
         *  mencari nilai keanggotaan himpunan ukuran sedang
         *  @return nilai keanggotaan di himpunan ukuran sedang
         */
        UkuranSedang() {
            if (this.ukuran >= 8 && this.ukuran <= 15) {
                return 1;
            }
            else if (this.ukuran > 4 && this.ukuran < 8) {
                return (this.ukuran - 4) / 4;
            }
            else if (this.ukuran > 15 && this.ukuran < 18) {
                return (18 - this.ukuran) / 3;
            }
            else {
                return 0;
            }
        }
        /**
         *  mencari nilai keanggotaan himpunan ukuran luas
         *  @return nilai keanggotaan di himpunan ukuran luas
         */
        UkuranLuas() {
            if (this.ukuran >= 18) {
                return 1;
            }
            else if (this.ukuran > 15 && this.ukuran < 18) {
                return (this.ukuran - 15) / 3;
            }
            else {
                return 0;
            }
        }
        /**
         * Mencari harga di himpunan harga murah
         * @param alpha
         * @return harga
         */
        HargaMurah(alpha) {
            if (alpha > 0 && alpha < 1) {
                return (900 - alpha * 600);
            }
            else if (alpha == 1) {
                return 300;
            }
            else {
                return 900;
            }
        }
        /**
         * Mencari harga di himpunan harga mahal
         * @param alpha
         * @return harga
         */
        HargaMahal(alpha) {
            if (alpha > 0 && alpha < 1) {
                return (300 + alpha * 600);
            }
            else if (alpha == 1) {
                return 900;
            }
            else {
                return 300;
            }
        }
        /**
         *  mencari nilai z untuk semua aturan yang ada
         */
        Inferensi() {
            //1. Jika fasilitas BIASA dan ukuran SEMPIT dan jarak DEKAT maka harga MAHAL
            this.alpha_arr[0] = this.CariMin(this.FasilitasBiasa(), this.UkuranSempit(), this.JarakDekat());
            this.z_arr[0] = this.HargaMahal(this.alpha_arr[0]);
            //2. Jika fasilitas BIASA dan ukuran SEMPIT dan jarak SEDANG maka harga MURAH
            this.alpha_arr[1] = this.CariMin(this.FasilitasBiasa(), this.UkuranSempit(), this.JarakSedang());
            this.z_arr[1] = this.HargaMurah(this.alpha_arr[1]);
            //3. Jika fasilitas BIASA dan ukuran SEMPIT dan jarak JAUH maka harga MURAH
            this.alpha_arr[2] = this.CariMin(this.FasilitasBiasa(), this.UkuranSempit(), this.JarakJauh());
            this.z_arr[2] = this.HargaMurah(this.alpha_arr[2]);
            //4. Jika fasilitas BIASA dan ukuran SEDANG dan jarak DEKAT maka harga MAHAL
            this.alpha_arr[3] = this.CariMin(this.FasilitasBiasa(), this.UkuranSedang(), this.JarakDekat());
            this.z_arr[3] = this.HargaMahal(this.alpha_arr[3]);
            //5. Jika fasilitas BIASA dan ukuran SEDANG dan jarak SEDANG maka harga MURAH
            this.alpha_arr[4] = this.CariMin(this.FasilitasBiasa(), this.UkuranSedang(), this.JarakSedang());
            this.z_arr[4] = this.HargaMurah(this.alpha_arr[4]);
            //6. Jika fasilitas BIASA dan ukuran SEDANG dan jarak JAUH maka harga MURAH
            this.alpha_arr[5] = this.CariMin(this.FasilitasBiasa(), this.UkuranSedang(), this.JarakJauh());
            this.z_arr[5] = this.HargaMurah(this.alpha_arr[5]);
            //7. Jika fasilitas BIASA dan ukuran LUAS dan jarak DEKAT maka harga MAHAL
            this.alpha_arr[6] = this.CariMin(this.FasilitasBiasa(), this.UkuranLuas(), this.JarakDekat());
            this.z_arr[6] = this.HargaMahal(this.alpha_arr[6]);
            //8. Jika fasilitas BIASA dan ukuran LUAS dan jarak SEDANG maka harga MURAH
            this.alpha_arr[7] = this.CariMin(this.FasilitasBiasa(), this.UkuranLuas(), this.JarakSedang());
            this.z_arr[7] = this.HargaMurah(this.alpha_arr[7]);
            //9. Jika fasilitas BIASA dan ukuran LUAS dan jarak JAUH maka harga MURAH
            this.alpha_arr[8] = this.CariMin(this.FasilitasBiasa(), this.UkuranLuas(), this.JarakJauh());
            this.z_arr[8] = this.HargaMurah(this.alpha_arr[8]);
            //10. Jika fasilitas LENGKAP dan ukuran SEMPIT dan jarak DEKAT maka harga MAHAL
            this.alpha_arr[9] = this.CariMin(this.FasilitasLengkap(), this.UkuranSempit(), this.JarakDekat());
            this.z_arr[9] = this.HargaMahal(this.alpha_arr[9]);
            //11. Jika fasilitas LENGKAP dan ukuran SEMPIT dan jarak SEDANG maka harga MAHAL
            this.alpha_arr[10] = this.CariMin(this.FasilitasLengkap(), this.UkuranSempit(), this.JarakSedang());
            this.z_arr[10] = this.HargaMahal(this.alpha_arr[10]);
            //12. Jika fasilitas LENGKAP dan ukuran SEMPIT dan jarak JAUH maka harga MURAH
            this.alpha_arr[11] = this.CariMin(this.FasilitasLengkap(), this.UkuranSempit(), this.JarakJauh());
            this.z_arr[11] = this.HargaMurah(this.alpha_arr[11]);
            //13. Jika fasilitas LENGKAP dan ukuran SEDANG dan jarak DEKAT maka harga MAHAL
            this.alpha_arr[12] = this.CariMin(this.FasilitasLengkap(), this.UkuranSedang(), this.JarakDekat());
            this.z_arr[12] = this.HargaMahal(this.alpha_arr[12]);
            //14. Jika fasilitas LENGKAP dan ukuran SEDANG dan jarak SEDANG maka harga MAHAL
            this.alpha_arr[13] = this.CariMin(this.FasilitasLengkap(), this.UkuranSedang(), this.JarakSedang());
            this.z_arr[13] = this.HargaMahal(this.alpha_arr[13]);
            //15. Jika fasilitas LENGKAP dan ukuran SEDANG dan jarak JAUH maka harga MURAH
            this.alpha_arr[14] = this.CariMin(this.FasilitasLengkap(), this.UkuranSedang(), this.JarakJauh());
            this.z_arr[14] = this.HargaMurah(this.alpha_arr[14]);
            //16. Jika fasilitas LENGKAP dan ukuran LUAS dan jarak DEKAT maka harga MAHAL
            this.alpha_arr[15] = this.CariMin(this.FasilitasLengkap(), this.UkuranLuas(), this.JarakDekat());
            this.z_arr[15] = this.HargaMahal(this.alpha_arr[15]);
            //17. Jika fasilitas LENGKAP dan ukuran LUAS dan jarak SEDANG maka harga MAHAL
            this.alpha_arr[16] = this.CariMin(this.FasilitasLengkap(), this.UkuranLuas(), this.JarakSedang());
            this.z_arr[16] = this.HargaMahal(this.alpha_arr[16]);
            //18. Jika fasilitas LENGKAP dan ukuran LUAS dan jarak JAUH maka harga MURAH
            this.alpha_arr[17] = this.CariMin(this.FasilitasLengkap(), this.UkuranLuas(), this.JarakJauh());
            this.z_arr[17] = this.HargaMurah(this.alpha_arr[17]);
        }
        /**
         *  mencari nilai total z(defuzzyfikasi)
         *  @return nilai total z
         */
        Defuzzyfikasi() {
            let temp1 = 0;
            let temp2 = 0;
            let hasil = 0;
            for (let i = 0; i < 18; i++) {
                temp1 = temp1 + this.alpha_arr[i] * this.z_arr[i];
                temp2 = temp2 + this.alpha_arr[i];
            }
            hasil = temp1 / temp2;
            return Math.round(hasil);
        }
        /**
         * Menghitung harga sewa kos
         * @return prediksi harga
         */
        Prediksi() {
            this.Inferensi();
            return this.Defuzzyfikasi();
        }
    }
    app;

    /* src\routes\Home.svelte generated by Svelte v3.29.4 */
    const file$1 = "src\\routes\\Home.svelte";

    function create_fragment$1(ctx) {
    	let br0;
    	let br1;
    	let br2;
    	let t0;
    	let div0;
    	let img;
    	let img_src_value;
    	let t1;
    	let div1;
    	let p;
    	let t3;
    	let div10;
    	let div4;
    	let div2;
    	let label0;
    	let t5;
    	let div3;
    	let input0;
    	let t6;
    	let div7;
    	let div5;
    	let label1;
    	let t8;
    	let div6;
    	let input1;
    	let t9;
    	let div9;
    	let div8;
    	let label2;
    	let t11;
    	let table;
    	let tr0;
    	let td0;
    	let label3;
    	let input2;
    	let t12;
    	let t13;
    	let td1;
    	let label4;
    	let input3;
    	let t14;
    	let t15;
    	let tr1;
    	let td2;
    	let label5;
    	let input4;
    	let t16;
    	let t17;
    	let td3;
    	let label6;
    	let input5;
    	let t18;
    	let t19;
    	let tr2;
    	let td4;
    	let label7;
    	let input6;
    	let t20;
    	let t21;
    	let td5;
    	let label8;
    	let input7;
    	let t22;
    	let t23;
    	let tr3;
    	let td6;
    	let label9;
    	let input8;
    	let t24;
    	let t25;
    	let td7;
    	let label10;
    	let input9;
    	let t26;
    	let t27;
    	let tr4;
    	let td8;
    	let label11;
    	let input10;
    	let t28;
    	let t29;
    	let td9;
    	let label12;
    	let input11;
    	let t30;
    	let t31;
    	let div11;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			br0 = element("br");
    			br1 = element("br");
    			br2 = element("br");
    			t0 = space();
    			div0 = element("div");
    			img = element("img");
    			t1 = space();
    			div1 = element("div");
    			p = element("p");
    			p.textContent = "Kami di sini siap membantu";
    			t3 = space();
    			div10 = element("div");
    			div4 = element("div");
    			div2 = element("div");
    			label0 = element("label");
    			label0.textContent = "JARAK TEMPAT KOS";
    			t5 = space();
    			div3 = element("div");
    			input0 = element("input");
    			t6 = space();
    			div7 = element("div");
    			div5 = element("div");
    			label1 = element("label");
    			label1.textContent = "LUAS KAMAR KOS";
    			t8 = space();
    			div6 = element("div");
    			input1 = element("input");
    			t9 = space();
    			div9 = element("div");
    			div8 = element("div");
    			label2 = element("label");
    			label2.textContent = "FASILITAS";
    			t11 = space();
    			table = element("table");
    			tr0 = element("tr");
    			td0 = element("td");
    			label3 = element("label");
    			input2 = element("input");
    			t12 = text(" Tempat tidur");
    			t13 = space();
    			td1 = element("td");
    			label4 = element("label");
    			input3 = element("input");
    			t14 = text(" Dapur");
    			t15 = space();
    			tr1 = element("tr");
    			td2 = element("td");
    			label5 = element("label");
    			input4 = element("input");
    			t16 = text(" Meja");
    			t17 = space();
    			td3 = element("td");
    			label6 = element("label");
    			input5 = element("input");
    			t18 = text(" Wi-Fi");
    			t19 = space();
    			tr2 = element("tr");
    			td4 = element("td");
    			label7 = element("label");
    			input6 = element("input");
    			t20 = text(" Almari");
    			t21 = space();
    			td5 = element("td");
    			label8 = element("label");
    			input7 = element("input");
    			t22 = text(" AC");
    			t23 = space();
    			tr3 = element("tr");
    			td6 = element("td");
    			label9 = element("label");
    			input8 = element("input");
    			t24 = text(" Kursi & meja belajar");
    			t25 = space();
    			td7 = element("td");
    			label10 = element("label");
    			input9 = element("input");
    			t26 = text(" TV");
    			t27 = space();
    			tr4 = element("tr");
    			td8 = element("td");
    			label11 = element("label");
    			input10 = element("input");
    			t28 = text(" Kamar mandi dalam");
    			t29 = space();
    			td9 = element("td");
    			label12 = element("label");
    			input11 = element("input");
    			t30 = text(" Laundry");
    			t31 = space();
    			div11 = element("div");
    			button = element("button");
    			button.textContent = "CHECK";
    			add_location(br0, file$1, 34, 0, 856);
    			add_location(br1, file$1, 34, 4, 860);
    			add_location(br2, file$1, 34, 8, 864);
    			if (img.src !== (img_src_value = "assets/logo.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "cekkosmu");
    			attr_dev(img, "id", "logo");
    			add_location(img, file$1, 36, 4, 899);
    			attr_dev(div0, "class", "text-center");
    			add_location(div0, file$1, 35, 0, 869);
    			attr_dev(p, "id", "moto");
    			add_location(p, file$1, 41, 4, 1029);
    			attr_dev(div1, "class", "text-center pt-3");
    			add_location(div1, file$1, 40, 0, 994);
    			attr_dev(label0, "for", "");
    			add_location(label0, file$1, 48, 12, 1199);
    			attr_dev(div2, "class", "");
    			add_location(div2, file$1, 47, 8, 1172);
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "id", "txtjarak");
    			add_location(input0, file$1, 51, 12, 1303);
    			attr_dev(div3, "class", "ml-auto mr-auto");
    			add_location(div3, file$1, 50, 8, 1261);
    			attr_dev(div4, "class", "col-4 input");
    			add_location(div4, file$1, 46, 4, 1138);
    			attr_dev(label1, "for", "");
    			add_location(label1, file$1, 56, 12, 1449);
    			attr_dev(div5, "class", "");
    			add_location(div5, file$1, 55, 8, 1422);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "id", "txtluas");
    			add_location(input1, file$1, 59, 12, 1536);
    			attr_dev(div6, "class", "");
    			add_location(div6, file$1, 58, 8, 1509);
    			attr_dev(div7, "class", "col-4 input");
    			add_location(div7, file$1, 54, 4, 1388);
    			attr_dev(label2, "for", "");
    			add_location(label2, file$1, 64, 12, 1682);
    			attr_dev(div8, "class", "");
    			add_location(div8, file$1, 63, 8, 1655);
    			attr_dev(input2, "type", "checkbox");
    			attr_dev(input2, "id", "fas0");
    			input2.__value = "10";
    			input2.value = input2.__value;
    			/*$$binding_groups*/ ctx[7][0].push(input2);
    			add_location(input2, file$1, 68, 27, 1814);
    			add_location(label3, file$1, 68, 20, 1807);
    			add_location(td0, file$1, 68, 16, 1803);
    			attr_dev(input3, "type", "checkbox");
    			attr_dev(input3, "id", "fas5");
    			input3.__value = "11";
    			input3.value = input3.__value;
    			/*$$binding_groups*/ ctx[7][0].push(input3);
    			add_location(input3, file$1, 69, 27, 1929);
    			add_location(label4, file$1, 69, 20, 1922);
    			add_location(td1, file$1, 69, 16, 1918);
    			add_location(tr0, file$1, 67, 12, 1782);
    			attr_dev(input4, "type", "checkbox");
    			attr_dev(input4, "id", "fas1");
    			input4.__value = "6";
    			input4.value = input4.__value;
    			/*$$binding_groups*/ ctx[7][0].push(input4);
    			add_location(input4, file$1, 72, 27, 2072);
    			add_location(label5, file$1, 72, 20, 2065);
    			add_location(td2, file$1, 72, 16, 2061);
    			attr_dev(input5, "type", "checkbox");
    			attr_dev(input5, "id", "fas6");
    			input5.__value = "14";
    			input5.value = input5.__value;
    			/*$$binding_groups*/ ctx[7][0].push(input5);
    			add_location(input5, file$1, 73, 27, 2178);
    			add_location(label6, file$1, 73, 20, 2171);
    			add_location(td3, file$1, 73, 16, 2167);
    			add_location(tr1, file$1, 71, 12, 2040);
    			attr_dev(input6, "type", "checkbox");
    			attr_dev(input6, "id", "fas2");
    			input6.__value = "7";
    			input6.value = input6.__value;
    			/*$$binding_groups*/ ctx[7][0].push(input6);
    			add_location(input6, file$1, 76, 27, 2321);
    			add_location(label7, file$1, 76, 20, 2314);
    			add_location(td4, file$1, 76, 16, 2310);
    			attr_dev(input7, "type", "checkbox");
    			attr_dev(input7, "id", "fas7");
    			input7.__value = "15";
    			input7.value = input7.__value;
    			/*$$binding_groups*/ ctx[7][0].push(input7);
    			add_location(input7, file$1, 77, 27, 2429);
    			add_location(label8, file$1, 77, 20, 2422);
    			add_location(td5, file$1, 77, 16, 2418);
    			add_location(tr2, file$1, 75, 12, 2289);
    			attr_dev(input8, "type", "checkbox");
    			attr_dev(input8, "id", "fas3");
    			input8.__value = "8";
    			input8.value = input8.__value;
    			/*$$binding_groups*/ ctx[7][0].push(input8);
    			add_location(input8, file$1, 80, 27, 2569);
    			add_location(label9, file$1, 80, 20, 2562);
    			add_location(td6, file$1, 80, 16, 2558);
    			attr_dev(input9, "type", "checkbox");
    			attr_dev(input9, "id", "fas8");
    			input9.__value = "13";
    			input9.value = input9.__value;
    			/*$$binding_groups*/ ctx[7][0].push(input9);
    			add_location(input9, file$1, 81, 27, 2692);
    			add_location(label10, file$1, 81, 20, 2685);
    			add_location(td7, file$1, 81, 16, 2681);
    			add_location(tr3, file$1, 79, 12, 2537);
    			attr_dev(input10, "type", "checkbox");
    			attr_dev(input10, "id", "fas4");
    			input10.__value = "9";
    			input10.value = input10.__value;
    			/*$$binding_groups*/ ctx[7][0].push(input10);
    			add_location(input10, file$1, 84, 27, 2832);
    			add_location(label11, file$1, 84, 20, 2825);
    			add_location(td8, file$1, 84, 16, 2821);
    			attr_dev(input11, "type", "checkbox");
    			attr_dev(input11, "id", "fas9");
    			input11.__value = "12";
    			input11.value = input11.__value;
    			/*$$binding_groups*/ ctx[7][0].push(input11);
    			add_location(input11, file$1, 85, 27, 2952);
    			add_location(label12, file$1, 85, 20, 2945);
    			add_location(td9, file$1, 85, 16, 2941);
    			add_location(tr4, file$1, 83, 12, 2800);
    			attr_dev(table, "id", "fasilitas-container");
    			add_location(table, file$1, 66, 8, 1737);
    			attr_dev(div9, "class", "col-4 input");
    			add_location(div9, file$1, 62, 4, 1621);
    			attr_dev(div10, "class", "row");
    			add_location(div10, file$1, 45, 0, 1116);
    			attr_dev(button, "class", "btn btn-success");
    			add_location(button, file$1, 93, 4, 3155);
    			attr_dev(div11, "class", "text-center");
    			add_location(div11, file$1, 92, 0, 3125);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, br0, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, br2, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div0, anchor);
    			append_dev(div0, img);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, p);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div10, anchor);
    			append_dev(div10, div4);
    			append_dev(div4, div2);
    			append_dev(div2, label0);
    			append_dev(div4, t5);
    			append_dev(div4, div3);
    			append_dev(div3, input0);
    			set_input_value(input0, /*jarak*/ ctx[0]);
    			append_dev(div10, t6);
    			append_dev(div10, div7);
    			append_dev(div7, div5);
    			append_dev(div5, label1);
    			append_dev(div7, t8);
    			append_dev(div7, div6);
    			append_dev(div6, input1);
    			set_input_value(input1, /*ukuran*/ ctx[1]);
    			append_dev(div10, t9);
    			append_dev(div10, div9);
    			append_dev(div9, div8);
    			append_dev(div8, label2);
    			append_dev(div9, t11);
    			append_dev(div9, table);
    			append_dev(table, tr0);
    			append_dev(tr0, td0);
    			append_dev(td0, label3);
    			append_dev(label3, input2);
    			input2.checked = ~/*fas*/ ctx[2].indexOf(input2.__value);
    			append_dev(label3, t12);
    			append_dev(tr0, t13);
    			append_dev(tr0, td1);
    			append_dev(td1, label4);
    			append_dev(label4, input3);
    			input3.checked = ~/*fas*/ ctx[2].indexOf(input3.__value);
    			append_dev(label4, t14);
    			append_dev(table, t15);
    			append_dev(table, tr1);
    			append_dev(tr1, td2);
    			append_dev(td2, label5);
    			append_dev(label5, input4);
    			input4.checked = ~/*fas*/ ctx[2].indexOf(input4.__value);
    			append_dev(label5, t16);
    			append_dev(tr1, t17);
    			append_dev(tr1, td3);
    			append_dev(td3, label6);
    			append_dev(label6, input5);
    			input5.checked = ~/*fas*/ ctx[2].indexOf(input5.__value);
    			append_dev(label6, t18);
    			append_dev(table, t19);
    			append_dev(table, tr2);
    			append_dev(tr2, td4);
    			append_dev(td4, label7);
    			append_dev(label7, input6);
    			input6.checked = ~/*fas*/ ctx[2].indexOf(input6.__value);
    			append_dev(label7, t20);
    			append_dev(tr2, t21);
    			append_dev(tr2, td5);
    			append_dev(td5, label8);
    			append_dev(label8, input7);
    			input7.checked = ~/*fas*/ ctx[2].indexOf(input7.__value);
    			append_dev(label8, t22);
    			append_dev(table, t23);
    			append_dev(table, tr3);
    			append_dev(tr3, td6);
    			append_dev(td6, label9);
    			append_dev(label9, input8);
    			input8.checked = ~/*fas*/ ctx[2].indexOf(input8.__value);
    			append_dev(label9, t24);
    			append_dev(tr3, t25);
    			append_dev(tr3, td7);
    			append_dev(td7, label10);
    			append_dev(label10, input9);
    			input9.checked = ~/*fas*/ ctx[2].indexOf(input9.__value);
    			append_dev(label10, t26);
    			append_dev(table, t27);
    			append_dev(table, tr4);
    			append_dev(tr4, td8);
    			append_dev(td8, label11);
    			append_dev(label11, input10);
    			input10.checked = ~/*fas*/ ctx[2].indexOf(input10.__value);
    			append_dev(label11, t28);
    			append_dev(tr4, t29);
    			append_dev(tr4, td9);
    			append_dev(td9, label12);
    			append_dev(label12, input11);
    			input11.checked = ~/*fas*/ ctx[2].indexOf(input11.__value);
    			append_dev(label12, t30);
    			insert_dev(target, t31, anchor);
    			insert_dev(target, div11, anchor);
    			append_dev(div11, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[4]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[5]),
    					listen_dev(input2, "change", /*input2_change_handler*/ ctx[6]),
    					listen_dev(input3, "change", /*input3_change_handler*/ ctx[8]),
    					listen_dev(input4, "change", /*input4_change_handler*/ ctx[9]),
    					listen_dev(input5, "change", /*input5_change_handler*/ ctx[10]),
    					listen_dev(input6, "change", /*input6_change_handler*/ ctx[11]),
    					listen_dev(input7, "change", /*input7_change_handler*/ ctx[12]),
    					listen_dev(input8, "change", /*input8_change_handler*/ ctx[13]),
    					listen_dev(input9, "change", /*input9_change_handler*/ ctx[14]),
    					listen_dev(input10, "change", /*input10_change_handler*/ ctx[15]),
    					listen_dev(input11, "change", /*input11_change_handler*/ ctx[16]),
    					listen_dev(button, "click", /*check*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*jarak*/ 1 && to_number(input0.value) !== /*jarak*/ ctx[0]) {
    				set_input_value(input0, /*jarak*/ ctx[0]);
    			}

    			if (dirty & /*ukuran*/ 2 && to_number(input1.value) !== /*ukuran*/ ctx[1]) {
    				set_input_value(input1, /*ukuran*/ ctx[1]);
    			}

    			if (dirty & /*fas*/ 4) {
    				input2.checked = ~/*fas*/ ctx[2].indexOf(input2.__value);
    			}

    			if (dirty & /*fas*/ 4) {
    				input3.checked = ~/*fas*/ ctx[2].indexOf(input3.__value);
    			}

    			if (dirty & /*fas*/ 4) {
    				input4.checked = ~/*fas*/ ctx[2].indexOf(input4.__value);
    			}

    			if (dirty & /*fas*/ 4) {
    				input5.checked = ~/*fas*/ ctx[2].indexOf(input5.__value);
    			}

    			if (dirty & /*fas*/ 4) {
    				input6.checked = ~/*fas*/ ctx[2].indexOf(input6.__value);
    			}

    			if (dirty & /*fas*/ 4) {
    				input7.checked = ~/*fas*/ ctx[2].indexOf(input7.__value);
    			}

    			if (dirty & /*fas*/ 4) {
    				input8.checked = ~/*fas*/ ctx[2].indexOf(input8.__value);
    			}

    			if (dirty & /*fas*/ 4) {
    				input9.checked = ~/*fas*/ ctx[2].indexOf(input9.__value);
    			}

    			if (dirty & /*fas*/ 4) {
    				input10.checked = ~/*fas*/ ctx[2].indexOf(input10.__value);
    			}

    			if (dirty & /*fas*/ 4) {
    				input11.checked = ~/*fas*/ ctx[2].indexOf(input11.__value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(br2);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div10);
    			/*$$binding_groups*/ ctx[7][0].splice(/*$$binding_groups*/ ctx[7][0].indexOf(input2), 1);
    			/*$$binding_groups*/ ctx[7][0].splice(/*$$binding_groups*/ ctx[7][0].indexOf(input3), 1);
    			/*$$binding_groups*/ ctx[7][0].splice(/*$$binding_groups*/ ctx[7][0].indexOf(input4), 1);
    			/*$$binding_groups*/ ctx[7][0].splice(/*$$binding_groups*/ ctx[7][0].indexOf(input5), 1);
    			/*$$binding_groups*/ ctx[7][0].splice(/*$$binding_groups*/ ctx[7][0].indexOf(input6), 1);
    			/*$$binding_groups*/ ctx[7][0].splice(/*$$binding_groups*/ ctx[7][0].indexOf(input7), 1);
    			/*$$binding_groups*/ ctx[7][0].splice(/*$$binding_groups*/ ctx[7][0].indexOf(input8), 1);
    			/*$$binding_groups*/ ctx[7][0].splice(/*$$binding_groups*/ ctx[7][0].indexOf(input9), 1);
    			/*$$binding_groups*/ ctx[7][0].splice(/*$$binding_groups*/ ctx[7][0].indexOf(input10), 1);
    			/*$$binding_groups*/ ctx[7][0].splice(/*$$binding_groups*/ ctx[7][0].indexOf(input11), 1);
    			if (detaching) detach_dev(t31);
    			if (detaching) detach_dev(div11);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Home", slots, []);

    	class Fuzzy extends Tsukamoto {
    		constructor(j, u, f) {
    			super(j, u, f);
    		}
    	}

    	// inisialisasi variabel
    	let jarak = 0;

    	let ukuran = 0;
    	let fas = [];
    	let sigma_fas = 0;
    	let harga = 0;

    	function check() {
    		// hitung fasilitas
    		sigma_fas = 0;

    		if (fas.length > 0 && jarak > 0 && ukuran > 0) {
    			for (let i = 0; i < fas.length; i++) {
    				sigma_fas = sigma_fas + parseInt(fas[i]);
    			}

    			// instansiasi
    			let fuzzy = new Fuzzy(jarak, ukuran, sigma_fas);

    			// hitung harga
    			harga = fuzzy.Prediksi();

    			// output
    			alert(`Prediksi harga sewa kos:\nRp ${harga}.000,00`);
    		} else {
    			alert("Mohon lengkapi data!!");
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];

    	function input0_input_handler() {
    		jarak = to_number(this.value);
    		$$invalidate(0, jarak);
    	}

    	function input1_input_handler() {
    		ukuran = to_number(this.value);
    		$$invalidate(1, ukuran);
    	}

    	function input2_change_handler() {
    		fas = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		$$invalidate(2, fas);
    	}

    	function input3_change_handler() {
    		fas = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		$$invalidate(2, fas);
    	}

    	function input4_change_handler() {
    		fas = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		$$invalidate(2, fas);
    	}

    	function input5_change_handler() {
    		fas = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		$$invalidate(2, fas);
    	}

    	function input6_change_handler() {
    		fas = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		$$invalidate(2, fas);
    	}

    	function input7_change_handler() {
    		fas = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		$$invalidate(2, fas);
    	}

    	function input8_change_handler() {
    		fas = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		$$invalidate(2, fas);
    	}

    	function input9_change_handler() {
    		fas = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		$$invalidate(2, fas);
    	}

    	function input10_change_handler() {
    		fas = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		$$invalidate(2, fas);
    	}

    	function input11_change_handler() {
    		fas = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		$$invalidate(2, fas);
    	}

    	$$self.$capture_state = () => ({
    		Tsukamoto,
    		Fuzzy,
    		jarak,
    		ukuran,
    		fas,
    		sigma_fas,
    		harga,
    		check
    	});

    	$$self.$inject_state = $$props => {
    		if ("jarak" in $$props) $$invalidate(0, jarak = $$props.jarak);
    		if ("ukuran" in $$props) $$invalidate(1, ukuran = $$props.ukuran);
    		if ("fas" in $$props) $$invalidate(2, fas = $$props.fas);
    		if ("sigma_fas" in $$props) sigma_fas = $$props.sigma_fas;
    		if ("harga" in $$props) harga = $$props.harga;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		jarak,
    		ukuran,
    		fas,
    		check,
    		input0_input_handler,
    		input1_input_handler,
    		input2_change_handler,
    		$$binding_groups,
    		input3_change_handler,
    		input4_change_handler,
    		input5_change_handler,
    		input6_change_handler,
    		input7_change_handler,
    		input8_change_handler,
    		input9_change_handler,
    		input10_change_handler,
    		input11_change_handler
    	];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\routes\About.svelte generated by Svelte v3.29.4 */

    const file$2 = "src\\routes\\About.svelte";

    function create_fragment$2(ctx) {
    	let div0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let div1;
    	let p;
    	let t2;
    	let ul;
    	let li0;
    	let t4;
    	let li1;
    	let t6;
    	let li2;
    	let t8;
    	let img1;
    	let img1_src_value;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			img0 = element("img");
    			t0 = space();
    			div1 = element("div");
    			p = element("p");
    			p.textContent = "Aplikasi ini menggunakan metode Fuzzy Tsukamoto dengan beberapa faktor yang memperngaruhi\n        prediksi harga sewa kos. Adapun faktor yang mempengaruhi yaitu jarak kos dengan kampus, ukuran luas kamar kos, \n        dan prosentase kelengkapan fasilitas kos.";
    			t2 = space();
    			ul = element("ul");
    			li0 = element("li");
    			li0.textContent = "Dekat (0-1km), sedang (3-5km), dan jauh (lebih dari 7km)";
    			t4 = space();
    			li1 = element("li");
    			li1.textContent = "Sempit (0-4m²), sedang (8-15m²), dan luas (lebih dari 15m²)";
    			t6 = space();
    			li2 = element("li");
    			li2.textContent = "Fasilitas biasa (0-20%) dan lengkap (lebih dari 70%)";
    			t8 = space();
    			img1 = element("img");
    			if (img0.src !== (img0_src_value = "assets/logo.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Logo");
    			attr_dev(img0, "id", "logo");
    			add_location(img0, file$2, 1, 4, 30);
    			attr_dev(div0, "class", "text-center");
    			add_location(div0, file$2, 0, 0, 0);
    			add_location(p, file$2, 4, 4, 113);
    			add_location(li0, file$2, 9, 8, 403);
    			add_location(li1, file$2, 10, 8, 477);
    			add_location(li2, file$2, 11, 8, 566);
    			add_location(ul, file$2, 8, 4, 390);
    			if (img1.src !== (img1_src_value = "assets/1.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "about");
    			attr_dev(img1, "id", "aboutlogo");
    			add_location(img1, file$2, 13, 4, 642);
    			attr_dev(div1, "class", "aboutbox");
    			add_location(div1, file$2, 3, 0, 86);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, img0);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, p);
    			append_dev(div1, t2);
    			append_dev(div1, ul);
    			append_dev(ul, li0);
    			append_dev(ul, t4);
    			append_dev(ul, li1);
    			append_dev(ul, t6);
    			append_dev(ul, li2);
    			append_dev(div1, t8);
    			append_dev(div1, img1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("About", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\routes\Contact.svelte generated by Svelte v3.29.4 */

    function create_fragment$3(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Contact", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Contact> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Contact extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Contact",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    var bind = function bind(fn, thisArg) {
      return function wrap() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        return fn.apply(thisArg, args);
      };
    };

    /*global toString:true*/

    // utils is a library of generic helper functions non-specific to axios

    var toString = Object.prototype.toString;

    /**
     * Determine if a value is an Array
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an Array, otherwise false
     */
    function isArray(val) {
      return toString.call(val) === '[object Array]';
    }

    /**
     * Determine if a value is undefined
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if the value is undefined, otherwise false
     */
    function isUndefined(val) {
      return typeof val === 'undefined';
    }

    /**
     * Determine if a value is a Buffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Buffer, otherwise false
     */
    function isBuffer(val) {
      return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
        && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
    }

    /**
     * Determine if a value is an ArrayBuffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an ArrayBuffer, otherwise false
     */
    function isArrayBuffer(val) {
      return toString.call(val) === '[object ArrayBuffer]';
    }

    /**
     * Determine if a value is a FormData
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an FormData, otherwise false
     */
    function isFormData(val) {
      return (typeof FormData !== 'undefined') && (val instanceof FormData);
    }

    /**
     * Determine if a value is a view on an ArrayBuffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
     */
    function isArrayBufferView(val) {
      var result;
      if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
        result = ArrayBuffer.isView(val);
      } else {
        result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
      }
      return result;
    }

    /**
     * Determine if a value is a String
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a String, otherwise false
     */
    function isString(val) {
      return typeof val === 'string';
    }

    /**
     * Determine if a value is a Number
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Number, otherwise false
     */
    function isNumber(val) {
      return typeof val === 'number';
    }

    /**
     * Determine if a value is an Object
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an Object, otherwise false
     */
    function isObject(val) {
      return val !== null && typeof val === 'object';
    }

    /**
     * Determine if a value is a plain Object
     *
     * @param {Object} val The value to test
     * @return {boolean} True if value is a plain Object, otherwise false
     */
    function isPlainObject(val) {
      if (toString.call(val) !== '[object Object]') {
        return false;
      }

      var prototype = Object.getPrototypeOf(val);
      return prototype === null || prototype === Object.prototype;
    }

    /**
     * Determine if a value is a Date
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Date, otherwise false
     */
    function isDate(val) {
      return toString.call(val) === '[object Date]';
    }

    /**
     * Determine if a value is a File
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a File, otherwise false
     */
    function isFile(val) {
      return toString.call(val) === '[object File]';
    }

    /**
     * Determine if a value is a Blob
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Blob, otherwise false
     */
    function isBlob(val) {
      return toString.call(val) === '[object Blob]';
    }

    /**
     * Determine if a value is a Function
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Function, otherwise false
     */
    function isFunction(val) {
      return toString.call(val) === '[object Function]';
    }

    /**
     * Determine if a value is a Stream
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Stream, otherwise false
     */
    function isStream(val) {
      return isObject(val) && isFunction(val.pipe);
    }

    /**
     * Determine if a value is a URLSearchParams object
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a URLSearchParams object, otherwise false
     */
    function isURLSearchParams(val) {
      return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
    }

    /**
     * Trim excess whitespace off the beginning and end of a string
     *
     * @param {String} str The String to trim
     * @returns {String} The String freed of excess whitespace
     */
    function trim(str) {
      return str.replace(/^\s*/, '').replace(/\s*$/, '');
    }

    /**
     * Determine if we're running in a standard browser environment
     *
     * This allows axios to run in a web worker, and react-native.
     * Both environments support XMLHttpRequest, but not fully standard globals.
     *
     * web workers:
     *  typeof window -> undefined
     *  typeof document -> undefined
     *
     * react-native:
     *  navigator.product -> 'ReactNative'
     * nativescript
     *  navigator.product -> 'NativeScript' or 'NS'
     */
    function isStandardBrowserEnv() {
      if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                               navigator.product === 'NativeScript' ||
                                               navigator.product === 'NS')) {
        return false;
      }
      return (
        typeof window !== 'undefined' &&
        typeof document !== 'undefined'
      );
    }

    /**
     * Iterate over an Array or an Object invoking a function for each item.
     *
     * If `obj` is an Array callback will be called passing
     * the value, index, and complete array for each item.
     *
     * If 'obj' is an Object callback will be called passing
     * the value, key, and complete object for each property.
     *
     * @param {Object|Array} obj The object to iterate
     * @param {Function} fn The callback to invoke for each item
     */
    function forEach(obj, fn) {
      // Don't bother if no value provided
      if (obj === null || typeof obj === 'undefined') {
        return;
      }

      // Force an array if not already something iterable
      if (typeof obj !== 'object') {
        /*eslint no-param-reassign:0*/
        obj = [obj];
      }

      if (isArray(obj)) {
        // Iterate over array values
        for (var i = 0, l = obj.length; i < l; i++) {
          fn.call(null, obj[i], i, obj);
        }
      } else {
        // Iterate over object keys
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            fn.call(null, obj[key], key, obj);
          }
        }
      }
    }

    /**
     * Accepts varargs expecting each argument to be an object, then
     * immutably merges the properties of each object and returns result.
     *
     * When multiple objects contain the same key the later object in
     * the arguments list will take precedence.
     *
     * Example:
     *
     * ```js
     * var result = merge({foo: 123}, {foo: 456});
     * console.log(result.foo); // outputs 456
     * ```
     *
     * @param {Object} obj1 Object to merge
     * @returns {Object} Result of all merge properties
     */
    function merge(/* obj1, obj2, obj3, ... */) {
      var result = {};
      function assignValue(val, key) {
        if (isPlainObject(result[key]) && isPlainObject(val)) {
          result[key] = merge(result[key], val);
        } else if (isPlainObject(val)) {
          result[key] = merge({}, val);
        } else if (isArray(val)) {
          result[key] = val.slice();
        } else {
          result[key] = val;
        }
      }

      for (var i = 0, l = arguments.length; i < l; i++) {
        forEach(arguments[i], assignValue);
      }
      return result;
    }

    /**
     * Extends object a by mutably adding to it the properties of object b.
     *
     * @param {Object} a The object to be extended
     * @param {Object} b The object to copy properties from
     * @param {Object} thisArg The object to bind function to
     * @return {Object} The resulting value of object a
     */
    function extend(a, b, thisArg) {
      forEach(b, function assignValue(val, key) {
        if (thisArg && typeof val === 'function') {
          a[key] = bind(val, thisArg);
        } else {
          a[key] = val;
        }
      });
      return a;
    }

    /**
     * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
     *
     * @param {string} content with BOM
     * @return {string} content value without BOM
     */
    function stripBOM(content) {
      if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
      }
      return content;
    }

    var utils = {
      isArray: isArray,
      isArrayBuffer: isArrayBuffer,
      isBuffer: isBuffer,
      isFormData: isFormData,
      isArrayBufferView: isArrayBufferView,
      isString: isString,
      isNumber: isNumber,
      isObject: isObject,
      isPlainObject: isPlainObject,
      isUndefined: isUndefined,
      isDate: isDate,
      isFile: isFile,
      isBlob: isBlob,
      isFunction: isFunction,
      isStream: isStream,
      isURLSearchParams: isURLSearchParams,
      isStandardBrowserEnv: isStandardBrowserEnv,
      forEach: forEach,
      merge: merge,
      extend: extend,
      trim: trim,
      stripBOM: stripBOM
    };

    function encode(val) {
      return encodeURIComponent(val).
        replace(/%3A/gi, ':').
        replace(/%24/g, '$').
        replace(/%2C/gi, ',').
        replace(/%20/g, '+').
        replace(/%5B/gi, '[').
        replace(/%5D/gi, ']');
    }

    /**
     * Build a URL by appending params to the end
     *
     * @param {string} url The base of the url (e.g., http://www.google.com)
     * @param {object} [params] The params to be appended
     * @returns {string} The formatted url
     */
    var buildURL = function buildURL(url, params, paramsSerializer) {
      /*eslint no-param-reassign:0*/
      if (!params) {
        return url;
      }

      var serializedParams;
      if (paramsSerializer) {
        serializedParams = paramsSerializer(params);
      } else if (utils.isURLSearchParams(params)) {
        serializedParams = params.toString();
      } else {
        var parts = [];

        utils.forEach(params, function serialize(val, key) {
          if (val === null || typeof val === 'undefined') {
            return;
          }

          if (utils.isArray(val)) {
            key = key + '[]';
          } else {
            val = [val];
          }

          utils.forEach(val, function parseValue(v) {
            if (utils.isDate(v)) {
              v = v.toISOString();
            } else if (utils.isObject(v)) {
              v = JSON.stringify(v);
            }
            parts.push(encode(key) + '=' + encode(v));
          });
        });

        serializedParams = parts.join('&');
      }

      if (serializedParams) {
        var hashmarkIndex = url.indexOf('#');
        if (hashmarkIndex !== -1) {
          url = url.slice(0, hashmarkIndex);
        }

        url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
      }

      return url;
    };

    function InterceptorManager() {
      this.handlers = [];
    }

    /**
     * Add a new interceptor to the stack
     *
     * @param {Function} fulfilled The function to handle `then` for a `Promise`
     * @param {Function} rejected The function to handle `reject` for a `Promise`
     *
     * @return {Number} An ID used to remove interceptor later
     */
    InterceptorManager.prototype.use = function use(fulfilled, rejected) {
      this.handlers.push({
        fulfilled: fulfilled,
        rejected: rejected
      });
      return this.handlers.length - 1;
    };

    /**
     * Remove an interceptor from the stack
     *
     * @param {Number} id The ID that was returned by `use`
     */
    InterceptorManager.prototype.eject = function eject(id) {
      if (this.handlers[id]) {
        this.handlers[id] = null;
      }
    };

    /**
     * Iterate over all the registered interceptors
     *
     * This method is particularly useful for skipping over any
     * interceptors that may have become `null` calling `eject`.
     *
     * @param {Function} fn The function to call for each interceptor
     */
    InterceptorManager.prototype.forEach = function forEach(fn) {
      utils.forEach(this.handlers, function forEachHandler(h) {
        if (h !== null) {
          fn(h);
        }
      });
    };

    var InterceptorManager_1 = InterceptorManager;

    /**
     * Transform the data for a request or a response
     *
     * @param {Object|String} data The data to be transformed
     * @param {Array} headers The headers for the request or response
     * @param {Array|Function} fns A single function or Array of functions
     * @returns {*} The resulting transformed data
     */
    var transformData = function transformData(data, headers, fns) {
      /*eslint no-param-reassign:0*/
      utils.forEach(fns, function transform(fn) {
        data = fn(data, headers);
      });

      return data;
    };

    var isCancel = function isCancel(value) {
      return !!(value && value.__CANCEL__);
    };

    var normalizeHeaderName = function normalizeHeaderName(headers, normalizedName) {
      utils.forEach(headers, function processHeader(value, name) {
        if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
          headers[normalizedName] = value;
          delete headers[name];
        }
      });
    };

    /**
     * Update an Error with the specified config, error code, and response.
     *
     * @param {Error} error The error to update.
     * @param {Object} config The config.
     * @param {string} [code] The error code (for example, 'ECONNABORTED').
     * @param {Object} [request] The request.
     * @param {Object} [response] The response.
     * @returns {Error} The error.
     */
    var enhanceError = function enhanceError(error, config, code, request, response) {
      error.config = config;
      if (code) {
        error.code = code;
      }

      error.request = request;
      error.response = response;
      error.isAxiosError = true;

      error.toJSON = function toJSON() {
        return {
          // Standard
          message: this.message,
          name: this.name,
          // Microsoft
          description: this.description,
          number: this.number,
          // Mozilla
          fileName: this.fileName,
          lineNumber: this.lineNumber,
          columnNumber: this.columnNumber,
          stack: this.stack,
          // Axios
          config: this.config,
          code: this.code
        };
      };
      return error;
    };

    /**
     * Create an Error with the specified message, config, error code, request and response.
     *
     * @param {string} message The error message.
     * @param {Object} config The config.
     * @param {string} [code] The error code (for example, 'ECONNABORTED').
     * @param {Object} [request] The request.
     * @param {Object} [response] The response.
     * @returns {Error} The created error.
     */
    var createError = function createError(message, config, code, request, response) {
      var error = new Error(message);
      return enhanceError(error, config, code, request, response);
    };

    /**
     * Resolve or reject a Promise based on response status.
     *
     * @param {Function} resolve A function that resolves the promise.
     * @param {Function} reject A function that rejects the promise.
     * @param {object} response The response.
     */
    var settle = function settle(resolve, reject, response) {
      var validateStatus = response.config.validateStatus;
      if (!response.status || !validateStatus || validateStatus(response.status)) {
        resolve(response);
      } else {
        reject(createError(
          'Request failed with status code ' + response.status,
          response.config,
          null,
          response.request,
          response
        ));
      }
    };

    var cookies = (
      utils.isStandardBrowserEnv() ?

      // Standard browser envs support document.cookie
        (function standardBrowserEnv() {
          return {
            write: function write(name, value, expires, path, domain, secure) {
              var cookie = [];
              cookie.push(name + '=' + encodeURIComponent(value));

              if (utils.isNumber(expires)) {
                cookie.push('expires=' + new Date(expires).toGMTString());
              }

              if (utils.isString(path)) {
                cookie.push('path=' + path);
              }

              if (utils.isString(domain)) {
                cookie.push('domain=' + domain);
              }

              if (secure === true) {
                cookie.push('secure');
              }

              document.cookie = cookie.join('; ');
            },

            read: function read(name) {
              var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
              return (match ? decodeURIComponent(match[3]) : null);
            },

            remove: function remove(name) {
              this.write(name, '', Date.now() - 86400000);
            }
          };
        })() :

      // Non standard browser env (web workers, react-native) lack needed support.
        (function nonStandardBrowserEnv() {
          return {
            write: function write() {},
            read: function read() { return null; },
            remove: function remove() {}
          };
        })()
    );

    /**
     * Determines whether the specified URL is absolute
     *
     * @param {string} url The URL to test
     * @returns {boolean} True if the specified URL is absolute, otherwise false
     */
    var isAbsoluteURL = function isAbsoluteURL(url) {
      // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
      // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
      // by any combination of letters, digits, plus, period, or hyphen.
      return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
    };

    /**
     * Creates a new URL by combining the specified URLs
     *
     * @param {string} baseURL The base URL
     * @param {string} relativeURL The relative URL
     * @returns {string} The combined URL
     */
    var combineURLs = function combineURLs(baseURL, relativeURL) {
      return relativeURL
        ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
        : baseURL;
    };

    /**
     * Creates a new URL by combining the baseURL with the requestedURL,
     * only when the requestedURL is not already an absolute URL.
     * If the requestURL is absolute, this function returns the requestedURL untouched.
     *
     * @param {string} baseURL The base URL
     * @param {string} requestedURL Absolute or relative URL to combine
     * @returns {string} The combined full path
     */
    var buildFullPath = function buildFullPath(baseURL, requestedURL) {
      if (baseURL && !isAbsoluteURL(requestedURL)) {
        return combineURLs(baseURL, requestedURL);
      }
      return requestedURL;
    };

    // Headers whose duplicates are ignored by node
    // c.f. https://nodejs.org/api/http.html#http_message_headers
    var ignoreDuplicateOf = [
      'age', 'authorization', 'content-length', 'content-type', 'etag',
      'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
      'last-modified', 'location', 'max-forwards', 'proxy-authorization',
      'referer', 'retry-after', 'user-agent'
    ];

    /**
     * Parse headers into an object
     *
     * ```
     * Date: Wed, 27 Aug 2014 08:58:49 GMT
     * Content-Type: application/json
     * Connection: keep-alive
     * Transfer-Encoding: chunked
     * ```
     *
     * @param {String} headers Headers needing to be parsed
     * @returns {Object} Headers parsed into an object
     */
    var parseHeaders = function parseHeaders(headers) {
      var parsed = {};
      var key;
      var val;
      var i;

      if (!headers) { return parsed; }

      utils.forEach(headers.split('\n'), function parser(line) {
        i = line.indexOf(':');
        key = utils.trim(line.substr(0, i)).toLowerCase();
        val = utils.trim(line.substr(i + 1));

        if (key) {
          if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
            return;
          }
          if (key === 'set-cookie') {
            parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
          } else {
            parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
          }
        }
      });

      return parsed;
    };

    var isURLSameOrigin = (
      utils.isStandardBrowserEnv() ?

      // Standard browser envs have full support of the APIs needed to test
      // whether the request URL is of the same origin as current location.
        (function standardBrowserEnv() {
          var msie = /(msie|trident)/i.test(navigator.userAgent);
          var urlParsingNode = document.createElement('a');
          var originURL;

          /**
        * Parse a URL to discover it's components
        *
        * @param {String} url The URL to be parsed
        * @returns {Object}
        */
          function resolveURL(url) {
            var href = url;

            if (msie) {
            // IE needs attribute set twice to normalize properties
              urlParsingNode.setAttribute('href', href);
              href = urlParsingNode.href;
            }

            urlParsingNode.setAttribute('href', href);

            // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
            return {
              href: urlParsingNode.href,
              protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
              host: urlParsingNode.host,
              search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
              hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
              hostname: urlParsingNode.hostname,
              port: urlParsingNode.port,
              pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                urlParsingNode.pathname :
                '/' + urlParsingNode.pathname
            };
          }

          originURL = resolveURL(window.location.href);

          /**
        * Determine if a URL shares the same origin as the current location
        *
        * @param {String} requestURL The URL to test
        * @returns {boolean} True if URL shares the same origin, otherwise false
        */
          return function isURLSameOrigin(requestURL) {
            var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
            return (parsed.protocol === originURL.protocol &&
                parsed.host === originURL.host);
          };
        })() :

      // Non standard browser envs (web workers, react-native) lack needed support.
        (function nonStandardBrowserEnv() {
          return function isURLSameOrigin() {
            return true;
          };
        })()
    );

    var xhr = function xhrAdapter(config) {
      return new Promise(function dispatchXhrRequest(resolve, reject) {
        var requestData = config.data;
        var requestHeaders = config.headers;

        if (utils.isFormData(requestData)) {
          delete requestHeaders['Content-Type']; // Let the browser set it
        }

        var request = new XMLHttpRequest();

        // HTTP basic authentication
        if (config.auth) {
          var username = config.auth.username || '';
          var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
          requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
        }

        var fullPath = buildFullPath(config.baseURL, config.url);
        request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

        // Set the request timeout in MS
        request.timeout = config.timeout;

        // Listen for ready state
        request.onreadystatechange = function handleLoad() {
          if (!request || request.readyState !== 4) {
            return;
          }

          // The request errored out and we didn't get a response, this will be
          // handled by onerror instead
          // With one exception: request that using file: protocol, most browsers
          // will return status as 0 even though it's a successful request
          if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
            return;
          }

          // Prepare the response
          var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
          var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
          var response = {
            data: responseData,
            status: request.status,
            statusText: request.statusText,
            headers: responseHeaders,
            config: config,
            request: request
          };

          settle(resolve, reject, response);

          // Clean up request
          request = null;
        };

        // Handle browser request cancellation (as opposed to a manual cancellation)
        request.onabort = function handleAbort() {
          if (!request) {
            return;
          }

          reject(createError('Request aborted', config, 'ECONNABORTED', request));

          // Clean up request
          request = null;
        };

        // Handle low level network errors
        request.onerror = function handleError() {
          // Real errors are hidden from us by the browser
          // onerror should only fire if it's a network error
          reject(createError('Network Error', config, null, request));

          // Clean up request
          request = null;
        };

        // Handle timeout
        request.ontimeout = function handleTimeout() {
          var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
          if (config.timeoutErrorMessage) {
            timeoutErrorMessage = config.timeoutErrorMessage;
          }
          reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
            request));

          // Clean up request
          request = null;
        };

        // Add xsrf header
        // This is only done if running in a standard browser environment.
        // Specifically not if we're in a web worker, or react-native.
        if (utils.isStandardBrowserEnv()) {
          // Add xsrf header
          var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
            cookies.read(config.xsrfCookieName) :
            undefined;

          if (xsrfValue) {
            requestHeaders[config.xsrfHeaderName] = xsrfValue;
          }
        }

        // Add headers to the request
        if ('setRequestHeader' in request) {
          utils.forEach(requestHeaders, function setRequestHeader(val, key) {
            if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
              // Remove Content-Type if data is undefined
              delete requestHeaders[key];
            } else {
              // Otherwise add header to the request
              request.setRequestHeader(key, val);
            }
          });
        }

        // Add withCredentials to request if needed
        if (!utils.isUndefined(config.withCredentials)) {
          request.withCredentials = !!config.withCredentials;
        }

        // Add responseType to request if needed
        if (config.responseType) {
          try {
            request.responseType = config.responseType;
          } catch (e) {
            // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
            // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
            if (config.responseType !== 'json') {
              throw e;
            }
          }
        }

        // Handle progress if needed
        if (typeof config.onDownloadProgress === 'function') {
          request.addEventListener('progress', config.onDownloadProgress);
        }

        // Not all browsers support upload events
        if (typeof config.onUploadProgress === 'function' && request.upload) {
          request.upload.addEventListener('progress', config.onUploadProgress);
        }

        if (config.cancelToken) {
          // Handle cancellation
          config.cancelToken.promise.then(function onCanceled(cancel) {
            if (!request) {
              return;
            }

            request.abort();
            reject(cancel);
            // Clean up request
            request = null;
          });
        }

        if (!requestData) {
          requestData = null;
        }

        // Send the request
        request.send(requestData);
      });
    };

    var DEFAULT_CONTENT_TYPE = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    function setContentTypeIfUnset(headers, value) {
      if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
        headers['Content-Type'] = value;
      }
    }

    function getDefaultAdapter() {
      var adapter;
      if (typeof XMLHttpRequest !== 'undefined') {
        // For browsers use XHR adapter
        adapter = xhr;
      } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
        // For node use HTTP adapter
        adapter = xhr;
      }
      return adapter;
    }

    var defaults = {
      adapter: getDefaultAdapter(),

      transformRequest: [function transformRequest(data, headers) {
        normalizeHeaderName(headers, 'Accept');
        normalizeHeaderName(headers, 'Content-Type');
        if (utils.isFormData(data) ||
          utils.isArrayBuffer(data) ||
          utils.isBuffer(data) ||
          utils.isStream(data) ||
          utils.isFile(data) ||
          utils.isBlob(data)
        ) {
          return data;
        }
        if (utils.isArrayBufferView(data)) {
          return data.buffer;
        }
        if (utils.isURLSearchParams(data)) {
          setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
          return data.toString();
        }
        if (utils.isObject(data)) {
          setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
          return JSON.stringify(data);
        }
        return data;
      }],

      transformResponse: [function transformResponse(data) {
        /*eslint no-param-reassign:0*/
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch (e) { /* Ignore */ }
        }
        return data;
      }],

      /**
       * A timeout in milliseconds to abort a request. If set to 0 (default) a
       * timeout is not created.
       */
      timeout: 0,

      xsrfCookieName: 'XSRF-TOKEN',
      xsrfHeaderName: 'X-XSRF-TOKEN',

      maxContentLength: -1,
      maxBodyLength: -1,

      validateStatus: function validateStatus(status) {
        return status >= 200 && status < 300;
      }
    };

    defaults.headers = {
      common: {
        'Accept': 'application/json, text/plain, */*'
      }
    };

    utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
      defaults.headers[method] = {};
    });

    utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
      defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
    });

    var defaults_1 = defaults;

    /**
     * Throws a `Cancel` if cancellation has been requested.
     */
    function throwIfCancellationRequested(config) {
      if (config.cancelToken) {
        config.cancelToken.throwIfRequested();
      }
    }

    /**
     * Dispatch a request to the server using the configured adapter.
     *
     * @param {object} config The config that is to be used for the request
     * @returns {Promise} The Promise to be fulfilled
     */
    var dispatchRequest = function dispatchRequest(config) {
      throwIfCancellationRequested(config);

      // Ensure headers exist
      config.headers = config.headers || {};

      // Transform request data
      config.data = transformData(
        config.data,
        config.headers,
        config.transformRequest
      );

      // Flatten headers
      config.headers = utils.merge(
        config.headers.common || {},
        config.headers[config.method] || {},
        config.headers
      );

      utils.forEach(
        ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
        function cleanHeaderConfig(method) {
          delete config.headers[method];
        }
      );

      var adapter = config.adapter || defaults_1.adapter;

      return adapter(config).then(function onAdapterResolution(response) {
        throwIfCancellationRequested(config);

        // Transform response data
        response.data = transformData(
          response.data,
          response.headers,
          config.transformResponse
        );

        return response;
      }, function onAdapterRejection(reason) {
        if (!isCancel(reason)) {
          throwIfCancellationRequested(config);

          // Transform response data
          if (reason && reason.response) {
            reason.response.data = transformData(
              reason.response.data,
              reason.response.headers,
              config.transformResponse
            );
          }
        }

        return Promise.reject(reason);
      });
    };

    /**
     * Config-specific merge-function which creates a new config-object
     * by merging two configuration objects together.
     *
     * @param {Object} config1
     * @param {Object} config2
     * @returns {Object} New object resulting from merging config2 to config1
     */
    var mergeConfig = function mergeConfig(config1, config2) {
      // eslint-disable-next-line no-param-reassign
      config2 = config2 || {};
      var config = {};

      var valueFromConfig2Keys = ['url', 'method', 'data'];
      var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
      var defaultToConfig2Keys = [
        'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
        'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
        'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
        'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
        'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
      ];
      var directMergeKeys = ['validateStatus'];

      function getMergedValue(target, source) {
        if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
          return utils.merge(target, source);
        } else if (utils.isPlainObject(source)) {
          return utils.merge({}, source);
        } else if (utils.isArray(source)) {
          return source.slice();
        }
        return source;
      }

      function mergeDeepProperties(prop) {
        if (!utils.isUndefined(config2[prop])) {
          config[prop] = getMergedValue(config1[prop], config2[prop]);
        } else if (!utils.isUndefined(config1[prop])) {
          config[prop] = getMergedValue(undefined, config1[prop]);
        }
      }

      utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
        if (!utils.isUndefined(config2[prop])) {
          config[prop] = getMergedValue(undefined, config2[prop]);
        }
      });

      utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

      utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
        if (!utils.isUndefined(config2[prop])) {
          config[prop] = getMergedValue(undefined, config2[prop]);
        } else if (!utils.isUndefined(config1[prop])) {
          config[prop] = getMergedValue(undefined, config1[prop]);
        }
      });

      utils.forEach(directMergeKeys, function merge(prop) {
        if (prop in config2) {
          config[prop] = getMergedValue(config1[prop], config2[prop]);
        } else if (prop in config1) {
          config[prop] = getMergedValue(undefined, config1[prop]);
        }
      });

      var axiosKeys = valueFromConfig2Keys
        .concat(mergeDeepPropertiesKeys)
        .concat(defaultToConfig2Keys)
        .concat(directMergeKeys);

      var otherKeys = Object
        .keys(config1)
        .concat(Object.keys(config2))
        .filter(function filterAxiosKeys(key) {
          return axiosKeys.indexOf(key) === -1;
        });

      utils.forEach(otherKeys, mergeDeepProperties);

      return config;
    };

    /**
     * Create a new instance of Axios
     *
     * @param {Object} instanceConfig The default config for the instance
     */
    function Axios(instanceConfig) {
      this.defaults = instanceConfig;
      this.interceptors = {
        request: new InterceptorManager_1(),
        response: new InterceptorManager_1()
      };
    }

    /**
     * Dispatch a request
     *
     * @param {Object} config The config specific for this request (merged with this.defaults)
     */
    Axios.prototype.request = function request(config) {
      /*eslint no-param-reassign:0*/
      // Allow for axios('example/url'[, config]) a la fetch API
      if (typeof config === 'string') {
        config = arguments[1] || {};
        config.url = arguments[0];
      } else {
        config = config || {};
      }

      config = mergeConfig(this.defaults, config);

      // Set config.method
      if (config.method) {
        config.method = config.method.toLowerCase();
      } else if (this.defaults.method) {
        config.method = this.defaults.method.toLowerCase();
      } else {
        config.method = 'get';
      }

      // Hook up interceptors middleware
      var chain = [dispatchRequest, undefined];
      var promise = Promise.resolve(config);

      this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
        chain.unshift(interceptor.fulfilled, interceptor.rejected);
      });

      this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
        chain.push(interceptor.fulfilled, interceptor.rejected);
      });

      while (chain.length) {
        promise = promise.then(chain.shift(), chain.shift());
      }

      return promise;
    };

    Axios.prototype.getUri = function getUri(config) {
      config = mergeConfig(this.defaults, config);
      return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
    };

    // Provide aliases for supported request methods
    utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
      /*eslint func-names:0*/
      Axios.prototype[method] = function(url, config) {
        return this.request(mergeConfig(config || {}, {
          method: method,
          url: url,
          data: (config || {}).data
        }));
      };
    });

    utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
      /*eslint func-names:0*/
      Axios.prototype[method] = function(url, data, config) {
        return this.request(mergeConfig(config || {}, {
          method: method,
          url: url,
          data: data
        }));
      };
    });

    var Axios_1 = Axios;

    /**
     * A `Cancel` is an object that is thrown when an operation is canceled.
     *
     * @class
     * @param {string=} message The message.
     */
    function Cancel(message) {
      this.message = message;
    }

    Cancel.prototype.toString = function toString() {
      return 'Cancel' + (this.message ? ': ' + this.message : '');
    };

    Cancel.prototype.__CANCEL__ = true;

    var Cancel_1 = Cancel;

    /**
     * A `CancelToken` is an object that can be used to request cancellation of an operation.
     *
     * @class
     * @param {Function} executor The executor function.
     */
    function CancelToken(executor) {
      if (typeof executor !== 'function') {
        throw new TypeError('executor must be a function.');
      }

      var resolvePromise;
      this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
      });

      var token = this;
      executor(function cancel(message) {
        if (token.reason) {
          // Cancellation has already been requested
          return;
        }

        token.reason = new Cancel_1(message);
        resolvePromise(token.reason);
      });
    }

    /**
     * Throws a `Cancel` if cancellation has been requested.
     */
    CancelToken.prototype.throwIfRequested = function throwIfRequested() {
      if (this.reason) {
        throw this.reason;
      }
    };

    /**
     * Returns an object that contains a new `CancelToken` and a function that, when called,
     * cancels the `CancelToken`.
     */
    CancelToken.source = function source() {
      var cancel;
      var token = new CancelToken(function executor(c) {
        cancel = c;
      });
      return {
        token: token,
        cancel: cancel
      };
    };

    var CancelToken_1 = CancelToken;

    /**
     * Syntactic sugar for invoking a function and expanding an array for arguments.
     *
     * Common use case would be to use `Function.prototype.apply`.
     *
     *  ```js
     *  function f(x, y, z) {}
     *  var args = [1, 2, 3];
     *  f.apply(null, args);
     *  ```
     *
     * With `spread` this example can be re-written.
     *
     *  ```js
     *  spread(function(x, y, z) {})([1, 2, 3]);
     *  ```
     *
     * @param {Function} callback
     * @returns {Function}
     */
    var spread = function spread(callback) {
      return function wrap(arr) {
        return callback.apply(null, arr);
      };
    };

    /**
     * Create an instance of Axios
     *
     * @param {Object} defaultConfig The default config for the instance
     * @return {Axios} A new instance of Axios
     */
    function createInstance(defaultConfig) {
      var context = new Axios_1(defaultConfig);
      var instance = bind(Axios_1.prototype.request, context);

      // Copy axios.prototype to instance
      utils.extend(instance, Axios_1.prototype, context);

      // Copy context to instance
      utils.extend(instance, context);

      return instance;
    }

    // Create the default instance to be exported
    var axios = createInstance(defaults_1);

    // Expose Axios class to allow class inheritance
    axios.Axios = Axios_1;

    // Factory for creating new instances
    axios.create = function create(instanceConfig) {
      return createInstance(mergeConfig(axios.defaults, instanceConfig));
    };

    // Expose Cancel & CancelToken
    axios.Cancel = Cancel_1;
    axios.CancelToken = CancelToken_1;
    axios.isCancel = isCancel;

    // Expose all/spread
    axios.all = function all(promises) {
      return Promise.all(promises);
    };
    axios.spread = spread;

    var axios_1 = axios;

    // Allow use of default import syntax in TypeScript
    var _default = axios;
    axios_1.default = _default;

    var axios$1 = axios_1;

    /* src\routes\Kosan.svelte generated by Svelte v3.29.4 */
    const file$3 = "src\\routes\\Kosan.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (33:4) {#if kosan}
    function create_if_block(ctx) {
    	let each_1_anchor;
    	let each_value = /*kosan*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*kosan*/ 1) {
    				each_value = /*kosan*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(33:4) {#if kosan}",
    		ctx
    	});

    	return block;
    }

    // (34:8) {#each kosan as hasil}
    function create_each_block(ctx) {
    	let div2;
    	let div0;
    	let t0_value = /*hasil*/ ctx[2].nama_kos + "";
    	let t0;
    	let t1;
    	let div1;
    	let h5;
    	let t3;
    	let p;
    	let t5;
    	let a;
    	let t7;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");
    			h5 = element("h5");
    			h5.textContent = "Special title treatment";
    			t3 = space();
    			p = element("p");
    			p.textContent = "With supporting text below as a natural lead-in to additional content.";
    			t5 = space();
    			a = element("a");
    			a.textContent = "Go somewhere";
    			t7 = space();
    			attr_dev(div0, "class", "card-header");
    			add_location(div0, file$3, 35, 12, 1383);
    			attr_dev(h5, "class", "card-title");
    			add_location(h5, file$3, 39, 14, 1513);
    			attr_dev(p, "class", "card-text");
    			add_location(p, file$3, 40, 14, 1580);
    			attr_dev(a, "href", "#");
    			attr_dev(a, "class", "btn btn-primary");
    			add_location(a, file$3, 41, 14, 1691);
    			attr_dev(div1, "class", "card-body");
    			add_location(div1, file$3, 38, 12, 1474);
    			attr_dev(div2, "class", "card mt-5");
    			add_location(div2, file$3, 34, 8, 1346);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, h5);
    			append_dev(div1, t3);
    			append_dev(div1, p);
    			append_dev(div1, t5);
    			append_dev(div1, a);
    			append_dev(div2, t7);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*kosan*/ 1 && t0_value !== (t0_value = /*hasil*/ ctx[2].nama_kos + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(34:8) {#each kosan as hasil}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div;
    	let if_block = /*kosan*/ ctx[0] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "pt-5 pb-5");
    			add_location(div, file$3, 31, 0, 1264);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*kosan*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const apiURL = "http://localhost:3002/listkosan";

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Kosan", slots, []);

    	var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    		function adopt(value) {
    			return value instanceof P
    			? value
    			: new P(function (resolve) {
    						resolve(value);
    					});
    		}

    		return new (P || (P = Promise))(function (resolve, reject) {
    				function fulfilled(value) {
    					try {
    						step(generator.next(value));
    					} catch(e) {
    						reject(e);
    					}
    				}

    				function rejected(value) {
    					try {
    						step(generator["throw"](value));
    					} catch(e) {
    						reject(e);
    					}
    				}

    				function step(result) {
    					result.done
    					? resolve(result.value)
    					: adopt(result.value).then(fulfilled, rejected);
    				}

    				step((generator = generator.apply(thisArg, _arguments || [])).next());
    			});
    	};

    	let kosan = [];

    	onMount(() => __awaiter(void 0, void 0, void 0, function* () {
    		const res = yield fetch(apiURL).then(r => r.json()).then(data => {
    			$$invalidate(0, kosan = data);
    		});
    	}));

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Kosan> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ __awaiter, axios: axios$1, onMount, kosan, apiURL });

    	$$self.$inject_state = $$props => {
    		if ("__awaiter" in $$props) __awaiter = $$props.__awaiter;
    		if ("kosan" in $$props) $$invalidate(0, kosan = $$props.kosan);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [kosan];
    }

    class Kosan extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Kosan",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\user\Login.svelte generated by Svelte v3.29.4 */

    const file$4 = "src\\user\\Login.svelte";

    function create_fragment$5(ctx) {
    	let div6;
    	let div5;
    	let div4;
    	let h3;
    	let t1;
    	let div0;
    	let t3;
    	let div1;
    	let label0;
    	let t5;
    	let input0;
    	let t6;
    	let div2;
    	let label1;
    	let t8;
    	let input1;
    	let t9;
    	let div3;
    	let button;
    	let t11;
    	let p;
    	let t12;
    	let a;

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div5 = element("div");
    			div4 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Admin Login";
    			t1 = space();
    			div0 = element("div");
    			div0.textContent = "Username atau password salah !";
    			t3 = space();
    			div1 = element("div");
    			label0 = element("label");
    			label0.textContent = "Username";
    			t5 = space();
    			input0 = element("input");
    			t6 = space();
    			div2 = element("div");
    			label1 = element("label");
    			label1.textContent = "Password";
    			t8 = space();
    			input1 = element("input");
    			t9 = space();
    			div3 = element("div");
    			button = element("button");
    			button.textContent = "Login";
    			t11 = space();
    			p = element("p");
    			t12 = text("Belum punya akun? ");
    			a = element("a");
    			a.textContent = "Daftar disini";
    			attr_dev(h3, "class", "card-title mb-5");
    			add_location(h3, file$4, 3, 10, 171);
    			attr_dev(div0, "class", "alert alert-danger");
    			attr_dev(div0, "role", "alert");
    			add_location(div0, file$4, 4, 10, 227);
    			attr_dev(label0, "for", "txtusernamae");
    			attr_dev(label0, "class", "form-label");
    			add_location(label0, file$4, 8, 12, 378);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "form-control");
    			attr_dev(input0, "id", "txtusernamae");
    			attr_dev(input0, "placeholder", "");
    			add_location(input0, file$4, 9, 12, 453);
    			attr_dev(div1, "class", "mb-3");
    			add_location(div1, file$4, 7, 10, 346);
    			attr_dev(label1, "for", "txtpassword");
    			attr_dev(label1, "class", "form-label");
    			add_location(label1, file$4, 12, 12, 588);
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "class", "form-control");
    			attr_dev(input1, "id", "txtpassword");
    			attr_dev(input1, "placeholder", "");
    			add_location(input1, file$4, 13, 12, 662);
    			attr_dev(div2, "class", "mb-3");
    			add_location(div2, file$4, 11, 10, 556);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn btn-success mb-1");
    			add_location(button, file$4, 16, 12, 800);
    			attr_dev(a, "href", "http://localhost:5000/user/signup");
    			add_location(a, file$4, 17, 33, 900);
    			add_location(p, file$4, 17, 12, 879);
    			attr_dev(div3, "class", "mb-3");
    			add_location(div3, file$4, 15, 10, 768);
    			attr_dev(div4, "class", "card-body");
    			add_location(div4, file$4, 2, 8, 136);
    			attr_dev(div5, "class", "card shadow card-bg");
    			set_style(div5, "width", "25rem");
    			set_style(div5, "margin-top", "70px");
    			add_location(div5, file$4, 1, 4, 54);
    			attr_dev(div6, "class", "d-flex justify-content-center mt-5");
    			add_location(div6, file$4, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div4, h3);
    			append_dev(div4, t1);
    			append_dev(div4, div0);
    			append_dev(div4, t3);
    			append_dev(div4, div1);
    			append_dev(div1, label0);
    			append_dev(div1, t5);
    			append_dev(div1, input0);
    			append_dev(div4, t6);
    			append_dev(div4, div2);
    			append_dev(div2, label1);
    			append_dev(div2, t8);
    			append_dev(div2, input1);
    			append_dev(div4, t9);
    			append_dev(div4, div3);
    			append_dev(div3, button);
    			append_dev(div3, t11);
    			append_dev(div3, p);
    			append_dev(p, t12);
    			append_dev(p, a);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Login", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Login> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Login extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Login",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    class myAlert {
        constructor(teks, tipe) {
            this.teks = teks;
            this.tipe = tipe;
        }
        showAlert() {
            return `<div class="alert alert-${this.tipe}" role="alert">${this.teks}</div>`;
        }
    }

    /* src\admin\Dasbor.svelte generated by Svelte v3.29.4 */

    const file$5 = "src\\admin\\Dasbor.svelte";

    function create_fragment$6(ctx) {
    	let div;
    	let h1;
    	let t1;
    	let p;
    	let t2;
    	let t3;
    	let form;
    	let input0;
    	let t4;
    	let input1;
    	let t5;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "DASBOR ADMIN";
    			t1 = space();
    			p = element("p");
    			t2 = text(/*sesi*/ ctx[0]);
    			t3 = space();
    			form = element("form");
    			input0 = element("input");
    			t4 = space();
    			input1 = element("input");
    			t5 = space();
    			button = element("button");
    			button.textContent = "Logout";
    			attr_dev(h1, "class", "h1 mb-3");
    			add_location(h1, file$5, 15, 4, 292);
    			add_location(p, file$5, 16, 4, 335);
    			attr_dev(input0, "type", "file");
    			attr_dev(input0, "accept", "image/jpeg");
    			attr_dev(input0, "name", "photo");
    			add_location(input0, file$5, 18, 8, 424);
    			attr_dev(input1, "type", "submit");
    			input1.value = "upload";
    			add_location(input1, file$5, 19, 8, 486);
    			attr_dev(form, "action", "");
    			attr_dev(form, "method", "post");
    			attr_dev(form, "enctype", "multipart/form-data");
    			add_location(form, file$5, 17, 4, 354);
    			attr_dev(button, "class", "btn btn-danger");
    			add_location(button, file$5, 21, 4, 541);
    			attr_dev(div, "class", "upload svelte-e2oo0u");
    			add_location(div, file$5, 14, 0, 266);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			append_dev(div, p);
    			append_dev(p, t2);
    			append_dev(div, t3);
    			append_dev(div, form);
    			append_dev(form, input0);
    			append_dev(form, t4);
    			append_dev(form, input1);
    			append_dev(div, t5);
    			append_dev(div, button);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", logout, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*sesi*/ 1) set_data_dev(t2, /*sesi*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function logout() {
    	localStorage.clear();
    	window.open("http://localhost:5000/admin/login", "_self");
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Dasbor", slots, []);
    	let sesi;
    	sesi = localStorage.getItem("admin");
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Dasbor> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ sesi, logout });

    	$$self.$inject_state = $$props => {
    		if ("sesi" in $$props) $$invalidate(0, sesi = $$props.sesi);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [sesi];
    }

    class Dasbor extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dasbor",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\admin\index.admin.svelte generated by Svelte v3.29.4 */
    const file$6 = "src\\admin\\index.admin.svelte";

    // (61:0) {:else}
    function create_else_block(ctx) {
    	let div5;
    	let div4;
    	let div3;
    	let h3;
    	let t1;
    	let t2;
    	let div0;
    	let label0;
    	let t4;
    	let input0;
    	let t5;
    	let div1;
    	let label1;
    	let t7;
    	let input1;
    	let t8;
    	let div2;
    	let button;
    	let mounted;
    	let dispose;
    	let if_block = /*login_state*/ ctx[3] == 1 && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div4 = element("div");
    			div3 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Admin Login";
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "Username";
    			t4 = space();
    			input0 = element("input");
    			t5 = space();
    			div1 = element("div");
    			label1 = element("label");
    			label1.textContent = "Password";
    			t7 = space();
    			input1 = element("input");
    			t8 = space();
    			div2 = element("div");
    			button = element("button");
    			button.textContent = "Login";
    			attr_dev(h3, "class", "card-title mb-5");
    			add_location(h3, file$6, 64, 14, 2459);
    			attr_dev(label0, "for", "txtusernamae");
    			attr_dev(label0, "class", "form-label");
    			add_location(label0, file$6, 69, 16, 2657);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "form-control");
    			attr_dev(input0, "id", "txtusernamae");
    			add_location(input0, file$6, 70, 16, 2736);
    			attr_dev(div0, "class", "mb-3");
    			add_location(div0, file$6, 68, 14, 2621);
    			attr_dev(label1, "for", "txtpassword");
    			attr_dev(label1, "class", "form-label");
    			add_location(label1, file$6, 73, 16, 2887);
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "class", "form-control");
    			attr_dev(input1, "id", "txtpassword");
    			add_location(input1, file$6, 74, 16, 2965);
    			attr_dev(div1, "class", "mb-3");
    			add_location(div1, file$6, 72, 14, 2851);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn btn-success");
    			add_location(button, file$6, 77, 16, 3118);
    			attr_dev(div2, "class", "mb-3");
    			add_location(div2, file$6, 76, 14, 3082);
    			attr_dev(div3, "class", "card-body");
    			add_location(div3, file$6, 63, 12, 2420);
    			attr_dev(div4, "class", "card shadow");
    			set_style(div4, "width", "25rem");
    			set_style(div4, "margin-top", "70px");
    			add_location(div4, file$6, 62, 8, 2342);
    			attr_dev(div5, "class", "d-flex justify-content-center mt-5");
    			add_location(div5, file$6, 61, 4, 2284);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, h3);
    			append_dev(div3, t1);
    			if (if_block) if_block.m(div3, null);
    			append_dev(div3, t2);
    			append_dev(div3, div0);
    			append_dev(div0, label0);
    			append_dev(div0, t4);
    			append_dev(div0, input0);
    			set_input_value(input0, /*uname*/ ctx[1]);
    			append_dev(div3, t5);
    			append_dev(div3, div1);
    			append_dev(div1, label1);
    			append_dev(div1, t7);
    			append_dev(div1, input1);
    			set_input_value(input1, /*pass*/ ctx[2]);
    			append_dev(div3, t8);
    			append_dev(div3, div2);
    			append_dev(div2, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[5]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[6]),
    					listen_dev(button, "click", /*doLogin*/ ctx[0], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*login_state*/ ctx[3] == 1) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					if_block.m(div3, t2);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*uname*/ 2 && input0.value !== /*uname*/ ctx[1]) {
    				set_input_value(input0, /*uname*/ ctx[1]);
    			}

    			if (dirty & /*pass*/ 4 && input1.value !== /*pass*/ ctx[2]) {
    				set_input_value(input1, /*pass*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(61:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (59:0) {#if localStorage.getItem('login') == 'login'}
    function create_if_block$1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = Dasbor;

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (switch_value !== (switch_value = Dasbor)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(59:0) {#if localStorage.getItem('login') == 'login'}",
    		ctx
    	});

    	return block;
    }

    // (66:14) {#if login_state == 1}
    function create_if_block_1(ctx) {
    	let html_tag;
    	let raw_value = /*notif*/ ctx[4].showNotif() + "";
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_anchor = empty();
    			html_tag = new HtmlTag(html_anchor);
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(66:14) {#if login_state == 1}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (localStorage.getItem("login") == "login") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type();
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Admin", slots, []);

    	var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    		function adopt(value) {
    			return value instanceof P
    			? value
    			: new P(function (resolve) {
    						resolve(value);
    					});
    		}

    		return new (P || (P = Promise))(function (resolve, reject) {
    				function fulfilled(value) {
    					try {
    						step(generator.next(value));
    					} catch(e) {
    						reject(e);
    					}
    				}

    				function rejected(value) {
    					try {
    						step(generator["throw"](value));
    					} catch(e) {
    						reject(e);
    					}
    				}

    				function step(result) {
    					result.done
    					? resolve(result.value)
    					: adopt(result.value).then(fulfilled, rejected);
    				}

    				step((generator = generator.apply(thisArg, _arguments || [])).next());
    			});
    	};

    	let result = { message: "", username: "", token: "" };
    	let uname;
    	let pass;
    	let login_state = 0;
    	let LOGIN_API_URL = "http://localhost:3002/admin/login";

    	class NotifAlert extends myAlert {
    		constructor(tipe, teks, role) {
    			super(teks, tipe);
    			this.role = role;
    		}

    		showNotif() {
    			return `<div class="alert alert-${this.tipe}" role="${this.role}">${this.teks}</div>`;
    		}
    	}

    	let notif = new NotifAlert("danger", "Username atau Password salah!!", "alert");

    	function doLogin() {
    		return __awaiter(this, void 0, void 0, function* () {
    			try {
    				const response = yield axios$1.post(LOGIN_API_URL, { username: uname, password: pass });
    				result = response.data;

    				if (result.message == "Berhasil login") {
    					window.open("http://localhost:5000/admin/dasbor", "_self");

    					// set localStorage
    					localStorage.setItem("admin", result.token);

    					localStorage.setItem("nama_admin", result.username);
    					localStorage.setItem("login", "login");
    					close();
    				} else {
    					$$invalidate(3, login_state = 1);
    				}
    			} catch(error) {
    				$$invalidate(3, login_state = 1);
    			}
    		});
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Admin> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		uname = this.value;
    		$$invalidate(1, uname);
    	}

    	function input1_input_handler() {
    		pass = this.value;
    		$$invalidate(2, pass);
    	}

    	$$self.$capture_state = () => ({
    		__awaiter,
    		myAlert,
    		axios: axios$1,
    		Dasbor,
    		result,
    		uname,
    		pass,
    		login_state,
    		LOGIN_API_URL,
    		NotifAlert,
    		notif,
    		doLogin
    	});

    	$$self.$inject_state = $$props => {
    		if ("__awaiter" in $$props) __awaiter = $$props.__awaiter;
    		if ("result" in $$props) result = $$props.result;
    		if ("uname" in $$props) $$invalidate(1, uname = $$props.uname);
    		if ("pass" in $$props) $$invalidate(2, pass = $$props.pass);
    		if ("login_state" in $$props) $$invalidate(3, login_state = $$props.login_state);
    		if ("LOGIN_API_URL" in $$props) LOGIN_API_URL = $$props.LOGIN_API_URL;
    		if ("notif" in $$props) $$invalidate(4, notif = $$props.notif);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		doLogin,
    		uname,
    		pass,
    		login_state,
    		notif,
    		input0_input_handler,
    		input1_input_handler
    	];
    }

    class Admin extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { doLogin: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Admin",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get doLogin() {
    		return this.$$.ctx[0];
    	}

    	set doLogin(value) {
    		throw new Error("<Admin>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\ownerkos\Login.svelte generated by Svelte v3.29.4 */

    const file$7 = "src\\ownerkos\\Login.svelte";

    function create_fragment$8(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "OWNER KOS LOGIN";
    			add_location(h1, file$7, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Login", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Login> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Login$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Login",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.29.4 */
    const file$8 = "src\\App.svelte";

    function create_fragment$9(ctx) {
    	let nav;
    	let t;
    	let div;
    	let switch_instance;
    	let current;
    	nav = new Nav({ $$inline: true });
    	var switch_value = /*current*/ ctx[0];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			create_component(nav.$$.fragment);
    			t = space();
    			div = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			attr_dev(div, "class", "container");
    			add_location(div, file$8, 24, 0, 871);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(nav, target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (switch_value !== (switch_value = /*current*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div, null);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nav.$$.fragment, local);
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nav.$$.fragment, local);
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(nav, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div);
    			if (switch_instance) destroy_component(switch_instance);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let current;
    	page("/", () => $$invalidate(0, current = Home));
    	page("/listkos", () => $$invalidate(0, current = Kosan));
    	page("/about", () => $$invalidate(0, current = About));
    	page("/contact", () => $$invalidate(0, current = Contact));
    	page("/user/login", () => $$invalidate(0, current = Login));
    	page("/admin/login", () => $$invalidate(0, current = Admin));
    	page("/owner/login", () => $$invalidate(0, current = Login$1));
    	page("/admin/dasbor", () => $$invalidate(0, current = Admin));
    	page.start();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		page,
    		Nav,
    		Home,
    		About,
    		Contact,
    		Kosan,
    		ULogin: Login,
    		ALogin: Admin,
    		OLogin: Login$1,
    		ADasbor: Admin,
    		current
    	});

    	$$self.$inject_state = $$props => {
    		if ("current" in $$props) $$invalidate(0, current = $$props.current);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [current];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    const app$1 = new App({
        target: document.body,
        props: {
            name: 'world'
        }
    });

    return app$1;

}());
//# sourceMappingURL=bundle.js.map
