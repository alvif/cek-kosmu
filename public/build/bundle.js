
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
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
function select_option(select, value) {
    for (let i = 0; i < select.options.length; i += 1) {
        const option = select.options[i];
        if (option.__value === value) {
            option.selected = true;
            return;
        }
    }
}
function select_value(select) {
    const selected_option = select.querySelector(':checked') || select.options[0];
    return selected_option && selected_option.__value;
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

const globals = (typeof window !== 'undefined'
    ? window
    : typeof globalThis !== 'undefined'
        ? globalThis
        : global);
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

/* src\components\nav-item.admin.svelte generated by Svelte v3.29.4 */

const file = "src\\components\\nav-item.admin.svelte";

function create_fragment(ctx) {
	let li;
	let a0;
	let t1;
	let div1;
	let a1;
	let t3;
	let div0;
	let t4;
	let a2;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			li = element("li");
			a0 = element("a");
			a0.textContent = "Admin";
			t1 = space();
			div1 = element("div");
			a1 = element("a");
			a1.textContent = "Dasbor";
			t3 = space();
			div0 = element("div");
			t4 = space();
			a2 = element("a");
			a2.textContent = "Logout";
			attr_dev(a0, "class", "nav-link dropdown-toggle text-white");
			attr_dev(a0, "href", "#anu");
			attr_dev(a0, "id", "navbarDropdown");
			attr_dev(a0, "role", "button");
			attr_dev(a0, "data-toggle", "dropdown");
			attr_dev(a0, "aria-haspopup", "true");
			attr_dev(a0, "aria-expanded", "false");
			add_location(a0, file, 7, 2, 185);
			attr_dev(a1, "class", "dropdown-item");
			attr_dev(a1, "href", "/admin/dasbor");
			add_location(a1, file, 12, 4, 492);
			attr_dev(div0, "class", "dropdown-divider");
			add_location(div0, file, 13, 4, 554);
			attr_dev(a2, "class", "dropdown-item");
			attr_dev(a2, "href", "#logout");
			add_location(a2, file, 14, 4, 596);
			attr_dev(div1, "class", "dropdown-menu");
			attr_dev(div1, "aria-labelledby", "navbarDropdown");
			add_location(div1, file, 10, 2, 367);
			attr_dev(li, "class", "nav-item dropdown ml-4");
			add_location(li, file, 6, 0, 146);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, li, anchor);
			append_dev(li, a0);
			append_dev(li, t1);
			append_dev(li, div1);
			append_dev(div1, a1);
			append_dev(div1, t3);
			append_dev(div1, div0);
			append_dev(div1, t4);
			append_dev(div1, a2);

			if (!mounted) {
				dispose = listen_dev(a2, "click", logout, false, false, false);
				mounted = true;
			}
		},
		p: noop,
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(li);
			mounted = false;
			dispose();
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

function logout() {
	localStorage.clear();
	window.open("http://localhost:5000/admin/login", "_self");
}

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Nav_item_admin", slots, []);
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Nav_item_admin> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({ logout });
	return [];
}

class Nav_item_admin extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Nav_item_admin",
			options,
			id: create_fragment.name
		});
	}
}

/* src\components\nav-item.owner.svelte generated by Svelte v3.29.4 */

const file$1 = "src\\components\\nav-item.owner.svelte";

function create_fragment$1(ctx) {
	let li;
	let a0;
	let t1;
	let div1;
	let a1;
	let t3;
	let div0;
	let t4;
	let a2;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			li = element("li");
			a0 = element("a");
			a0.textContent = "Owner";
			t1 = space();
			div1 = element("div");
			a1 = element("a");
			a1.textContent = "Dasbor";
			t3 = space();
			div0 = element("div");
			t4 = space();
			a2 = element("a");
			a2.textContent = "Logout";
			attr_dev(a0, "class", "nav-link dropdown-toggle text-white");
			attr_dev(a0, "href", "#anu");
			attr_dev(a0, "id", "navbarDropdown");
			attr_dev(a0, "role", "button");
			attr_dev(a0, "data-toggle", "dropdown");
			attr_dev(a0, "aria-haspopup", "true");
			attr_dev(a0, "aria-expanded", "false");
			add_location(a0, file$1, 7, 2, 185);
			attr_dev(a1, "class", "dropdown-item");
			attr_dev(a1, "href", "/owner/dasbor");
			add_location(a1, file$1, 12, 4, 492);
			attr_dev(div0, "class", "dropdown-divider");
			add_location(div0, file$1, 13, 4, 554);
			attr_dev(a2, "class", "dropdown-item");
			attr_dev(a2, "href", "#logout");
			add_location(a2, file$1, 14, 4, 596);
			attr_dev(div1, "class", "dropdown-menu");
			attr_dev(div1, "aria-labelledby", "navbarDropdown");
			add_location(div1, file$1, 10, 2, 367);
			attr_dev(li, "class", "nav-item dropdown ml-4");
			add_location(li, file$1, 6, 0, 146);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, li, anchor);
			append_dev(li, a0);
			append_dev(li, t1);
			append_dev(li, div1);
			append_dev(div1, a1);
			append_dev(div1, t3);
			append_dev(div1, div0);
			append_dev(div1, t4);
			append_dev(div1, a2);

			if (!mounted) {
				dispose = listen_dev(a2, "click", logout$1, false, false, false);
				mounted = true;
			}
		},
		p: noop,
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(li);
			mounted = false;
			dispose();
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

function logout$1() {
	localStorage.clear();
	window.open("http://localhost:5000/owner/login", "_self");
}

function instance$1($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Nav_item_owner", slots, []);
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Nav_item_owner> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({ logout: logout$1 });
	return [];
}

class Nav_item_owner extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Nav_item_owner",
			options,
			id: create_fragment$1.name
		});
	}
}

/* src\components\nav-item.user.svelte generated by Svelte v3.29.4 */

const file$2 = "src\\components\\nav-item.user.svelte";

function create_fragment$2(ctx) {
	let li;
	let a0;
	let t1;
	let div1;
	let a1;
	let t3;
	let div0;
	let t4;
	let a2;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			li = element("li");
			a0 = element("a");
			a0.textContent = "User";
			t1 = space();
			div1 = element("div");
			a1 = element("a");
			a1.textContent = "Dasbor";
			t3 = space();
			div0 = element("div");
			t4 = space();
			a2 = element("a");
			a2.textContent = "Logout";
			attr_dev(a0, "class", "nav-link dropdown-toggle text-white");
			attr_dev(a0, "href", "#anu");
			attr_dev(a0, "id", "navbarDropdown");
			attr_dev(a0, "role", "button");
			attr_dev(a0, "data-toggle", "dropdown");
			attr_dev(a0, "aria-haspopup", "true");
			attr_dev(a0, "aria-expanded", "false");
			add_location(a0, file$2, 7, 2, 184);
			attr_dev(a1, "class", "dropdown-item");
			attr_dev(a1, "href", "/user/dasbor");
			add_location(a1, file$2, 12, 4, 490);
			attr_dev(div0, "class", "dropdown-divider");
			add_location(div0, file$2, 13, 4, 551);
			attr_dev(a2, "class", "dropdown-item");
			attr_dev(a2, "href", "#logout");
			add_location(a2, file$2, 14, 4, 593);
			attr_dev(div1, "class", "dropdown-menu");
			attr_dev(div1, "aria-labelledby", "navbarDropdown");
			add_location(div1, file$2, 10, 2, 365);
			attr_dev(li, "class", "nav-item dropdown ml-4");
			add_location(li, file$2, 6, 0, 145);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, li, anchor);
			append_dev(li, a0);
			append_dev(li, t1);
			append_dev(li, div1);
			append_dev(div1, a1);
			append_dev(div1, t3);
			append_dev(div1, div0);
			append_dev(div1, t4);
			append_dev(div1, a2);

			if (!mounted) {
				dispose = listen_dev(a2, "click", logout$2, false, false, false);
				mounted = true;
			}
		},
		p: noop,
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(li);
			mounted = false;
			dispose();
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

function logout$2() {
	localStorage.clear();
	window.open("http://localhost:5000/user/login", "_self");
}

function instance$2($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Nav_item_user", slots, []);
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Nav_item_user> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({ logout: logout$2 });
	return [];
}

class Nav_item_user extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Nav_item_user",
			options,
			id: create_fragment$2.name
		});
	}
}

/* src\components\Nav.svelte generated by Svelte v3.29.4 */
const file$3 = "src\\components\\Nav.svelte";

function create_fragment$3(ctx) {
	let nav;
	let a0;
	let img;
	let img_src_value;
	let t0;
	let ul5;
	let ul0;
	let a1;
	let t2;
	let ul1;
	let a2;
	let t4;
	let ul2;
	let a3;
	let t6;
	let ul3;
	let a4;
	let t8;
	let ul4;
	let a5;
	let t10;
	let switch_instance;
	let current;
	var switch_value = /*current_item*/ ctx[0];

	function switch_props(ctx) {
		return { $$inline: true };
	}

	if (switch_value) {
		switch_instance = new switch_value(switch_props());
	}

	const block = {
		c: function create() {
			nav = element("nav");
			a0 = element("a");
			img = element("img");
			t0 = space();
			ul5 = element("ul");
			ul0 = element("ul");
			a1 = element("a");
			a1.textContent = "Home";
			t2 = space();
			ul1 = element("ul");
			a2 = element("a");
			a2.textContent = "Cari";
			t4 = space();
			ul2 = element("ul");
			a3 = element("a");
			a3.textContent = "Tempat Kos";
			t6 = space();
			ul3 = element("ul");
			a4 = element("a");
			a4.textContent = "Contact";
			t8 = space();
			ul4 = element("ul");
			a5 = element("a");
			a5.textContent = "About";
			t10 = space();
			if (switch_instance) create_component(switch_instance.$$.fragment);
			if (img.src !== (img_src_value = "../assets/brand.png")) attr_dev(img, "src", img_src_value);
			attr_dev(img, "width", "123");
			attr_dev(img, "height", "39");
			attr_dev(img, "class", "d-inline-block align-top");
			attr_dev(img, "alt", "brand");
			attr_dev(img, "loading", "lazy");
			add_location(img, file$3, 20, 2, 571);
			attr_dev(a0, "class", "navbar-brand");
			attr_dev(a0, "href", "/");
			add_location(a0, file$3, 19, 1, 534);
			attr_dev(a1, "href", "/");
			attr_dev(a1, "class", "nav-link text-white");
			add_location(a1, file$3, 25, 3, 761);
			attr_dev(ul0, "class", "nav-item");
			add_location(ul0, file$3, 24, 2, 735);
			attr_dev(a2, "href", "/carikos");
			attr_dev(a2, "class", "nav-link text-white");
			add_location(a2, file$3, 28, 3, 848);
			attr_dev(ul1, "class", "nav-item");
			add_location(ul1, file$3, 27, 2, 822);
			attr_dev(a3, "href", "/listkos");
			attr_dev(a3, "class", "nav-link text-white");
			add_location(a3, file$3, 31, 3, 942);
			attr_dev(ul2, "class", "nav-item");
			add_location(ul2, file$3, 30, 2, 916);
			attr_dev(a4, "href", "/contact");
			attr_dev(a4, "class", "nav-link text-white");
			add_location(a4, file$3, 34, 3, 1042);
			attr_dev(ul3, "class", "nav-item");
			add_location(ul3, file$3, 33, 2, 1016);
			attr_dev(a5, "href", "/about");
			attr_dev(a5, "class", "nav-link text-white");
			add_location(a5, file$3, 37, 3, 1139);
			attr_dev(ul4, "class", "nav-item");
			add_location(ul4, file$3, 36, 2, 1113);
			attr_dev(ul5, "class", "navbar-nav ml-auto");
			add_location(ul5, file$3, 23, 1, 700);
			attr_dev(nav, "class", "navbar fixed-top navbar-expand navbar-custom");
			add_location(nav, file$3, 18, 0, 473);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, nav, anchor);
			append_dev(nav, a0);
			append_dev(a0, img);
			append_dev(nav, t0);
			append_dev(nav, ul5);
			append_dev(ul5, ul0);
			append_dev(ul0, a1);
			append_dev(ul5, t2);
			append_dev(ul5, ul1);
			append_dev(ul1, a2);
			append_dev(ul5, t4);
			append_dev(ul5, ul2);
			append_dev(ul2, a3);
			append_dev(ul5, t6);
			append_dev(ul5, ul3);
			append_dev(ul3, a4);
			append_dev(ul5, t8);
			append_dev(ul5, ul4);
			append_dev(ul4, a5);
			append_dev(ul5, t10);

			if (switch_instance) {
				mount_component(switch_instance, ul5, null);
			}

			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (switch_value !== (switch_value = /*current_item*/ ctx[0])) {
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
					mount_component(switch_instance, ul5, null);
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
			if (detaching) detach_dev(nav);
			if (switch_instance) destroy_component(switch_instance);
		}
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

function instance$3($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Nav", slots, []);
	let current_item;

	switch (localStorage.getItem("login")) {
		case "admin":
			current_item = Nav_item_admin;
			break;
		case "owner":
			current_item = Nav_item_owner;
			break;
		case "user":
			current_item = Nav_item_user;
			break;
	}

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Nav> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({
		navAdmin: Nav_item_admin,
		navOwner: Nav_item_owner,
		navUser: Nav_item_user,
		current_item
	});

	$$self.$inject_state = $$props => {
		if ("current_item" in $$props) $$invalidate(0, current_item = $$props.current_item);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [current_item];
}

class Nav extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Nav",
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

class UI {
}
class myToast extends UI {
    // Konstruktor
    constructor(judul, teks, tipe) {
        super();
        this._judul = judul;
        this._teks = teks;
        this._tipe = tipe;
    }
    // Setter Getter
    set judul(judul) {
        this._judul = judul;
    }
    get judul() {
        return this._judul;
    }
    set teks(teks) {
        this._teks = teks;
    }
    get teks() {
        return this._teks;
    }
    set tipe(tipe) {
        this._tipe = tipe;
    }
    get tipe() {
        return this._tipe;
    }
}
class Image extends UI {
    /** konstruktor */
    constructor(id = '', path_img, alt = '') {
        super();
        this.id = id;
        this.path = path_img;
        this.alt = alt;
    }
    /** setter dan getter width height */
    set setWidth(width) {
        this.width = width;
    }
    get getWidth() {
        return this.width;
    }
    set setHeight(height) {
        this.height;
    }
    get getHeight() {
        return this.height;
    }
    /** show image method */
    show() {
        return `<img src="${this.path}" alt="${this.alt}" width="${this.width}" height="${this.height}" id="${this.id}">`;
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

/* src\routes\Home.svelte generated by Svelte v3.29.4 */
const file$4 = "src\\routes\\Home.svelte";

// (38:2) {:else}
function create_else_block(ctx) {
	let button0;
	let t1;
	let button1;
	let br0;
	let br1;

	const block = {
		c: function create() {
			button0 = element("button");
			button0.textContent = "Sign Up";
			t1 = space();
			button1 = element("button");
			button1.textContent = "Sign in";
			br0 = element("br");
			br1 = element("br");
			attr_dev(button0, "class", "btn btn-info");
			attr_dev(button0, "data-toggle", "modal");
			attr_dev(button0, "data-target", "#SignUpModal");
			add_location(button0, file$4, 38, 4, 1084);
			attr_dev(button1, "class", "btn btn-success");
			attr_dev(button1, "data-toggle", "modal");
			attr_dev(button1, "data-target", "#SignInModal");
			add_location(button1, file$4, 42, 4, 1199);
			add_location(br0, file$4, 45, 49, 1312);
			add_location(br1, file$4, 45, 53, 1316);
		},
		m: function mount(target, anchor) {
			insert_dev(target, button0, anchor);
			insert_dev(target, t1, anchor);
			insert_dev(target, button1, anchor);
			insert_dev(target, br0, anchor);
			insert_dev(target, br1, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(button0);
			if (detaching) detach_dev(t1);
			if (detaching) detach_dev(button1);
			if (detaching) detach_dev(br0);
			if (detaching) detach_dev(br1);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block.name,
		type: "else",
		source: "(38:2) {:else}",
		ctx
	});

	return block;
}

// (36:2) {#if localStorage.getItem('admin') || localStorage.getItem('owner') || localStorage.getItem('user')}
function create_if_block(ctx) {
	const block = { c: noop, m: noop, d: noop };

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(36:2) {#if localStorage.getItem('admin') || localStorage.getItem('owner') || localStorage.getItem('user')}",
		ctx
	});

	return block;
}

function create_fragment$4(ctx) {
	let br0;
	let br1;
	let br2;
	let t0;
	let div0;
	let raw_value = /*logo*/ ctx[0].show() + "";
	let t1;
	let div1;
	let p0;
	let t3;
	let div2;
	let t4;
	let div7;
	let div6;
	let div5;
	let div3;
	let h50;
	let t6;
	let button0;
	let span0;
	let t8;
	let div4;
	let p1;
	let t10;
	let button1;
	let t12;
	let button2;
	let t14;
	let div12;
	let div11;
	let div10;
	let div8;
	let h51;
	let t16;
	let button3;
	let span1;
	let t18;
	let div9;
	let p2;
	let t20;
	let button4;
	let t22;
	let button5;
	let mounted;
	let dispose;

	function select_block_type(ctx, dirty) {
		if (localStorage.getItem("admin") || localStorage.getItem("owner") || localStorage.getItem("user")) return create_if_block;
		return create_else_block;
	}

	let current_block_type = select_block_type();
	let if_block = current_block_type(ctx);

	const block = {
		c: function create() {
			br0 = element("br");
			br1 = element("br");
			br2 = element("br");
			t0 = space();
			div0 = element("div");
			t1 = space();
			div1 = element("div");
			p0 = element("p");
			p0.textContent = "Kami di sini siap membantu";
			t3 = space();
			div2 = element("div");
			if_block.c();
			t4 = space();
			div7 = element("div");
			div6 = element("div");
			div5 = element("div");
			div3 = element("div");
			h50 = element("h5");
			h50.textContent = "Sign Up";
			t6 = space();
			button0 = element("button");
			span0 = element("span");
			span0.textContent = "×";
			t8 = space();
			div4 = element("div");
			p1 = element("p");
			p1.textContent = "Sign Up sebagai :";
			t10 = space();
			button1 = element("button");
			button1.textContent = "Pencari Kos";
			t12 = space();
			button2 = element("button");
			button2.textContent = "Pemilik Kos";
			t14 = space();
			div12 = element("div");
			div11 = element("div");
			div10 = element("div");
			div8 = element("div");
			h51 = element("h5");
			h51.textContent = "Sign In";
			t16 = space();
			button3 = element("button");
			span1 = element("span");
			span1.textContent = "×";
			t18 = space();
			div9 = element("div");
			p2 = element("p");
			p2.textContent = "Sign In sebagai :";
			t20 = space();
			button4 = element("button");
			button4.textContent = "Pencari Kos";
			t22 = space();
			button5 = element("button");
			button5.textContent = "Pemilik Kos";
			add_location(br0, file$4, 22, 0, 668);
			add_location(br1, file$4, 22, 6, 674);
			add_location(br2, file$4, 22, 12, 680);
			attr_dev(div0, "class", "text-center");
			add_location(div0, file$4, 23, 0, 687);
			attr_dev(p0, "id", "moto");
			add_location(p0, file$4, 29, 2, 810);
			attr_dev(div1, "class", "text-center pt-3");
			add_location(div1, file$4, 28, 0, 777);
			attr_dev(div2, "class", "tombol text-center mt-5");
			add_location(div2, file$4, 34, 0, 906);
			attr_dev(h50, "class", "modal-title");
			add_location(h50, file$4, 59, 8, 1805);
			attr_dev(span0, "aria-hidden", "true");
			add_location(span0, file$4, 65, 10, 1977);
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", "close");
			attr_dev(button0, "data-dismiss", "modal");
			attr_dev(button0, "aria-label", "Close");
			add_location(button0, file$4, 60, 8, 1850);
			attr_dev(div3, "class", "modal-header");
			add_location(div3, file$4, 58, 6, 1770);
			add_location(p1, file$4, 69, 8, 2099);
			attr_dev(button1, "class", "btn btn-primary");
			add_location(button1, file$4, 70, 8, 2133);
			attr_dev(button2, "class", "btn btn-warning");
			add_location(button2, file$4, 71, 8, 2234);
			attr_dev(div4, "class", "modal-body text-center");
			add_location(div4, file$4, 68, 6, 2054);
			attr_dev(div5, "class", "modal-content");
			add_location(div5, file$4, 57, 4, 1736);
			attr_dev(div6, "class", "modal-dialog");
			attr_dev(div6, "role", "document");
			add_location(div6, file$4, 56, 2, 1689);
			attr_dev(div7, "class", "modal");
			attr_dev(div7, "data-backdrop", "static");
			attr_dev(div7, "tabindex", "-1");
			attr_dev(div7, "role", "dialog");
			attr_dev(div7, "id", "SignUpModal");
			add_location(div7, file$4, 55, 0, 1599);
			attr_dev(h51, "class", "modal-title");
			add_location(h51, file$4, 82, 8, 2596);
			attr_dev(span1, "aria-hidden", "true");
			add_location(span1, file$4, 88, 10, 2768);
			attr_dev(button3, "type", "button");
			attr_dev(button3, "class", "close");
			attr_dev(button3, "data-dismiss", "modal");
			attr_dev(button3, "aria-label", "Close");
			add_location(button3, file$4, 83, 8, 2641);
			attr_dev(div8, "class", "modal-header");
			add_location(div8, file$4, 81, 6, 2561);
			add_location(p2, file$4, 92, 8, 2890);
			attr_dev(button4, "class", "btn btn-primary");
			add_location(button4, file$4, 93, 8, 2924);
			attr_dev(button5, "class", "btn btn-warning");
			add_location(button5, file$4, 94, 8, 3025);
			attr_dev(div9, "class", "modal-body text-center");
			add_location(div9, file$4, 91, 6, 2845);
			attr_dev(div10, "class", "modal-content");
			add_location(div10, file$4, 80, 4, 2527);
			attr_dev(div11, "class", "modal-dialog");
			attr_dev(div11, "role", "document");
			add_location(div11, file$4, 79, 2, 2480);
			attr_dev(div12, "class", "modal");
			attr_dev(div12, "data-backdrop", "static");
			attr_dev(div12, "tabindex", "-1");
			attr_dev(div12, "role", "dialog");
			attr_dev(div12, "id", "SignInModal");
			add_location(div12, file$4, 78, 0, 2390);
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
			div0.innerHTML = raw_value;
			insert_dev(target, t1, anchor);
			insert_dev(target, div1, anchor);
			append_dev(div1, p0);
			insert_dev(target, t3, anchor);
			insert_dev(target, div2, anchor);
			if_block.m(div2, null);
			insert_dev(target, t4, anchor);
			insert_dev(target, div7, anchor);
			append_dev(div7, div6);
			append_dev(div6, div5);
			append_dev(div5, div3);
			append_dev(div3, h50);
			append_dev(div3, t6);
			append_dev(div3, button0);
			append_dev(button0, span0);
			append_dev(div5, t8);
			append_dev(div5, div4);
			append_dev(div4, p1);
			append_dev(div4, t10);
			append_dev(div4, button1);
			append_dev(div4, t12);
			append_dev(div4, button2);
			insert_dev(target, t14, anchor);
			insert_dev(target, div12, anchor);
			append_dev(div12, div11);
			append_dev(div11, div10);
			append_dev(div10, div8);
			append_dev(div8, h51);
			append_dev(div8, t16);
			append_dev(div8, button3);
			append_dev(button3, span1);
			append_dev(div10, t18);
			append_dev(div10, div9);
			append_dev(div9, p2);
			append_dev(div9, t20);
			append_dev(div9, button4);
			append_dev(div9, t22);
			append_dev(div9, button5);

			if (!mounted) {
				dispose = [
					listen_dev(button1, "click", /*click_handler*/ ctx[1], false, false, false),
					listen_dev(button2, "click", /*click_handler_1*/ ctx[2], false, false, false),
					listen_dev(button4, "click", /*click_handler_2*/ ctx[3], false, false, false),
					listen_dev(button5, "click", /*click_handler_3*/ ctx[4], false, false, false)
				];

				mounted = true;
			}
		},
		p: noop,
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
			if (detaching) detach_dev(div2);
			if_block.d();
			if (detaching) detach_dev(t4);
			if (detaching) detach_dev(div7);
			if (detaching) detach_dev(t14);
			if (detaching) detach_dev(div12);
			mounted = false;
			run_all(dispose);
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

function doSignUP(type) {
	if (type === "pencarikos") {
		window.open("http://localhost:5000/user/signup", "_self");
	} else if (type === "pemilikkos") {
		window.open("http://localhost:5000/owner/signup", "_self");
	}
}

function doSignIn(type) {
	if (type === "pencarikos") {
		window.open("http://localhost:5000/user/login", "_self");
	} else if (type === "pemilikkos") {
		window.open("http://localhost:5000/owner/login", "_self");
	}
}

function instance$4($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Home", slots, []);
	let logo = new Image("logo", "assets/logo.png", "logo");
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Home> was created with unknown prop '${key}'`);
	});

	const click_handler = () => doSignUP("pencarikos");
	const click_handler_1 = () => doSignUP("pemilikkos");
	const click_handler_2 = () => doSignIn("pencarikos");
	const click_handler_3 = () => doSignIn("pemilikkos");
	$$self.$capture_state = () => ({ axios: axios$1, Image, logo, doSignUP, doSignIn });

	$$self.$inject_state = $$props => {
		if ("logo" in $$props) $$invalidate(0, logo = $$props.logo);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [logo, click_handler, click_handler_1, click_handler_2, click_handler_3];
}

class Home extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Home",
			options,
			id: create_fragment$4.name
		});
	}
}

/* src\routes\About.svelte generated by Svelte v3.29.4 */

const file$5 = "src\\routes\\About.svelte";

function create_fragment$5(ctx) {
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
			add_location(img0, file$5, 3, 4, 69);
			attr_dev(div0, "class", "text-center mt-3 pt-5");
			add_location(div0, file$5, 2, 0, 29);
			add_location(p, file$5, 6, 4, 152);
			add_location(li0, file$5, 11, 8, 442);
			add_location(li1, file$5, 12, 8, 516);
			add_location(li2, file$5, 13, 8, 605);
			add_location(ul, file$5, 10, 4, 429);
			if (img1.src !== (img1_src_value = "assets/1.png")) attr_dev(img1, "src", img1_src_value);
			attr_dev(img1, "alt", "about");
			attr_dev(img1, "id", "aboutlogo");
			add_location(img1, file$5, 15, 4, 681);
			attr_dev(div1, "class", "aboutbox");
			add_location(div1, file$5, 5, 0, 125);
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
		id: create_fragment$5.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$5($$self, $$props) {
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
		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "About",
			options,
			id: create_fragment$5.name
		});
	}
}

/* src\routes\Contact.svelte generated by Svelte v3.29.4 */
const file$6 = "src\\routes\\Contact.svelte";

function create_fragment$6(ctx) {
	let br0;
	let br1;
	let br2;
	let t0;
	let div0;
	let raw_value = /*logo*/ ctx[0].show() + "";
	let t1;
	let div1;
	let h50;
	let t3;
	let h51;
	let t5;
	let h52;

	const block = {
		c: function create() {
			br0 = element("br");
			br1 = element("br");
			br2 = element("br");
			t0 = space();
			div0 = element("div");
			t1 = space();
			div1 = element("div");
			h50 = element("h5");
			h50.textContent = "EMAIL: alvifsandana@gmail.com";
			t3 = space();
			h51 = element("h5");
			h51.textContent = "TELEPON: 081386219341";
			t5 = space();
			h52 = element("h5");
			h52.textContent = "INSTAGRAM: @alvifsandana";
			add_location(br0, file$6, 5, 0, 137);
			add_location(br1, file$6, 5, 6, 143);
			add_location(br2, file$6, 5, 12, 149);
			attr_dev(div0, "class", "text-center");
			add_location(div0, file$6, 6, 0, 157);
			add_location(h50, file$6, 12, 2, 285);
			add_location(h51, file$6, 13, 2, 327);
			add_location(h52, file$6, 14, 2, 361);
			attr_dev(div1, "class", "text-center mt-3");
			add_location(div1, file$6, 11, 0, 251);
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
			div0.innerHTML = raw_value;
			insert_dev(target, t1, anchor);
			insert_dev(target, div1, anchor);
			append_dev(div1, h50);
			append_dev(div1, t3);
			append_dev(div1, h51);
			append_dev(div1, t5);
			append_dev(div1, h52);
		},
		p: noop,
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

function instance$6($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Contact", slots, []);
	let logo = new Image("logo", "assets/logo.png", "logo");
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Contact> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({ Image, logo });

	$$self.$inject_state = $$props => {
		if ("logo" in $$props) $$invalidate(0, logo = $$props.logo);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [logo];
}

class Contact extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Contact",
			options,
			id: create_fragment$6.name
		});
	}
}

class Pengguna {
    set nama(txtnama) {
        this._nama = txtnama;
    }
    get nama() {
        return this._nama;
    }
    set alamat(txtalamat) {
        this._nama = txtalamat;
    }
    get alamat() {
        return this._alamat;
    }
    set username(txtusername) {
        this._username = txtusername;
    }
    get username() {
        return this._username;
    }
    set password(pw) {
        this._password = pw;
    }
    get password() {
        return this._password;
    }
    set email(txtemail) {
        this._nama = txtemail;
    }
    get email() {
        return this._email;
    }
    set createdAt(tgl) {
        this._createdAt = this.createdAt;
    }
    get createdAt() {
        return this._createdAt;
    }
    set updatedAt(tgl) {
        this._updatedAt = tgl;
    }
    get updatedAt() {
        return this._updatedAt;
    }
}
class Admin extends Pengguna {
    constructor(id) {
        super();
        this.id_admin = id;
    }
    signup() {
    }
    ;
    cekLogin() {
    }
    ;
}
class Owner extends Pengguna {
    signup() {
    }
    ;
    cekLogin() {
    }
    ;
}
class Users extends Pengguna {
    signup() {
    }
    ;
    cekLogin() {
    }
    ;
}

var sweetalert2_all = createCommonjsModule(function (module, exports) {
/*!
* sweetalert2 v10.12.5
* Released under the MIT License.
*/
(function (global, factory) {
   module.exports = factory() ;
}(commonjsGlobal, function () {
  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  var consolePrefix = 'SweetAlert2:';
  /**
   * Filter the unique values into a new array
   * @param arr
   */

  var uniqueArray = function uniqueArray(arr) {
    var result = [];

    for (var i = 0; i < arr.length; i++) {
      if (result.indexOf(arr[i]) === -1) {
        result.push(arr[i]);
      }
    }

    return result;
  };
  /**
   * Capitalize the first letter of a string
   * @param str
   */

  var capitalizeFirstLetter = function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  /**
   * Returns the array of object values (Object.values isn't supported in IE11)
   * @param obj
   */

  var objectValues = function objectValues(obj) {
    return Object.keys(obj).map(function (key) {
      return obj[key];
    });
  };
  /**
   * Convert NodeList to Array
   * @param nodeList
   */

  var toArray = function toArray(nodeList) {
    return Array.prototype.slice.call(nodeList);
  };
  /**
   * Standardise console warnings
   * @param message
   */

  var warn = function warn(message) {
    console.warn("".concat(consolePrefix, " ").concat(_typeof(message) === 'object' ? message.join(' ') : message));
  };
  /**
   * Standardise console errors
   * @param message
   */

  var error = function error(message) {
    console.error("".concat(consolePrefix, " ").concat(message));
  };
  /**
   * Private global state for `warnOnce`
   * @type {Array}
   * @private
   */

  var previousWarnOnceMessages = [];
  /**
   * Show a console warning, but only if it hasn't already been shown
   * @param message
   */

  var warnOnce = function warnOnce(message) {
    if (!(previousWarnOnceMessages.indexOf(message) !== -1)) {
      previousWarnOnceMessages.push(message);
      warn(message);
    }
  };
  /**
   * Show a one-time console warning about deprecated params/methods
   */

  var warnAboutDeprecation = function warnAboutDeprecation(deprecatedParam, useInstead) {
    warnOnce("\"".concat(deprecatedParam, "\" is deprecated and will be removed in the next major release. Please use \"").concat(useInstead, "\" instead."));
  };
  /**
   * If `arg` is a function, call it (with no arguments or context) and return the result.
   * Otherwise, just pass the value through
   * @param arg
   */

  var callIfFunction = function callIfFunction(arg) {
    return typeof arg === 'function' ? arg() : arg;
  };
  var hasToPromiseFn = function hasToPromiseFn(arg) {
    return arg && typeof arg.toPromise === 'function';
  };
  var asPromise = function asPromise(arg) {
    return hasToPromiseFn(arg) ? arg.toPromise() : Promise.resolve(arg);
  };
  var isPromise = function isPromise(arg) {
    return arg && Promise.resolve(arg) === arg;
  };

  var DismissReason = Object.freeze({
    cancel: 'cancel',
    backdrop: 'backdrop',
    close: 'close',
    esc: 'esc',
    timer: 'timer'
  });

  var isJqueryElement = function isJqueryElement(elem) {
    return _typeof(elem) === 'object' && elem.jquery;
  };

  var isElement = function isElement(elem) {
    return elem instanceof Element || isJqueryElement(elem);
  };

  var argsToParams = function argsToParams(args) {
    var params = {};

    if (_typeof(args[0]) === 'object' && !isElement(args[0])) {
      _extends(params, args[0]);
    } else {
      ['title', 'html', 'icon'].forEach(function (name, index) {
        var arg = args[index];

        if (typeof arg === 'string' || isElement(arg)) {
          params[name] = arg;
        } else if (arg !== undefined) {
          error("Unexpected type of ".concat(name, "! Expected \"string\" or \"Element\", got ").concat(_typeof(arg)));
        }
      });
    }

    return params;
  };

  var swalPrefix = 'swal2-';
  var prefix = function prefix(items) {
    var result = {};

    for (var i in items) {
      result[items[i]] = swalPrefix + items[i];
    }

    return result;
  };
  var swalClasses = prefix(['container', 'shown', 'height-auto', 'iosfix', 'popup', 'modal', 'no-backdrop', 'no-transition', 'toast', 'toast-shown', 'toast-column', 'show', 'hide', 'close', 'title', 'header', 'content', 'html-container', 'actions', 'confirm', 'deny', 'cancel', 'footer', 'icon', 'icon-content', 'image', 'input', 'file', 'range', 'select', 'radio', 'checkbox', 'label', 'textarea', 'inputerror', 'input-label', 'validation-message', 'progress-steps', 'active-progress-step', 'progress-step', 'progress-step-line', 'loader', 'loading', 'styled', 'top', 'top-start', 'top-end', 'top-left', 'top-right', 'center', 'center-start', 'center-end', 'center-left', 'center-right', 'bottom', 'bottom-start', 'bottom-end', 'bottom-left', 'bottom-right', 'grow-row', 'grow-column', 'grow-fullscreen', 'rtl', 'timer-progress-bar', 'timer-progress-bar-container', 'scrollbar-measure', 'icon-success', 'icon-warning', 'icon-info', 'icon-question', 'icon-error']);
  var iconTypes = prefix(['success', 'warning', 'info', 'question', 'error']);

  var getContainer = function getContainer() {
    return document.body.querySelector(".".concat(swalClasses.container));
  };
  var elementBySelector = function elementBySelector(selectorString) {
    var container = getContainer();
    return container ? container.querySelector(selectorString) : null;
  };

  var elementByClass = function elementByClass(className) {
    return elementBySelector(".".concat(className));
  };

  var getPopup = function getPopup() {
    return elementByClass(swalClasses.popup);
  };
  var getIcons = function getIcons() {
    var popup = getPopup();
    return toArray(popup.querySelectorAll(".".concat(swalClasses.icon)));
  };
  var getIcon = function getIcon() {
    var visibleIcon = getIcons().filter(function (icon) {
      return isVisible(icon);
    });
    return visibleIcon.length ? visibleIcon[0] : null;
  };
  var getTitle = function getTitle() {
    return elementByClass(swalClasses.title);
  };
  var getContent = function getContent() {
    return elementByClass(swalClasses.content);
  };
  var getHtmlContainer = function getHtmlContainer() {
    return elementByClass(swalClasses['html-container']);
  };
  var getImage = function getImage() {
    return elementByClass(swalClasses.image);
  };
  var getProgressSteps = function getProgressSteps() {
    return elementByClass(swalClasses['progress-steps']);
  };
  var getValidationMessage = function getValidationMessage() {
    return elementByClass(swalClasses['validation-message']);
  };
  var getConfirmButton = function getConfirmButton() {
    return elementBySelector(".".concat(swalClasses.actions, " .").concat(swalClasses.confirm));
  };
  var getDenyButton = function getDenyButton() {
    return elementBySelector(".".concat(swalClasses.actions, " .").concat(swalClasses.deny));
  };
  var getInputLabel = function getInputLabel() {
    return elementByClass(swalClasses['input-label']);
  };
  var getLoader = function getLoader() {
    return elementBySelector(".".concat(swalClasses.loader));
  };
  var getCancelButton = function getCancelButton() {
    return elementBySelector(".".concat(swalClasses.actions, " .").concat(swalClasses.cancel));
  };
  var getActions = function getActions() {
    return elementByClass(swalClasses.actions);
  };
  var getHeader = function getHeader() {
    return elementByClass(swalClasses.header);
  };
  var getFooter = function getFooter() {
    return elementByClass(swalClasses.footer);
  };
  var getTimerProgressBar = function getTimerProgressBar() {
    return elementByClass(swalClasses['timer-progress-bar']);
  };
  var getCloseButton = function getCloseButton() {
    return elementByClass(swalClasses.close);
  }; // https://github.com/jkup/focusable/blob/master/index.js

  var focusable = "\n  a[href],\n  area[href],\n  input:not([disabled]),\n  select:not([disabled]),\n  textarea:not([disabled]),\n  button:not([disabled]),\n  iframe,\n  object,\n  embed,\n  [tabindex=\"0\"],\n  [contenteditable],\n  audio[controls],\n  video[controls],\n  summary\n";
  var getFocusableElements = function getFocusableElements() {
    var focusableElementsWithTabindex = toArray(getPopup().querySelectorAll('[tabindex]:not([tabindex="-1"]):not([tabindex="0"])')) // sort according to tabindex
    .sort(function (a, b) {
      a = parseInt(a.getAttribute('tabindex'));
      b = parseInt(b.getAttribute('tabindex'));

      if (a > b) {
        return 1;
      } else if (a < b) {
        return -1;
      }

      return 0;
    });
    var otherFocusableElements = toArray(getPopup().querySelectorAll(focusable)).filter(function (el) {
      return el.getAttribute('tabindex') !== '-1';
    });
    return uniqueArray(focusableElementsWithTabindex.concat(otherFocusableElements)).filter(function (el) {
      return isVisible(el);
    });
  };
  var isModal = function isModal() {
    return !isToast() && !document.body.classList.contains(swalClasses['no-backdrop']);
  };
  var isToast = function isToast() {
    return document.body.classList.contains(swalClasses['toast-shown']);
  };
  var isLoading = function isLoading() {
    return getPopup().hasAttribute('data-loading');
  };

  var states = {
    previousBodyPadding: null
  };
  var setInnerHtml = function setInnerHtml(elem, html) {
    // #1926
    elem.textContent = '';

    if (html) {
      var parser = new DOMParser();
      var parsed = parser.parseFromString(html, "text/html");
      toArray(parsed.querySelector('head').childNodes).forEach(function (child) {
        elem.appendChild(child);
      });
      toArray(parsed.querySelector('body').childNodes).forEach(function (child) {
        elem.appendChild(child);
      });
    }
  };
  var hasClass = function hasClass(elem, className) {
    if (!className) {
      return false;
    }

    var classList = className.split(/\s+/);

    for (var i = 0; i < classList.length; i++) {
      if (!elem.classList.contains(classList[i])) {
        return false;
      }
    }

    return true;
  };

  var removeCustomClasses = function removeCustomClasses(elem, params) {
    toArray(elem.classList).forEach(function (className) {
      if (!(objectValues(swalClasses).indexOf(className) !== -1) && !(objectValues(iconTypes).indexOf(className) !== -1) && !(objectValues(params.showClass).indexOf(className) !== -1)) {
        elem.classList.remove(className);
      }
    });
  };

  var applyCustomClass = function applyCustomClass(elem, params, className) {
    removeCustomClasses(elem, params);

    if (params.customClass && params.customClass[className]) {
      if (typeof params.customClass[className] !== 'string' && !params.customClass[className].forEach) {
        return warn("Invalid type of customClass.".concat(className, "! Expected string or iterable object, got \"").concat(_typeof(params.customClass[className]), "\""));
      }

      addClass(elem, params.customClass[className]);
    }
  };
  function getInput(content, inputType) {
    if (!inputType) {
      return null;
    }

    switch (inputType) {
      case 'select':
      case 'textarea':
      case 'file':
        return getChildByClass(content, swalClasses[inputType]);

      case 'checkbox':
        return content.querySelector(".".concat(swalClasses.checkbox, " input"));

      case 'radio':
        return content.querySelector(".".concat(swalClasses.radio, " input:checked")) || content.querySelector(".".concat(swalClasses.radio, " input:first-child"));

      case 'range':
        return content.querySelector(".".concat(swalClasses.range, " input"));

      default:
        return getChildByClass(content, swalClasses.input);
    }
  }
  var focusInput = function focusInput(input) {
    input.focus(); // place cursor at end of text in text input

    if (input.type !== 'file') {
      // http://stackoverflow.com/a/2345915
      var val = input.value;
      input.value = '';
      input.value = val;
    }
  };
  var toggleClass = function toggleClass(target, classList, condition) {
    if (!target || !classList) {
      return;
    }

    if (typeof classList === 'string') {
      classList = classList.split(/\s+/).filter(Boolean);
    }

    classList.forEach(function (className) {
      if (target.forEach) {
        target.forEach(function (elem) {
          condition ? elem.classList.add(className) : elem.classList.remove(className);
        });
      } else {
        condition ? target.classList.add(className) : target.classList.remove(className);
      }
    });
  };
  var addClass = function addClass(target, classList) {
    toggleClass(target, classList, true);
  };
  var removeClass = function removeClass(target, classList) {
    toggleClass(target, classList, false);
  };
  var getChildByClass = function getChildByClass(elem, className) {
    for (var i = 0; i < elem.childNodes.length; i++) {
      if (hasClass(elem.childNodes[i], className)) {
        return elem.childNodes[i];
      }
    }
  };
  var applyNumericalStyle = function applyNumericalStyle(elem, property, value) {
    if (value === "".concat(parseInt(value))) {
      value = parseInt(value);
    }

    if (value || parseInt(value) === 0) {
      elem.style[property] = typeof value === 'number' ? "".concat(value, "px") : value;
    } else {
      elem.style.removeProperty(property);
    }
  };
  var show = function show(elem) {
    var display = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'flex';
    elem.style.display = display;
  };
  var hide = function hide(elem) {
    elem.style.display = 'none';
  };
  var setStyle = function setStyle(parent, selector, property, value) {
    var el = parent.querySelector(selector);

    if (el) {
      el.style[property] = value;
    }
  };
  var toggle = function toggle(elem, condition, display) {
    condition ? show(elem, display) : hide(elem);
  }; // borrowed from jquery $(elem).is(':visible') implementation

  var isVisible = function isVisible(elem) {
    return !!(elem && (elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length));
  };
  var allButtonsAreHidden = function allButtonsAreHidden() {
    return !isVisible(getConfirmButton()) && !isVisible(getDenyButton()) && !isVisible(getCancelButton());
  };
  var isScrollable = function isScrollable(elem) {
    return !!(elem.scrollHeight > elem.clientHeight);
  }; // borrowed from https://stackoverflow.com/a/46352119

  var hasCssAnimation = function hasCssAnimation(elem) {
    var style = window.getComputedStyle(elem);
    var animDuration = parseFloat(style.getPropertyValue('animation-duration') || '0');
    var transDuration = parseFloat(style.getPropertyValue('transition-duration') || '0');
    return animDuration > 0 || transDuration > 0;
  };
  var contains = function contains(haystack, needle) {
    if (typeof haystack.contains === 'function') {
      return haystack.contains(needle);
    }
  };
  var animateTimerProgressBar = function animateTimerProgressBar(timer) {
    var reset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var timerProgressBar = getTimerProgressBar();

    if (isVisible(timerProgressBar)) {
      if (reset) {
        timerProgressBar.style.transition = 'none';
        timerProgressBar.style.width = '100%';
      }

      setTimeout(function () {
        timerProgressBar.style.transition = "width ".concat(timer / 1000, "s linear");
        timerProgressBar.style.width = '0%';
      }, 10);
    }
  };
  var stopTimerProgressBar = function stopTimerProgressBar() {
    var timerProgressBar = getTimerProgressBar();
    var timerProgressBarWidth = parseInt(window.getComputedStyle(timerProgressBar).width);
    timerProgressBar.style.removeProperty('transition');
    timerProgressBar.style.width = '100%';
    var timerProgressBarFullWidth = parseInt(window.getComputedStyle(timerProgressBar).width);
    var timerProgressBarPercent = parseInt(timerProgressBarWidth / timerProgressBarFullWidth * 100);
    timerProgressBar.style.removeProperty('transition');
    timerProgressBar.style.width = "".concat(timerProgressBarPercent, "%");
  };

  // Detect Node env
  var isNodeEnv = function isNodeEnv() {
    return typeof window === 'undefined' || typeof document === 'undefined';
  };

  var sweetHTML = "\n <div aria-labelledby=\"".concat(swalClasses.title, "\" aria-describedby=\"").concat(swalClasses.content, "\" class=\"").concat(swalClasses.popup, "\" tabindex=\"-1\">\n   <div class=\"").concat(swalClasses.header, "\">\n     <ul class=\"").concat(swalClasses['progress-steps'], "\"></ul>\n     <div class=\"").concat(swalClasses.icon, " ").concat(iconTypes.error, "\"></div>\n     <div class=\"").concat(swalClasses.icon, " ").concat(iconTypes.question, "\"></div>\n     <div class=\"").concat(swalClasses.icon, " ").concat(iconTypes.warning, "\"></div>\n     <div class=\"").concat(swalClasses.icon, " ").concat(iconTypes.info, "\"></div>\n     <div class=\"").concat(swalClasses.icon, " ").concat(iconTypes.success, "\"></div>\n     <img class=\"").concat(swalClasses.image, "\" />\n     <h2 class=\"").concat(swalClasses.title, "\" id=\"").concat(swalClasses.title, "\"></h2>\n     <button type=\"button\" class=\"").concat(swalClasses.close, "\"></button>\n   </div>\n   <div class=\"").concat(swalClasses.content, "\">\n     <div id=\"").concat(swalClasses.content, "\" class=\"").concat(swalClasses['html-container'], "\"></div>\n     <input class=\"").concat(swalClasses.input, "\" />\n     <input type=\"file\" class=\"").concat(swalClasses.file, "\" />\n     <div class=\"").concat(swalClasses.range, "\">\n       <input type=\"range\" />\n       <output></output>\n     </div>\n     <select class=\"").concat(swalClasses.select, "\"></select>\n     <div class=\"").concat(swalClasses.radio, "\"></div>\n     <label for=\"").concat(swalClasses.checkbox, "\" class=\"").concat(swalClasses.checkbox, "\">\n       <input type=\"checkbox\" />\n       <span class=\"").concat(swalClasses.label, "\"></span>\n     </label>\n     <textarea class=\"").concat(swalClasses.textarea, "\"></textarea>\n     <div class=\"").concat(swalClasses['validation-message'], "\" id=\"").concat(swalClasses['validation-message'], "\"></div>\n   </div>\n   <div class=\"").concat(swalClasses.actions, "\">\n     <div class=\"").concat(swalClasses.loader, "\"></div>\n     <button type=\"button\" class=\"").concat(swalClasses.confirm, "\"></button>\n     <button type=\"button\" class=\"").concat(swalClasses.deny, "\"></button>\n     <button type=\"button\" class=\"").concat(swalClasses.cancel, "\"></button>\n   </div>\n   <div class=\"").concat(swalClasses.footer, "\"></div>\n   <div class=\"").concat(swalClasses['timer-progress-bar-container'], "\">\n     <div class=\"").concat(swalClasses['timer-progress-bar'], "\"></div>\n   </div>\n </div>\n").replace(/(^|\n)\s*/g, '');

  var resetOldContainer = function resetOldContainer() {
    var oldContainer = getContainer();

    if (!oldContainer) {
      return false;
    }

    oldContainer.parentNode.removeChild(oldContainer);
    removeClass([document.documentElement, document.body], [swalClasses['no-backdrop'], swalClasses['toast-shown'], swalClasses['has-column']]);
    return true;
  };

  var oldInputVal; // IE11 workaround, see #1109 for details

  var resetValidationMessage = function resetValidationMessage(e) {
    if (Swal.isVisible() && oldInputVal !== e.target.value) {
      Swal.resetValidationMessage();
    }

    oldInputVal = e.target.value;
  };

  var addInputChangeListeners = function addInputChangeListeners() {
    var content = getContent();
    var input = getChildByClass(content, swalClasses.input);
    var file = getChildByClass(content, swalClasses.file);
    var range = content.querySelector(".".concat(swalClasses.range, " input"));
    var rangeOutput = content.querySelector(".".concat(swalClasses.range, " output"));
    var select = getChildByClass(content, swalClasses.select);
    var checkbox = content.querySelector(".".concat(swalClasses.checkbox, " input"));
    var textarea = getChildByClass(content, swalClasses.textarea);
    input.oninput = resetValidationMessage;
    file.onchange = resetValidationMessage;
    select.onchange = resetValidationMessage;
    checkbox.onchange = resetValidationMessage;
    textarea.oninput = resetValidationMessage;

    range.oninput = function (e) {
      resetValidationMessage(e);
      rangeOutput.value = range.value;
    };

    range.onchange = function (e) {
      resetValidationMessage(e);
      range.nextSibling.value = range.value;
    };
  };

  var getTarget = function getTarget(target) {
    return typeof target === 'string' ? document.querySelector(target) : target;
  };

  var setupAccessibility = function setupAccessibility(params) {
    var popup = getPopup();
    popup.setAttribute('role', params.toast ? 'alert' : 'dialog');
    popup.setAttribute('aria-live', params.toast ? 'polite' : 'assertive');

    if (!params.toast) {
      popup.setAttribute('aria-modal', 'true');
    }
  };

  var setupRTL = function setupRTL(targetElement) {
    if (window.getComputedStyle(targetElement).direction === 'rtl') {
      addClass(getContainer(), swalClasses.rtl);
    }
  };
  /*
   * Add modal + backdrop to DOM
   */


  var init = function init(params) {
    // Clean up the old popup container if it exists
    var oldContainerExisted = resetOldContainer();
    /* istanbul ignore if */

    if (isNodeEnv()) {
      error('SweetAlert2 requires document to initialize');
      return;
    }

    var container = document.createElement('div');
    container.className = swalClasses.container;

    if (oldContainerExisted) {
      addClass(container, swalClasses['no-transition']);
    }

    setInnerHtml(container, sweetHTML);
    var targetElement = getTarget(params.target);
    targetElement.appendChild(container);
    setupAccessibility(params);
    setupRTL(targetElement);
    addInputChangeListeners();
  };

  var parseHtmlToContainer = function parseHtmlToContainer(param, target) {
    // DOM element
    if (param instanceof HTMLElement) {
      target.appendChild(param); // Object
    } else if (_typeof(param) === 'object') {
      handleObject(param, target); // Plain string
    } else if (param) {
      setInnerHtml(target, param);
    }
  };

  var handleObject = function handleObject(param, target) {
    // JQuery element(s)
    if (param.jquery) {
      handleJqueryElem(target, param); // For other objects use their string representation
    } else {
      setInnerHtml(target, param.toString());
    }
  };

  var handleJqueryElem = function handleJqueryElem(target, elem) {
    target.textContent = '';

    if (0 in elem) {
      for (var i = 0; (i in elem); i++) {
        target.appendChild(elem[i].cloneNode(true));
      }
    } else {
      target.appendChild(elem.cloneNode(true));
    }
  };

  var animationEndEvent = function () {
    // Prevent run in Node env

    /* istanbul ignore if */
    if (isNodeEnv()) {
      return false;
    }

    var testEl = document.createElement('div');
    var transEndEventNames = {
      WebkitAnimation: 'webkitAnimationEnd',
      OAnimation: 'oAnimationEnd oanimationend',
      animation: 'animationend'
    };

    for (var i in transEndEventNames) {
      if (Object.prototype.hasOwnProperty.call(transEndEventNames, i) && typeof testEl.style[i] !== 'undefined') {
        return transEndEventNames[i];
      }
    }

    return false;
  }();

  // https://github.com/twbs/bootstrap/blob/master/js/src/modal.js

  var measureScrollbar = function measureScrollbar() {
    var scrollDiv = document.createElement('div');
    scrollDiv.className = swalClasses['scrollbar-measure'];
    document.body.appendChild(scrollDiv);
    var scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    return scrollbarWidth;
  };

  var renderActions = function renderActions(instance, params) {
    var actions = getActions();
    var loader = getLoader();
    var confirmButton = getConfirmButton();
    var denyButton = getDenyButton();
    var cancelButton = getCancelButton(); // Actions (buttons) wrapper

    if (!params.showConfirmButton && !params.showDenyButton && !params.showCancelButton) {
      hide(actions);
    } // Custom class


    applyCustomClass(actions, params, 'actions'); // Render buttons

    renderButton(confirmButton, 'confirm', params);
    renderButton(denyButton, 'deny', params);
    renderButton(cancelButton, 'cancel', params);
    handleButtonsStyling(confirmButton, denyButton, cancelButton, params);

    if (params.reverseButtons) {
      actions.insertBefore(cancelButton, loader);
      actions.insertBefore(denyButton, loader);
      actions.insertBefore(confirmButton, loader);
    } // Loader


    setInnerHtml(loader, params.loaderHtml);
    applyCustomClass(loader, params, 'loader');
  };

  function handleButtonsStyling(confirmButton, denyButton, cancelButton, params) {
    if (!params.buttonsStyling) {
      return removeClass([confirmButton, denyButton, cancelButton], swalClasses.styled);
    }

    addClass([confirmButton, denyButton, cancelButton], swalClasses.styled); // Buttons background colors

    if (params.confirmButtonColor) {
      confirmButton.style.backgroundColor = params.confirmButtonColor;
    }

    if (params.denyButtonColor) {
      denyButton.style.backgroundColor = params.denyButtonColor;
    }

    if (params.cancelButtonColor) {
      cancelButton.style.backgroundColor = params.cancelButtonColor;
    }
  }

  function renderButton(button, buttonType, params) {
    toggle(button, params["show".concat(capitalizeFirstLetter(buttonType), "Button")], 'inline-block');
    setInnerHtml(button, params["".concat(buttonType, "ButtonText")]); // Set caption text

    button.setAttribute('aria-label', params["".concat(buttonType, "ButtonAriaLabel")]); // ARIA label
    // Add buttons custom classes

    button.className = swalClasses[buttonType];
    applyCustomClass(button, params, "".concat(buttonType, "Button"));
    addClass(button, params["".concat(buttonType, "ButtonClass")]);
  }

  function handleBackdropParam(container, backdrop) {
    if (typeof backdrop === 'string') {
      container.style.background = backdrop;
    } else if (!backdrop) {
      addClass([document.documentElement, document.body], swalClasses['no-backdrop']);
    }
  }

  function handlePositionParam(container, position) {
    if (position in swalClasses) {
      addClass(container, swalClasses[position]);
    } else {
      warn('The "position" parameter is not valid, defaulting to "center"');
      addClass(container, swalClasses.center);
    }
  }

  function handleGrowParam(container, grow) {
    if (grow && typeof grow === 'string') {
      var growClass = "grow-".concat(grow);

      if (growClass in swalClasses) {
        addClass(container, swalClasses[growClass]);
      }
    }
  }

  var renderContainer = function renderContainer(instance, params) {
    var container = getContainer();

    if (!container) {
      return;
    }

    handleBackdropParam(container, params.backdrop);

    if (!params.backdrop && params.allowOutsideClick) {
      warn('"allowOutsideClick" parameter requires `backdrop` parameter to be set to `true`');
    }

    handlePositionParam(container, params.position);
    handleGrowParam(container, params.grow); // Custom class

    applyCustomClass(container, params, 'container'); // Set queue step attribute for getQueueStep() method

    var queueStep = document.body.getAttribute('data-swal2-queue-step');

    if (queueStep) {
      container.setAttribute('data-queue-step', queueStep);
      document.body.removeAttribute('data-swal2-queue-step');
    }
  };

  /**
   * This module containts `WeakMap`s for each effectively-"private  property" that a `Swal` has.
   * For example, to set the private property "foo" of `this` to "bar", you can `privateProps.foo.set(this, 'bar')`
   * This is the approach that Babel will probably take to implement private methods/fields
   *   https://github.com/tc39/proposal-private-methods
   *   https://github.com/babel/babel/pull/7555
   * Once we have the changes from that PR in Babel, and our core class fits reasonable in *one module*
   *   then we can use that language feature.
   */
  var privateProps = {
    promise: new WeakMap(),
    innerParams: new WeakMap(),
    domCache: new WeakMap()
  };

  var inputTypes = ['input', 'file', 'range', 'select', 'radio', 'checkbox', 'textarea'];
  var renderInput = function renderInput(instance, params) {
    var content = getContent();
    var innerParams = privateProps.innerParams.get(instance);
    var rerender = !innerParams || params.input !== innerParams.input;
    inputTypes.forEach(function (inputType) {
      var inputClass = swalClasses[inputType];
      var inputContainer = getChildByClass(content, inputClass); // set attributes

      setAttributes(inputType, params.inputAttributes); // set class

      inputContainer.className = inputClass;

      if (rerender) {
        hide(inputContainer);
      }
    });

    if (params.input) {
      if (rerender) {
        showInput(params);
      } // set custom class


      setCustomClass(params);
    }
  };

  var showInput = function showInput(params) {
    if (!renderInputType[params.input]) {
      return error("Unexpected type of input! Expected \"text\", \"email\", \"password\", \"number\", \"tel\", \"select\", \"radio\", \"checkbox\", \"textarea\", \"file\" or \"url\", got \"".concat(params.input, "\""));
    }

    var inputContainer = getInputContainer(params.input);
    var input = renderInputType[params.input](inputContainer, params);
    show(input); // input autofocus

    setTimeout(function () {
      focusInput(input);
    });
  };

  var removeAttributes = function removeAttributes(input) {
    for (var i = 0; i < input.attributes.length; i++) {
      var attrName = input.attributes[i].name;

      if (!(['type', 'value', 'style'].indexOf(attrName) !== -1)) {
        input.removeAttribute(attrName);
      }
    }
  };

  var setAttributes = function setAttributes(inputType, inputAttributes) {
    var input = getInput(getContent(), inputType);

    if (!input) {
      return;
    }

    removeAttributes(input);

    for (var attr in inputAttributes) {
      // Do not set a placeholder for <input type="range">
      // it'll crash Edge, #1298
      if (inputType === 'range' && attr === 'placeholder') {
        continue;
      }

      input.setAttribute(attr, inputAttributes[attr]);
    }
  };

  var setCustomClass = function setCustomClass(params) {
    var inputContainer = getInputContainer(params.input);

    if (params.customClass) {
      addClass(inputContainer, params.customClass.input);
    }
  };

  var setInputPlaceholder = function setInputPlaceholder(input, params) {
    if (!input.placeholder || params.inputPlaceholder) {
      input.placeholder = params.inputPlaceholder;
    }
  };

  var setInputLabel = function setInputLabel(input, prependTo, params) {
    if (params.inputLabel) {
      input.id = swalClasses.input;
      var label = document.createElement('label');
      var labelClass = swalClasses['input-label'];
      label.setAttribute('for', input.id);
      label.className = labelClass;
      label.innerText = params.inputLabel;
      prependTo.insertAdjacentElement('beforebegin', label);
    }
  };

  var getInputContainer = function getInputContainer(inputType) {
    var inputClass = swalClasses[inputType] ? swalClasses[inputType] : swalClasses.input;
    return getChildByClass(getContent(), inputClass);
  };

  var renderInputType = {};

  renderInputType.text = renderInputType.email = renderInputType.password = renderInputType.number = renderInputType.tel = renderInputType.url = function (input, params) {
    if (typeof params.inputValue === 'string' || typeof params.inputValue === 'number') {
      input.value = params.inputValue;
    } else if (!isPromise(params.inputValue)) {
      warn("Unexpected type of inputValue! Expected \"string\", \"number\" or \"Promise\", got \"".concat(_typeof(params.inputValue), "\""));
    }

    setInputLabel(input, input, params);
    setInputPlaceholder(input, params);
    input.type = params.input;
    return input;
  };

  renderInputType.file = function (input, params) {
    setInputLabel(input, input, params);
    setInputPlaceholder(input, params);
    return input;
  };

  renderInputType.range = function (range, params) {
    var rangeInput = range.querySelector('input');
    var rangeOutput = range.querySelector('output');
    rangeInput.value = params.inputValue;
    rangeInput.type = params.input;
    rangeOutput.value = params.inputValue;
    setInputLabel(rangeInput, range, params);
    return range;
  };

  renderInputType.select = function (select, params) {
    select.textContent = '';

    if (params.inputPlaceholder) {
      var placeholder = document.createElement('option');
      setInnerHtml(placeholder, params.inputPlaceholder);
      placeholder.value = '';
      placeholder.disabled = true;
      placeholder.selected = true;
      select.appendChild(placeholder);
    }

    setInputLabel(select, select, params);
    return select;
  };

  renderInputType.radio = function (radio) {
    radio.textContent = '';
    return radio;
  };

  renderInputType.checkbox = function (checkboxContainer, params) {
    var checkbox = getInput(getContent(), 'checkbox');
    checkbox.value = 1;
    checkbox.id = swalClasses.checkbox;
    checkbox.checked = Boolean(params.inputValue);
    var label = checkboxContainer.querySelector('span');
    setInnerHtml(label, params.inputPlaceholder);
    return checkboxContainer;
  };

  renderInputType.textarea = function (textarea, params) {
    textarea.value = params.inputValue;
    setInputPlaceholder(textarea, params);
    setInputLabel(textarea, textarea, params);

    var getPadding = function getPadding(el) {
      return parseInt(window.getComputedStyle(el).paddingLeft) + parseInt(window.getComputedStyle(el).paddingRight);
    };

    if ('MutationObserver' in window) {
      // #1699
      var initialPopupWidth = parseInt(window.getComputedStyle(getPopup()).width);

      var outputsize = function outputsize() {
        var contentWidth = textarea.offsetWidth + getPadding(getPopup()) + getPadding(getContent());

        if (contentWidth > initialPopupWidth) {
          getPopup().style.width = "".concat(contentWidth, "px");
        } else {
          getPopup().style.width = null;
        }
      };

      new MutationObserver(outputsize).observe(textarea, {
        attributes: true,
        attributeFilter: ['style']
      });
    }

    return textarea;
  };

  var renderContent = function renderContent(instance, params) {
    var content = getContent().querySelector("#".concat(swalClasses.content)); // Content as HTML

    if (params.html) {
      parseHtmlToContainer(params.html, content);
      show(content, 'block'); // Content as plain text
    } else if (params.text) {
      content.textContent = params.text;
      show(content, 'block'); // No content
    } else {
      hide(content);
    }

    renderInput(instance, params); // Custom class

    applyCustomClass(getContent(), params, 'content');
  };

  var renderFooter = function renderFooter(instance, params) {
    var footer = getFooter();
    toggle(footer, params.footer);

    if (params.footer) {
      parseHtmlToContainer(params.footer, footer);
    } // Custom class


    applyCustomClass(footer, params, 'footer');
  };

  var renderCloseButton = function renderCloseButton(instance, params) {
    var closeButton = getCloseButton();
    setInnerHtml(closeButton, params.closeButtonHtml); // Custom class

    applyCustomClass(closeButton, params, 'closeButton');
    toggle(closeButton, params.showCloseButton);
    closeButton.setAttribute('aria-label', params.closeButtonAriaLabel);
  };

  var renderIcon = function renderIcon(instance, params) {
    var innerParams = privateProps.innerParams.get(instance); // if the given icon already rendered, apply the styling without re-rendering the icon

    if (innerParams && params.icon === innerParams.icon && getIcon()) {
      applyStyles(getIcon(), params);
      return;
    }

    hideAllIcons();

    if (!params.icon) {
      return;
    }

    if (Object.keys(iconTypes).indexOf(params.icon) !== -1) {
      var icon = elementBySelector(".".concat(swalClasses.icon, ".").concat(iconTypes[params.icon]));
      show(icon); // Custom or default content

      setContent(icon, params);
      applyStyles(icon, params); // Animate icon

      addClass(icon, params.showClass.icon);
    } else {
      error("Unknown icon! Expected \"success\", \"error\", \"warning\", \"info\" or \"question\", got \"".concat(params.icon, "\""));
    }
  };

  var hideAllIcons = function hideAllIcons() {
    var icons = getIcons();

    for (var i = 0; i < icons.length; i++) {
      hide(icons[i]);
    }
  };

  var applyStyles = function applyStyles(icon, params) {
    // Icon color
    setColor(icon, params); // Success icon background color

    adjustSuccessIconBackgoundColor(); // Custom class

    applyCustomClass(icon, params, 'icon');
  }; // Adjust success icon background color to match the popup background color


  var adjustSuccessIconBackgoundColor = function adjustSuccessIconBackgoundColor() {
    var popup = getPopup();
    var popupBackgroundColor = window.getComputedStyle(popup).getPropertyValue('background-color');
    var successIconParts = popup.querySelectorAll('[class^=swal2-success-circular-line], .swal2-success-fix');

    for (var i = 0; i < successIconParts.length; i++) {
      successIconParts[i].style.backgroundColor = popupBackgroundColor;
    }
  };

  var setContent = function setContent(icon, params) {
    icon.textContent = '';

    if (params.iconHtml) {
      setInnerHtml(icon, iconContent(params.iconHtml));
    } else if (params.icon === 'success') {
      setInnerHtml(icon, "\n      <div class=\"swal2-success-circular-line-left\"></div>\n      <span class=\"swal2-success-line-tip\"></span> <span class=\"swal2-success-line-long\"></span>\n      <div class=\"swal2-success-ring\"></div> <div class=\"swal2-success-fix\"></div>\n      <div class=\"swal2-success-circular-line-right\"></div>\n    ");
    } else if (params.icon === 'error') {
      setInnerHtml(icon, "\n      <span class=\"swal2-x-mark\">\n        <span class=\"swal2-x-mark-line-left\"></span>\n        <span class=\"swal2-x-mark-line-right\"></span>\n      </span>\n    ");
    } else {
      var defaultIconHtml = {
        question: '?',
        warning: '!',
        info: 'i'
      };
      setInnerHtml(icon, iconContent(defaultIconHtml[params.icon]));
    }
  };

  var setColor = function setColor(icon, params) {
    if (!params.iconColor) {
      return;
    }

    icon.style.color = params.iconColor;
    icon.style.borderColor = params.iconColor;

    for (var _i = 0, _arr = ['.swal2-success-line-tip', '.swal2-success-line-long', '.swal2-x-mark-line-left', '.swal2-x-mark-line-right']; _i < _arr.length; _i++) {
      var sel = _arr[_i];
      setStyle(icon, sel, 'backgroundColor', params.iconColor);
    }

    setStyle(icon, '.swal2-success-ring', 'borderColor', params.iconColor);
  };

  var iconContent = function iconContent(content) {
    return "<div class=\"".concat(swalClasses['icon-content'], "\">").concat(content, "</div>");
  };

  var renderImage = function renderImage(instance, params) {
    var image = getImage();

    if (!params.imageUrl) {
      return hide(image);
    }

    show(image, ''); // Src, alt

    image.setAttribute('src', params.imageUrl);
    image.setAttribute('alt', params.imageAlt); // Width, height

    applyNumericalStyle(image, 'width', params.imageWidth);
    applyNumericalStyle(image, 'height', params.imageHeight); // Class

    image.className = swalClasses.image;
    applyCustomClass(image, params, 'image');
  };

  var currentSteps = [];
  /*
   * Global function for chaining sweetAlert popups
   */

  var queue = function queue(steps) {
    var Swal = this;
    currentSteps = steps;

    var resetAndResolve = function resetAndResolve(resolve, value) {
      currentSteps = [];
      resolve(value);
    };

    var queueResult = [];
    return new Promise(function (resolve) {
      (function step(i, callback) {
        if (i < currentSteps.length) {
          document.body.setAttribute('data-swal2-queue-step', i);
          Swal.fire(currentSteps[i]).then(function (result) {
            if (typeof result.value !== 'undefined') {
              queueResult.push(result.value);
              step(i + 1);
            } else {
              resetAndResolve(resolve, {
                dismiss: result.dismiss
              });
            }
          });
        } else {
          resetAndResolve(resolve, {
            value: queueResult
          });
        }
      })(0);
    });
  };
  /*
   * Global function for getting the index of current popup in queue
   */

  var getQueueStep = function getQueueStep() {
    return getContainer() && getContainer().getAttribute('data-queue-step');
  };
  /*
   * Global function for inserting a popup to the queue
   */

  var insertQueueStep = function insertQueueStep(step, index) {
    if (index && index < currentSteps.length) {
      return currentSteps.splice(index, 0, step);
    }

    return currentSteps.push(step);
  };
  /*
   * Global function for deleting a popup from the queue
   */

  var deleteQueueStep = function deleteQueueStep(index) {
    if (typeof currentSteps[index] !== 'undefined') {
      currentSteps.splice(index, 1);
    }
  };

  var createStepElement = function createStepElement(step) {
    var stepEl = document.createElement('li');
    addClass(stepEl, swalClasses['progress-step']);
    setInnerHtml(stepEl, step);
    return stepEl;
  };

  var createLineElement = function createLineElement(params) {
    var lineEl = document.createElement('li');
    addClass(lineEl, swalClasses['progress-step-line']);

    if (params.progressStepsDistance) {
      lineEl.style.width = params.progressStepsDistance;
    }

    return lineEl;
  };

  var renderProgressSteps = function renderProgressSteps(instance, params) {
    var progressStepsContainer = getProgressSteps();

    if (!params.progressSteps || params.progressSteps.length === 0) {
      return hide(progressStepsContainer);
    }

    show(progressStepsContainer);
    progressStepsContainer.textContent = '';
    var currentProgressStep = parseInt(params.currentProgressStep === undefined ? getQueueStep() : params.currentProgressStep);

    if (currentProgressStep >= params.progressSteps.length) {
      warn('Invalid currentProgressStep parameter, it should be less than progressSteps.length ' + '(currentProgressStep like JS arrays starts from 0)');
    }

    params.progressSteps.forEach(function (step, index) {
      var stepEl = createStepElement(step);
      progressStepsContainer.appendChild(stepEl);

      if (index === currentProgressStep) {
        addClass(stepEl, swalClasses['active-progress-step']);
      }

      if (index !== params.progressSteps.length - 1) {
        var lineEl = createLineElement(params);
        progressStepsContainer.appendChild(lineEl);
      }
    });
  };

  var renderTitle = function renderTitle(instance, params) {
    var title = getTitle();
    toggle(title, params.title || params.titleText);

    if (params.title) {
      parseHtmlToContainer(params.title, title);
    }

    if (params.titleText) {
      title.innerText = params.titleText;
    } // Custom class


    applyCustomClass(title, params, 'title');
  };

  var renderHeader = function renderHeader(instance, params) {
    var header = getHeader(); // Custom class

    applyCustomClass(header, params, 'header'); // Progress steps

    renderProgressSteps(instance, params); // Icon

    renderIcon(instance, params); // Image

    renderImage(instance, params); // Title

    renderTitle(instance, params); // Close button

    renderCloseButton(instance, params);
  };

  var renderPopup = function renderPopup(instance, params) {
    var popup = getPopup(); // Width

    applyNumericalStyle(popup, 'width', params.width); // Padding

    applyNumericalStyle(popup, 'padding', params.padding); // Background

    if (params.background) {
      popup.style.background = params.background;
    } // Classes


    addClasses(popup, params);
  };

  var addClasses = function addClasses(popup, params) {
    // Default Class + showClass when updating Swal.update({})
    popup.className = "".concat(swalClasses.popup, " ").concat(isVisible(popup) ? params.showClass.popup : '');

    if (params.toast) {
      addClass([document.documentElement, document.body], swalClasses['toast-shown']);
      addClass(popup, swalClasses.toast);
    } else {
      addClass(popup, swalClasses.modal);
    } // Custom class


    applyCustomClass(popup, params, 'popup');

    if (typeof params.customClass === 'string') {
      addClass(popup, params.customClass);
    } // Icon class (#1842)


    if (params.icon) {
      addClass(popup, swalClasses["icon-".concat(params.icon)]);
    }
  };

  var render = function render(instance, params) {
    renderPopup(instance, params);
    renderContainer(instance, params);
    renderHeader(instance, params);
    renderContent(instance, params);
    renderActions(instance, params);
    renderFooter(instance, params);

    if (typeof params.didRender === 'function') {
      params.didRender(getPopup());
    } else if (typeof params.onRender === 'function') {
      params.onRender(getPopup()); // @deprecated
    }
  };

  /*
   * Global function to determine if SweetAlert2 popup is shown
   */

  var isVisible$1 = function isVisible$$1() {
    return isVisible(getPopup());
  };
  /*
   * Global function to click 'Confirm' button
   */

  var clickConfirm = function clickConfirm() {
    return getConfirmButton() && getConfirmButton().click();
  };
  /*
   * Global function to click 'Deny' button
   */

  var clickDeny = function clickDeny() {
    return getDenyButton() && getDenyButton().click();
  };
  /*
   * Global function to click 'Cancel' button
   */

  var clickCancel = function clickCancel() {
    return getCancelButton() && getCancelButton().click();
  };

  function fire() {
    var Swal = this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _construct(Swal, args);
  }

  /**
   * Returns an extended version of `Swal` containing `params` as defaults.
   * Useful for reusing Swal configuration.
   *
   * For example:
   *
   * Before:
   * const textPromptOptions = { input: 'text', showCancelButton: true }
   * const {value: firstName} = await Swal.fire({ ...textPromptOptions, title: 'What is your first name?' })
   * const {value: lastName} = await Swal.fire({ ...textPromptOptions, title: 'What is your last name?' })
   *
   * After:
   * const TextPrompt = Swal.mixin({ input: 'text', showCancelButton: true })
   * const {value: firstName} = await TextPrompt('What is your first name?')
   * const {value: lastName} = await TextPrompt('What is your last name?')
   *
   * @param mixinParams
   */
  function mixin(mixinParams) {
    var MixinSwal = /*#__PURE__*/function (_this) {
      _inherits(MixinSwal, _this);

      var _super = _createSuper(MixinSwal);

      function MixinSwal() {
        _classCallCheck(this, MixinSwal);

        return _super.apply(this, arguments);
      }

      _createClass(MixinSwal, [{
        key: "_main",
        value: function _main(params, prevMixinParams) {
          return _get(_getPrototypeOf(MixinSwal.prototype), "_main", this).call(this, params, _extends({}, prevMixinParams, mixinParams));
        }
      }]);

      return MixinSwal;
    }(this);

    return MixinSwal;
  }

  /**
   * Shows loader (spinner), this is useful with AJAX requests.
   * By default the loader be shown instead of the "Confirm" button.
   */

  var showLoading = function showLoading(buttonToReplace) {
    var popup = getPopup();

    if (!popup) {
      Swal.fire();
    }

    popup = getPopup();
    var actions = getActions();
    var loader = getLoader();

    if (!buttonToReplace && isVisible(getConfirmButton())) {
      buttonToReplace = getConfirmButton();
    }

    show(actions);

    if (buttonToReplace) {
      hide(buttonToReplace);
      loader.setAttribute('data-button-to-replace', buttonToReplace.className);
    }

    loader.parentNode.insertBefore(loader, buttonToReplace);
    addClass([popup, actions], swalClasses.loading);
    show(loader);
    popup.setAttribute('data-loading', true);
    popup.setAttribute('aria-busy', true);
    popup.focus();
  };

  var RESTORE_FOCUS_TIMEOUT = 100;

  var globalState = {};

  var focusPreviousActiveElement = function focusPreviousActiveElement() {
    if (globalState.previousActiveElement && globalState.previousActiveElement.focus) {
      globalState.previousActiveElement.focus();
      globalState.previousActiveElement = null;
    } else if (document.body) {
      document.body.focus();
    }
  }; // Restore previous active (focused) element


  var restoreActiveElement = function restoreActiveElement() {
    return new Promise(function (resolve) {
      var x = window.scrollX;
      var y = window.scrollY;
      globalState.restoreFocusTimeout = setTimeout(function () {
        focusPreviousActiveElement();
        resolve();
      }, RESTORE_FOCUS_TIMEOUT); // issues/900

      /* istanbul ignore if */

      if (typeof x !== 'undefined' && typeof y !== 'undefined') {
        // IE doesn't have scrollX/scrollY support
        window.scrollTo(x, y);
      }
    });
  };

  /**
   * If `timer` parameter is set, returns number of milliseconds of timer remained.
   * Otherwise, returns undefined.
   */

  var getTimerLeft = function getTimerLeft() {
    return globalState.timeout && globalState.timeout.getTimerLeft();
  };
  /**
   * Stop timer. Returns number of milliseconds of timer remained.
   * If `timer` parameter isn't set, returns undefined.
   */

  var stopTimer = function stopTimer() {
    if (globalState.timeout) {
      stopTimerProgressBar();
      return globalState.timeout.stop();
    }
  };
  /**
   * Resume timer. Returns number of milliseconds of timer remained.
   * If `timer` parameter isn't set, returns undefined.
   */

  var resumeTimer = function resumeTimer() {
    if (globalState.timeout) {
      var remaining = globalState.timeout.start();
      animateTimerProgressBar(remaining);
      return remaining;
    }
  };
  /**
   * Resume timer. Returns number of milliseconds of timer remained.
   * If `timer` parameter isn't set, returns undefined.
   */

  var toggleTimer = function toggleTimer() {
    var timer = globalState.timeout;
    return timer && (timer.running ? stopTimer() : resumeTimer());
  };
  /**
   * Increase timer. Returns number of milliseconds of an updated timer.
   * If `timer` parameter isn't set, returns undefined.
   */

  var increaseTimer = function increaseTimer(n) {
    if (globalState.timeout) {
      var remaining = globalState.timeout.increase(n);
      animateTimerProgressBar(remaining, true);
      return remaining;
    }
  };
  /**
   * Check if timer is running. Returns true if timer is running
   * or false if timer is paused or stopped.
   * If `timer` parameter isn't set, returns undefined
   */

  var isTimerRunning = function isTimerRunning() {
    return globalState.timeout && globalState.timeout.isRunning();
  };

  var bodyClickListenerAdded = false;
  var clickHandlers = {};
  function bindClickHandler() {
    var attr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'data-swal-template';
    clickHandlers[attr] = this;

    if (!bodyClickListenerAdded) {
      document.body.addEventListener('click', bodyClickListener);
      bodyClickListenerAdded = true;
    }
  }

  var bodyClickListener = function bodyClickListener(event) {
    // 1. using .parentNode instead of event.path because of better support by old browsers https://stackoverflow.com/a/39245638
    // 2. using .parentNode instead of .parentElement because of IE11 + SVG https://stackoverflow.com/a/36270354
    for (var el = event.target; el && el !== document; el = el.parentNode) {
      for (var attr in clickHandlers) {
        var template = el.getAttribute(attr);

        if (template) {
          clickHandlers[attr].fire({
            template: template
          });
          return;
        }
      }
    }
  };

  var defaultParams = {
    title: '',
    titleText: '',
    text: '',
    html: '',
    footer: '',
    icon: undefined,
    iconColor: undefined,
    iconHtml: undefined,
    template: undefined,
    toast: false,
    animation: true,
    showClass: {
      popup: 'swal2-show',
      backdrop: 'swal2-backdrop-show',
      icon: 'swal2-icon-show'
    },
    hideClass: {
      popup: 'swal2-hide',
      backdrop: 'swal2-backdrop-hide',
      icon: 'swal2-icon-hide'
    },
    customClass: {},
    target: 'body',
    backdrop: true,
    heightAuto: true,
    allowOutsideClick: true,
    allowEscapeKey: true,
    allowEnterKey: true,
    stopKeydownPropagation: true,
    keydownListenerCapture: false,
    showConfirmButton: true,
    showDenyButton: false,
    showCancelButton: false,
    preConfirm: undefined,
    preDeny: undefined,
    confirmButtonText: 'OK',
    confirmButtonAriaLabel: '',
    confirmButtonColor: undefined,
    denyButtonText: 'No',
    denyButtonAriaLabel: '',
    denyButtonColor: undefined,
    cancelButtonText: 'Cancel',
    cancelButtonAriaLabel: '',
    cancelButtonColor: undefined,
    buttonsStyling: true,
    reverseButtons: false,
    focusConfirm: true,
    focusDeny: false,
    focusCancel: false,
    showCloseButton: false,
    closeButtonHtml: '&times;',
    closeButtonAriaLabel: 'Close this dialog',
    loaderHtml: '',
    showLoaderOnConfirm: false,
    imageUrl: undefined,
    imageWidth: undefined,
    imageHeight: undefined,
    imageAlt: '',
    timer: undefined,
    timerProgressBar: false,
    width: undefined,
    padding: undefined,
    background: undefined,
    input: undefined,
    inputPlaceholder: '',
    inputLabel: '',
    inputValue: '',
    inputOptions: {},
    inputAutoTrim: true,
    inputAttributes: {},
    inputValidator: undefined,
    returnInputValueOnDeny: false,
    validationMessage: undefined,
    grow: false,
    position: 'center',
    progressSteps: [],
    currentProgressStep: undefined,
    progressStepsDistance: undefined,
    onBeforeOpen: undefined,
    onOpen: undefined,
    willOpen: undefined,
    didOpen: undefined,
    onRender: undefined,
    didRender: undefined,
    onClose: undefined,
    onAfterClose: undefined,
    willClose: undefined,
    didClose: undefined,
    onDestroy: undefined,
    didDestroy: undefined,
    scrollbarPadding: true
  };
  var updatableParams = ['allowEscapeKey', 'allowOutsideClick', 'background', 'buttonsStyling', 'cancelButtonAriaLabel', 'cancelButtonColor', 'cancelButtonText', 'closeButtonAriaLabel', 'closeButtonHtml', 'confirmButtonAriaLabel', 'confirmButtonColor', 'confirmButtonText', 'currentProgressStep', 'customClass', 'denyButtonAriaLabel', 'denyButtonColor', 'denyButtonText', 'didClose', 'didDestroy', 'footer', 'hideClass', 'html', 'icon', 'iconColor', 'imageAlt', 'imageHeight', 'imageUrl', 'imageWidth', 'onAfterClose', 'onClose', 'onDestroy', 'progressSteps', 'reverseButtons', 'showCancelButton', 'showCloseButton', 'showConfirmButton', 'showDenyButton', 'text', 'title', 'titleText', 'willClose'];
  var deprecatedParams = {
    animation: 'showClass" and "hideClass',
    onBeforeOpen: 'willOpen',
    onOpen: 'didOpen',
    onRender: 'didRender',
    onClose: 'willClose',
    onAfterClose: 'didClose',
    onDestroy: 'didDestroy'
  };
  var toastIncompatibleParams = ['allowOutsideClick', 'allowEnterKey', 'backdrop', 'focusConfirm', 'focusDeny', 'focusCancel', 'heightAuto', 'keydownListenerCapture'];
  /**
   * Is valid parameter
   * @param {String} paramName
   */

  var isValidParameter = function isValidParameter(paramName) {
    return Object.prototype.hasOwnProperty.call(defaultParams, paramName);
  };
  /**
   * Is valid parameter for Swal.update() method
   * @param {String} paramName
   */

  var isUpdatableParameter = function isUpdatableParameter(paramName) {
    return updatableParams.indexOf(paramName) !== -1;
  };
  /**
   * Is deprecated parameter
   * @param {String} paramName
   */

  var isDeprecatedParameter = function isDeprecatedParameter(paramName) {
    return deprecatedParams[paramName];
  };

  var checkIfParamIsValid = function checkIfParamIsValid(param) {
    if (!isValidParameter(param)) {
      warn("Unknown parameter \"".concat(param, "\""));
    }
  };

  var checkIfToastParamIsValid = function checkIfToastParamIsValid(param) {
    if (toastIncompatibleParams.indexOf(param) !== -1) {
      warn("The parameter \"".concat(param, "\" is incompatible with toasts"));
    }
  };

  var checkIfParamIsDeprecated = function checkIfParamIsDeprecated(param) {
    if (isDeprecatedParameter(param)) {
      warnAboutDeprecation(param, isDeprecatedParameter(param));
    }
  };
  /**
   * Show relevant warnings for given params
   *
   * @param params
   */


  var showWarningsForParams = function showWarningsForParams(params) {
    for (var param in params) {
      checkIfParamIsValid(param);

      if (params.toast) {
        checkIfToastParamIsValid(param);
      }

      checkIfParamIsDeprecated(param);
    }
  };



  var staticMethods = /*#__PURE__*/Object.freeze({
    isValidParameter: isValidParameter,
    isUpdatableParameter: isUpdatableParameter,
    isDeprecatedParameter: isDeprecatedParameter,
    argsToParams: argsToParams,
    isVisible: isVisible$1,
    clickConfirm: clickConfirm,
    clickDeny: clickDeny,
    clickCancel: clickCancel,
    getContainer: getContainer,
    getPopup: getPopup,
    getTitle: getTitle,
    getContent: getContent,
    getHtmlContainer: getHtmlContainer,
    getImage: getImage,
    getIcon: getIcon,
    getIcons: getIcons,
    getInputLabel: getInputLabel,
    getCloseButton: getCloseButton,
    getActions: getActions,
    getConfirmButton: getConfirmButton,
    getDenyButton: getDenyButton,
    getCancelButton: getCancelButton,
    getLoader: getLoader,
    getHeader: getHeader,
    getFooter: getFooter,
    getTimerProgressBar: getTimerProgressBar,
    getFocusableElements: getFocusableElements,
    getValidationMessage: getValidationMessage,
    isLoading: isLoading,
    fire: fire,
    mixin: mixin,
    queue: queue,
    getQueueStep: getQueueStep,
    insertQueueStep: insertQueueStep,
    deleteQueueStep: deleteQueueStep,
    showLoading: showLoading,
    enableLoading: showLoading,
    getTimerLeft: getTimerLeft,
    stopTimer: stopTimer,
    resumeTimer: resumeTimer,
    toggleTimer: toggleTimer,
    increaseTimer: increaseTimer,
    isTimerRunning: isTimerRunning,
    bindClickHandler: bindClickHandler
  });

  /**
   * Hides loader and shows back the button which was hidden by .showLoading()
   */

  function hideLoading() {
    // do nothing if popup is closed
    var innerParams = privateProps.innerParams.get(this);

    if (!innerParams) {
      return;
    }

    var domCache = privateProps.domCache.get(this);
    hide(domCache.loader);
    var buttonToReplace = domCache.popup.getElementsByClassName(domCache.loader.getAttribute('data-button-to-replace'));

    if (buttonToReplace.length) {
      show(buttonToReplace[0], 'inline-block');
    } else if (allButtonsAreHidden()) {
      hide(domCache.actions);
    }

    removeClass([domCache.popup, domCache.actions], swalClasses.loading);
    domCache.popup.removeAttribute('aria-busy');
    domCache.popup.removeAttribute('data-loading');
    domCache.confirmButton.disabled = false;
    domCache.denyButton.disabled = false;
    domCache.cancelButton.disabled = false;
  }

  function getInput$1(instance) {
    var innerParams = privateProps.innerParams.get(instance || this);
    var domCache = privateProps.domCache.get(instance || this);

    if (!domCache) {
      return null;
    }

    return getInput(domCache.content, innerParams.input);
  }

  var fixScrollbar = function fixScrollbar() {
    // for queues, do not do this more than once
    if (states.previousBodyPadding !== null) {
      return;
    } // if the body has overflow


    if (document.body.scrollHeight > window.innerHeight) {
      // add padding so the content doesn't shift after removal of scrollbar
      states.previousBodyPadding = parseInt(window.getComputedStyle(document.body).getPropertyValue('padding-right'));
      document.body.style.paddingRight = "".concat(states.previousBodyPadding + measureScrollbar(), "px");
    }
  };
  var undoScrollbar = function undoScrollbar() {
    if (states.previousBodyPadding !== null) {
      document.body.style.paddingRight = "".concat(states.previousBodyPadding, "px");
      states.previousBodyPadding = null;
    }
  };

  /* istanbul ignore file */

  var iOSfix = function iOSfix() {
    var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream || navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;

    if (iOS && !hasClass(document.body, swalClasses.iosfix)) {
      var offset = document.body.scrollTop;
      document.body.style.top = "".concat(offset * -1, "px");
      addClass(document.body, swalClasses.iosfix);
      lockBodyScroll();
      addBottomPaddingForTallPopups(); // #1948
    }
  };

  var addBottomPaddingForTallPopups = function addBottomPaddingForTallPopups() {
    var safari = !navigator.userAgent.match(/(CriOS|FxiOS|EdgiOS|YaBrowser|UCBrowser)/i);

    if (safari) {
      var bottomPanelHeight = 44;

      if (getPopup().scrollHeight > window.innerHeight - bottomPanelHeight) {
        getContainer().style.paddingBottom = "".concat(bottomPanelHeight, "px");
      }
    }
  };

  var lockBodyScroll = function lockBodyScroll() {
    // #1246
    var container = getContainer();
    var preventTouchMove;

    container.ontouchstart = function (e) {
      preventTouchMove = shouldPreventTouchMove(e);
    };

    container.ontouchmove = function (e) {
      if (preventTouchMove) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
  };

  var shouldPreventTouchMove = function shouldPreventTouchMove(event) {
    var target = event.target;
    var container = getContainer();

    if (isStylys(event) || isZoom(event)) {
      return false;
    }

    if (target === container) {
      return true;
    }

    if (!isScrollable(container) && target.tagName !== 'INPUT' && // #1603
    !(isScrollable(getContent()) && // #1944
    getContent().contains(target))) {
      return true;
    }

    return false;
  };

  var isStylys = function isStylys(event) {
    // #1786
    return event.touches && event.touches.length && event.touches[0].touchType === 'stylus';
  };

  var isZoom = function isZoom(event) {
    // #1891
    return event.touches && event.touches.length > 1;
  };

  var undoIOSfix = function undoIOSfix() {
    if (hasClass(document.body, swalClasses.iosfix)) {
      var offset = parseInt(document.body.style.top, 10);
      removeClass(document.body, swalClasses.iosfix);
      document.body.style.top = '';
      document.body.scrollTop = offset * -1;
    }
  };

  /* istanbul ignore file */

  var isIE11 = function isIE11() {
    return !!window.MSInputMethodContext && !!document.documentMode;
  }; // Fix IE11 centering sweetalert2/issues/933


  var fixVerticalPositionIE = function fixVerticalPositionIE() {
    var container = getContainer();
    var popup = getPopup();
    container.style.removeProperty('align-items');

    if (popup.offsetTop < 0) {
      container.style.alignItems = 'flex-start';
    }
  };

  var IEfix = function IEfix() {
    if (typeof window !== 'undefined' && isIE11()) {
      fixVerticalPositionIE();
      window.addEventListener('resize', fixVerticalPositionIE);
    }
  };
  var undoIEfix = function undoIEfix() {
    if (typeof window !== 'undefined' && isIE11()) {
      window.removeEventListener('resize', fixVerticalPositionIE);
    }
  };

  // Adding aria-hidden="true" to elements outside of the active modal dialog ensures that
  // elements not within the active modal dialog will not be surfaced if a user opens a screen
  // reader’s list of elements (headings, form controls, landmarks, etc.) in the document.

  var setAriaHidden = function setAriaHidden() {
    var bodyChildren = toArray(document.body.children);
    bodyChildren.forEach(function (el) {
      if (el === getContainer() || contains(el, getContainer())) {
        return;
      }

      if (el.hasAttribute('aria-hidden')) {
        el.setAttribute('data-previous-aria-hidden', el.getAttribute('aria-hidden'));
      }

      el.setAttribute('aria-hidden', 'true');
    });
  };
  var unsetAriaHidden = function unsetAriaHidden() {
    var bodyChildren = toArray(document.body.children);
    bodyChildren.forEach(function (el) {
      if (el.hasAttribute('data-previous-aria-hidden')) {
        el.setAttribute('aria-hidden', el.getAttribute('data-previous-aria-hidden'));
        el.removeAttribute('data-previous-aria-hidden');
      } else {
        el.removeAttribute('aria-hidden');
      }
    });
  };

  /**
   * This module containts `WeakMap`s for each effectively-"private  property" that a `Swal` has.
   * For example, to set the private property "foo" of `this` to "bar", you can `privateProps.foo.set(this, 'bar')`
   * This is the approach that Babel will probably take to implement private methods/fields
   *   https://github.com/tc39/proposal-private-methods
   *   https://github.com/babel/babel/pull/7555
   * Once we have the changes from that PR in Babel, and our core class fits reasonable in *one module*
   *   then we can use that language feature.
   */
  var privateMethods = {
    swalPromiseResolve: new WeakMap()
  };

  /*
   * Instance method to close sweetAlert
   */

  function removePopupAndResetState(instance, container, isToast$$1, didClose) {
    if (isToast$$1) {
      triggerDidCloseAndDispose(instance, didClose);
    } else {
      restoreActiveElement().then(function () {
        return triggerDidCloseAndDispose(instance, didClose);
      });
      globalState.keydownTarget.removeEventListener('keydown', globalState.keydownHandler, {
        capture: globalState.keydownListenerCapture
      });
      globalState.keydownHandlerAdded = false;
    }

    if (container.parentNode && !document.body.getAttribute('data-swal2-queue-step')) {
      container.parentNode.removeChild(container);
    }

    if (isModal()) {
      undoScrollbar();
      undoIOSfix();
      undoIEfix();
      unsetAriaHidden();
    }

    removeBodyClasses();
  }

  function removeBodyClasses() {
    removeClass([document.documentElement, document.body], [swalClasses.shown, swalClasses['height-auto'], swalClasses['no-backdrop'], swalClasses['toast-shown'], swalClasses['toast-column']]);
  }

  function close(resolveValue) {
    var popup = getPopup();

    if (!popup) {
      return;
    }

    resolveValue = prepareResolveValue(resolveValue);
    var innerParams = privateProps.innerParams.get(this);

    if (!innerParams || hasClass(popup, innerParams.hideClass.popup)) {
      return;
    }

    var swalPromiseResolve = privateMethods.swalPromiseResolve.get(this);
    removeClass(popup, innerParams.showClass.popup);
    addClass(popup, innerParams.hideClass.popup);
    var backdrop = getContainer();
    removeClass(backdrop, innerParams.showClass.backdrop);
    addClass(backdrop, innerParams.hideClass.backdrop);
    handlePopupAnimation(this, popup, innerParams); // Resolve Swal promise

    swalPromiseResolve(resolveValue);
  }

  var prepareResolveValue = function prepareResolveValue(resolveValue) {
    // When user calls Swal.close()
    if (typeof resolveValue === 'undefined') {
      return {
        isConfirmed: false,
        isDenied: false,
        isDismissed: true
      };
    }

    return _extends({
      isConfirmed: false,
      isDenied: false,
      isDismissed: false
    }, resolveValue);
  };

  var handlePopupAnimation = function handlePopupAnimation(instance, popup, innerParams) {
    var container = getContainer(); // If animation is supported, animate

    var animationIsSupported = animationEndEvent && hasCssAnimation(popup);
    var onClose = innerParams.onClose,
        onAfterClose = innerParams.onAfterClose,
        willClose = innerParams.willClose,
        didClose = innerParams.didClose;
    runDidClose(popup, willClose, onClose);

    if (animationIsSupported) {
      animatePopup(instance, popup, container, didClose || onAfterClose);
    } else {
      // Otherwise, remove immediately
      removePopupAndResetState(instance, container, isToast(), didClose || onAfterClose);
    }
  };

  var runDidClose = function runDidClose(popup, willClose, onClose) {
    if (willClose !== null && typeof willClose === 'function') {
      willClose(popup);
    } else if (onClose !== null && typeof onClose === 'function') {
      onClose(popup); // @deprecated
    }
  };

  var animatePopup = function animatePopup(instance, popup, container, didClose) {
    globalState.swalCloseEventFinishedCallback = removePopupAndResetState.bind(null, instance, container, isToast(), didClose);
    popup.addEventListener(animationEndEvent, function (e) {
      if (e.target === popup) {
        globalState.swalCloseEventFinishedCallback();
        delete globalState.swalCloseEventFinishedCallback;
      }
    });
  };

  var triggerDidCloseAndDispose = function triggerDidCloseAndDispose(instance, didClose) {
    setTimeout(function () {
      if (typeof didClose === 'function') {
        didClose();
      }

      instance._destroy();
    });
  };

  function setButtonsDisabled(instance, buttons, disabled) {
    var domCache = privateProps.domCache.get(instance);
    buttons.forEach(function (button) {
      domCache[button].disabled = disabled;
    });
  }

  function setInputDisabled(input, disabled) {
    if (!input) {
      return false;
    }

    if (input.type === 'radio') {
      var radiosContainer = input.parentNode.parentNode;
      var radios = radiosContainer.querySelectorAll('input');

      for (var i = 0; i < radios.length; i++) {
        radios[i].disabled = disabled;
      }
    } else {
      input.disabled = disabled;
    }
  }

  function enableButtons() {
    setButtonsDisabled(this, ['confirmButton', 'denyButton', 'cancelButton'], false);
  }
  function disableButtons() {
    setButtonsDisabled(this, ['confirmButton', 'denyButton', 'cancelButton'], true);
  }
  function enableInput() {
    return setInputDisabled(this.getInput(), false);
  }
  function disableInput() {
    return setInputDisabled(this.getInput(), true);
  }

  function showValidationMessage(error) {
    var domCache = privateProps.domCache.get(this);
    var params = privateProps.innerParams.get(this);
    setInnerHtml(domCache.validationMessage, error);
    domCache.validationMessage.className = swalClasses['validation-message'];

    if (params.customClass && params.customClass.validationMessage) {
      addClass(domCache.validationMessage, params.customClass.validationMessage);
    }

    show(domCache.validationMessage);
    var input = this.getInput();

    if (input) {
      input.setAttribute('aria-invalid', true);
      input.setAttribute('aria-describedBy', swalClasses['validation-message']);
      focusInput(input);
      addClass(input, swalClasses.inputerror);
    }
  } // Hide block with validation message

  function resetValidationMessage$1() {
    var domCache = privateProps.domCache.get(this);

    if (domCache.validationMessage) {
      hide(domCache.validationMessage);
    }

    var input = this.getInput();

    if (input) {
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-describedBy');
      removeClass(input, swalClasses.inputerror);
    }
  }

  function getProgressSteps$1() {
    var domCache = privateProps.domCache.get(this);
    return domCache.progressSteps;
  }

  var Timer = /*#__PURE__*/function () {
    function Timer(callback, delay) {
      _classCallCheck(this, Timer);

      this.callback = callback;
      this.remaining = delay;
      this.running = false;
      this.start();
    }

    _createClass(Timer, [{
      key: "start",
      value: function start() {
        if (!this.running) {
          this.running = true;
          this.started = new Date();
          this.id = setTimeout(this.callback, this.remaining);
        }

        return this.remaining;
      }
    }, {
      key: "stop",
      value: function stop() {
        if (this.running) {
          this.running = false;
          clearTimeout(this.id);
          this.remaining -= new Date() - this.started;
        }

        return this.remaining;
      }
    }, {
      key: "increase",
      value: function increase(n) {
        var running = this.running;

        if (running) {
          this.stop();
        }

        this.remaining += n;

        if (running) {
          this.start();
        }

        return this.remaining;
      }
    }, {
      key: "getTimerLeft",
      value: function getTimerLeft() {
        if (this.running) {
          this.stop();
          this.start();
        }

        return this.remaining;
      }
    }, {
      key: "isRunning",
      value: function isRunning() {
        return this.running;
      }
    }]);

    return Timer;
  }();

  var defaultInputValidators = {
    email: function email(string, validationMessage) {
      return /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]{2,24}$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || 'Invalid email address');
    },
    url: function url(string, validationMessage) {
      // taken from https://stackoverflow.com/a/3809435 with a small change from #1306 and #2013
      return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || 'Invalid URL');
    }
  };

  function setDefaultInputValidators(params) {
    // Use default `inputValidator` for supported input types if not provided
    if (!params.inputValidator) {
      Object.keys(defaultInputValidators).forEach(function (key) {
        if (params.input === key) {
          params.inputValidator = defaultInputValidators[key];
        }
      });
    }
  }

  function validateCustomTargetElement(params) {
    // Determine if the custom target element is valid
    if (!params.target || typeof params.target === 'string' && !document.querySelector(params.target) || typeof params.target !== 'string' && !params.target.appendChild) {
      warn('Target parameter is not valid, defaulting to "body"');
      params.target = 'body';
    }
  }
  /**
   * Set type, text and actions on popup
   *
   * @param params
   * @returns {boolean}
   */


  function setParameters(params) {
    setDefaultInputValidators(params); // showLoaderOnConfirm && preConfirm

    if (params.showLoaderOnConfirm && !params.preConfirm) {
      warn('showLoaderOnConfirm is set to true, but preConfirm is not defined.\n' + 'showLoaderOnConfirm should be used together with preConfirm, see usage example:\n' + 'https://sweetalert2.github.io/#ajax-request');
    } // params.animation will be actually used in renderPopup.js
    // but in case when params.animation is a function, we need to call that function
    // before popup (re)initialization, so it'll be possible to check Swal.isVisible()
    // inside the params.animation function


    params.animation = callIfFunction(params.animation);
    validateCustomTargetElement(params); // Replace newlines with <br> in title

    if (typeof params.title === 'string') {
      params.title = params.title.split('\n').join('<br />');
    }

    init(params);
  }

  var swalStringParams = ['swal-title', 'swal-html', 'swal-footer'];
  var getTemplateParams = function getTemplateParams(params) {
    var template = typeof params.template === 'string' ? document.querySelector(params.template) : params.template;

    if (!template) {
      return {};
    }

    var templateContent = template.content || template; // IE11

    showWarningsForElements(templateContent);

    var result = _extends(getSwalParams(templateContent), getSwalButtons(templateContent), getSwalImage(templateContent), getSwalIcon(templateContent), getSwalInput(templateContent), getSwalStringParams(templateContent, swalStringParams));

    return result;
  };

  var getSwalParams = function getSwalParams(templateContent) {
    var result = {};
    toArray(templateContent.querySelectorAll('swal-param')).forEach(function (param) {
      showWarningsForAttributes(param, ['name', 'value']);
      var paramName = param.getAttribute('name');
      var value = param.getAttribute('value');

      if (typeof defaultParams[paramName] === 'boolean' && value === 'false') {
        value = false;
      }

      if (_typeof(defaultParams[paramName]) === 'object') {
        value = JSON.parse(value);
      }

      result[paramName] = value;
    });
    return result;
  };

  var getSwalButtons = function getSwalButtons(templateContent) {
    var result = {};
    toArray(templateContent.querySelectorAll('swal-button')).forEach(function (button) {
      showWarningsForAttributes(button, ['type', 'color', 'aria-label']);
      var type = button.getAttribute('type');
      result["".concat(type, "ButtonText")] = button.innerHTML;
      result["show".concat(capitalizeFirstLetter(type), "Button")] = true;

      if (button.hasAttribute('color')) {
        result["".concat(type, "ButtonColor")] = button.getAttribute('color');
      }

      if (button.hasAttribute('aria-label')) {
        result["".concat(type, "ButtonAriaLabel")] = button.getAttribute('aria-label');
      }
    });
    return result;
  };

  var getSwalImage = function getSwalImage(templateContent) {
    var result = {};
    var image = templateContent.querySelector('swal-image');

    if (image) {
      showWarningsForAttributes(image, ['src', 'width', 'height', 'alt']);

      if (image.hasAttribute('src')) {
        result.imageUrl = image.getAttribute('src');
      }

      if (image.hasAttribute('width')) {
        result.imageWidth = image.getAttribute('width');
      }

      if (image.hasAttribute('height')) {
        result.imageHeight = image.getAttribute('height');
      }

      if (image.hasAttribute('alt')) {
        result.imageAlt = image.getAttribute('alt');
      }
    }

    return result;
  };

  var getSwalIcon = function getSwalIcon(templateContent) {
    var result = {};
    var icon = templateContent.querySelector('swal-icon');

    if (icon) {
      showWarningsForAttributes(icon, ['type', 'color']);

      if (icon.hasAttribute('type')) {
        result.icon = icon.getAttribute('type');
      }

      if (icon.hasAttribute('color')) {
        result.iconColor = icon.getAttribute('color');
      }

      result.iconHtml = icon.innerHTML;
    }

    return result;
  };

  var getSwalInput = function getSwalInput(templateContent) {
    var result = {};
    var input = templateContent.querySelector('swal-input');

    if (input) {
      showWarningsForAttributes(input, ['type', 'label', 'placeholder', 'value']);
      result.input = input.getAttribute('type') || 'text';

      if (input.hasAttribute('label')) {
        result.inputLabel = input.getAttribute('label');
      }

      if (input.hasAttribute('placeholder')) {
        result.inputPlaceholder = input.getAttribute('placeholder');
      }

      if (input.hasAttribute('value')) {
        result.inputValue = input.getAttribute('value');
      }
    }

    var inputOptions = templateContent.querySelectorAll('swal-input-option');

    if (inputOptions.length) {
      result.inputOptions = {};
      toArray(inputOptions).forEach(function (option) {
        showWarningsForAttributes(option, ['value']);
        var optionValue = option.getAttribute('value');
        var optionName = option.innerHTML;
        result.inputOptions[optionValue] = optionName;
      });
    }

    return result;
  };

  var getSwalStringParams = function getSwalStringParams(templateContent, paramNames) {
    var result = {};

    for (var i in paramNames) {
      var paramName = paramNames[i];
      var tag = templateContent.querySelector(paramName);

      if (tag) {
        showWarningsForAttributes(tag, []);
        result[paramName.replace(/^swal-/, '')] = tag.innerHTML;
      }
    }

    return result;
  };

  var showWarningsForElements = function showWarningsForElements(template) {
    var allowedElements = swalStringParams.concat(['swal-param', 'swal-button', 'swal-image', 'swal-icon', 'swal-input', 'swal-input-option']);
    toArray(template.querySelectorAll('*')).forEach(function (el) {
      var tagName = el.tagName.toLowerCase();

      if (allowedElements.indexOf(tagName) === -1) {
        warn("Unrecognized element <".concat(tagName, ">"));
      }
    });
  };

  var showWarningsForAttributes = function showWarningsForAttributes(el, allowedAttributes) {
    toArray(el.attributes).forEach(function (attribute) {
      if (allowedAttributes.indexOf(attribute.name) === -1) {
        warn(["Unrecognized attribute \"".concat(attribute.name, "\" on <").concat(el.tagName.toLowerCase(), ">."), "".concat(allowedAttributes.length ? "Allowed attributes are: ".concat(allowedAttributes.join(', ')) : 'To set the value, use HTML within the element.')]);
      }
    });
  };

  var SHOW_CLASS_TIMEOUT = 10;
  /**
   * Open popup, add necessary classes and styles, fix scrollbar
   *
   * @param params
   */

  var openPopup = function openPopup(params) {
    var container = getContainer();
    var popup = getPopup();

    if (typeof params.willOpen === 'function') {
      params.willOpen(popup);
    } else if (typeof params.onBeforeOpen === 'function') {
      params.onBeforeOpen(popup); // @deprecated
    }

    var bodyStyles = window.getComputedStyle(document.body);
    var initialBodyOverflow = bodyStyles.overflowY;
    addClasses$1(container, popup, params); // scrolling is 'hidden' until animation is done, after that 'auto'

    setTimeout(function () {
      setScrollingVisibility(container, popup);
    }, SHOW_CLASS_TIMEOUT);

    if (isModal()) {
      fixScrollContainer(container, params.scrollbarPadding, initialBodyOverflow);
      setAriaHidden();
    }

    if (!isToast() && !globalState.previousActiveElement) {
      globalState.previousActiveElement = document.activeElement;
    }

    runDidOpen(popup, params);
    removeClass(container, swalClasses['no-transition']);
  };

  var runDidOpen = function runDidOpen(popup, params) {
    if (typeof params.didOpen === 'function') {
      setTimeout(function () {
        return params.didOpen(popup);
      });
    } else if (typeof params.onOpen === 'function') {
      setTimeout(function () {
        return params.onOpen(popup);
      }); // @deprecated
    }
  };

  var swalOpenAnimationFinished = function swalOpenAnimationFinished(event) {
    var popup = getPopup();

    if (event.target !== popup) {
      return;
    }

    var container = getContainer();
    popup.removeEventListener(animationEndEvent, swalOpenAnimationFinished);
    container.style.overflowY = 'auto';
  };

  var setScrollingVisibility = function setScrollingVisibility(container, popup) {
    if (animationEndEvent && hasCssAnimation(popup)) {
      container.style.overflowY = 'hidden';
      popup.addEventListener(animationEndEvent, swalOpenAnimationFinished);
    } else {
      container.style.overflowY = 'auto';
    }
  };

  var fixScrollContainer = function fixScrollContainer(container, scrollbarPadding, initialBodyOverflow) {
    iOSfix();
    IEfix();

    if (scrollbarPadding && initialBodyOverflow !== 'hidden') {
      fixScrollbar();
    } // sweetalert2/issues/1247


    setTimeout(function () {
      container.scrollTop = 0;
    });
  };

  var addClasses$1 = function addClasses(container, popup, params) {
    addClass(container, params.showClass.backdrop); // the workaround with setting/unsetting opacity is needed for #2019 and 2059

    popup.style.setProperty('opacity', '0', 'important');
    show(popup);
    setTimeout(function () {
      // Animate popup right after showing it
      addClass(popup, params.showClass.popup); // and remove the opacity workaround

      popup.style.removeProperty('opacity');
    }, SHOW_CLASS_TIMEOUT); // 10ms in order to fix #2062

    addClass([document.documentElement, document.body], swalClasses.shown);

    if (params.heightAuto && params.backdrop && !params.toast) {
      addClass([document.documentElement, document.body], swalClasses['height-auto']);
    }
  };

  var handleInputOptionsAndValue = function handleInputOptionsAndValue(instance, params) {
    if (params.input === 'select' || params.input === 'radio') {
      handleInputOptions(instance, params);
    } else if (['text', 'email', 'number', 'tel', 'textarea'].indexOf(params.input) !== -1 && (hasToPromiseFn(params.inputValue) || isPromise(params.inputValue))) {
      handleInputValue(instance, params);
    }
  };
  var getInputValue = function getInputValue(instance, innerParams) {
    var input = instance.getInput();

    if (!input) {
      return null;
    }

    switch (innerParams.input) {
      case 'checkbox':
        return getCheckboxValue(input);

      case 'radio':
        return getRadioValue(input);

      case 'file':
        return getFileValue(input);

      default:
        return innerParams.inputAutoTrim ? input.value.trim() : input.value;
    }
  };

  var getCheckboxValue = function getCheckboxValue(input) {
    return input.checked ? 1 : 0;
  };

  var getRadioValue = function getRadioValue(input) {
    return input.checked ? input.value : null;
  };

  var getFileValue = function getFileValue(input) {
    return input.files.length ? input.getAttribute('multiple') !== null ? input.files : input.files[0] : null;
  };

  var handleInputOptions = function handleInputOptions(instance, params) {
    var content = getContent();

    var processInputOptions = function processInputOptions(inputOptions) {
      return populateInputOptions[params.input](content, formatInputOptions(inputOptions), params);
    };

    if (hasToPromiseFn(params.inputOptions) || isPromise(params.inputOptions)) {
      showLoading();
      asPromise(params.inputOptions).then(function (inputOptions) {
        instance.hideLoading();
        processInputOptions(inputOptions);
      });
    } else if (_typeof(params.inputOptions) === 'object') {
      processInputOptions(params.inputOptions);
    } else {
      error("Unexpected type of inputOptions! Expected object, Map or Promise, got ".concat(_typeof(params.inputOptions)));
    }
  };

  var handleInputValue = function handleInputValue(instance, params) {
    var input = instance.getInput();
    hide(input);
    asPromise(params.inputValue).then(function (inputValue) {
      input.value = params.input === 'number' ? parseFloat(inputValue) || 0 : "".concat(inputValue);
      show(input);
      input.focus();
      instance.hideLoading();
    })["catch"](function (err) {
      error("Error in inputValue promise: ".concat(err));
      input.value = '';
      show(input);
      input.focus();
      instance.hideLoading();
    });
  };

  var populateInputOptions = {
    select: function select(content, inputOptions, params) {
      var select = getChildByClass(content, swalClasses.select);

      var renderOption = function renderOption(parent, optionLabel, optionValue) {
        var option = document.createElement('option');
        option.value = optionValue;
        setInnerHtml(option, optionLabel);
        option.selected = isSelected(optionValue, params.inputValue);
        parent.appendChild(option);
      };

      inputOptions.forEach(function (inputOption) {
        var optionValue = inputOption[0];
        var optionLabel = inputOption[1]; // <optgroup> spec:
        // https://www.w3.org/TR/html401/interact/forms.html#h-17.6
        // "...all OPTGROUP elements must be specified directly within a SELECT element (i.e., groups may not be nested)..."
        // check whether this is a <optgroup>

        if (Array.isArray(optionLabel)) {
          // if it is an array, then it is an <optgroup>
          var optgroup = document.createElement('optgroup');
          optgroup.label = optionValue;
          optgroup.disabled = false; // not configurable for now

          select.appendChild(optgroup);
          optionLabel.forEach(function (o) {
            return renderOption(optgroup, o[1], o[0]);
          });
        } else {
          // case of <option>
          renderOption(select, optionLabel, optionValue);
        }
      });
      select.focus();
    },
    radio: function radio(content, inputOptions, params) {
      var radio = getChildByClass(content, swalClasses.radio);
      inputOptions.forEach(function (inputOption) {
        var radioValue = inputOption[0];
        var radioLabel = inputOption[1];
        var radioInput = document.createElement('input');
        var radioLabelElement = document.createElement('label');
        radioInput.type = 'radio';
        radioInput.name = swalClasses.radio;
        radioInput.value = radioValue;

        if (isSelected(radioValue, params.inputValue)) {
          radioInput.checked = true;
        }

        var label = document.createElement('span');
        setInnerHtml(label, radioLabel);
        label.className = swalClasses.label;
        radioLabelElement.appendChild(radioInput);
        radioLabelElement.appendChild(label);
        radio.appendChild(radioLabelElement);
      });
      var radios = radio.querySelectorAll('input');

      if (radios.length) {
        radios[0].focus();
      }
    }
  };
  /**
   * Converts `inputOptions` into an array of `[value, label]`s
   * @param inputOptions
   */

  var formatInputOptions = function formatInputOptions(inputOptions) {
    var result = [];

    if (typeof Map !== 'undefined' && inputOptions instanceof Map) {
      inputOptions.forEach(function (value, key) {
        var valueFormatted = value;

        if (_typeof(valueFormatted) === 'object') {
          // case of <optgroup>
          valueFormatted = formatInputOptions(valueFormatted);
        }

        result.push([key, valueFormatted]);
      });
    } else {
      Object.keys(inputOptions).forEach(function (key) {
        var valueFormatted = inputOptions[key];

        if (_typeof(valueFormatted) === 'object') {
          // case of <optgroup>
          valueFormatted = formatInputOptions(valueFormatted);
        }

        result.push([key, valueFormatted]);
      });
    }

    return result;
  };

  var isSelected = function isSelected(optionValue, inputValue) {
    return inputValue && inputValue.toString() === optionValue.toString();
  };

  var handleConfirmButtonClick = function handleConfirmButtonClick(instance, innerParams) {
    instance.disableButtons();

    if (innerParams.input) {
      handleConfirmOrDenyWithInput(instance, innerParams, 'confirm');
    } else {
      confirm(instance, innerParams, true);
    }
  };
  var handleDenyButtonClick = function handleDenyButtonClick(instance, innerParams) {
    instance.disableButtons();

    if (innerParams.returnInputValueOnDeny) {
      handleConfirmOrDenyWithInput(instance, innerParams, 'deny');
    } else {
      deny(instance, innerParams, false);
    }
  };
  var handleCancelButtonClick = function handleCancelButtonClick(instance, dismissWith) {
    instance.disableButtons();
    dismissWith(DismissReason.cancel);
  };

  var handleConfirmOrDenyWithInput = function handleConfirmOrDenyWithInput(instance, innerParams, type
  /* type is either 'confirm' or 'deny' */
  ) {
    var inputValue = getInputValue(instance, innerParams);

    if (innerParams.inputValidator) {
      handleInputValidator(instance, innerParams, inputValue);
    } else if (!instance.getInput().checkValidity()) {
      instance.enableButtons();
      instance.showValidationMessage(innerParams.validationMessage);
    } else if (type === 'deny') {
      deny(instance, innerParams, inputValue);
    } else {
      confirm(instance, innerParams, inputValue);
    }
  };

  var handleInputValidator = function handleInputValidator(instance, innerParams, inputValue) {
    instance.disableInput();
    var validationPromise = Promise.resolve().then(function () {
      return asPromise(innerParams.inputValidator(inputValue, innerParams.validationMessage));
    });
    validationPromise.then(function (validationMessage) {
      instance.enableButtons();
      instance.enableInput();

      if (validationMessage) {
        instance.showValidationMessage(validationMessage);
      } else {
        confirm(instance, innerParams, inputValue);
      }
    });
  };

  var deny = function deny(instance, innerParams, value) {
    if (innerParams.preDeny) {
      var preDenyPromise = Promise.resolve().then(function () {
        return asPromise(innerParams.preDeny(value, innerParams.validationMessage));
      });
      preDenyPromise.then(function (preDenyValue) {
        if (preDenyValue === false) {
          instance.hideLoading();
        } else {
          instance.closePopup({
            isDenied: true,
            value: typeof preDenyValue === 'undefined' ? value : preDenyValue
          });
        }
      });
    } else {
      instance.closePopup({
        isDenied: true,
        value: value
      });
    }
  };

  var succeedWith = function succeedWith(instance, value) {
    instance.closePopup({
      isConfirmed: true,
      value: value
    });
  };

  var confirm = function confirm(instance, innerParams, value) {
    if (innerParams.showLoaderOnConfirm) {
      showLoading(); // TODO: make showLoading an *instance* method
    }

    if (innerParams.preConfirm) {
      instance.resetValidationMessage();
      var preConfirmPromise = Promise.resolve().then(function () {
        return asPromise(innerParams.preConfirm(value, innerParams.validationMessage));
      });
      preConfirmPromise.then(function (preConfirmValue) {
        if (isVisible(getValidationMessage()) || preConfirmValue === false) {
          instance.hideLoading();
        } else {
          succeedWith(instance, typeof preConfirmValue === 'undefined' ? value : preConfirmValue);
        }
      });
    } else {
      succeedWith(instance, value);
    }
  };

  var addKeydownHandler = function addKeydownHandler(instance, globalState, innerParams, dismissWith) {
    if (globalState.keydownTarget && globalState.keydownHandlerAdded) {
      globalState.keydownTarget.removeEventListener('keydown', globalState.keydownHandler, {
        capture: globalState.keydownListenerCapture
      });
      globalState.keydownHandlerAdded = false;
    }

    if (!innerParams.toast) {
      globalState.keydownHandler = function (e) {
        return keydownHandler(instance, e, dismissWith);
      };

      globalState.keydownTarget = innerParams.keydownListenerCapture ? window : getPopup();
      globalState.keydownListenerCapture = innerParams.keydownListenerCapture;
      globalState.keydownTarget.addEventListener('keydown', globalState.keydownHandler, {
        capture: globalState.keydownListenerCapture
      });
      globalState.keydownHandlerAdded = true;
    }
  }; // Focus handling

  var setFocus = function setFocus(innerParams, index, increment) {
    var focusableElements = getFocusableElements(); // search for visible elements and select the next possible match

    if (focusableElements.length) {
      index = index + increment; // rollover to first item

      if (index === focusableElements.length) {
        index = 0; // go to last item
      } else if (index === -1) {
        index = focusableElements.length - 1;
      }

      return focusableElements[index].focus();
    } // no visible focusable elements, focus the popup


    getPopup().focus();
  };
  var arrowKeysNextButton = ['ArrowRight', 'ArrowDown', 'Right', 'Down' // IE11
  ];
  var arrowKeysPreviousButton = ['ArrowLeft', 'ArrowUp', 'Left', 'Up' // IE11
  ];
  var escKeys = ['Escape', 'Esc' // IE11
  ];

  var keydownHandler = function keydownHandler(instance, e, dismissWith) {
    var innerParams = privateProps.innerParams.get(instance);

    if (innerParams.stopKeydownPropagation) {
      e.stopPropagation();
    } // ENTER


    if (e.key === 'Enter') {
      handleEnter(instance, e, innerParams); // TAB
    } else if (e.key === 'Tab') {
      handleTab(e, innerParams); // ARROWS - switch focus between buttons
    } else if ([].concat(arrowKeysNextButton, arrowKeysPreviousButton).indexOf(e.key) !== -1) {
      handleArrows(e.key); // ESC
    } else if (escKeys.indexOf(e.key) !== -1) {
      handleEsc(e, innerParams, dismissWith);
    }
  };

  var handleEnter = function handleEnter(instance, e, innerParams) {
    // #720 #721
    if (e.isComposing) {
      return;
    }

    if (e.target && instance.getInput() && e.target.outerHTML === instance.getInput().outerHTML) {
      if (['textarea', 'file'].indexOf(innerParams.input) !== -1) {
        return; // do not submit
      }

      clickConfirm();
      e.preventDefault();
    }
  };

  var handleTab = function handleTab(e, innerParams) {
    var targetElement = e.target;
    var focusableElements = getFocusableElements();
    var btnIndex = -1;

    for (var i = 0; i < focusableElements.length; i++) {
      if (targetElement === focusableElements[i]) {
        btnIndex = i;
        break;
      }
    }

    if (!e.shiftKey) {
      // Cycle to the next button
      setFocus(innerParams, btnIndex, 1);
    } else {
      // Cycle to the prev button
      setFocus(innerParams, btnIndex, -1);
    }

    e.stopPropagation();
    e.preventDefault();
  };

  var handleArrows = function handleArrows(key) {
    var confirmButton = getConfirmButton();
    var denyButton = getDenyButton();
    var cancelButton = getCancelButton();

    if (!([confirmButton, denyButton, cancelButton].indexOf(document.activeElement) !== -1)) {
      return;
    }

    var sibling = arrowKeysNextButton.indexOf(key) !== -1 ? 'nextElementSibling' : 'previousElementSibling';
    var buttonToFocus = document.activeElement[sibling];

    if (buttonToFocus) {
      buttonToFocus.focus();
    }
  };

  var handleEsc = function handleEsc(e, innerParams, dismissWith) {
    if (callIfFunction(innerParams.allowEscapeKey)) {
      e.preventDefault();
      dismissWith(DismissReason.esc);
    }
  };

  var handlePopupClick = function handlePopupClick(instance, domCache, dismissWith) {
    var innerParams = privateProps.innerParams.get(instance);

    if (innerParams.toast) {
      handleToastClick(instance, domCache, dismissWith);
    } else {
      // Ignore click events that had mousedown on the popup but mouseup on the container
      // This can happen when the user drags a slider
      handleModalMousedown(domCache); // Ignore click events that had mousedown on the container but mouseup on the popup

      handleContainerMousedown(domCache);
      handleModalClick(instance, domCache, dismissWith);
    }
  };

  var handleToastClick = function handleToastClick(instance, domCache, dismissWith) {
    // Closing toast by internal click
    domCache.popup.onclick = function () {
      var innerParams = privateProps.innerParams.get(instance);

      if (innerParams.showConfirmButton || innerParams.showDenyButton || innerParams.showCancelButton || innerParams.showCloseButton || innerParams.input) {
        return;
      }

      dismissWith(DismissReason.close);
    };
  };

  var ignoreOutsideClick = false;

  var handleModalMousedown = function handleModalMousedown(domCache) {
    domCache.popup.onmousedown = function () {
      domCache.container.onmouseup = function (e) {
        domCache.container.onmouseup = undefined; // We only check if the mouseup target is the container because usually it doesn't
        // have any other direct children aside of the popup

        if (e.target === domCache.container) {
          ignoreOutsideClick = true;
        }
      };
    };
  };

  var handleContainerMousedown = function handleContainerMousedown(domCache) {
    domCache.container.onmousedown = function () {
      domCache.popup.onmouseup = function (e) {
        domCache.popup.onmouseup = undefined; // We also need to check if the mouseup target is a child of the popup

        if (e.target === domCache.popup || domCache.popup.contains(e.target)) {
          ignoreOutsideClick = true;
        }
      };
    };
  };

  var handleModalClick = function handleModalClick(instance, domCache, dismissWith) {
    domCache.container.onclick = function (e) {
      var innerParams = privateProps.innerParams.get(instance);

      if (ignoreOutsideClick) {
        ignoreOutsideClick = false;
        return;
      }

      if (e.target === domCache.container && callIfFunction(innerParams.allowOutsideClick)) {
        dismissWith(DismissReason.backdrop);
      }
    };
  };

  function _main(userParams) {
    var mixinParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    showWarningsForParams(_extends({}, mixinParams, userParams));

    if (globalState.currentInstance) {
      globalState.currentInstance._destroy();
    }

    globalState.currentInstance = this;
    var innerParams = prepareParams(userParams, mixinParams);
    setParameters(innerParams);
    Object.freeze(innerParams); // clear the previous timer

    if (globalState.timeout) {
      globalState.timeout.stop();
      delete globalState.timeout;
    } // clear the restore focus timeout


    clearTimeout(globalState.restoreFocusTimeout);
    var domCache = populateDomCache(this);
    render(this, innerParams);
    privateProps.innerParams.set(this, innerParams);
    return swalPromise(this, domCache, innerParams);
  }

  var prepareParams = function prepareParams(userParams, mixinParams) {
    var templateParams = getTemplateParams(userParams);

    var showClass = _extends({}, defaultParams.showClass, mixinParams.showClass, templateParams.showClass, userParams.showClass);

    var hideClass = _extends({}, defaultParams.hideClass, mixinParams.hideClass, templateParams.hideClass, userParams.hideClass);

    var params = _extends({}, defaultParams, mixinParams, templateParams, userParams); // precedence is described in #2131


    params.showClass = showClass;
    params.hideClass = hideClass; // @deprecated

    if (userParams.animation === false) {
      params.showClass = {
        popup: 'swal2-noanimation',
        backdrop: 'swal2-noanimation'
      };
      params.hideClass = {};
    }

    return params;
  };

  var swalPromise = function swalPromise(instance, domCache, innerParams) {
    return new Promise(function (resolve) {
      // functions to handle all closings/dismissals
      var dismissWith = function dismissWith(dismiss) {
        instance.closePopup({
          isDismissed: true,
          dismiss: dismiss
        });
      };

      privateMethods.swalPromiseResolve.set(instance, resolve);

      domCache.confirmButton.onclick = function () {
        return handleConfirmButtonClick(instance, innerParams);
      };

      domCache.denyButton.onclick = function () {
        return handleDenyButtonClick(instance, innerParams);
      };

      domCache.cancelButton.onclick = function () {
        return handleCancelButtonClick(instance, dismissWith);
      };

      domCache.closeButton.onclick = function () {
        return dismissWith(DismissReason.close);
      };

      handlePopupClick(instance, domCache, dismissWith);
      addKeydownHandler(instance, globalState, innerParams, dismissWith);

      if (innerParams.toast && (innerParams.input || innerParams.footer || innerParams.showCloseButton)) {
        addClass(document.body, swalClasses['toast-column']);
      } else {
        removeClass(document.body, swalClasses['toast-column']);
      }

      handleInputOptionsAndValue(instance, innerParams);
      openPopup(innerParams);
      setupTimer(globalState, innerParams, dismissWith);
      initFocus(domCache, innerParams); // Scroll container to top on open (#1247, #1946)

      setTimeout(function () {
        domCache.container.scrollTop = 0;
      });
    });
  };

  var populateDomCache = function populateDomCache(instance) {
    var domCache = {
      popup: getPopup(),
      container: getContainer(),
      content: getContent(),
      actions: getActions(),
      confirmButton: getConfirmButton(),
      denyButton: getDenyButton(),
      cancelButton: getCancelButton(),
      loader: getLoader(),
      closeButton: getCloseButton(),
      validationMessage: getValidationMessage(),
      progressSteps: getProgressSteps()
    };
    privateProps.domCache.set(instance, domCache);
    return domCache;
  };

  var setupTimer = function setupTimer(globalState$$1, innerParams, dismissWith) {
    var timerProgressBar = getTimerProgressBar();
    hide(timerProgressBar);

    if (innerParams.timer) {
      globalState$$1.timeout = new Timer(function () {
        dismissWith('timer');
        delete globalState$$1.timeout;
      }, innerParams.timer);

      if (innerParams.timerProgressBar) {
        show(timerProgressBar);
        setTimeout(function () {
          if (globalState$$1.timeout.running) {
            // timer can be already stopped at this point
            animateTimerProgressBar(innerParams.timer);
          }
        });
      }
    }
  };

  var initFocus = function initFocus(domCache, innerParams) {
    if (innerParams.toast) {
      return;
    }

    if (!callIfFunction(innerParams.allowEnterKey)) {
      return blurActiveElement();
    }

    if (!focusButton(domCache, innerParams)) {
      setFocus(innerParams, -1, 1);
    }
  };

  var focusButton = function focusButton(domCache, innerParams) {
    if (innerParams.focusDeny && isVisible(domCache.denyButton)) {
      domCache.denyButton.focus();
      return true;
    }

    if (innerParams.focusCancel && isVisible(domCache.cancelButton)) {
      domCache.cancelButton.focus();
      return true;
    }

    if (innerParams.focusConfirm && isVisible(domCache.confirmButton)) {
      domCache.confirmButton.focus();
      return true;
    }

    return false;
  };

  var blurActiveElement = function blurActiveElement() {
    if (document.activeElement && typeof document.activeElement.blur === 'function') {
      document.activeElement.blur();
    }
  };

  /**
   * Updates popup parameters.
   */

  function update(params) {
    var popup = getPopup();
    var innerParams = privateProps.innerParams.get(this);

    if (!popup || hasClass(popup, innerParams.hideClass.popup)) {
      return warn("You're trying to update the closed or closing popup, that won't work. Use the update() method in preConfirm parameter or show a new popup.");
    }

    var validUpdatableParams = {}; // assign valid params from `params` to `defaults`

    Object.keys(params).forEach(function (param) {
      if (Swal.isUpdatableParameter(param)) {
        validUpdatableParams[param] = params[param];
      } else {
        warn("Invalid parameter to update: \"".concat(param, "\". Updatable params are listed here: https://github.com/sweetalert2/sweetalert2/blob/master/src/utils/params.js\n\nIf you think this parameter should be updatable, request it here: https://github.com/sweetalert2/sweetalert2/issues/new?template=02_feature_request.md"));
      }
    });

    var updatedParams = _extends({}, innerParams, validUpdatableParams);

    render(this, updatedParams);
    privateProps.innerParams.set(this, updatedParams);
    Object.defineProperties(this, {
      params: {
        value: _extends({}, this.params, params),
        writable: false,
        enumerable: true
      }
    });
  }

  function _destroy() {
    var domCache = privateProps.domCache.get(this);
    var innerParams = privateProps.innerParams.get(this);

    if (!innerParams) {
      return; // This instance has already been destroyed
    } // Check if there is another Swal closing


    if (domCache.popup && globalState.swalCloseEventFinishedCallback) {
      globalState.swalCloseEventFinishedCallback();
      delete globalState.swalCloseEventFinishedCallback;
    } // Check if there is a swal disposal defer timer


    if (globalState.deferDisposalTimer) {
      clearTimeout(globalState.deferDisposalTimer);
      delete globalState.deferDisposalTimer;
    }

    runDidDestroy(innerParams);
    disposeSwal(this);
  }

  var runDidDestroy = function runDidDestroy(innerParams) {
    if (typeof innerParams.didDestroy === 'function') {
      innerParams.didDestroy();
    } else if (typeof innerParams.onDestroy === 'function') {
      innerParams.onDestroy(); // @deprecated
    }
  };

  var disposeSwal = function disposeSwal(instance) {
    // Unset this.params so GC will dispose it (#1569)
    delete instance.params; // Unset globalState props so GC will dispose globalState (#1569)

    delete globalState.keydownHandler;
    delete globalState.keydownTarget; // Unset WeakMaps so GC will be able to dispose them (#1569)

    unsetWeakMaps(privateProps);
    unsetWeakMaps(privateMethods);
  };

  var unsetWeakMaps = function unsetWeakMaps(obj) {
    for (var i in obj) {
      obj[i] = new WeakMap();
    }
  };



  var instanceMethods = /*#__PURE__*/Object.freeze({
    hideLoading: hideLoading,
    disableLoading: hideLoading,
    getInput: getInput$1,
    close: close,
    closePopup: close,
    closeModal: close,
    closeToast: close,
    enableButtons: enableButtons,
    disableButtons: disableButtons,
    enableInput: enableInput,
    disableInput: disableInput,
    showValidationMessage: showValidationMessage,
    resetValidationMessage: resetValidationMessage$1,
    getProgressSteps: getProgressSteps$1,
    _main: _main,
    update: update,
    _destroy: _destroy
  });

  var currentInstance;

  var SweetAlert = /*#__PURE__*/function () {
    function SweetAlert() {
      _classCallCheck(this, SweetAlert);

      // Prevent run in Node env
      if (typeof window === 'undefined') {
        return;
      } // Check for the existence of Promise


      if (typeof Promise === 'undefined') {
        error('This package requires a Promise library, please include a shim to enable it in this browser (See: https://github.com/sweetalert2/sweetalert2/wiki/Migration-from-SweetAlert-to-SweetAlert2#1-ie-support)');
      }

      currentInstance = this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var outerParams = Object.freeze(this.constructor.argsToParams(args));
      Object.defineProperties(this, {
        params: {
          value: outerParams,
          writable: false,
          enumerable: true,
          configurable: true
        }
      });

      var promise = this._main(this.params);

      privateProps.promise.set(this, promise);
    } // `catch` cannot be the name of a module export, so we define our thenable methods here instead


    _createClass(SweetAlert, [{
      key: "then",
      value: function then(onFulfilled) {
        var promise = privateProps.promise.get(this);
        return promise.then(onFulfilled);
      }
    }, {
      key: "finally",
      value: function _finally(onFinally) {
        var promise = privateProps.promise.get(this);
        return promise["finally"](onFinally);
      }
    }]);

    return SweetAlert;
  }(); // Assign instance methods from src/instanceMethods/*.js to prototype


  _extends(SweetAlert.prototype, instanceMethods); // Assign static methods from src/staticMethods/*.js to constructor


  _extends(SweetAlert, staticMethods); // Proxy to instance methods to constructor, for now, for backwards compatibility


  Object.keys(instanceMethods).forEach(function (key) {
    SweetAlert[key] = function () {
      if (currentInstance) {
        var _currentInstance;

        return (_currentInstance = currentInstance)[key].apply(_currentInstance, arguments);
      }
    };
  });
  SweetAlert.DismissReason = DismissReason;
  SweetAlert.version = '10.12.5';

  var Swal = SweetAlert;
  Swal["default"] = Swal;

  return Swal;

}));
if (typeof commonjsGlobal !== 'undefined' && commonjsGlobal.Sweetalert2){  commonjsGlobal.swal = commonjsGlobal.sweetAlert = commonjsGlobal.Swal = commonjsGlobal.SweetAlert = commonjsGlobal.Sweetalert2;}

"undefined"!=typeof document&&function(e,t){var n=e.createElement("style");if(e.getElementsByTagName("head")[0].appendChild(n),n.styleSheet)n.styleSheet.disabled||(n.styleSheet.cssText=t);else try{n.innerHTML=t;}catch(e){n.innerText=t;}}(document,".swal2-popup.swal2-toast{flex-direction:row;align-items:center;width:auto;padding:.625em;overflow-y:hidden;background:#fff;box-shadow:0 0 .625em #d9d9d9}.swal2-popup.swal2-toast .swal2-header{flex-direction:row;padding:0}.swal2-popup.swal2-toast .swal2-title{flex-grow:1;justify-content:flex-start;margin:0 .6em;font-size:1em}.swal2-popup.swal2-toast .swal2-footer{margin:.5em 0 0;padding:.5em 0 0;font-size:.8em}.swal2-popup.swal2-toast .swal2-close{position:static;width:.8em;height:.8em;line-height:.8}.swal2-popup.swal2-toast .swal2-content{justify-content:flex-start;padding:0;font-size:1em}.swal2-popup.swal2-toast .swal2-icon{width:2em;min-width:2em;height:2em;margin:0}.swal2-popup.swal2-toast .swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:1.8em;font-weight:700}@media all and (-ms-high-contrast:none),(-ms-high-contrast:active){.swal2-popup.swal2-toast .swal2-icon .swal2-icon-content{font-size:.25em}}.swal2-popup.swal2-toast .swal2-icon.swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line]{top:.875em;width:1.375em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:.3125em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:.3125em}.swal2-popup.swal2-toast .swal2-actions{flex-basis:auto!important;width:auto;height:auto;margin:0 .3125em;padding:0}.swal2-popup.swal2-toast .swal2-styled{margin:.125em .3125em;padding:.3125em .625em;font-size:1em}.swal2-popup.swal2-toast .swal2-styled:focus{box-shadow:0 0 0 1px #fff,0 0 0 3px rgba(100,150,200,.5)}.swal2-popup.swal2-toast .swal2-success{border-color:#a5dc86}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line]{position:absolute;width:1.6em;height:3em;transform:rotate(45deg);border-radius:50%}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=left]{top:-.8em;left:-.5em;transform:rotate(-45deg);transform-origin:2em 2em;border-radius:4em 0 0 4em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=right]{top:-.25em;left:.9375em;transform-origin:0 1.5em;border-radius:0 4em 4em 0}.swal2-popup.swal2-toast .swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-success .swal2-success-fix{top:0;left:.4375em;width:.4375em;height:2.6875em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line]{height:.3125em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=tip]{top:1.125em;left:.1875em;width:.75em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=long]{top:.9375em;right:.1875em;width:1.375em}.swal2-popup.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-tip{-webkit-animation:swal2-toast-animate-success-line-tip .75s;animation:swal2-toast-animate-success-line-tip .75s}.swal2-popup.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-long{-webkit-animation:swal2-toast-animate-success-line-long .75s;animation:swal2-toast-animate-success-line-long .75s}.swal2-popup.swal2-toast.swal2-show{-webkit-animation:swal2-toast-show .5s;animation:swal2-toast-show .5s}.swal2-popup.swal2-toast.swal2-hide{-webkit-animation:swal2-toast-hide .1s forwards;animation:swal2-toast-hide .1s forwards}.swal2-container{display:flex;position:fixed;z-index:1060;top:0;right:0;bottom:0;left:0;flex-direction:row;align-items:center;justify-content:center;padding:.625em;overflow-x:hidden;transition:background-color .1s;-webkit-overflow-scrolling:touch}.swal2-container.swal2-backdrop-show,.swal2-container.swal2-noanimation{background:rgba(0,0,0,.4)}.swal2-container.swal2-backdrop-hide{background:0 0!important}.swal2-container.swal2-top{align-items:flex-start}.swal2-container.swal2-top-left,.swal2-container.swal2-top-start{align-items:flex-start;justify-content:flex-start}.swal2-container.swal2-top-end,.swal2-container.swal2-top-right{align-items:flex-start;justify-content:flex-end}.swal2-container.swal2-center{align-items:center}.swal2-container.swal2-center-left,.swal2-container.swal2-center-start{align-items:center;justify-content:flex-start}.swal2-container.swal2-center-end,.swal2-container.swal2-center-right{align-items:center;justify-content:flex-end}.swal2-container.swal2-bottom{align-items:flex-end}.swal2-container.swal2-bottom-left,.swal2-container.swal2-bottom-start{align-items:flex-end;justify-content:flex-start}.swal2-container.swal2-bottom-end,.swal2-container.swal2-bottom-right{align-items:flex-end;justify-content:flex-end}.swal2-container.swal2-bottom-end>:first-child,.swal2-container.swal2-bottom-left>:first-child,.swal2-container.swal2-bottom-right>:first-child,.swal2-container.swal2-bottom-start>:first-child,.swal2-container.swal2-bottom>:first-child{margin-top:auto}.swal2-container.swal2-grow-fullscreen>.swal2-modal{display:flex!important;flex:1;align-self:stretch;justify-content:center}.swal2-container.swal2-grow-row>.swal2-modal{display:flex!important;flex:1;align-content:center;justify-content:center}.swal2-container.swal2-grow-column{flex:1;flex-direction:column}.swal2-container.swal2-grow-column.swal2-bottom,.swal2-container.swal2-grow-column.swal2-center,.swal2-container.swal2-grow-column.swal2-top{align-items:center}.swal2-container.swal2-grow-column.swal2-bottom-left,.swal2-container.swal2-grow-column.swal2-bottom-start,.swal2-container.swal2-grow-column.swal2-center-left,.swal2-container.swal2-grow-column.swal2-center-start,.swal2-container.swal2-grow-column.swal2-top-left,.swal2-container.swal2-grow-column.swal2-top-start{align-items:flex-start}.swal2-container.swal2-grow-column.swal2-bottom-end,.swal2-container.swal2-grow-column.swal2-bottom-right,.swal2-container.swal2-grow-column.swal2-center-end,.swal2-container.swal2-grow-column.swal2-center-right,.swal2-container.swal2-grow-column.swal2-top-end,.swal2-container.swal2-grow-column.swal2-top-right{align-items:flex-end}.swal2-container.swal2-grow-column>.swal2-modal{display:flex!important;flex:1;align-content:center;justify-content:center}.swal2-container.swal2-no-transition{transition:none!important}.swal2-container:not(.swal2-top):not(.swal2-top-start):not(.swal2-top-end):not(.swal2-top-left):not(.swal2-top-right):not(.swal2-center-start):not(.swal2-center-end):not(.swal2-center-left):not(.swal2-center-right):not(.swal2-bottom):not(.swal2-bottom-start):not(.swal2-bottom-end):not(.swal2-bottom-left):not(.swal2-bottom-right):not(.swal2-grow-fullscreen)>.swal2-modal{margin:auto}@media all and (-ms-high-contrast:none),(-ms-high-contrast:active){.swal2-container .swal2-modal{margin:0!important}}.swal2-popup{display:none;position:relative;box-sizing:border-box;flex-direction:column;justify-content:center;width:32em;max-width:100%;padding:1.25em;border:none;border-radius:5px;background:#fff;font-family:inherit;font-size:1rem}.swal2-popup:focus{outline:0}.swal2-popup.swal2-loading{overflow-y:hidden}.swal2-header{display:flex;flex-direction:column;align-items:center;padding:0 1.8em}.swal2-title{position:relative;max-width:100%;margin:0 0 .4em;padding:0;color:#595959;font-size:1.875em;font-weight:600;text-align:center;text-transform:none;word-wrap:break-word}.swal2-actions{display:flex;z-index:1;box-sizing:border-box;flex-wrap:wrap;align-items:center;justify-content:center;width:100%;margin:1.25em auto 0;padding:0 1.6em}.swal2-actions:not(.swal2-loading) .swal2-styled[disabled]{opacity:.4}.swal2-actions:not(.swal2-loading) .swal2-styled:hover{background-image:linear-gradient(rgba(0,0,0,.1),rgba(0,0,0,.1))}.swal2-actions:not(.swal2-loading) .swal2-styled:active{background-image:linear-gradient(rgba(0,0,0,.2),rgba(0,0,0,.2))}.swal2-loader{display:none;align-items:center;justify-content:center;width:2.2em;height:2.2em;margin:0 1.875em;-webkit-animation:swal2-rotate-loading 1.5s linear 0s infinite normal;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border-width:.25em;border-style:solid;border-radius:100%;border-color:#2778c4 transparent #2778c4 transparent}.swal2-styled{margin:.3125em;padding:.625em 1.1em;box-shadow:none;font-weight:500}.swal2-styled:not([disabled]){cursor:pointer}.swal2-styled.swal2-confirm{border:0;border-radius:.25em;background:initial;background-color:#2778c4;color:#fff;font-size:1.0625em}.swal2-styled.swal2-deny{border:0;border-radius:.25em;background:initial;background-color:#d14529;color:#fff;font-size:1.0625em}.swal2-styled.swal2-cancel{border:0;border-radius:.25em;background:initial;background-color:#757575;color:#fff;font-size:1.0625em}.swal2-styled:focus{outline:0;box-shadow:0 0 0 3px rgba(100,150,200,.5)}.swal2-styled::-moz-focus-inner{border:0}.swal2-footer{justify-content:center;margin:1.25em 0 0;padding:1em 0 0;border-top:1px solid #eee;color:#545454;font-size:1em}.swal2-timer-progress-bar-container{position:absolute;right:0;bottom:0;left:0;height:.25em;overflow:hidden;border-bottom-right-radius:5px;border-bottom-left-radius:5px}.swal2-timer-progress-bar{width:100%;height:.25em;background:rgba(0,0,0,.2)}.swal2-image{max-width:100%;margin:1.25em auto}.swal2-close{position:absolute;z-index:2;top:0;right:0;align-items:center;justify-content:center;width:1.2em;height:1.2em;padding:0;overflow:hidden;transition:color .1s ease-out;border:none;border-radius:5px;background:0 0;color:#ccc;font-family:serif;font-size:2.5em;line-height:1.2;cursor:pointer}.swal2-close:hover{transform:none;background:0 0;color:#f27474}.swal2-close:focus{outline:0;box-shadow:inset 0 0 0 3px rgba(100,150,200,.5)}.swal2-close::-moz-focus-inner{border:0}.swal2-content{z-index:1;justify-content:center;margin:0;padding:0 1.6em;color:#545454;font-size:1.125em;font-weight:400;line-height:normal;text-align:center;word-wrap:break-word}.swal2-checkbox,.swal2-file,.swal2-input,.swal2-radio,.swal2-select,.swal2-textarea{margin:1em auto}.swal2-file,.swal2-input,.swal2-textarea{box-sizing:border-box;width:100%;transition:border-color .3s,box-shadow .3s;border:1px solid #d9d9d9;border-radius:.1875em;background:inherit;box-shadow:inset 0 1px 1px rgba(0,0,0,.06);color:inherit;font-size:1.125em}.swal2-file.swal2-inputerror,.swal2-input.swal2-inputerror,.swal2-textarea.swal2-inputerror{border-color:#f27474!important;box-shadow:0 0 2px #f27474!important}.swal2-file:focus,.swal2-input:focus,.swal2-textarea:focus{border:1px solid #b4dbed;outline:0;box-shadow:0 0 0 3px rgba(100,150,200,.5)}.swal2-file::-moz-placeholder,.swal2-input::-moz-placeholder,.swal2-textarea::-moz-placeholder{color:#ccc}.swal2-file:-ms-input-placeholder,.swal2-input:-ms-input-placeholder,.swal2-textarea:-ms-input-placeholder{color:#ccc}.swal2-file::placeholder,.swal2-input::placeholder,.swal2-textarea::placeholder{color:#ccc}.swal2-range{margin:1em auto;background:#fff}.swal2-range input{width:80%}.swal2-range output{width:20%;color:inherit;font-weight:600;text-align:center}.swal2-range input,.swal2-range output{height:2.625em;padding:0;font-size:1.125em;line-height:2.625em}.swal2-input{height:2.625em;padding:0 .75em}.swal2-input[type=number]{max-width:10em}.swal2-file{background:inherit;font-size:1.125em}.swal2-textarea{height:6.75em;padding:.75em}.swal2-select{min-width:50%;max-width:100%;padding:.375em .625em;background:inherit;color:inherit;font-size:1.125em}.swal2-checkbox,.swal2-radio{align-items:center;justify-content:center;background:#fff;color:inherit}.swal2-checkbox label,.swal2-radio label{margin:0 .6em;font-size:1.125em}.swal2-checkbox input,.swal2-radio input{margin:0 .4em}.swal2-input-label{display:flex;justify-content:center;margin:1em auto}.swal2-validation-message{display:none;align-items:center;justify-content:center;margin:0 -2.7em;padding:.625em;overflow:hidden;background:#f0f0f0;color:#666;font-size:1em;font-weight:300}.swal2-validation-message::before{content:\"!\";display:inline-block;width:1.5em;min-width:1.5em;height:1.5em;margin:0 .625em;border-radius:50%;background-color:#f27474;color:#fff;font-weight:600;line-height:1.5em;text-align:center}.swal2-icon{position:relative;box-sizing:content-box;justify-content:center;width:5em;height:5em;margin:1.25em auto 1.875em;border:.25em solid transparent;border-radius:50%;font-family:inherit;line-height:5em;cursor:default;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:3.75em}.swal2-icon.swal2-error{border-color:#f27474;color:#f27474}.swal2-icon.swal2-error .swal2-x-mark{position:relative;flex-grow:1}.swal2-icon.swal2-error [class^=swal2-x-mark-line]{display:block;position:absolute;top:2.3125em;width:2.9375em;height:.3125em;border-radius:.125em;background-color:#f27474}.swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:1.0625em;transform:rotate(45deg)}.swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:1em;transform:rotate(-45deg)}.swal2-icon.swal2-error.swal2-icon-show{-webkit-animation:swal2-animate-error-icon .5s;animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-error.swal2-icon-show .swal2-x-mark{-webkit-animation:swal2-animate-error-x-mark .5s;animation:swal2-animate-error-x-mark .5s}.swal2-icon.swal2-warning{border-color:#facea8;color:#f8bb86}.swal2-icon.swal2-info{border-color:#9de0f6;color:#3fc3ee}.swal2-icon.swal2-question{border-color:#c9dae1;color:#87adbd}.swal2-icon.swal2-success{border-color:#a5dc86;color:#a5dc86}.swal2-icon.swal2-success [class^=swal2-success-circular-line]{position:absolute;width:3.75em;height:7.5em;transform:rotate(45deg);border-radius:50%}.swal2-icon.swal2-success [class^=swal2-success-circular-line][class$=left]{top:-.4375em;left:-2.0635em;transform:rotate(-45deg);transform-origin:3.75em 3.75em;border-radius:7.5em 0 0 7.5em}.swal2-icon.swal2-success [class^=swal2-success-circular-line][class$=right]{top:-.6875em;left:1.875em;transform:rotate(-45deg);transform-origin:0 3.75em;border-radius:0 7.5em 7.5em 0}.swal2-icon.swal2-success .swal2-success-ring{position:absolute;z-index:2;top:-.25em;left:-.25em;box-sizing:content-box;width:100%;height:100%;border:.25em solid rgba(165,220,134,.3);border-radius:50%}.swal2-icon.swal2-success .swal2-success-fix{position:absolute;z-index:1;top:.5em;left:1.625em;width:.4375em;height:5.625em;transform:rotate(-45deg)}.swal2-icon.swal2-success [class^=swal2-success-line]{display:block;position:absolute;z-index:2;height:.3125em;border-radius:.125em;background-color:#a5dc86}.swal2-icon.swal2-success [class^=swal2-success-line][class$=tip]{top:2.875em;left:.8125em;width:1.5625em;transform:rotate(45deg)}.swal2-icon.swal2-success [class^=swal2-success-line][class$=long]{top:2.375em;right:.5em;width:2.9375em;transform:rotate(-45deg)}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-line-tip{-webkit-animation:swal2-animate-success-line-tip .75s;animation:swal2-animate-success-line-tip .75s}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-line-long{-webkit-animation:swal2-animate-success-line-long .75s;animation:swal2-animate-success-line-long .75s}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-circular-line-right{-webkit-animation:swal2-rotate-success-circular-line 4.25s ease-in;animation:swal2-rotate-success-circular-line 4.25s ease-in}.swal2-progress-steps{flex-wrap:wrap;align-items:center;max-width:100%;margin:0 0 1.25em;padding:0;background:inherit;font-weight:600}.swal2-progress-steps li{display:inline-block;position:relative}.swal2-progress-steps .swal2-progress-step{z-index:20;flex-shrink:0;width:2em;height:2em;border-radius:2em;background:#2778c4;color:#fff;line-height:2em;text-align:center}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step{background:#2778c4}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step{background:#add8e6;color:#fff}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step-line{background:#add8e6}.swal2-progress-steps .swal2-progress-step-line{z-index:10;flex-shrink:0;width:2.5em;height:.4em;margin:0 -1px;background:#2778c4}[class^=swal2]{-webkit-tap-highlight-color:transparent}.swal2-show{-webkit-animation:swal2-show .3s;animation:swal2-show .3s}.swal2-hide{-webkit-animation:swal2-hide .15s forwards;animation:swal2-hide .15s forwards}.swal2-noanimation{transition:none}.swal2-scrollbar-measure{position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll}.swal2-rtl .swal2-close{right:auto;left:0}.swal2-rtl .swal2-timer-progress-bar{right:0;left:auto}@supports (-ms-accelerator:true){.swal2-range input{width:100%!important}.swal2-range output{display:none}}@media all and (-ms-high-contrast:none),(-ms-high-contrast:active){.swal2-range input{width:100%!important}.swal2-range output{display:none}}@-webkit-keyframes swal2-toast-show{0%{transform:translateY(-.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0)}}@keyframes swal2-toast-show{0%{transform:translateY(-.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0)}}@-webkit-keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@-webkit-keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@-webkit-keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}@keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}@-webkit-keyframes swal2-show{0%{transform:scale(.7)}45%{transform:scale(1.05)}80%{transform:scale(.95)}100%{transform:scale(1)}}@keyframes swal2-show{0%{transform:scale(.7)}45%{transform:scale(1.05)}80%{transform:scale(.95)}100%{transform:scale(1)}}@-webkit-keyframes swal2-hide{0%{transform:scale(1);opacity:1}100%{transform:scale(.5);opacity:0}}@keyframes swal2-hide{0%{transform:scale(1);opacity:1}100%{transform:scale(.5);opacity:0}}@-webkit-keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.8125em;width:1.5625em}}@keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.8125em;width:1.5625em}}@-webkit-keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@-webkit-keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@-webkit-keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(.4);opacity:0}50%{margin-top:1.625em;transform:scale(.4);opacity:0}80%{margin-top:-.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(.4);opacity:0}50%{margin-top:1.625em;transform:scale(.4);opacity:0}80%{margin-top:-.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@-webkit-keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0);opacity:1}}@keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0);opacity:1}}@-webkit-keyframes swal2-rotate-loading{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes swal2-rotate-loading{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow:hidden}body.swal2-height-auto{height:auto!important}body.swal2-no-backdrop .swal2-container{top:auto;right:auto;bottom:auto;left:auto;max-width:calc(100% - .625em * 2);background-color:transparent!important}body.swal2-no-backdrop .swal2-container>.swal2-modal{box-shadow:0 0 10px rgba(0,0,0,.4)}body.swal2-no-backdrop .swal2-container.swal2-top{top:0;left:50%;transform:translateX(-50%)}body.swal2-no-backdrop .swal2-container.swal2-top-left,body.swal2-no-backdrop .swal2-container.swal2-top-start{top:0;left:0}body.swal2-no-backdrop .swal2-container.swal2-top-end,body.swal2-no-backdrop .swal2-container.swal2-top-right{top:0;right:0}body.swal2-no-backdrop .swal2-container.swal2-center{top:50%;left:50%;transform:translate(-50%,-50%)}body.swal2-no-backdrop .swal2-container.swal2-center-left,body.swal2-no-backdrop .swal2-container.swal2-center-start{top:50%;left:0;transform:translateY(-50%)}body.swal2-no-backdrop .swal2-container.swal2-center-end,body.swal2-no-backdrop .swal2-container.swal2-center-right{top:50%;right:0;transform:translateY(-50%)}body.swal2-no-backdrop .swal2-container.swal2-bottom{bottom:0;left:50%;transform:translateX(-50%)}body.swal2-no-backdrop .swal2-container.swal2-bottom-left,body.swal2-no-backdrop .swal2-container.swal2-bottom-start{bottom:0;left:0}body.swal2-no-backdrop .swal2-container.swal2-bottom-end,body.swal2-no-backdrop .swal2-container.swal2-bottom-right{right:0;bottom:0}@media print{body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow-y:scroll!important}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown)>[aria-hidden=true]{display:none}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown) .swal2-container{position:static!important}}body.swal2-toast-shown .swal2-container{background-color:transparent}body.swal2-toast-shown .swal2-container.swal2-top{top:0;right:auto;bottom:auto;left:50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-top-end,body.swal2-toast-shown .swal2-container.swal2-top-right{top:0;right:0;bottom:auto;left:auto}body.swal2-toast-shown .swal2-container.swal2-top-left,body.swal2-toast-shown .swal2-container.swal2-top-start{top:0;right:auto;bottom:auto;left:0}body.swal2-toast-shown .swal2-container.swal2-center-left,body.swal2-toast-shown .swal2-container.swal2-center-start{top:50%;right:auto;bottom:auto;left:0;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-center{top:50%;right:auto;bottom:auto;left:50%;transform:translate(-50%,-50%)}body.swal2-toast-shown .swal2-container.swal2-center-end,body.swal2-toast-shown .swal2-container.swal2-center-right{top:50%;right:0;bottom:auto;left:auto;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-left,body.swal2-toast-shown .swal2-container.swal2-bottom-start{top:auto;right:auto;bottom:0;left:0}body.swal2-toast-shown .swal2-container.swal2-bottom{top:auto;right:auto;bottom:0;left:50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-end,body.swal2-toast-shown .swal2-container.swal2-bottom-right{top:auto;right:0;bottom:0;left:auto}body.swal2-toast-column .swal2-toast{flex-direction:column;align-items:stretch}body.swal2-toast-column .swal2-toast .swal2-actions{flex:1;align-self:stretch;height:2.2em;margin-top:.3125em}body.swal2-toast-column .swal2-toast .swal2-loading{justify-content:center}body.swal2-toast-column .swal2-toast .swal2-input{height:2em;margin:.3125em auto;font-size:1em}body.swal2-toast-column .swal2-toast .swal2-validation-message{font-size:1em}");
});

/* src\routes\Kosan.svelte generated by Svelte v3.29.4 */

const { console: console_1 } = globals;
const file$7 = "src\\routes\\Kosan.svelte";

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[13] = list[i];
	child_ctx[15] = i;
	return child_ctx;
}

// (153:4) {#if kosan}
function create_if_block$1(ctx) {
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
			if (dirty & /*Usr, kosan*/ 17) {
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
		id: create_if_block$1.name,
		type: "if",
		source: "(153:4) {#if kosan}",
		ctx
	});

	return block;
}

// (154:6) {#each kosan as hasil, counter}
function create_each_block(ctx) {
	let div4;
	let div3;
	let div0;
	let img;
	let img_src_value;
	let t0;
	let div2;
	let div1;
	let h5;
	let t1_value = /*hasil*/ ctx[13].nama_kos + "";
	let t1;
	let t2;
	let table;
	let tr0;
	let td0;
	let t4;
	let td1;
	let t6;
	let td2;
	let t7_value = /*hasil*/ ctx[13].jumlah_kamar + "";
	let t7;
	let t8;
	let tr1;
	let td3;
	let t10;
	let td4;
	let t12;
	let td5;
	let t13_value = /*hasil*/ ctx[13].luas_kamar + "";
	let t13;
	let t14;
	let t15;
	let tr2;
	let td6;
	let t17;
	let td7;
	let t19;
	let td8;
	let t20_value = /*hasil*/ ctx[13].alamat_kos + "";
	let t20;
	let t21;
	let div4_data_no_value;
	let mounted;
	let dispose;

	function click_handler(...args) {
		return /*click_handler*/ ctx[5](/*counter*/ ctx[15], ...args);
	}

	const block = {
		c: function create() {
			div4 = element("div");
			div3 = element("div");
			div0 = element("div");
			img = element("img");
			t0 = space();
			div2 = element("div");
			div1 = element("div");
			h5 = element("h5");
			t1 = text(t1_value);
			t2 = space();
			table = element("table");
			tr0 = element("tr");
			td0 = element("td");
			td0.textContent = "Total Kamar";
			t4 = space();
			td1 = element("td");
			td1.textContent = ":";
			t6 = space();
			td2 = element("td");
			t7 = text(t7_value);
			t8 = space();
			tr1 = element("tr");
			td3 = element("td");
			td3.textContent = "Luas Kamar";
			t10 = space();
			td4 = element("td");
			td4.textContent = ":";
			t12 = space();
			td5 = element("td");
			t13 = text(t13_value);
			t14 = text(" m²");
			t15 = space();
			tr2 = element("tr");
			td6 = element("td");
			td6.textContent = "Alamat Kos";
			t17 = space();
			td7 = element("td");
			td7.textContent = ":";
			t19 = space();
			td8 = element("td");
			t20 = text(t20_value);
			t21 = space();
			if (img.src !== (img_src_value = "http://localhost:3002/upload/kosan/image-1608049910729.png")) attr_dev(img, "src", img_src_value);
			attr_dev(img, "class", "card-img");
			attr_dev(img, "alt", "...");
			add_location(img, file$7, 163, 14, 5512);
			attr_dev(div0, "class", "col-md-4");
			add_location(div0, file$7, 162, 12, 5474);
			attr_dev(h5, "class", "card-title text-left ");
			set_style(h5, "margin-left", "13px");
			add_location(h5, file$7, 170, 16, 5775);
			add_location(td0, file$7, 175, 20, 6007);
			add_location(td1, file$7, 176, 20, 6049);
			add_location(td2, file$7, 177, 20, 6081);
			add_location(tr0, file$7, 174, 18, 5981);
			add_location(td3, file$7, 180, 20, 6181);
			add_location(td4, file$7, 181, 20, 6222);
			add_location(td5, file$7, 182, 20, 6254);
			add_location(tr1, file$7, 179, 18, 6155);
			add_location(td6, file$7, 185, 20, 6359);
			add_location(td7, file$7, 186, 20, 6400);
			add_location(td8, file$7, 187, 20, 6432);
			add_location(tr2, file$7, 184, 18, 6333);
			attr_dev(table, "class", "table table-borderless text-left");
			add_location(table, file$7, 173, 16, 5913);
			attr_dev(div1, "class", "card-body");
			add_location(div1, file$7, 169, 14, 5734);
			attr_dev(div2, "class", "col-md-8");
			add_location(div2, file$7, 168, 12, 5696);
			attr_dev(div3, "class", "row no-gutters");
			add_location(div3, file$7, 161, 10, 5432);
			attr_dev(div4, "class", "card mb-3 ml-3");
			set_style(div4, "max-width", "540px");
			attr_dev(div4, "data-no", div4_data_no_value = /*counter*/ ctx[15]);
			attr_dev(div4, "data-toggle", "modal");
			attr_dev(div4, "data-target", "#InfoModal");
			add_location(div4, file$7, 154, 8, 5195);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div4, anchor);
			append_dev(div4, div3);
			append_dev(div3, div0);
			append_dev(div0, img);
			append_dev(div3, t0);
			append_dev(div3, div2);
			append_dev(div2, div1);
			append_dev(div1, h5);
			append_dev(h5, t1);
			append_dev(div1, t2);
			append_dev(div1, table);
			append_dev(table, tr0);
			append_dev(tr0, td0);
			append_dev(tr0, t4);
			append_dev(tr0, td1);
			append_dev(tr0, t6);
			append_dev(tr0, td2);
			append_dev(td2, t7);
			append_dev(table, t8);
			append_dev(table, tr1);
			append_dev(tr1, td3);
			append_dev(tr1, t10);
			append_dev(tr1, td4);
			append_dev(tr1, t12);
			append_dev(tr1, td5);
			append_dev(td5, t13);
			append_dev(td5, t14);
			append_dev(table, t15);
			append_dev(table, tr2);
			append_dev(tr2, td6);
			append_dev(tr2, t17);
			append_dev(tr2, td7);
			append_dev(tr2, t19);
			append_dev(tr2, td8);
			append_dev(td8, t20);
			append_dev(div4, t21);

			if (!mounted) {
				dispose = listen_dev(div4, "click", click_handler, false, false, false);
				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*kosan*/ 1 && t1_value !== (t1_value = /*hasil*/ ctx[13].nama_kos + "")) set_data_dev(t1, t1_value);
			if (dirty & /*kosan*/ 1 && t7_value !== (t7_value = /*hasil*/ ctx[13].jumlah_kamar + "")) set_data_dev(t7, t7_value);
			if (dirty & /*kosan*/ 1 && t13_value !== (t13_value = /*hasil*/ ctx[13].luas_kamar + "")) set_data_dev(t13, t13_value);
			if (dirty & /*kosan*/ 1 && t20_value !== (t20_value = /*hasil*/ ctx[13].alamat_kos + "")) set_data_dev(t20, t20_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div4);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block.name,
		type: "each",
		source: "(154:6) {#each kosan as hasil, counter}",
		ctx
	});

	return block;
}

function create_fragment$7(ctx) {
	let div1;
	let h1;
	let t1;
	let div0;
	let t2;
	let div9;
	let div8;
	let div7;
	let div5;
	let div4;
	let div2;
	let img;
	let img_src_value;
	let t3;
	let div3;
	let t4;
	let t5_value = /*selected_kosan*/ ctx[1].nama_kos + "";
	let t5;
	let br0;
	let t6;
	let t7_value = /*selected_kosan*/ ctx[1].jumlah_kamar + "";
	let t7;
	let t8;
	let br1;
	let t9;
	let t10_value = /*selected_kosan*/ ctx[1].alamat_kos + "";
	let t10;
	let br2;
	let t11;
	let t12_value = /*selected_kosan*/ ctx[1].fasilitas + "";
	let t12;
	let br3;
	let br4;
	let t13;
	let t14_value = /*selected_kosan*/ ctx[1].harga_sewa + "";
	let t14;
	let t15;
	let br5;
	let br6;
	let t16;
	let input0;
	let br7;
	let t17;
	let input1;
	let t18;
	let div6;
	let button;
	let mounted;
	let dispose;
	let if_block = /*kosan*/ ctx[0] && create_if_block$1(ctx);

	const block = {
		c: function create() {
			div1 = element("div");
			h1 = element("h1");
			h1.textContent = "List Tempat Kos";
			t1 = space();
			div0 = element("div");
			if (if_block) if_block.c();
			t2 = space();
			div9 = element("div");
			div8 = element("div");
			div7 = element("div");
			div5 = element("div");
			div4 = element("div");
			div2 = element("div");
			img = element("img");
			t3 = space();
			div3 = element("div");
			t4 = text("Nama Kosan :\r\n            ");
			t5 = text(t5_value);
			br0 = element("br");
			t6 = text("\r\n            Total Kamar :\r\n            ");
			t7 = text(t7_value);
			t8 = text("\r\n            kamar");
			br1 = element("br");
			t9 = text("\r\n            Alamat Kos :\r\n            ");
			t10 = text(t10_value);
			br2 = element("br");
			t11 = text("\r\n            Fasilitas :\r\n            ");
			t12 = text(t12_value);
			br3 = element("br");
			br4 = element("br");
			t13 = text("\r\n            Harga Sewa : Rp\r\n            ");
			t14 = text(t14_value);
			t15 = text("\r\n            ; per bulan");
			br5 = element("br");
			br6 = element("br");
			t16 = text("\r\n            Lama Sewa (dalam bulan) :\r\n            ");
			input0 = element("input");
			br7 = element("br");
			t17 = text("\r\n            Total Biaya Sewa (Rp) :\r\n            ");
			input1 = element("input");
			t18 = space();
			div6 = element("div");
			button = element("button");
			button.textContent = "Sewa\r\n          Kamar";
			attr_dev(h1, "class", "h1 pt-3 svelte-ozgfm");
			add_location(h1, file$7, 150, 2, 5043);
			attr_dev(div0, "class", "row row-cols-1 row-cols-md-2");
			add_location(div0, file$7, 151, 2, 5087);
			attr_dev(div1, "class", "mt-5 text-center");
			add_location(div1, file$7, 149, 0, 5009);
			if (img.src !== (img_src_value = "http://localhost:3002/upload/kosan/image-1608049910729.png")) attr_dev(img, "src", img_src_value);
			attr_dev(img, "class", "border");
			attr_dev(img, "width", "125");
			attr_dev(img, "height", "125");
			attr_dev(img, "alt", "");
			add_location(img, file$7, 206, 12, 6933);
			attr_dev(div2, "class", "col-3 p-2");
			add_location(div2, file$7, 205, 10, 6896);
			add_location(br0, file$7, 215, 37, 7251);
			add_location(br1, file$7, 218, 17, 7346);
			add_location(br2, file$7, 220, 39, 7419);
			add_location(br3, file$7, 222, 38, 7490);
			add_location(br4, file$7, 222, 44, 7496);
			add_location(br5, file$7, 225, 23, 7597);
			add_location(br6, file$7, 225, 29, 7603);
			attr_dev(input0, "type", "number");
			attr_dev(input0, "title", "tekan enter setelah memasukkan lama sewa");
			input0.required = true;
			add_location(input0, file$7, 227, 12, 7662);
			add_location(br7, file$7, 232, 25, 7940);
			attr_dev(input1, "type", "number");
			input1.disabled = true;
			add_location(input1, file$7, 234, 12, 7997);
			attr_dev(div3, "class", "col-9 text-left");
			add_location(div3, file$7, 213, 10, 7157);
			attr_dev(div4, "class", "row");
			add_location(div4, file$7, 204, 8, 6867);
			attr_dev(div5, "class", "modal-body");
			add_location(div5, file$7, 203, 6, 6833);
			attr_dev(button, "type", "button");
			attr_dev(button, "class", "btn btn-primary");
			add_location(button, file$7, 239, 8, 8155);
			attr_dev(div6, "class", "modal-footer");
			add_location(div6, file$7, 238, 6, 8119);
			attr_dev(div7, "class", "modal-content");
			add_location(div7, file$7, 202, 4, 6798);
			attr_dev(div8, "class", "modal-dialog modal-dialog-centered");
			attr_dev(div8, "role", "document");
			add_location(div8, file$7, 201, 2, 6728);
			attr_dev(div9, "class", "modal fade");
			attr_dev(div9, "tabindex", "-1");
			attr_dev(div9, "role", "dialog");
			attr_dev(div9, "id", "InfoModal");
			add_location(div9, file$7, 200, 0, 6657);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			append_dev(div1, h1);
			append_dev(div1, t1);
			append_dev(div1, div0);
			if (if_block) if_block.m(div0, null);
			insert_dev(target, t2, anchor);
			insert_dev(target, div9, anchor);
			append_dev(div9, div8);
			append_dev(div8, div7);
			append_dev(div7, div5);
			append_dev(div5, div4);
			append_dev(div4, div2);
			append_dev(div2, img);
			append_dev(div4, t3);
			append_dev(div4, div3);
			append_dev(div3, t4);
			append_dev(div3, t5);
			append_dev(div3, br0);
			append_dev(div3, t6);
			append_dev(div3, t7);
			append_dev(div3, t8);
			append_dev(div3, br1);
			append_dev(div3, t9);
			append_dev(div3, t10);
			append_dev(div3, br2);
			append_dev(div3, t11);
			append_dev(div3, t12);
			append_dev(div3, br3);
			append_dev(div3, br4);
			append_dev(div3, t13);
			append_dev(div3, t14);
			append_dev(div3, t15);
			append_dev(div3, br5);
			append_dev(div3, br6);
			append_dev(div3, t16);
			append_dev(div3, input0);
			set_input_value(input0, /*sewa_kos*/ ctx[2].lama_sewa);
			append_dev(div3, br7);
			append_dev(div3, t17);
			append_dev(div3, input1);
			set_input_value(input1, /*sewa_kos*/ ctx[2].total_biaya);
			append_dev(div7, t18);
			append_dev(div7, div6);
			append_dev(div6, button);

			if (!mounted) {
				dispose = [
					listen_dev(input0, "input", /*input0_input_handler*/ ctx[6]),
					listen_dev(input0, "change", /*change_handler*/ ctx[7], false, false, false),
					listen_dev(input1, "input", /*input1_input_handler*/ ctx[8]),
					listen_dev(button, "click", /*click_handler_1*/ ctx[9], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (/*kosan*/ ctx[0]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$1(ctx);
					if_block.c();
					if_block.m(div0, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty & /*selected_kosan*/ 2 && t5_value !== (t5_value = /*selected_kosan*/ ctx[1].nama_kos + "")) set_data_dev(t5, t5_value);
			if (dirty & /*selected_kosan*/ 2 && t7_value !== (t7_value = /*selected_kosan*/ ctx[1].jumlah_kamar + "")) set_data_dev(t7, t7_value);
			if (dirty & /*selected_kosan*/ 2 && t10_value !== (t10_value = /*selected_kosan*/ ctx[1].alamat_kos + "")) set_data_dev(t10, t10_value);
			if (dirty & /*selected_kosan*/ 2 && t12_value !== (t12_value = /*selected_kosan*/ ctx[1].fasilitas + "")) set_data_dev(t12, t12_value);
			if (dirty & /*selected_kosan*/ 2 && t14_value !== (t14_value = /*selected_kosan*/ ctx[1].harga_sewa + "")) set_data_dev(t14, t14_value);

			if (dirty & /*sewa_kos*/ 4 && to_number(input0.value) !== /*sewa_kos*/ ctx[2].lama_sewa) {
				set_input_value(input0, /*sewa_kos*/ ctx[2].lama_sewa);
			}

			if (dirty & /*sewa_kos*/ 4 && to_number(input1.value) !== /*sewa_kos*/ ctx[2].total_biaya) {
				set_input_value(input1, /*sewa_kos*/ ctx[2].total_biaya);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
			if (if_block) if_block.d();
			if (detaching) detach_dev(t2);
			if (detaching) detach_dev(div9);
			mounted = false;
			run_all(dispose);
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

const apiURL = "http://localhost:3002/listkosan";

function instance$7($$self, $$props, $$invalidate) {
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
	let selected_kosan = [];

	let sewa_kos = {
		id_kos: 0,
		id_user: 0,
		lama_sewa: 0,
		total_biaya: 0
	};

	onMount(() => __awaiter(void 0, void 0, void 0, function* () {
		const res = yield fetch(apiURL).then(r => r.json()).then(data => {
			$$invalidate(0, kosan = data);
		});
	}));

	class Alert extends myAlert {
		// Konstruktor
		constructor(teks, tipe) {
			super(teks, tipe);

			// Properti
			this.toast = sweetalert2_all.mixin({
				toast: false,
				position: "center",
				showConfirmButton: true,
				timer: 3000,
				timerProgressBar: true,
				didOpen: toast => {
					toast.addEventListener("mouseenter", sweetalert2_all.stopTimer);
					toast.addEventListener("mouseleave", sweetalert2_all.resumeTimer);
				}
			});

			this.tipe = tipe;
		}

		// method untuk menampilkan toast
		show() {
			this.toast.fire({
				icon: this.tipe != "success" ? "error" : "success",
				title: this.teks
			});
		}
	}

	class User extends Users {
		// konstruktor
		constructor(id_user) {
			super();
			this.id_user = id_user;
		}

		// setter
		set id_User(id) {
			this.id_user = id;
		}

		// getter
		get id_User() {
			return this.id_user;
		}

		// methods....
		selectKosan(index) {
			try {
				$$invalidate(1, selected_kosan = kosan[index]);
				console.log(selected_kosan);
			} catch(error) {
				alert(error);
			}
		}

		pesanKamarKos(id_kosan, lamasewa, n_kamar) {
			try {
				// cek apakah user telah login
				if (!localStorage.getItem("nama_user")) {
					alert("Silahkan signin terlebih dahulu!");
				} else {
					if (lamasewa == null || lamasewa == 0 || lamasewa == undefined) {
						let alr = new Alert("Mohon masukkan lama sewa!", "error");
						alr.show();
					} else {
						// post data (method, header, dan request body ke server api)
						fetch("http://localhost:3002/users/buatpesanan", {
							method: "POST",
							headers: {
								"Content-Type": "application/x-www-form-urlencoded"
							},
							body: `id_user=${this.id_user}&id_kos=${id_kosan}&lama_sewa=${lamasewa}&nominal=${sewa_kos.total_biaya}`
						}).// handle data respon dari server
						then(res => {
							let alrt = new Alert("Berhasil melakukan Pemesanan!", "success");
							alrt.show();

							setTimeout(
								function () {
									window.open("http://localhost:5000/user/dasbor", "_self");
								},
								4000
							);
						}).// catch error
						catch(err => {
							let alrt1 = new Alert(err, "error");
							alrt1.showAlert();
						});
					}
				}
			} catch(error) {
				alert(error);
			}
		}
	}

	function sewa(id_kosan, id_user) {
		try {
			// cek apakah user telah login
			if (!localStorage.getItem("nama_user")) {
				alert("Silahkan signin terlebih dahulu!");
			} else {
				// instansiasi dari class User
				let usr = new User(parseInt(localStorage.getItem("id_user")));

				// memesan kamar kos
				usr.pesanKamarKos(id_kosan, sewa_kos.lama_sewa, 1);
			}
		} catch(error) {
			let alrt1 = new myAlert(error, "danger"); // catch error
			alrt1.showAlert();
		}
	}

	// instansiasi objek
	let Usr = new User(parseInt(localStorage.getItem("id_user")));

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Kosan> was created with unknown prop '${key}'`);
	});

	const click_handler = counter => Usr.selectKosan(counter);

	function input0_input_handler() {
		sewa_kos.lama_sewa = to_number(this.value);
		$$invalidate(2, sewa_kos);
	}

	const change_handler = () => $$invalidate(2, sewa_kos.total_biaya = selected_kosan.harga_sewa * sewa_kos.lama_sewa, sewa_kos);

	function input1_input_handler() {
		sewa_kos.total_biaya = to_number(this.value);
		$$invalidate(2, sewa_kos);
	}

	const click_handler_1 = () => sewa(selected_kosan.id_kos, parseInt(localStorage.getItem("id_user")));

	$$self.$capture_state = () => ({
		__awaiter,
		Users,
		onMount,
		myAlert,
		Swal: sweetalert2_all,
		kosan,
		selected_kosan,
		sewa_kos,
		apiURL,
		Alert,
		User,
		sewa,
		Usr
	});

	$$self.$inject_state = $$props => {
		if ("__awaiter" in $$props) __awaiter = $$props.__awaiter;
		if ("kosan" in $$props) $$invalidate(0, kosan = $$props.kosan);
		if ("selected_kosan" in $$props) $$invalidate(1, selected_kosan = $$props.selected_kosan);
		if ("sewa_kos" in $$props) $$invalidate(2, sewa_kos = $$props.sewa_kos);
		if ("Usr" in $$props) $$invalidate(4, Usr = $$props.Usr);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		kosan,
		selected_kosan,
		sewa_kos,
		sewa,
		Usr,
		click_handler,
		input0_input_handler,
		change_handler,
		input1_input_handler,
		click_handler_1
	];
}

class Kosan extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Kosan",
			options,
			id: create_fragment$7.name
		});
	}
}

/* src\user\Dasbor.svelte generated by Svelte v3.29.4 */

const { console: console_1$1 } = globals;
const file$8 = "src\\user\\Dasbor.svelte";

function get_each_context$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[18] = list[i];
	child_ctx[20] = i;
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[18] = list[i];
	child_ctx[20] = i;
	return child_ctx;
}

// (297:32) {#each data_pesanan as data, i}
function create_each_block_1(ctx) {
	let div;
	let strong;
	let t0;
	let t1_value = /*data*/ ctx[18].id_pesanan + "";
	let t1;
	let t2;
	let mounted;
	let dispose;

	function click_handler_1(...args) {
		return /*click_handler_1*/ ctx[6](/*i*/ ctx[20], ...args);
	}

	const block = {
		c: function create() {
			div = element("div");
			strong = element("strong");
			t0 = text("Id pesanan: ");
			t1 = text(t1_value);
			t2 = space();
			add_location(strong, file$8, 298, 36, 10088);
			attr_dev(div, "class", "pesanan");
			add_location(div, file$8, 297, 32, 9994);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, strong);
			append_dev(strong, t0);
			append_dev(strong, t1);
			append_dev(div, t2);

			if (!mounted) {
				dispose = listen_dev(div, "click", click_handler_1, false, false, false);
				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*data_pesanan*/ 1 && t1_value !== (t1_value = /*data*/ ctx[18].id_pesanan + "")) set_data_dev(t1, t1_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1.name,
		type: "each",
		source: "(297:32) {#each data_pesanan as data, i}",
		ctx
	});

	return block;
}

// (325:32) {#each data_transaksi as data, i}
function create_each_block$1(ctx) {
	let div;
	let strong;
	let t0;
	let t1_value = /*data*/ ctx[18].id_transaksi + "";
	let t1;
	let t2;
	let mounted;
	let dispose;

	function click_handler_3(...args) {
		return /*click_handler_3*/ ctx[8](/*i*/ ctx[20], ...args);
	}

	const block = {
		c: function create() {
			div = element("div");
			strong = element("strong");
			t0 = text("Id Pembayaran: ");
			t1 = text(t1_value);
			t2 = space();
			add_location(strong, file$8, 326, 36, 11478);
			attr_dev(div, "class", "pesanan");
			add_location(div, file$8, 325, 32, 11381);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, strong);
			append_dev(strong, t0);
			append_dev(strong, t1);
			append_dev(div, t2);

			if (!mounted) {
				dispose = listen_dev(div, "click", click_handler_3, false, false, false);
				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*data_transaksi*/ 2 && t1_value !== (t1_value = /*data*/ ctx[18].id_transaksi + "")) set_data_dev(t1, t1_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$1.name,
		type: "each",
		source: "(325:32) {#each data_transaksi as data, i}",
		ctx
	});

	return block;
}

function create_fragment$8(ctx) {
	let div21;
	let div20;
	let div1;
	let div0;
	let a0;
	let t1;
	let a1;
	let t3;
	let a2;
	let t5;
	let a3;
	let t7;
	let div19;
	let div18;
	let div8;
	let div7;
	let div3;
	let strong0;
	let t9;
	let div2;
	let t10;
	let div5;
	let strong1;
	let t12;
	let div4;
	let t13;
	let div6;
	let button0;
	let br0;
	let br1;
	let t15;
	let button1;
	let t17;
	let div15;
	let div14;
	let div10;
	let strong2;
	let t19;
	let div9;
	let t20;
	let div12;
	let strong3;
	let t22;
	let div11;
	let t23;
	let div13;
	let button2;
	let br2;
	let br3;
	let t25;
	let button3;
	let t27;
	let div16;
	let t29;
	let div17;
	let mounted;
	let dispose;
	let each_value_1 = /*data_pesanan*/ ctx[0];
	validate_each_argument(each_value_1);
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	let each_value = /*data_transaksi*/ ctx[1];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div21 = element("div");
			div20 = element("div");
			div1 = element("div");
			div0 = element("div");
			a0 = element("a");
			a0.textContent = "Pemesanan";
			t1 = space();
			a1 = element("a");
			a1.textContent = "Pembayaran";
			t3 = space();
			a2 = element("a");
			a2.textContent = "Messages";
			t5 = space();
			a3 = element("a");
			a3.textContent = "Profiles";
			t7 = space();
			div19 = element("div");
			div18 = element("div");
			div8 = element("div");
			div7 = element("div");
			div3 = element("div");
			strong0 = element("strong");
			strong0.textContent = "List Pesanan Kamar";
			t9 = space();
			div2 = element("div");

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t10 = space();
			div5 = element("div");
			strong1 = element("strong");
			strong1.textContent = "Keterangan";
			t12 = space();
			div4 = element("div");
			t13 = space();
			div6 = element("div");
			button0 = element("button");
			button0.textContent = "Lanjutkan Pembayaran";
			br0 = element("br");
			br1 = element("br");
			t15 = space();
			button1 = element("button");
			button1.textContent = "Batalkan Pemesanan";
			t17 = space();
			div15 = element("div");
			div14 = element("div");
			div10 = element("div");
			strong2 = element("strong");
			strong2.textContent = "Pembayaran";
			t19 = space();
			div9 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t20 = space();
			div12 = element("div");
			strong3 = element("strong");
			strong3.textContent = "Keterangan";
			t22 = space();
			div11 = element("div");
			t23 = space();
			div13 = element("div");
			button2 = element("button");
			button2.textContent = "Bayar Sekarang";
			br2 = element("br");
			br3 = element("br");
			t25 = space();
			button3 = element("button");
			button3.textContent = "Batalkan Pemesanan";
			t27 = space();
			div16 = element("div");
			div16.textContent = "SEGERA HADIR :)";
			t29 = space();
			div17 = element("div");
			div17.textContent = "SEGERA HADIR :)";
			attr_dev(a0, "class", "nav-link active svelte-19s0ulu");
			attr_dev(a0, "id", "v-pills-home-tab");
			attr_dev(a0, "data-toggle", "pill");
			attr_dev(a0, "href", "#v-pills-home");
			attr_dev(a0, "role", "tab");
			attr_dev(a0, "aria-controls", "v-pills-home");
			attr_dev(a0, "aria-selected", "true");
			add_location(a0, file$8, 251, 16, 7984);
			attr_dev(a1, "class", "nav-link svelte-19s0ulu");
			attr_dev(a1, "id", "v-pills-profile-tab");
			attr_dev(a1, "data-toggle", "pill");
			attr_dev(a1, "href", "#v-pills-profile");
			attr_dev(a1, "role", "tab");
			attr_dev(a1, "aria-controls", "v-pills-profile");
			attr_dev(a1, "aria-selected", "false");
			add_location(a1, file$8, 259, 16, 8312);
			attr_dev(a2, "class", "nav-link svelte-19s0ulu");
			attr_dev(a2, "id", "v-pills-messages-tab");
			attr_dev(a2, "data-toggle", "pill");
			attr_dev(a2, "href", "#v-pills-messages");
			attr_dev(a2, "role", "tab");
			attr_dev(a2, "aria-controls", "v-pills-messages");
			attr_dev(a2, "aria-selected", "false");
			add_location(a2, file$8, 267, 16, 8680);
			attr_dev(a3, "class", "nav-link svelte-19s0ulu");
			attr_dev(a3, "id", "v-pills-settings-tab");
			attr_dev(a3, "data-toggle", "pill");
			attr_dev(a3, "href", "#v-pills-settings");
			attr_dev(a3, "role", "tab");
			attr_dev(a3, "aria-controls", "v-pills-settings");
			attr_dev(a3, "aria-selected", "false");
			add_location(a3, file$8, 275, 16, 9013);
			attr_dev(div0, "class", "nav flex-column nav-pills text-left svelte-19s0ulu");
			attr_dev(div0, "id", "v-pills-tab");
			attr_dev(div0, "role", "tablist");
			attr_dev(div0, "aria-orientation", "vertical");
			add_location(div0, file$8, 246, 12, 7789);
			attr_dev(div1, "class", "col-3 pt-3 pb-2 bg-white");
			attr_dev(div1, "id", "user-menu");
			add_location(div1, file$8, 245, 8, 7722);
			add_location(strong0, file$8, 294, 28, 9812);
			attr_dev(div2, "class", "list svelte-19s0ulu");
			add_location(div2, file$8, 295, 28, 9877);
			attr_dev(div3, "class", "col-4 mb-3");
			add_location(div3, file$8, 293, 24, 9758);
			add_location(strong1, file$8, 304, 28, 10358);
			attr_dev(div4, "class", "keterangan svelte-19s0ulu");
			attr_dev(div4, "id", "ket");
			add_location(div4, file$8, 305, 28, 10415);
			attr_dev(div5, "class", "col-4");
			add_location(div5, file$8, 303, 24, 10309);
			attr_dev(button0, "class", "btn btn-success p-2");
			add_location(button0, file$8, 310, 28, 10593);
			add_location(br0, file$8, 310, 133, 10698);
			add_location(br1, file$8, 310, 137, 10702);
			attr_dev(button1, "class", "btn btn-danger p-2");
			add_location(button1, file$8, 311, 28, 10736);
			attr_dev(div6, "class", "col-4");
			add_location(div6, file$8, 309, 24, 10544);
			attr_dev(div7, "class", "d-flex align-items-center pt-4");
			add_location(div7, file$8, 292, 20, 9688);
			attr_dev(div8, "class", "tab-pane fade show active");
			attr_dev(div8, "id", "v-pills-home");
			attr_dev(div8, "role", "tabpanel");
			attr_dev(div8, "aria-labelledby", "v-pills-home-tab");
			add_location(div8, file$8, 287, 16, 9474);
			add_location(strong2, file$8, 322, 28, 11205);
			attr_dev(div9, "class", "list svelte-19s0ulu");
			add_location(div9, file$8, 323, 28, 11262);
			attr_dev(div10, "class", "col-4 mb-3");
			add_location(div10, file$8, 321, 24, 11151);
			add_location(strong3, file$8, 332, 28, 11753);
			attr_dev(div11, "class", "keterangan svelte-19s0ulu");
			attr_dev(div11, "id", "ketp");
			add_location(div11, file$8, 333, 28, 11810);
			attr_dev(div12, "class", "col-4");
			add_location(div12, file$8, 331, 24, 11704);
			attr_dev(button2, "class", "btn btn-success p-2");
			add_location(button2, file$8, 336, 28, 11957);
			add_location(br2, file$8, 336, 131, 12060);
			add_location(br3, file$8, 336, 135, 12064);
			attr_dev(button3, "class", "btn btn-danger p-2");
			add_location(button3, file$8, 337, 28, 12098);
			attr_dev(div13, "class", "col-4");
			add_location(div13, file$8, 335, 24, 11908);
			attr_dev(div14, "class", "row");
			add_location(div14, file$8, 320, 20, 11108);
			attr_dev(div15, "class", "tab-pane fade");
			attr_dev(div15, "id", "v-pills-profile");
			attr_dev(div15, "role", "tabpanel");
			attr_dev(div15, "aria-labelledby", "v-pills-profile-tab");
			add_location(div15, file$8, 315, 16, 10900);
			attr_dev(div16, "class", "tab-pane fade");
			attr_dev(div16, "id", "v-pills-messages");
			attr_dev(div16, "role", "tabpanel");
			attr_dev(div16, "aria-labelledby", "v-pills-messages-tab");
			add_location(div16, file$8, 341, 16, 12262);
			attr_dev(div17, "class", "tab-pane fade");
			attr_dev(div17, "id", "v-pills-settings");
			attr_dev(div17, "role", "tabpanel");
			attr_dev(div17, "aria-labelledby", "v-pills-settings-tab");
			add_location(div17, file$8, 348, 16, 12529);
			attr_dev(div18, "class", "tab-content");
			attr_dev(div18, "id", "v-pills-tabContent");
			add_location(div18, file$8, 286, 12, 9407);
			attr_dev(div19, "class", "col-9");
			add_location(div19, file$8, 285, 8, 9374);
			attr_dev(div20, "class", "row border rounded p-2 bg-white dasbor svelte-19s0ulu");
			add_location(div20, file$8, 244, 4, 7660);
			attr_dev(div21, "class", "mt-5 pt-4");
			add_location(div21, file$8, 243, 0, 7631);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div21, anchor);
			append_dev(div21, div20);
			append_dev(div20, div1);
			append_dev(div1, div0);
			append_dev(div0, a0);
			append_dev(div0, t1);
			append_dev(div0, a1);
			append_dev(div0, t3);
			append_dev(div0, a2);
			append_dev(div0, t5);
			append_dev(div0, a3);
			append_dev(div20, t7);
			append_dev(div20, div19);
			append_dev(div19, div18);
			append_dev(div18, div8);
			append_dev(div8, div7);
			append_dev(div7, div3);
			append_dev(div3, strong0);
			append_dev(div3, t9);
			append_dev(div3, div2);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].m(div2, null);
			}

			append_dev(div7, t10);
			append_dev(div7, div5);
			append_dev(div5, strong1);
			append_dev(div5, t12);
			append_dev(div5, div4);
			append_dev(div7, t13);
			append_dev(div7, div6);
			append_dev(div6, button0);
			append_dev(div6, br0);
			append_dev(div6, br1);
			append_dev(div6, t15);
			append_dev(div6, button1);
			append_dev(div18, t17);
			append_dev(div18, div15);
			append_dev(div15, div14);
			append_dev(div14, div10);
			append_dev(div10, strong2);
			append_dev(div10, t19);
			append_dev(div10, div9);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div9, null);
			}

			append_dev(div14, t20);
			append_dev(div14, div12);
			append_dev(div12, strong3);
			append_dev(div12, t22);
			append_dev(div12, div11);
			append_dev(div14, t23);
			append_dev(div14, div13);
			append_dev(div13, button2);
			append_dev(div13, br2);
			append_dev(div13, br3);
			append_dev(div13, t25);
			append_dev(div13, button3);
			append_dev(div18, t27);
			append_dev(div18, div16);
			append_dev(div18, t29);
			append_dev(div18, div17);

			if (!mounted) {
				dispose = [
					listen_dev(a1, "click", /*click_handler*/ ctx[5], false, false, false),
					listen_dev(button0, "click", /*click_handler_2*/ ctx[7], false, false, false),
					listen_dev(button2, "click", /*click_handler_4*/ ctx[9], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*getInfoPesanan, data_pesanan*/ 5) {
				each_value_1 = /*data_pesanan*/ ctx[0];
				validate_each_argument(each_value_1);
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1(ctx, each_value_1, i);

					if (each_blocks_1[i]) {
						each_blocks_1[i].p(child_ctx, dirty);
					} else {
						each_blocks_1[i] = create_each_block_1(child_ctx);
						each_blocks_1[i].c();
						each_blocks_1[i].m(div2, null);
					}
				}

				for (; i < each_blocks_1.length; i += 1) {
					each_blocks_1[i].d(1);
				}

				each_blocks_1.length = each_value_1.length;
			}

			if (dirty & /*getInfoPembayaran, data_transaksi*/ 10) {
				each_value = /*data_transaksi*/ ctx[1];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$1(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div9, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div21);
			destroy_each(each_blocks_1, detaching);
			destroy_each(each_blocks, detaching);
			mounted = false;
			run_all(dispose);
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

function instance$8($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Dasbor", slots, []);
	let data_pesanan = [];
	let data_transaksi = [];
	let selected_index = 0;
	let selected_index_p = 0;

	class Toast extends myToast {
		// Konstruktor
		constructor(judul, teks, tipe) {
			super(judul, teks, tipe);

			// Properti
			this.toast = sweetalert2_all.mixin({
				toast: true,
				position: "top-end",
				showConfirmButton: false,
				timer: 3000,
				timerProgressBar: true,
				didOpen: toast => {
					toast.addEventListener("mouseenter", sweetalert2_all.stopTimer);
					toast.addEventListener("mouseleave", sweetalert2_all.resumeTimer);
				}
			});
		}

		// method untuk menampilkan toast
		show() {
			this.toast.fire({
				icon: this.tipe != "success" ? "error" : "success",
				title: this.judul
			});
		}

		// method untuk ambil waktu saat ini
		getTime() {
			let waktu;
			let w_panjang;
			let jam;
			waktu = new Date();
			w_panjang = waktu.toTimeString();
			jam = parseInt(w_panjang.slice(0, 2));

			if (jam >= 0 && jam <= 11) {
				return "pagi";
			} else if (jam >= 12 && jam <= 18) {
				return "siang";
			} else {
				return "malam";
			}
		}
	}

	class User extends Users {
		constructor(id) {
			super();
			this.id_user = id;
		}

		getPesanan() {
			try {
				axios$1.get("http://localhost:3002/users/pesanan", {
					headers: {
						Authorization: localStorage.getItem("user"),
						id_user: this.id_user
					}
				}).then(res => {
					let respon = res.data;
					$$invalidate(0, data_pesanan = respon.data);
				});
			} catch(error) {
				alert(error);
			}
		}

		getTransaksi() {
			try {
				axios$1.get("http://localhost:3002/users/transaksi", {
					headers: {
						Authorization: localStorage.getItem("user"),
						id_user: this.id_user
					}
				}).then(res => {
					let respon = res.data;
					$$invalidate(1, data_transaksi = respon.data);
				});
			} catch(error) {
				
			}
		}

		tambahPembayaran() {
			try {
				const headers = new Headers();
				headers.append("Content-Type", "application/x-www-form-urlencoded");
				headers.append("Authorization", localStorage.getItem("user"));
				const body = `id_penyewa=${data_pesanan[selected_index].id_user}&id_kos=${data_pesanan[selected_index].id_kos}&n_kamar=${data_pesanan[selected_index].n_kamar}&nominal=${data_pesanan[selected_index].nominal}`;
				const init = { method: "POST", headers, body };

				fetch("http://localhost:3002/users/tambah-transaksi", init).then(response => {
					console.log(response.json());
					alert("Berhasil! Silahkan lanjut ke pembayaran!");
				}).catch(e => {
					// error in e.message
					alert(e.message);
				});
			} catch(error) {
				alert(error);
			}
		}

		konfirmasiPembayaran() {
			try {
				if (selected_index_p < 0) {
					alert("Mohon pilih transaksi!");
					return;
				}

				axios$1.post("http://localhost:3002/users/selesaikan-transaksi", { status_pembayaran: "selesai(user)" }, {
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						"Authorization": localStorage.getItem("user"),
						"id_transaksi": data_transaksi[selected_index_p].id_transaksi,
						"id_penyewa": data_transaksi[selected_index_p].id_penyewa,
						"id_kos": data_transaksi[selected_index_p].id_kosan
					}
				}).then(res => {
					let respon = res.data;
					alert(respon.message);
				});
			} catch(error) {
				alert(error);
			}
		}
	}

	function getInfoPesanan(index) {
		let keterangan = ``;

		// index array data pesanan yang diklik
		selected_index = index;

		keterangan = `
        <strong>Info Pemesanan</strong>
        <table class="text-left">
        <tr style="line-height: 25px;">
            <td>Id Pemesanan</td><td>:</td><td>${data_pesanan[index].id_pesanan}</td>
        </tr>
        <tr style="line-height: 25px;">
            <td>Lama Sewa</td><td>:</td><td>${data_pesanan[index].lama_tinggal} bulan</td>
        </tr>
        <tr style="line-height: 25px;">
            <td>Kamar dipesan</td><td>:</td><td>${data_pesanan[index].n_kamar} unit</td>
        </tr>
        <tr style="line-height: 25px;">
            <td>Ketersediaan Kamar</td><td>:</td><td>${data_pesanan[index].ketersediaan}</td>
        </tr>
        </table>
        `;

		// show keterangan
		document.getElementById("ket").innerHTML = keterangan;
	}

	function getInfoPembayaran(index) {
		let keterangan = ``;

		// index array data pesanan yang diklik
		selected_index_p = index;

		keterangan = `
        <strong>Info Pemesanan</strong>
        <table class="text-left">
        <tr style="line-height: 25px;">
            <td>Id Transaksi</td><td>:</td><td>${data_transaksi[index].id_transaksi}</td>
        </tr>
        <tr style="line-height: 25px;">
            <td>Kode Transaksi</td><td>:</td><td>${data_transaksi[index].kode_transaksi}</td>
        </tr>
        <tr style="line-height: 25px;">
            <td>Nominal</td><td>:</td><td>Rp ${data_transaksi[index].nominal}</td>
        </tr>
        <tr style="line-height: 25px;">
            <td>Kamar dipesan</td><td>:</td><td>${data_transaksi[index].n_kamar} unit</td>
        </tr>
        <tr style="line-height: 25px;">
            <td>Status Transaksir</td><td>:</td><td>${data_transaksi[index].status_transaksi}</td>
        </tr>
        </table>
        `;

		// show keterangan
		document.getElementById("ketp").innerHTML = keterangan;
	}

	let time = function () {
		let waktu;
		let w_panjang;
		let jam;
		waktu = new Date();
		w_panjang = waktu.toTimeString();
		jam = parseInt(w_panjang.slice(0, 2));

		if (jam >= 0 && jam <= 11) {
			return "pagi";
		} else if (jam >= 12 && jam <= 18) {
			return "siang";
		} else {
			return "malam";
		}
	};

	let waktu = time();
	let nama = localStorage.getItem("nama_user");

	// Instansiasi objek toast
	let info_toast = new Toast(`Berhasil login! Selamat ${waktu} ${nama}`, "", "success");

	// pesan welcome
	info_toast.show();

	let Usr = new User(parseInt(localStorage.getItem("id_user")));
	Usr.getPesanan();
	Usr.getTransaksi();
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<Dasbor> was created with unknown prop '${key}'`);
	});

	const click_handler = () => Usr.getTransaksi();
	const click_handler_1 = i => getInfoPesanan(i);
	const click_handler_2 = () => Usr.tambahPembayaran();
	const click_handler_3 = i => getInfoPembayaran(i);
	const click_handler_4 = () => Usr.konfirmasiPembayaran();

	$$self.$capture_state = () => ({
		myToast,
		Users,
		Swal: sweetalert2_all,
		axios: axios$1,
		data_pesanan,
		data_transaksi,
		selected_index,
		selected_index_p,
		Toast,
		User,
		getInfoPesanan,
		getInfoPembayaran,
		time,
		waktu,
		nama,
		info_toast,
		Usr
	});

	$$self.$inject_state = $$props => {
		if ("data_pesanan" in $$props) $$invalidate(0, data_pesanan = $$props.data_pesanan);
		if ("data_transaksi" in $$props) $$invalidate(1, data_transaksi = $$props.data_transaksi);
		if ("selected_index" in $$props) selected_index = $$props.selected_index;
		if ("selected_index_p" in $$props) selected_index_p = $$props.selected_index_p;
		if ("time" in $$props) time = $$props.time;
		if ("waktu" in $$props) waktu = $$props.waktu;
		if ("nama" in $$props) nama = $$props.nama;
		if ("info_toast" in $$props) info_toast = $$props.info_toast;
		if ("Usr" in $$props) $$invalidate(4, Usr = $$props.Usr);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		data_pesanan,
		data_transaksi,
		getInfoPesanan,
		getInfoPembayaran,
		Usr,
		click_handler,
		click_handler_1,
		click_handler_2,
		click_handler_3,
		click_handler_4
	];
}

class Dasbor extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Dasbor",
			options,
			id: create_fragment$8.name
		});
	}
}

class Login {
    constructor(username, password, url) {
        // this._username = this.validasiUser(username) ? username : '';
        this._username = username;
        this._password = password;
        this.LOGIN_API_URL = url;
    }
    validasiUser(username) {
        return username != '';
    }
    doLogin(level) {
        switch (level) {
            case 'user':
                this.Login(this.username, this.password, level);
                break;
            case 'owner':
                this.Login(this.username, this.password, level);
                break;
            case 'admin':
                this.Login(this.username, this.password, level);
                break;
        }
    }
    async Login(username, password, level) {
        try {
            const response = await fetch(this.LOGIN_API_URL, {
                method: "POST",
                body: JSON.stringify({ username: username, password: password }),
                headers: { "Content-type": "application/x-www-form-urlencoded" }
            });
            let hasil = await response.json();
            if (hasil.message == "Berhasil login") {
                window.open(`http://localhost:5000/${level}/dasbor`, "_self");
                // set localStorage
                this.loginSession(level);
            }
            else {
                this.login_state = 0;
            }
        }
        catch (error) {
            this.login_state = 0;
        }
    }
    loginSession(level) {
        // set localStorage
        localStorage.setItem(level, this.result.token);
        localStorage.setItem(this.username, this.result.username);
        localStorage.setItem('login', level);
    }
    clearSession() {
        localStorage.clear();
    }
    set username(uname) {
        this._username = uname;
    }
    get username() {
        return this._username;
    }
    set password(pass) {
        this._password = pass;
    }
    set lvl(level) {
        this._lvl = level;
    }
    set apiURL(url) {
        this.LOGIN_API_URL = url;
    }
    set login_state(num) {
        switch (num) {
            case 0:
                this._login_state = 0;
                break;
            case 1:
                this._login_state = 1;
                break;
            case 2:
                this._login_state = 2;
                break;
            default:
                this._login_state = -1;
                break;
        }
    }
    get res() {
        return this.result;
    }
}

/* src\user\Login.svelte generated by Svelte v3.29.4 */

const { console: console_1$2 } = globals;
const file$9 = "src\\user\\Login.svelte";

// (77:6) {#if login_state === -1}
function create_if_block$2(ctx) {
	let html_tag;
	let raw_value = /*notiflogin*/ ctx[3].showAlert() + "";
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
		id: create_if_block$2.name,
		type: "if",
		source: "(77:6) {#if login_state === -1}",
		ctx
	});

	return block;
}

function create_fragment$9(ctx) {
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
	let t10;
	let p;
	let t11;
	let a;
	let mounted;
	let dispose;
	let if_block = /*login_state*/ ctx[2] === -1 && create_if_block$2(ctx);

	const block = {
		c: function create() {
			div5 = element("div");
			div4 = element("div");
			div3 = element("div");
			h3 = element("h3");
			h3.textContent = "User Login";
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
			t10 = space();
			p = element("p");
			t11 = text("Belum punya akun?\r\n          ");
			a = element("a");
			a.textContent = "Daftar disini";
			attr_dev(h3, "class", "card-title mb-5");
			add_location(h3, file$9, 75, 6, 3044);
			attr_dev(label0, "for", "txtusernamae");
			attr_dev(label0, "class", "form-label");
			add_location(label0, file$9, 80, 8, 3208);
			attr_dev(input0, "type", "text");
			attr_dev(input0, "class", "form-control");
			attr_dev(input0, "id", "txtusernamae");
			attr_dev(input0, "placeholder", "");
			add_location(input0, file$9, 81, 8, 3279);
			attr_dev(div0, "class", "mb-3");
			add_location(div0, file$9, 79, 6, 3180);
			attr_dev(label1, "for", "txtpassword");
			attr_dev(label1, "class", "form-label");
			add_location(label1, file$9, 89, 8, 3478);
			attr_dev(input1, "type", "password");
			attr_dev(input1, "class", "form-control");
			attr_dev(input1, "id", "txtpassword");
			attr_dev(input1, "placeholder", "");
			add_location(input1, file$9, 90, 8, 3548);
			attr_dev(div1, "class", "mb-3");
			add_location(div1, file$9, 88, 6, 3450);
			attr_dev(button, "type", "button");
			attr_dev(button, "class", "btn btn-success mb-1");
			add_location(button, file$9, 98, 8, 3749);
			attr_dev(a, "href", "http://localhost:5000/user/signup");
			add_location(a, file$9, 104, 10, 3918);
			add_location(p, file$9, 102, 8, 3874);
			attr_dev(div2, "class", "mb-3");
			add_location(div2, file$9, 97, 6, 3721);
			attr_dev(div3, "class", "card-body");
			add_location(div3, file$9, 74, 4, 3013);
			attr_dev(div4, "class", "card shadow card-bg");
			set_style(div4, "width", "25rem");
			set_style(div4, "margin-top", "70px");
			add_location(div4, file$9, 73, 2, 2935);
			attr_dev(div5, "class", "d-flex justify-content-center mt-4");
			add_location(div5, file$9, 72, 0, 2883);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
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
			set_input_value(input0, /*uname*/ ctx[0]);
			append_dev(div3, t5);
			append_dev(div3, div1);
			append_dev(div1, label1);
			append_dev(div1, t7);
			append_dev(div1, input1);
			set_input_value(input1, /*pass*/ ctx[1]);
			append_dev(div3, t8);
			append_dev(div3, div2);
			append_dev(div2, button);
			append_dev(div2, t10);
			append_dev(div2, p);
			append_dev(p, t11);
			append_dev(p, a);

			if (!mounted) {
				dispose = [
					listen_dev(input0, "input", /*input0_input_handler*/ ctx[5]),
					listen_dev(input1, "input", /*input1_input_handler*/ ctx[6]),
					listen_dev(button, "click", /*login*/ ctx[4], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (/*login_state*/ ctx[2] === -1) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$2(ctx);
					if_block.c();
					if_block.m(div3, t2);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty & /*uname*/ 1 && input0.value !== /*uname*/ ctx[0]) {
				set_input_value(input0, /*uname*/ ctx[0]);
			}

			if (dirty & /*pass*/ 2 && input1.value !== /*pass*/ ctx[1]) {
				set_input_value(input1, /*pass*/ ctx[1]);
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
		id: create_fragment$9.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$9($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Login", slots, []);

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

	let uname;
	let pass;
	let login_state = 0;
	let notiflogin = new myAlert("Username atau password salah!", "danger");
	let res;

	function login() {
		return __awaiter(this, void 0, void 0, function* () {
			try {
				const response = yield axios$1.post("http://localhost:3002/users/login", { username: uname, password: pass });
				res = response.data;

				if (res.message == "Berhasil login") {
					window.open("http://localhost:5000/user/dasbor", "_self");
					localStorage.setItem("user", res.token);
					localStorage.setItem("id_user", res.id_user);
					localStorage.setItem("nama_user", res.username);
					localStorage.setItem("login", "user");
				} else {
					$$invalidate(2, login_state = -1);
				}
			} catch(error) {
				$$invalidate(2, login_state = -1);
			}
		});
	}

	function login1() {
		return __awaiter(this, void 0, void 0, function* () {
			try {
				fetch("http://localhost:3002/users/login", {
					method: "POST",
					headers: {
						"Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
					},
					body: JSON.stringify({ username: uname, password: pass })
				}).then(response => response.json()).then(json => console.log(json)).catch(err => alert(err));
			} catch(error) {
				alert(error); // if (res.message == "Berhasil login") {
				$$invalidate(2, login_state = -1);
			}
		});
	}

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$2.warn(`<Login> was created with unknown prop '${key}'`);
	});

	function input0_input_handler() {
		uname = this.value;
		$$invalidate(0, uname);
	}

	function input1_input_handler() {
		pass = this.value;
		$$invalidate(1, pass);
	}

	$$self.$capture_state = () => ({
		__awaiter,
		myAlert,
		axios: axios$1,
		Login,
		uname,
		pass,
		login_state,
		notiflogin,
		res,
		login,
		login1
	});

	$$self.$inject_state = $$props => {
		if ("__awaiter" in $$props) __awaiter = $$props.__awaiter;
		if ("uname" in $$props) $$invalidate(0, uname = $$props.uname);
		if ("pass" in $$props) $$invalidate(1, pass = $$props.pass);
		if ("login_state" in $$props) $$invalidate(2, login_state = $$props.login_state);
		if ("notiflogin" in $$props) $$invalidate(3, notiflogin = $$props.notiflogin);
		if ("res" in $$props) res = $$props.res;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		uname,
		pass,
		login_state,
		notiflogin,
		login,
		input0_input_handler,
		input1_input_handler
	];
}

class Login_1 extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Login_1",
			options,
			id: create_fragment$9.name
		});
	}
}

/* src\user\index.user.svelte generated by Svelte v3.29.4 */

// (7:0) {:else}
function create_else_block$1(ctx) {
	let switch_instance;
	let switch_instance_anchor;
	let current;
	var switch_value = Login_1;

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
			if (switch_value !== (switch_value = Login_1)) {
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
		id: create_else_block$1.name,
		type: "else",
		source: "(7:0) {:else}",
		ctx
	});

	return block;
}

// (5:0) {#if localStorage.getItem('login') == 'user'}
function create_if_block$3(ctx) {
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
		id: create_if_block$3.name,
		type: "if",
		source: "(5:0) {#if localStorage.getItem('login') == 'user'}",
		ctx
	});

	return block;
}

function create_fragment$a(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block$3, create_else_block$1];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (localStorage.getItem("login") == "user") return 0;
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
		id: create_fragment$a.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$a($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("User", slots, []);
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<User> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({ Dasbor, Login: Login_1 });
	return [];
}

class User extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "User",
			options,
			id: create_fragment$a.name
		});
	}
}

/* src\admin\components.verifikasi.kos.svelte generated by Svelte v3.29.4 */

const { console: console_1$3 } = globals;
const file$a = "src\\admin\\components.verifikasi.kos.svelte";

function get_each_context_1$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[14] = list[i];
	return child_ctx;
}

function get_each_context$2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[11] = list[i];
	child_ctx[13] = i;
	return child_ctx;
}

// (197:20) {#if data.id_pemilik == datao.id_owner}
function create_if_block$4(ctx) {
	let p;
	let strong;
	let t0;
	let t1_value = /*datao*/ ctx[14].nama_owner + "";
	let t1;
	let br;
	let t2;
	let t3_value = /*data*/ ctx[11].nama_kos + "";
	let t3;

	const block = {
		c: function create() {
			p = element("p");
			strong = element("strong");
			t0 = text("Username: ");
			t1 = text(t1_value);
			br = element("br");
			t2 = text("\n                        Nama Kosan :");
			t3 = text(t3_value);
			add_location(strong, file$a, 198, 24, 6369);
			add_location(br, file$a, 198, 69, 6414);
			add_location(p, file$a, 197, 22, 6341);
		},
		m: function mount(target, anchor) {
			insert_dev(target, p, anchor);
			append_dev(p, strong);
			append_dev(strong, t0);
			append_dev(strong, t1);
			append_dev(p, br);
			append_dev(p, t2);
			append_dev(p, t3);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*data_owner*/ 2 && t1_value !== (t1_value = /*datao*/ ctx[14].nama_owner + "")) set_data_dev(t1, t1_value);
			if (dirty & /*data_kosan*/ 1 && t3_value !== (t3_value = /*data*/ ctx[11].nama_kos + "")) set_data_dev(t3, t3_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(p);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$4.name,
		type: "if",
		source: "(197:20) {#if data.id_pemilik == datao.id_owner}",
		ctx
	});

	return block;
}

// (196:18) {#each data_owner as datao}
function create_each_block_1$1(ctx) {
	let if_block_anchor;
	let if_block = /*data*/ ctx[11].id_pemilik == /*datao*/ ctx[14].id_owner && create_if_block$4(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, dirty) {
			if (/*data*/ ctx[11].id_pemilik == /*datao*/ ctx[14].id_owner) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$4(ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1$1.name,
		type: "each",
		source: "(196:18) {#each data_owner as datao}",
		ctx
	});

	return block;
}

// (191:14) {#each data_kosan as data, i}
function create_each_block$2(ctx) {
	let div;
	let t;
	let div_id_value;
	let mounted;
	let dispose;
	let each_value_1 = /*data_owner*/ ctx[1];
	validate_each_argument(each_value_1);
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
	}

	function click_handler(...args) {
		return /*click_handler*/ ctx[5](/*data*/ ctx[11], ...args);
	}

	const block = {
		c: function create() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t = space();
			attr_dev(div, "class", "kosan-perlu-verifikasi");
			attr_dev(div, "id", div_id_value = (/*i*/ ctx[13] + 1).toString());
			add_location(div, file$a, 191, 16, 6037);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}

			append_dev(div, t);

			if (!mounted) {
				dispose = listen_dev(div, "click", click_handler, false, false, false);
				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*data_kosan, data_owner*/ 3) {
				each_value_1 = /*data_owner*/ ctx[1];
				validate_each_argument(each_value_1);
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_1$1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, t);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_1.length;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$2.name,
		type: "each",
		source: "(191:14) {#each data_kosan as data, i}",
		ctx
	});

	return block;
}

function create_fragment$b(ctx) {
	let div13;
	let div0;
	let t0;
	let span;
	let t1_value = /*data_kosan*/ ctx[0].length + "";
	let t1;
	let t2;
	let div12;
	let div11;
	let div4;
	let div3;
	let div2;
	let h50;
	let t4;
	let div1;
	let t5;
	let div8;
	let div7;
	let div6;
	let h51;
	let t7;
	let div5;
	let t8;
	let div10;
	let div9;
	let button0;
	let t10;
	let button1;
	let mounted;
	let dispose;
	let each_value = /*data_kosan*/ ctx[0];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div13 = element("div");
			div0 = element("div");
			t0 = text("Perlu Verifikasi\n    ");
			span = element("span");
			t1 = text(t1_value);
			t2 = space();
			div12 = element("div");
			div11 = element("div");
			div4 = element("div");
			div3 = element("div");
			div2 = element("div");
			h50 = element("h5");
			h50.textContent = "List";
			t4 = space();
			div1 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t5 = space();
			div8 = element("div");
			div7 = element("div");
			div6 = element("div");
			h51 = element("h5");
			h51.textContent = "KETERANGAN";
			t7 = space();
			div5 = element("div");
			t8 = space();
			div10 = element("div");
			div9 = element("div");
			button0 = element("button");
			button0.textContent = "Tolak";
			t10 = space();
			button1 = element("button");
			button1.textContent = "Terima";
			attr_dev(span, "class", "badge badge-warning");
			attr_dev(span, "id", "counter");
			add_location(span, file$a, 181, 4, 5631);
			attr_dev(div0, "class", "card-header text-left svelte-1sz7fpx");
			add_location(div0, file$a, 179, 2, 5570);
			attr_dev(h50, "class", "card-title text-left");
			add_location(h50, file$a, 188, 12, 5883);
			attr_dev(div1, "class", "list text-left svelte-1sz7fpx");
			attr_dev(div1, "id", "list");
			add_location(div1, file$a, 189, 12, 5938);
			attr_dev(div2, "class", "card-body");
			add_location(div2, file$a, 187, 10, 5847);
			attr_dev(div3, "class", "card");
			add_location(div3, file$a, 186, 8, 5818);
			attr_dev(div4, "class", "col-4");
			add_location(div4, file$a, 185, 6, 5790);
			attr_dev(h51, "class", "card-title text-left");
			add_location(h51, file$a, 212, 12, 6760);
			attr_dev(div5, "class", "list svelte-1sz7fpx");
			attr_dev(div5, "id", "ket");
			add_location(div5, file$a, 213, 12, 6821);
			attr_dev(div6, "class", "card-body");
			add_location(div6, file$a, 211, 10, 6724);
			attr_dev(div7, "class", "card");
			add_location(div7, file$a, 210, 8, 6695);
			attr_dev(div8, "class", "col-5");
			add_location(div8, file$a, 209, 6, 6667);
			attr_dev(button0, "class", "btn btn-danger m-2");
			add_location(button0, file$a, 219, 10, 6981);
			attr_dev(button1, "class", "btn btn-success m-2");
			add_location(button1, file$a, 220, 10, 7101);
			attr_dev(div9, "class", "d-flex flex-column-reverse");
			add_location(div9, file$a, 218, 8, 6930);
			attr_dev(div10, "class", "col-3");
			add_location(div10, file$a, 217, 6, 6902);
			attr_dev(div11, "class", "d-flex align-items-center");
			add_location(div11, file$a, 184, 4, 5744);
			attr_dev(div12, "class", "card-body");
			add_location(div12, file$a, 183, 2, 5716);
			attr_dev(div13, "class", "card");
			add_location(div13, file$a, 178, 0, 5549);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div13, anchor);
			append_dev(div13, div0);
			append_dev(div0, t0);
			append_dev(div0, span);
			append_dev(span, t1);
			append_dev(div13, t2);
			append_dev(div13, div12);
			append_dev(div12, div11);
			append_dev(div11, div4);
			append_dev(div4, div3);
			append_dev(div3, div2);
			append_dev(div2, h50);
			append_dev(div2, t4);
			append_dev(div2, div1);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div1, null);
			}

			append_dev(div11, t5);
			append_dev(div11, div8);
			append_dev(div8, div7);
			append_dev(div7, div6);
			append_dev(div6, h51);
			append_dev(div6, t7);
			append_dev(div6, div5);
			append_dev(div11, t8);
			append_dev(div11, div10);
			append_dev(div10, div9);
			append_dev(div9, button0);
			append_dev(div9, t10);
			append_dev(div9, button1);

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", /*click_handler_1*/ ctx[6], false, false, false),
					listen_dev(button1, "click", /*click_handler_2*/ ctx[7], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*data_kosan*/ 1 && t1_value !== (t1_value = /*data_kosan*/ ctx[0].length + "")) set_data_dev(t1, t1_value);

			if (dirty & /*getKeterangan, data_kosan, data_owner*/ 11) {
				each_value = /*data_kosan*/ ctx[0];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$2(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$2(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div1, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div13);
			destroy_each(each_blocks, detaching);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$b.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$b($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Components_verifikasi_kos", slots, []);
	let result;
	let data_kosan = [];
	let data_owner = [];
	let i_list = 0;

	class Adm extends Admin {
		constructor(id) {
			super(id);
		}

		konfirmasiPemesanan(id_pemesanan, id_kos, opsi) {
			
		}

		konfirmasiPendaftaran(id_kos, opsi) {
			try {
				if (opsi === "terima") {
					axios$1.post(
						"http://localhost:3002/admin/konfirmasi-pendaftaran",
						{
							"id_kos": data_kosan[i_list].id_kos,
							"status_kosan": "verified"
						},
						{
							headers: {
								Authorization: localStorage.getItem("admin"),
								"Content-Type": "application/x-www-form-urlencoded",
								"id_kos": data_kosan[i_list].id_kos,
								"status_kosan": "verified"
							}
						}
					).then(res => {
						let respon = res.data;
						alert(respon.message);
						document.getElementById("ket").innerHTML = "";
						getKosan();
					}).catch(err => {
						alert(err);
					});
				} else if (opsi === "tolak") {
					axios$1.post(
						"http://localhost:3002/admin/konfirmasi-pendaftaran",
						{
							"id_kos": data_kosan[i_list].id_kos,
							"status_kosan": "not verified"
						},
						{
							headers: {
								Authorization: localStorage.getItem("admin"),
								"Content-Type": "application/x-www-form-urlencoded",
								"id_kos": data_kosan[i_list].id_kos,
								"status_kosan": "not verified"
							}
						}
					).then(res => {
						let respon = res.data;
						alert(respon.message);
						document.getElementById("ket").innerHTML = "";
						getKosan();
					}).catch(err => {
						alert(err);
					});
				} else {
					alert("Error opsi!");
				}
			} catch(error) {
				alert(error);
			}
		}
	}

	function getKosan() {
		try {
			axios$1.get("http://localhost:3002/admin/unverified-kosan", {
				headers: {
					Authorization: localStorage.getItem("admin"),
					status_kosan: "after register"
				}
			}).then(function (response) {
				// respon
				result = response.data;

				if (result.message == "Data Ditemukan!") {
					$$invalidate(0, data_kosan = result.data);
					$$invalidate(1, data_owner = result.data_owner);
					console.log(result);
				} else {
					alert(result.message);
				}
			}).then(function (error) {
				// handle error
				console.log(error);
			});
		} catch(error) {
			alert(error);
		}
	}

	function getKeterangan(id_kosan, id_owner) {
		let keterangan = ``;
		let id_k = 0;
		let id_o = 0;

		// search index
		for (let i = 0; i < data_kosan.length; i++) {
			if (data_kosan[i].id_kos == id_kosan) {
				id_k = i;
			}
		}

		for (let j = 0; j < data_owner.length; j++) {
			if (data_owner[j].id_owner == id_owner) {
				id_o = j;
			}
		}

		keterangan = `
    <table class='text-left'>
      <tr style="line-height: 25px;">
        <td>Nama Kosan</td><td>:</td><td>${data_kosan[id_k].nama_kos}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Alamat Kosan</td><td>:</td><td>${data_kosan[id_k].alamat_kos}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Luas Kamar</td><td>:</td><td>${data_kosan[id_k].luas_kamar}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Jumlah Kamar</td><td>:</td><td>${data_kosan[id_k].jumlah_kamar}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Jumlah Kamar</td><td>:</td><td>${data_kosan[id_k].fasilitas}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Harga Sewa</td><td>:</td><td>${data_kosan[id_k].harga_sewa}</td>
      </tr>
    </table>
    <br/>
    <table class='text-left'>
      <tr style="line-height: 25px;">
        <td>Nama Owner</td><td>:</td><td>${data_owner[id_o].nama_owner}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Alamat Owner</td><td>:</td><td>${data_owner[id_o].alamat_owner}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>No. Telepon</td><td>:</td><td>${data_owner[id_o].no_telpon}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Email</td><td>:</td><td>${data_owner[id_o].email}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>TTL</td><td>:</td><td>${data_owner[id_o].TTL}</td>
      </tr>
    </table>
    `;

		document.getElementById("ket").innerHTML = keterangan;
	}

	let adm = new Adm(parseInt(localStorage.getItem("id_admin")));
	getKosan();
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$3.warn(`<Components_verifikasi_kos> was created with unknown prop '${key}'`);
	});

	const click_handler = data => getKeterangan(data.id_kos, data.id_pemilik);
	const click_handler_1 = () => adm.konfirmasiPendaftaran(i_list, "tolak");
	const click_handler_2 = () => adm.konfirmasiPendaftaran(i_list, "terima");

	$$self.$capture_state = () => ({
		axios: axios$1,
		Admin,
		result,
		data_kosan,
		data_owner,
		i_list,
		Adm,
		getKosan,
		getKeterangan,
		adm
	});

	$$self.$inject_state = $$props => {
		if ("result" in $$props) result = $$props.result;
		if ("data_kosan" in $$props) $$invalidate(0, data_kosan = $$props.data_kosan);
		if ("data_owner" in $$props) $$invalidate(1, data_owner = $$props.data_owner);
		if ("i_list" in $$props) $$invalidate(2, i_list = $$props.i_list);
		if ("adm" in $$props) $$invalidate(4, adm = $$props.adm);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		data_kosan,
		data_owner,
		i_list,
		getKeterangan,
		adm,
		click_handler,
		click_handler_1,
		click_handler_2
	];
}

class Components_verifikasi_kos extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Components_verifikasi_kos",
			options,
			id: create_fragment$b.name
		});
	}
}

/* src\admin\components.pemesanan.svelte generated by Svelte v3.29.4 */
const file$b = "src\\admin\\components.pemesanan.svelte";

function get_each_context$3(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[12] = list[i];
	child_ctx[14] = i;
	return child_ctx;
}

// (219:14) {#each data_pemesanan as data, i}
function create_each_block$3(ctx) {
	let div;
	let strong;
	let t0;
	let t1_value = /*data*/ ctx[12].id_pesanan + "";
	let t1;
	let t2;
	let div_id_value;
	let mounted;
	let dispose;

	function click_handler(...args) {
		return /*click_handler*/ ctx[4](/*data*/ ctx[12], ...args);
	}

	const block = {
		c: function create() {
			div = element("div");
			strong = element("strong");
			t0 = text("ID Pesanan: ");
			t1 = text(t1_value);
			t2 = space();
			add_location(strong, file$b, 220, 18, 7561);
			attr_dev(div, "class", "unconfirmed-pesanan svelte-1abhqpz");
			attr_dev(div, "id", div_id_value = /*data*/ ctx[12].id_pesanan);
			add_location(div, file$b, 219, 16, 7407);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, strong);
			append_dev(strong, t0);
			append_dev(strong, t1);
			append_dev(div, t2);

			if (!mounted) {
				dispose = listen_dev(div, "click", click_handler, false, false, false);
				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*data_pemesanan*/ 1 && t1_value !== (t1_value = /*data*/ ctx[12].id_pesanan + "")) set_data_dev(t1, t1_value);

			if (dirty & /*data_pemesanan*/ 1 && div_id_value !== (div_id_value = /*data*/ ctx[12].id_pesanan)) {
				attr_dev(div, "id", div_id_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$3.name,
		type: "each",
		source: "(219:14) {#each data_pemesanan as data, i}",
		ctx
	});

	return block;
}

function create_fragment$c(ctx) {
	let div13;
	let div0;
	let t0;
	let span;
	let t1_value = /*data_pemesanan*/ ctx[0].length + "";
	let t1;
	let t2;
	let div12;
	let div11;
	let div4;
	let div3;
	let div2;
	let h50;
	let t4;
	let div1;
	let t5;
	let div8;
	let div7;
	let div6;
	let h51;
	let t7;
	let div5;
	let t8;
	let div10;
	let div9;
	let button;
	let mounted;
	let dispose;
	let each_value = /*data_pemesanan*/ ctx[0];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div13 = element("div");
			div0 = element("div");
			t0 = text("Perlu Konfirmasi\r\n    ");
			span = element("span");
			t1 = text(t1_value);
			t2 = space();
			div12 = element("div");
			div11 = element("div");
			div4 = element("div");
			div3 = element("div");
			div2 = element("div");
			h50 = element("h5");
			h50.textContent = "List";
			t4 = space();
			div1 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t5 = space();
			div8 = element("div");
			div7 = element("div");
			div6 = element("div");
			h51 = element("h5");
			h51.textContent = "KETERANGAN";
			t7 = space();
			div5 = element("div");
			t8 = space();
			div10 = element("div");
			div9 = element("div");
			button = element("button");
			button.textContent = "KONFIRMASI";
			attr_dev(span, "class", "badge badge-primary");
			add_location(span, file$b, 209, 4, 6999);
			attr_dev(div0, "class", "card-header text-left svelte-1abhqpz");
			add_location(div0, file$b, 207, 2, 6936);
			attr_dev(h50, "class", "card-title text-left");
			add_location(h50, file$b, 216, 12, 7246);
			attr_dev(div1, "class", "list text-left svelte-1abhqpz");
			attr_dev(div1, "id", "list");
			add_location(div1, file$b, 217, 12, 7302);
			attr_dev(div2, "class", "card-body");
			add_location(div2, file$b, 215, 10, 7209);
			attr_dev(div3, "class", "card");
			add_location(div3, file$b, 214, 8, 7179);
			attr_dev(div4, "class", "col-4");
			add_location(div4, file$b, 213, 6, 7150);
			attr_dev(h51, "class", "card-title text-left");
			add_location(h51, file$b, 230, 14, 7828);
			attr_dev(div5, "class", "list svelte-1abhqpz");
			attr_dev(div5, "id", "ket");
			add_location(div5, file$b, 231, 14, 7892);
			attr_dev(div6, "class", "card-body");
			add_location(div6, file$b, 229, 10, 7789);
			attr_dev(div7, "class", "card");
			add_location(div7, file$b, 228, 8, 7759);
			attr_dev(div8, "class", "col-5");
			add_location(div8, file$b, 227, 6, 7730);
			attr_dev(button, "class", "btn btn-success p-2 svelte-1abhqpz");
			attr_dev(button, "id", "btnkonfirm");
			add_location(button, file$b, 239, 10, 8080);
			attr_dev(div9, "class", "d-flex flex-column-reverse");
			add_location(div9, file$b, 238, 8, 8028);
			attr_dev(div10, "class", "col-3");
			add_location(div10, file$b, 237, 6, 7999);
			attr_dev(div11, "class", "d-flex align-items-top");
			add_location(div11, file$b, 212, 4, 7106);
			attr_dev(div12, "class", "card-body");
			add_location(div12, file$b, 211, 2, 7077);
			attr_dev(div13, "class", "card");
			add_location(div13, file$b, 206, 0, 6914);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div13, anchor);
			append_dev(div13, div0);
			append_dev(div0, t0);
			append_dev(div0, span);
			append_dev(span, t1);
			append_dev(div13, t2);
			append_dev(div13, div12);
			append_dev(div12, div11);
			append_dev(div11, div4);
			append_dev(div4, div3);
			append_dev(div3, div2);
			append_dev(div2, h50);
			append_dev(div2, t4);
			append_dev(div2, div1);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div1, null);
			}

			append_dev(div11, t5);
			append_dev(div11, div8);
			append_dev(div8, div7);
			append_dev(div7, div6);
			append_dev(div6, h51);
			append_dev(div6, t7);
			append_dev(div6, div5);
			append_dev(div11, t8);
			append_dev(div11, div10);
			append_dev(div10, div9);
			append_dev(div9, button);

			if (!mounted) {
				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[5], false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*data_pemesanan*/ 1 && t1_value !== (t1_value = /*data_pemesanan*/ ctx[0].length + "")) set_data_dev(t1, t1_value);

			if (dirty & /*data_pemesanan, getKeterangan*/ 5) {
				each_value = /*data_pemesanan*/ ctx[0];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$3(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$3(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div1, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div13);
			destroy_each(each_blocks, detaching);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$c.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$c($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Components_pemesanan", slots, []);
	let data_pemesanan = [];
	let data_kosan = [];
	let data_owner = [];
	let data_user = [];
	let selected_idx_p = 0;
	let selected_idx_k = 0;

	class Adm extends Admin {
		constructor(id) {
			super(id);
		}

		konfirmasiPemesanan(id_pemesanan) {
			try {
				axios$1.post("http://localhost:3002/admin/konfirmasi-pemesanan", {}, {
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						"Authorization": localStorage.getItem("admin"),
						"id_pemesanan": data_pemesanan[id_pemesanan].id_pesanan,
						"status_pesanan": "tersedia"
					}
				}).then(res => {
					let respon = res.data;
					alert(respon.message);
					document.getElementById("ket").innerHTML = "";
					this.getUnconfirmedPesanan();
				}).catch(err => {
					alert(err);
				});
			} catch(error) {
				alert(error);
			}
		}

		getUnconfirmedPesanan() {
			try {
				axios$1.get("http://localhost:3002/admin/unconfirmed-pesanan", {
					headers: {
						Authorization: localStorage.getItem("admin"),
						status_pesanan: "unconfirmed"
					}
				}).then(res => {
					// memasukkan response data
					let result = res.data;

					// memilah data sesuai kelompok
					$$invalidate(0, data_pemesanan = result.data);

					data_kosan = result.data_kosan;
					data_owner = result.data_owner;
					data_user = result.data_user;
				});
			} catch(error) {
				alert(error);
			}
		}
	}

	function getListUnconfirmed() {
		try {
			let adm = new Adm(parseInt(localStorage.getItem("id_admin")));
			adm.getUnconfirmedPesanan();
		} catch(error) {
			alert(error);
		}
	}

	function getKeterangan(id_pesanan, id_user, id_kosan) {
		let keterangan = ``;
		let i_u = 0;
		let i_k = 0;
		let i_o = 0;
		let i_p = 0;

		// search index
		for (let i = 0; i < data_kosan.length; i++) {
			if (data_kosan[i].id_kos == id_kosan) {
				i_k = i;
				selected_idx_k = i_k;

				for (let j = 0; j < data_user.length; j++) {
					if (data_user[j].id_user == id_user) {
						i_u = j;

						for (let k = 0; k < data_owner.length; k++) {
							if (data_owner[k].id_owner == data_kosan[i_k].id_pemilik) {
								i_o = k;

								for (let l = 0; l < data_pemesanan.length; l++) {
									if (data_pemesanan[l].id_pesanan == id_pesanan) {
										i_p = l;
										$$invalidate(1, selected_idx_p = i_p);
									}
								}
							}
						}
					}
				}
			}
		}

		keterangan = `
    <strong>Info Pemesanan</strong>
    <table class="text-left">
      <tr style="line-height: 25px;">
        <td>Id Pemesanan</td><td>:</td><td>${data_pemesanan[i_p].id_pesanan}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Lama Sewa</td><td>:</td><td>${data_pemesanan[i_p].lama_tinggal} bulan</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Kamar dipesan</td><td>:</td><td>${data_pemesanan[i_p].n_kamar} unit</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Ketersediaan Kamar</td><td>:</td><td>${data_pemesanan[i_p].ketersediaan}</td>
      </tr>
    </table>
    <br/>
    <strong>Data Pemesan</strong>
    <table class='text-left'>
      <tr style="line-height: 25px;">
        <td>Nama User</td><td>:</td><td>${data_user[i_u].nama_user}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Alamat User</td><td>:</td><td>${data_user[i_u].alamat_user}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>No. Telepon</td><td>:</td><td>${data_user[i_u].telpon_user}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Email</td><td>:</td><td>${data_user[i_u].email_user}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>TTL</td><td>:</td><td>${data_user[i_u].tgllahir}</td>
      </tr>
    </table>
    <br/>
    <strong>Data Tempat Kos</strong>
    <table class='text-left'>
      <tr style="line-height: 25px;">
        <td>Nama Kosan</td><td>:</td><td>${data_kosan[i_k].nama_kos}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Alamat Kosan</td><td>:</td><td>${data_kosan[i_k].alamat_kos}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Luas Kamar</td><td>:</td><td>${data_kosan[i_k].luas_kamar}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Jumlah Kamar</td><td>:</td><td>${data_kosan[i_k].jumlah_kamar}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Jumlah Kamar</td><td>:</td><td>${data_kosan[i_k].fasilitas}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Kamar dipesan</td><td>:</td><td>${data_kosan[i_k].kamar_dipesan}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Kamar dihuni</td><td>:</td><td>${data_kosan[i_k].kamar_dihuni}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Harga Sewa</td><td>:</td><td>${data_kosan[i_k].harga_sewa}</td>
      </tr>
    </table>
    <br/>
    <strong>Data Pemilik Kos</strong>
    <table class='text-left'>
      <tr style="line-height: 25px;">
        <td>Nama Owner</td><td>:</td><td>${data_owner[i_o].nama_owner}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Alamat Owner</td><td>:</td><td>${data_owner[i_o].alamat_owner}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>No. Telepon</td><td>:</td><td>${data_owner[i_o].no_telpon}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Email</td><td>:</td><td>${data_owner[i_o].email}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>TTL</td><td>:</td><td>${data_owner[i_o].TTL}</td>
      </tr>
    </table>
    `;

		document.getElementById("ket").innerHTML = keterangan;
	}

	getListUnconfirmed();
	let adm = new Adm(parseInt(localStorage.getItem("id_admin")));
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Components_pemesanan> was created with unknown prop '${key}'`);
	});

	const click_handler = data => {
		getKeterangan(data.id_pesanan, data.id_user, data.id_kos);
	};

	const click_handler_1 = () => adm.konfirmasiPemesanan(selected_idx_p);

	$$self.$capture_state = () => ({
		axios: axios$1,
		Admin,
		data_pemesanan,
		data_kosan,
		data_owner,
		data_user,
		selected_idx_p,
		selected_idx_k,
		Adm,
		getListUnconfirmed,
		getKeterangan,
		adm
	});

	$$self.$inject_state = $$props => {
		if ("data_pemesanan" in $$props) $$invalidate(0, data_pemesanan = $$props.data_pemesanan);
		if ("data_kosan" in $$props) data_kosan = $$props.data_kosan;
		if ("data_owner" in $$props) data_owner = $$props.data_owner;
		if ("data_user" in $$props) data_user = $$props.data_user;
		if ("selected_idx_p" in $$props) $$invalidate(1, selected_idx_p = $$props.selected_idx_p);
		if ("selected_idx_k" in $$props) selected_idx_k = $$props.selected_idx_k;
		if ("adm" in $$props) $$invalidate(3, adm = $$props.adm);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		data_pemesanan,
		selected_idx_p,
		getKeterangan,
		adm,
		click_handler,
		click_handler_1
	];
}

class Components_pemesanan extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Components_pemesanan",
			options,
			id: create_fragment$c.name
		});
	}
}

/* src\admin\components.histori.svelte generated by Svelte v3.29.4 */
const file$c = "src\\admin\\components.histori.svelte";

function get_each_context$4(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[6] = list[i];
	return child_ctx;
}

// (126:14) {#each data_transaksi as data}
function create_each_block$4(ctx) {
	let div;
	let strong;
	let t0;
	let t1_value = /*data*/ ctx[6].id_transaksi + "";
	let t1;
	let t2;
	let mounted;
	let dispose;

	function click_handler(...args) {
		return /*click_handler*/ ctx[2](/*data*/ ctx[6], ...args);
	}

	const block = {
		c: function create() {
			div = element("div");
			strong = element("strong");
			t0 = text("Id Pembayaran: ");
			t1 = text(t1_value);
			t2 = space();
			add_location(strong, file$c, 127, 18, 4112);
			attr_dev(div, "class", "unconfirmed-pesanan");
			add_location(div, file$c, 126, 16, 4005);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, strong);
			append_dev(strong, t0);
			append_dev(strong, t1);
			append_dev(div, t2);

			if (!mounted) {
				dispose = listen_dev(div, "click", click_handler, false, false, false);
				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*data_transaksi*/ 1 && t1_value !== (t1_value = /*data*/ ctx[6].id_transaksi + "")) set_data_dev(t1, t1_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$4.name,
		type: "each",
		source: "(126:14) {#each data_transaksi as data}",
		ctx
	});

	return block;
}

function create_fragment$d(ctx) {
	let div13;
	let div0;
	let t0;
	let span;
	let t2;
	let div12;
	let div11;
	let div4;
	let div3;
	let div2;
	let h50;
	let t4;
	let div1;
	let t5;
	let div8;
	let div7;
	let div6;
	let h51;
	let t7;
	let div5;
	let t8;
	let div10;
	let div9;
	let button;
	let mounted;
	let dispose;
	let each_value = /*data_transaksi*/ ctx[0];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div13 = element("div");
			div0 = element("div");
			t0 = text("Perlu Konfirmasi\r\n    ");
			span = element("span");
			span.textContent = "0";
			t2 = space();
			div12 = element("div");
			div11 = element("div");
			div4 = element("div");
			div3 = element("div");
			div2 = element("div");
			h50 = element("h5");
			h50.textContent = "List";
			t4 = space();
			div1 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t5 = space();
			div8 = element("div");
			div7 = element("div");
			div6 = element("div");
			h51 = element("h5");
			h51.textContent = "KETERANGAN";
			t7 = space();
			div5 = element("div");
			t8 = space();
			div10 = element("div");
			div9 = element("div");
			button = element("button");
			button.textContent = "Konfirmasi";
			attr_dev(span, "class", "badge badge-success");
			add_location(span, file$c, 116, 4, 3622);
			attr_dev(div0, "class", "card-header text-left svelte-1abhqpz");
			add_location(div0, file$c, 114, 2, 3559);
			attr_dev(h50, "class", "card-title text-left");
			add_location(h50, file$c, 123, 12, 3847);
			attr_dev(div1, "class", "list text-left svelte-1abhqpz");
			attr_dev(div1, "id", "list");
			add_location(div1, file$c, 124, 12, 3903);
			attr_dev(div2, "class", "card-body");
			add_location(div2, file$c, 122, 10, 3810);
			attr_dev(div3, "class", "card");
			add_location(div3, file$c, 121, 8, 3780);
			attr_dev(div4, "class", "col-4");
			add_location(div4, file$c, 120, 6, 3751);
			attr_dev(h51, "class", "card-title text-left");
			add_location(h51, file$c, 137, 12, 4382);
			attr_dev(div5, "class", "list svelte-1abhqpz");
			attr_dev(div5, "id", "ket");
			add_location(div5, file$c, 138, 12, 4444);
			attr_dev(div6, "class", "card-body");
			add_location(div6, file$c, 136, 10, 4345);
			attr_dev(div7, "class", "card");
			add_location(div7, file$c, 135, 8, 4315);
			attr_dev(div8, "class", "col-5");
			add_location(div8, file$c, 134, 6, 4286);
			attr_dev(button, "class", "btn btn-success p-2");
			add_location(button, file$c, 146, 10, 4630);
			attr_dev(div9, "class", "d-flex flex-column-reverse");
			add_location(div9, file$c, 145, 8, 4578);
			attr_dev(div10, "class", "col-3");
			add_location(div10, file$c, 144, 6, 4549);
			attr_dev(div11, "class", "d-flex align-items-top");
			add_location(div11, file$c, 119, 4, 3707);
			attr_dev(div12, "class", "card-body");
			add_location(div12, file$c, 118, 2, 3678);
			attr_dev(div13, "class", "card");
			add_location(div13, file$c, 113, 0, 3537);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div13, anchor);
			append_dev(div13, div0);
			append_dev(div0, t0);
			append_dev(div0, span);
			append_dev(div13, t2);
			append_dev(div13, div12);
			append_dev(div12, div11);
			append_dev(div11, div4);
			append_dev(div4, div3);
			append_dev(div3, div2);
			append_dev(div2, h50);
			append_dev(div2, t4);
			append_dev(div2, div1);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div1, null);
			}

			append_dev(div11, t5);
			append_dev(div11, div8);
			append_dev(div8, div7);
			append_dev(div7, div6);
			append_dev(div6, h51);
			append_dev(div6, t7);
			append_dev(div6, div5);
			append_dev(div11, t8);
			append_dev(div11, div10);
			append_dev(div10, div9);
			append_dev(div9, button);

			if (!mounted) {
				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[3], false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*adm, data_transaksi*/ 3) {
				each_value = /*data_transaksi*/ ctx[0];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$4(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$4(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div1, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div13);
			destroy_each(each_blocks, detaching);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$d.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$d($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Components_histori", slots, []);
	let data_transaksi = [];
	let selected_i_tr = 0;

	class Adm extends Admin {
		constructor(id) {
			super(id);
		}

		getUnconfirmedPembayaran() {
			try {
				axios$1.get("http://localhost:3002/admin/unconfirmed-transaksi", {
					headers: {
						"Authorization": localStorage.getItem("admin")
					}
				}).then(res => {
					let respon = res.data;
					$$invalidate(0, data_transaksi = respon.data);
				}).catch(err => {
					alert(err);
				});
			} catch(error) {
				alert(error);
			}
		}

		getKeterangan(id_transaksi) {
			let keterangan = ``;

			// search index
			for (let i = 0; i < data_transaksi.length; i++) {
				if (data_transaksi[i].id_transaksi == id_transaksi) {
					selected_i_tr = i;
				}
			}

			keterangan = `
      <strong>Info Pemesanan</strong>
      <table class="text-left">
        <tr style="line-height: 25px;">
          <td>Id transaksi</td><td>:</td><td>${data_transaksi[selected_i_tr].id_transaksi}</td>
        </tr>
        <tr style="line-height: 25px;">
          <td>Kode Transaksi</td><td>:</td><td>${data_transaksi[selected_i_tr].kode_transaksi} </td>
        </tr>
        <tr style="line-height: 25px;">
          <td>Tanggal Transaksi</td><td>:</td><td>${data_transaksi[selected_i_tr].tgl_transaksi} </td>
        </tr>
        <tr style="line-height: 25px;">
          <td>Id Penyewa</td><td>:</td><td>${data_transaksi[selected_i_tr].id_penyewa}</td>
        </tr>
        <tr style="line-height: 25px;">
          <td>Id Kosan</td><td>:</td><td>${data_transaksi[selected_i_tr].id_kosan}</td>
        </tr>
        <tr style="line-height: 25px;">
          <td>Kamar dipesan</td><td>:</td><td>${data_transaksi[selected_i_tr].n_kamar}</td>
        </tr>
        <tr style="line-height: 25px;">
          <td>Nominal</td><td>:</td><td>${data_transaksi[selected_i_tr].nominal}</td>
        </tr>
      </table>
      `;

			document.getElementById("ket").innerHTML = keterangan;
		}

		konfirmasiPembayaran() {
			try {
				if (selected_i_tr < 0) {
					alert("Mohon Pilih Pembayaran!");
					return;
				}

				axios$1.post("http://localhost:3002/admin/konfirmasi-transaksi", {}, {
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						"Authorization": localStorage.getItem("admin"),
						"id_transaksi": data_transaksi[selected_i_tr].id_transaksi
					}
				}).then(res => {
					let respon = res.data;
					alert(respon.message);
					document.getElementById("ket").innerHTML = "";
					this.getUnconfirmedPembayaran();
				});
			} catch(error) {
				alert(error);
			}
		}

		konfirmasiPemesanan() {
			
		}
	}

	let adm = new Adm(parseInt(localStorage.getItem("id_admin")));
	adm.getUnconfirmedPembayaran();
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Components_histori> was created with unknown prop '${key}'`);
	});

	const click_handler = data => adm.getKeterangan(data.id_transaksi);
	const click_handler_1 = () => adm.konfirmasiPembayaran();

	$$self.$capture_state = () => ({
		axios: axios$1,
		Admin,
		data_transaksi,
		selected_i_tr,
		Adm,
		adm
	});

	$$self.$inject_state = $$props => {
		if ("data_transaksi" in $$props) $$invalidate(0, data_transaksi = $$props.data_transaksi);
		if ("selected_i_tr" in $$props) selected_i_tr = $$props.selected_i_tr;
		if ("adm" in $$props) $$invalidate(1, adm = $$props.adm);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [data_transaksi, adm, click_handler, click_handler_1];
}

class Components_histori extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Components_histori",
			options,
			id: create_fragment$d.name
		});
	}
}

const subscriber_queue = [];
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
function writable(value, start = noop) {
    let stop;
    const subscribers = [];
    function set(new_value) {
        if (safe_not_equal(value, new_value)) {
            value = new_value;
            if (stop) { // store is ready
                const run_queue = !subscriber_queue.length;
                for (let i = 0; i < subscribers.length; i += 1) {
                    const s = subscribers[i];
                    s[1]();
                    subscriber_queue.push(s, value);
                }
                if (run_queue) {
                    for (let i = 0; i < subscriber_queue.length; i += 2) {
                        subscriber_queue[i][0](subscriber_queue[i + 1]);
                    }
                    subscriber_queue.length = 0;
                }
            }
        }
    }
    function update(fn) {
        set(fn(value));
    }
    function subscribe(run, invalidate = noop) {
        const subscriber = [run, invalidate];
        subscribers.push(subscriber);
        if (subscribers.length === 1) {
            stop = start(set) || noop;
        }
        run(value);
        return () => {
            const index = subscribers.indexOf(subscriber);
            if (index !== -1) {
                subscribers.splice(index, 1);
            }
            if (subscribers.length === 0) {
                stop();
                stop = null;
            }
        };
    }
    return { set, update, subscribe };
}

const store = () => {

  const login = {
    nama: undefined,
    token: undefined,
    level: undefined
  };

  const { subscribe, set, update } = writable(login);

  const method = {
    init() {
      update(login => {
        login.nama = '';
        login.token = '';
        login.level = '';
        return login;
      });
    },
    setNama(nama){
      update(login => {
        login.nama = nama;
        return login;
      });
    },
    setToken(token){
      update(login => {
        login.token = token;
        return login;
      });
    },
    setLevel(level){
      update(login => {
        login.level = level;
        return login;
      });
    }
  };

  return {
    subscribe,
    set,
    update,
    ...method
  }
};

var store$1 = store();

/* src\admin\Dasbor.svelte generated by Svelte v3.29.4 */
const file$d = "src\\admin\\Dasbor.svelte";

function create_fragment$e(ctx) {
	let div3;
	let div2;
	let div0;
	let ul;
	let li0;
	let a0;
	let t1;
	let li1;
	let a1;
	let t3;
	let li2;
	let a2;
	let t5;
	let div1;
	let switch_instance;
	let current;
	let mounted;
	let dispose;
	var switch_value = /*component*/ ctx[0];

	function switch_props(ctx) {
		return { $$inline: true };
	}

	if (switch_value) {
		switch_instance = new switch_value(switch_props());
	}

	const block = {
		c: function create() {
			div3 = element("div");
			div2 = element("div");
			div0 = element("div");
			ul = element("ul");
			li0 = element("li");
			a0 = element("a");
			a0.textContent = "Pendaftaran Kos";
			t1 = space();
			li1 = element("li");
			a1 = element("a");
			a1.textContent = "Pemesanan";
			t3 = space();
			li2 = element("li");
			a2 = element("a");
			a2.textContent = "Pembayaran";
			t5 = space();
			div1 = element("div");
			if (switch_instance) create_component(switch_instance.$$.fragment);
			attr_dev(a0, "class", "nav-link active svelte-tvfrj0");
			attr_dev(a0, "href", "#verifikasi");
			add_location(a0, file$d, 105, 10, 2743);
			attr_dev(li0, "class", "nav-item");
			add_location(li0, file$d, 104, 8, 2710);
			attr_dev(a1, "class", "nav-link svelte-tvfrj0");
			attr_dev(a1, "href", "#pemesanan");
			add_location(a1, file$d, 111, 10, 2940);
			attr_dev(li1, "class", "nav-item");
			add_location(li1, file$d, 110, 8, 2907);
			attr_dev(a2, "class", "nav-link svelte-tvfrj0");
			attr_dev(a2, "href", "#histori");
			add_location(a2, file$d, 117, 10, 3123);
			attr_dev(li2, "class", "nav-item");
			add_location(li2, file$d, 116, 8, 3090);
			attr_dev(ul, "class", "nav nav-tabs card-header-tabs svelte-tvfrj0");
			attr_dev(ul, "id", "myTab");
			add_location(ul, file$d, 103, 6, 2647);
			attr_dev(div0, "class", "card-header svelte-tvfrj0");
			add_location(div0, file$d, 102, 4, 2614);
			attr_dev(div1, "class", "card-body");
			add_location(div1, file$d, 124, 4, 3293);
			attr_dev(div2, "class", "card text-center");
			add_location(div2, file$d, 101, 2, 2578);
			attr_dev(div3, "class", "admin svelte-tvfrj0");
			add_location(div3, file$d, 100, 0, 2555);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div3, anchor);
			append_dev(div3, div2);
			append_dev(div2, div0);
			append_dev(div0, ul);
			append_dev(ul, li0);
			append_dev(li0, a0);
			append_dev(ul, t1);
			append_dev(ul, li1);
			append_dev(li1, a1);
			append_dev(ul, t3);
			append_dev(ul, li2);
			append_dev(li2, a2);
			append_dev(div2, t5);
			append_dev(div2, div1);

			if (switch_instance) {
				mount_component(switch_instance, div1, null);
			}

			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(a0, "click", /*click_handler*/ ctx[2], false, false, false),
					listen_dev(a1, "click", /*click_handler_1*/ ctx[3], false, false, false),
					listen_dev(a2, "click", /*click_handler_2*/ ctx[4], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
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
					mount_component(switch_instance, div1, null);
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
			if (detaching) detach_dev(div3);
			if (switch_instance) destroy_component(switch_instance);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$e.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function getTime() {
	let waktu;
	let w_panjang;
	let jam;
	waktu = new Date();
	w_panjang = waktu.toTimeString();
	jam = parseInt(w_panjang.slice(0, 2));

	if (jam >= 0 && jam <= 11) {
		return "pagi";
	} else if (jam >= 12 && jam <= 18) {
		return "siang";
	} else {
		return "malam";
	}
}

function instance$e($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Dasbor", slots, []);

	class Toast extends myToast {
		// Konstruktor
		constructor(judul, teks, tipe) {
			super(judul, teks, tipe);

			// Properti
			this.toast = sweetalert2_all.mixin({
				toast: true,
				position: "top-end",
				showConfirmButton: false,
				timer: 3000,
				timerProgressBar: true,
				didOpen: toast => {
					toast.addEventListener("mouseenter", sweetalert2_all.stopTimer);
					toast.addEventListener("mouseleave", sweetalert2_all.resumeTimer);
				}
			});
		}

		// method untuk menampilkan toast
		show() {
			this.toast.fire({
				icon: this.tipe != "success" ? "error" : "success",
				title: this.judul
			});
		}

		// method untuk ambil waktu saat ini
		getTime() {
			let waktu;
			let w_panjang;
			let jam;
			waktu = new Date();
			w_panjang = waktu.toTimeString();
			jam = parseInt(w_panjang.slice(0, 2));

			if (jam >= 0 && jam <= 11) {
				return "pagi";
			} else if (jam >= 12 && jam <= 18) {
				return "siang";
			} else {
				return "malam";
			}
		}
	}

	let sesi;
	let component = Components_verifikasi_kos;
	sesi = localStorage.getItem("nama_admin");

	function pilihComponent(n) {
		if (n == 1) {
			$$invalidate(0, component = Components_verifikasi_kos);
		} else if (n == 2) {
			$$invalidate(0, component = Components_pemesanan);
		} else {
			$$invalidate(0, component = Components_histori);
		}
	}

	let w = getTime();
	let nama = localStorage.getItem("nama_admin");
	let welcome_toast = new Toast(`Selamat ${w}, ${nama} :)`, "", "success");

	if (nama != undefined) {
		welcome_toast.show();
	}

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Dasbor> was created with unknown prop '${key}'`);
	});

	const click_handler = () => pilihComponent(1);
	const click_handler_1 = () => pilihComponent(2);
	const click_handler_2 = () => pilihComponent(3);

	$$self.$capture_state = () => ({
		Verifikasi: Components_verifikasi_kos,
		Pemesanan: Components_pemesanan,
		Histori: Components_histori,
		myToast,
		Swal: sweetalert2_all,
		store: store$1,
		Toast,
		sesi,
		component,
		pilihComponent,
		getTime,
		w,
		nama,
		welcome_toast
	});

	$$self.$inject_state = $$props => {
		if ("sesi" in $$props) sesi = $$props.sesi;
		if ("component" in $$props) $$invalidate(0, component = $$props.component);
		if ("w" in $$props) w = $$props.w;
		if ("nama" in $$props) nama = $$props.nama;
		if ("welcome_toast" in $$props) welcome_toast = $$props.welcome_toast;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [component, pilihComponent, click_handler, click_handler_1, click_handler_2];
}

class Dasbor$1 extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Dasbor",
			options,
			id: create_fragment$e.name
		});
	}
}

/* src\admin\index.admin.svelte generated by Svelte v3.29.4 */

const { console: console_1$4 } = globals;
const file$e = "src\\admin\\index.admin.svelte";

// (71:0) {:else}
function create_else_block$2(ctx) {
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
			add_location(h3, file$e, 74, 14, 3020);
			attr_dev(label0, "for", "txtusernamae");
			attr_dev(label0, "class", "form-label");
			add_location(label0, file$e, 79, 16, 3218);
			attr_dev(input0, "type", "text");
			attr_dev(input0, "class", "form-control");
			attr_dev(input0, "id", "txtusernamae");
			add_location(input0, file$e, 80, 16, 3297);
			attr_dev(div0, "class", "mb-3");
			add_location(div0, file$e, 78, 14, 3182);
			attr_dev(label1, "for", "txtpassword");
			attr_dev(label1, "class", "form-label");
			add_location(label1, file$e, 83, 16, 3448);
			attr_dev(input1, "type", "password");
			attr_dev(input1, "class", "form-control");
			attr_dev(input1, "id", "txtpassword");
			add_location(input1, file$e, 84, 16, 3526);
			attr_dev(div1, "class", "mb-3");
			add_location(div1, file$e, 82, 14, 3412);
			attr_dev(button, "type", "button");
			attr_dev(button, "class", "btn btn-success");
			add_location(button, file$e, 87, 16, 3679);
			attr_dev(div2, "class", "mb-3");
			add_location(div2, file$e, 86, 14, 3643);
			attr_dev(div3, "class", "card-body");
			add_location(div3, file$e, 73, 12, 2981);
			attr_dev(div4, "class", "card shadow card-bg");
			set_style(div4, "width", "25rem");
			set_style(div4, "margin-top", "70px");
			add_location(div4, file$e, 72, 8, 2895);
			attr_dev(div5, "class", "d-flex justify-content-center mt-5");
			add_location(div5, file$e, 71, 4, 2837);
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
		id: create_else_block$2.name,
		type: "else",
		source: "(71:0) {:else}",
		ctx
	});

	return block;
}

// (69:0) {#if localStorage.getItem('login') == 'admin'}
function create_if_block$5(ctx) {
	let switch_instance;
	let switch_instance_anchor;
	let current;
	var switch_value = Dasbor$1;

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
			if (switch_value !== (switch_value = Dasbor$1)) {
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
		id: create_if_block$5.name,
		type: "if",
		source: "(69:0) {#if localStorage.getItem('login') == 'admin'}",
		ctx
	});

	return block;
}

// (76:14) {#if login_state == 1}
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
		source: "(76:14) {#if login_state == 1}",
		ctx
	});

	return block;
}

function create_fragment$f(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block$5, create_else_block$2];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (localStorage.getItem("login") == "admin") return 0;
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
		id: create_fragment$f.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$f($$self, $$props, $$invalidate) {
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
					localStorage.setItem("login", "admin");
					store$1.init();
					store$1.setNama(result.username);
					store$1.setToken(result.token);
					store$1.setLevel("admin");
					console.log("lS admin = " + localStorage.getItem("admin"));
					console.log("lS nama = " + localStorage.getItem("nama_admin"));
					console.log("lS login = " + localStorage.getItem("login"));
				} else // console.log($store.level)
				// console.log($store.token)
				{
					$$invalidate(3, login_state = 1); // console.log($store.nama)
				}
			} catch(error) {
				$$invalidate(3, login_state = 1);
			}
		});
	}

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$4.warn(`<Admin> was created with unknown prop '${key}'`);
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
		Dasbor: Dasbor$1,
		store: store$1,
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

class Admin$1 extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$f, create_fragment$f, safe_not_equal, { doLogin: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Admin",
			options,
			id: create_fragment$f.name
		});
	}

	get doLogin() {
		return this.$$.ctx[0];
	}

	set doLogin(value) {
		throw new Error("<Admin>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src\ownerkos\components\components.edit.svelte generated by Svelte v3.29.4 */

const { console: console_1$5 } = globals;
const file$f = "src\\ownerkos\\components\\components.edit.svelte";

function get_each_context$5(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[14] = list[i];
	child_ctx[16] = i;
	return child_ctx;
}

// (125:14) {:else}
function create_else_block$3(ctx) {
	let each_1_anchor;
	let each_value = /*data_kosan*/ ctx[0];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
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
			if (dirty & /*currentKosan, data_kosan*/ 5) {
				each_value = /*data_kosan*/ ctx[0];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$5(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$5(child_ctx);
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
		id: create_else_block$3.name,
		type: "else",
		source: "(125:14) {:else}",
		ctx
	});

	return block;
}

// (123:47) 
function create_if_block_1$1(ctx) {
	let div;
	let span;

	const block = {
		c: function create() {
			div = element("div");
			span = element("span");
			span.textContent = "Kosong...";
			add_location(span, file$f, 123, 35, 3350);
			attr_dev(div, "class", "kosan svelte-7wgm5n");
			add_location(div, file$f, 123, 16, 3331);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, span);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$1.name,
		type: "if",
		source: "(123:47) ",
		ctx
	});

	return block;
}

// (115:14) {#if data_kosan.length == 1}
function create_if_block$6(ctx) {
	let div;
	let p;
	let strong;
	let t0;
	let t1_value = /*data_kosan*/ ctx[0][0].nama_kos + "";
	let t1;
	let br;
	let t2;
	let t3_value = /*data_kosan*/ ctx[0][0].alamat_kos + "";
	let t3;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div = element("div");
			p = element("p");
			strong = element("strong");
			t0 = text("Nama Kosan: ");
			t1 = text(t1_value);
			br = element("br");
			t2 = text("\r\n                    Alamat :\r\n                    ");
			t3 = text(t3_value);
			add_location(strong, file$f, 117, 20, 3079);
			add_location(br, file$f, 117, 73, 3132);
			add_location(p, file$f, 116, 18, 3054);
			attr_dev(div, "class", "kosan svelte-7wgm5n");
			add_location(div, file$f, 115, 16, 2983);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, p);
			append_dev(p, strong);
			append_dev(strong, t0);
			append_dev(strong, t1);
			append_dev(p, br);
			append_dev(p, t2);
			append_dev(p, t3);

			if (!mounted) {
				dispose = listen_dev(div, "click", /*click_handler*/ ctx[3], false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*data_kosan*/ 1 && t1_value !== (t1_value = /*data_kosan*/ ctx[0][0].nama_kos + "")) set_data_dev(t1, t1_value);
			if (dirty & /*data_kosan*/ 1 && t3_value !== (t3_value = /*data_kosan*/ ctx[0][0].alamat_kos + "")) set_data_dev(t3, t3_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$6.name,
		type: "if",
		source: "(115:14) {#if data_kosan.length == 1}",
		ctx
	});

	return block;
}

// (126:16) {#each data_kosan as data, i}
function create_each_block$5(ctx) {
	let div;
	let p;
	let strong;
	let t0;
	let t1_value = /*data*/ ctx[14].nama_kos + "";
	let t1;
	let br;
	let t2;
	let t3_value = /*data*/ ctx[14].alamat_kos + "";
	let t3;
	let t4;
	let div_id_value;
	let mounted;
	let dispose;

	function click_handler_1(...args) {
		return /*click_handler_1*/ ctx[4](/*i*/ ctx[16], ...args);
	}

	const block = {
		c: function create() {
			div = element("div");
			p = element("p");
			strong = element("strong");
			t0 = text("Nama Kosan: ");
			t1 = text(t1_value);
			br = element("br");
			t2 = text("\r\n                      Alamat :\r\n                      ");
			t3 = text(t3_value);
			t4 = space();
			add_location(strong, file$f, 128, 22, 3592);
			add_location(br, file$f, 128, 66, 3636);
			add_location(p, file$f, 127, 20, 3565);
			attr_dev(div, "class", "kosan svelte-7wgm5n");
			attr_dev(div, "id", div_id_value = (/*i*/ ctx[16] + 1).toString());
			add_location(div, file$f, 126, 18, 3468);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, p);
			append_dev(p, strong);
			append_dev(strong, t0);
			append_dev(strong, t1);
			append_dev(p, br);
			append_dev(p, t2);
			append_dev(p, t3);
			append_dev(div, t4);

			if (!mounted) {
				dispose = listen_dev(div, "click", click_handler_1, false, false, false);
				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*data_kosan*/ 1 && t1_value !== (t1_value = /*data*/ ctx[14].nama_kos + "")) set_data_dev(t1, t1_value);
			if (dirty & /*data_kosan*/ 1 && t3_value !== (t3_value = /*data*/ ctx[14].alamat_kos + "")) set_data_dev(t3, t3_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$5.name,
		type: "each",
		source: "(126:16) {#each data_kosan as data, i}",
		ctx
	});

	return block;
}

function create_fragment$g(ctx) {
	let div13;
	let div0;
	let t0;
	let span;
	let t1;
	let div12;
	let div11;
	let div4;
	let div3;
	let div2;
	let h50;
	let t3;
	let div1;
	let t4;
	let div8;
	let div7;
	let div6;
	let h51;
	let t6;
	let div5;
	let table;
	let tr0;
	let td0;
	let td1;
	let td2;
	let input0;
	let t9;
	let tr1;
	let td3;
	let td4;
	let td5;
	let input1;
	let t12;
	let tr2;
	let td6;
	let td7;
	let td8;
	let input2;
	let t15;
	let tr3;
	let td9;
	let td10;
	let td11;
	let input3;
	let t18;
	let tr4;
	let td12;
	let td13;
	let td14;
	let input4;
	let t21;
	let tr5;
	let td15;
	let td16;
	let td17;
	let input5;
	let t24;
	let div10;
	let div9;
	let button;
	let mounted;
	let dispose;

	function select_block_type(ctx, dirty) {
		if (/*data_kosan*/ ctx[0].length == 1) return create_if_block$6;
		if (/*data_kosan*/ ctx[0].length == 0) return create_if_block_1$1;
		return create_else_block$3;
	}

	let current_block_type = select_block_type(ctx);
	let if_block = current_block_type(ctx);

	const block = {
		c: function create() {
			div13 = element("div");
			div0 = element("div");
			t0 = text("Tempat Kos\r\n    ");
			span = element("span");
			t1 = space();
			div12 = element("div");
			div11 = element("div");
			div4 = element("div");
			div3 = element("div");
			div2 = element("div");
			h50 = element("h5");
			h50.textContent = "List";
			t3 = space();
			div1 = element("div");
			if_block.c();
			t4 = space();
			div8 = element("div");
			div7 = element("div");
			div6 = element("div");
			h51 = element("h5");
			h51.textContent = "KETERANGAN";
			t6 = space();
			div5 = element("div");
			table = element("table");
			tr0 = element("tr");
			td0 = element("td");
			td0.textContent = "Nama Kosan";
			td1 = element("td");
			td1.textContent = ":";
			td2 = element("td");
			input0 = element("input");
			t9 = space();
			tr1 = element("tr");
			td3 = element("td");
			td3.textContent = "Alamat Kosan";
			td4 = element("td");
			td4.textContent = ":";
			td5 = element("td");
			input1 = element("input");
			t12 = space();
			tr2 = element("tr");
			td6 = element("td");
			td6.textContent = "Luas Kamar ( m² )";
			td7 = element("td");
			td7.textContent = ":";
			td8 = element("td");
			input2 = element("input");
			t15 = space();
			tr3 = element("tr");
			td9 = element("td");
			td9.textContent = "Jumlah Kamar";
			td10 = element("td");
			td10.textContent = ":";
			td11 = element("td");
			input3 = element("input");
			t18 = space();
			tr4 = element("tr");
			td12 = element("td");
			td12.textContent = "Fasilitas Kamar";
			td13 = element("td");
			td13.textContent = ":";
			td14 = element("td");
			input4 = element("input");
			t21 = space();
			tr5 = element("tr");
			td15 = element("td");
			td15.textContent = "Harga Sewa";
			td16 = element("td");
			td16.textContent = ":";
			td17 = element("td");
			input5 = element("input");
			t24 = space();
			div10 = element("div");
			div9 = element("div");
			button = element("button");
			button.textContent = "Simpan Perubahan";
			attr_dev(span, "class", "badge badge-warning");
			attr_dev(span, "id", "counter");
			add_location(span, file$f, 105, 4, 2592);
			attr_dev(div0, "class", "card-header text-left svelte-7wgm5n");
			add_location(div0, file$f, 103, 2, 2535);
			attr_dev(h50, "class", "card-title text-left");
			add_location(h50, file$f, 112, 12, 2827);
			attr_dev(div1, "class", "list text-left svelte-7wgm5n");
			attr_dev(div1, "id", "list");
			add_location(div1, file$f, 113, 12, 2883);
			attr_dev(div2, "class", "card-body");
			add_location(div2, file$f, 111, 10, 2790);
			attr_dev(div3, "class", "card");
			add_location(div3, file$f, 110, 8, 2760);
			attr_dev(div4, "class", "col-4");
			add_location(div4, file$f, 109, 6, 2731);
			attr_dev(h51, "class", "card-title text-left");
			add_location(h51, file$f, 142, 12, 3985);
			add_location(td0, file$f, 146, 18, 4184);
			add_location(td1, file$f, 146, 37, 4203);
			attr_dev(input0, "type", "text");
			add_location(input0, file$f, 146, 51, 4217);
			add_location(td2, file$f, 146, 47, 4213);
			set_style(tr0, "line-height", "25px");
			attr_dev(tr0, "class", "svelte-7wgm5n");
			add_location(tr0, file$f, 145, 16, 4133);
			add_location(td3, file$f, 149, 18, 4369);
			add_location(td4, file$f, 149, 39, 4390);
			attr_dev(input1, "type", "text");
			add_location(input1, file$f, 149, 53, 4404);
			add_location(td5, file$f, 149, 49, 4400);
			set_style(tr1, "line-height", "25px");
			attr_dev(tr1, "class", "svelte-7wgm5n");
			add_location(tr1, file$f, 148, 16, 4318);
			add_location(td6, file$f, 152, 18, 4558);
			add_location(td7, file$f, 152, 48, 4588);
			attr_dev(input2, "type", "number");
			attr_dev(input2, "min", "0");
			add_location(input2, file$f, 152, 62, 4602);
			add_location(td8, file$f, 152, 58, 4598);
			set_style(tr2, "line-height", "25px");
			attr_dev(tr2, "class", "svelte-7wgm5n");
			add_location(tr2, file$f, 151, 16, 4507);
			add_location(td9, file$f, 155, 18, 4764);
			add_location(td10, file$f, 155, 39, 4785);
			attr_dev(input3, "type", "number");
			attr_dev(input3, "min", "0");
			add_location(input3, file$f, 155, 53, 4799);
			add_location(td11, file$f, 155, 49, 4795);
			set_style(tr3, "line-height", "25px");
			attr_dev(tr3, "class", "svelte-7wgm5n");
			add_location(tr3, file$f, 154, 16, 4713);
			add_location(td12, file$f, 158, 18, 4963);
			add_location(td13, file$f, 158, 42, 4987);
			attr_dev(input4, "type", "text");
			add_location(input4, file$f, 158, 56, 5001);
			add_location(td14, file$f, 158, 52, 4997);
			set_style(tr4, "line-height", "25px");
			attr_dev(tr4, "class", "svelte-7wgm5n");
			add_location(tr4, file$f, 157, 16, 4912);
			add_location(td15, file$f, 161, 18, 5154);
			add_location(td16, file$f, 161, 37, 5173);
			attr_dev(input5, "type", "number");
			attr_dev(input5, "min", "0");
			add_location(input5, file$f, 161, 51, 5187);
			add_location(td17, file$f, 161, 47, 5183);
			set_style(tr5, "line-height", "25px");
			attr_dev(tr5, "class", "svelte-7wgm5n");
			add_location(tr5, file$f, 160, 16, 5103);
			attr_dev(table, "class", "text-left");
			add_location(table, file$f, 144, 14, 4090);
			attr_dev(div5, "class", "list svelte-7wgm5n");
			attr_dev(div5, "id", "ket");
			add_location(div5, file$f, 143, 12, 4047);
			attr_dev(div6, "class", "card-body");
			add_location(div6, file$f, 141, 10, 3948);
			attr_dev(div7, "class", "card");
			add_location(div7, file$f, 140, 8, 3918);
			attr_dev(div8, "class", "col-5");
			add_location(div8, file$f, 139, 6, 3889);
			attr_dev(button, "class", "btn btn-success m-2");
			add_location(button, file$f, 170, 10, 5461);
			attr_dev(div9, "class", "d-flex flex-column-reverse");
			add_location(div9, file$f, 169, 8, 5409);
			attr_dev(div10, "class", "col-3");
			add_location(div10, file$f, 168, 6, 5380);
			attr_dev(div11, "class", "d-flex align-items-center");
			add_location(div11, file$f, 108, 4, 2684);
			attr_dev(div12, "class", "card-body");
			add_location(div12, file$f, 107, 2, 2655);
			attr_dev(div13, "class", "card");
			add_location(div13, file$f, 102, 0, 2513);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div13, anchor);
			append_dev(div13, div0);
			append_dev(div0, t0);
			append_dev(div0, span);
			append_dev(div13, t1);
			append_dev(div13, div12);
			append_dev(div12, div11);
			append_dev(div11, div4);
			append_dev(div4, div3);
			append_dev(div3, div2);
			append_dev(div2, h50);
			append_dev(div2, t3);
			append_dev(div2, div1);
			if_block.m(div1, null);
			append_dev(div11, t4);
			append_dev(div11, div8);
			append_dev(div8, div7);
			append_dev(div7, div6);
			append_dev(div6, h51);
			append_dev(div6, t6);
			append_dev(div6, div5);
			append_dev(div5, table);
			append_dev(table, tr0);
			append_dev(tr0, td0);
			append_dev(tr0, td1);
			append_dev(tr0, td2);
			append_dev(td2, input0);
			set_input_value(input0, /*current_kosan*/ ctx[1].nama_kos);
			append_dev(table, t9);
			append_dev(table, tr1);
			append_dev(tr1, td3);
			append_dev(tr1, td4);
			append_dev(tr1, td5);
			append_dev(td5, input1);
			set_input_value(input1, /*current_kosan*/ ctx[1].alamat_kos);
			append_dev(table, t12);
			append_dev(table, tr2);
			append_dev(tr2, td6);
			append_dev(tr2, td7);
			append_dev(tr2, td8);
			append_dev(td8, input2);
			set_input_value(input2, /*current_kosan*/ ctx[1].luas_kamar);
			append_dev(table, t15);
			append_dev(table, tr3);
			append_dev(tr3, td9);
			append_dev(tr3, td10);
			append_dev(tr3, td11);
			append_dev(td11, input3);
			set_input_value(input3, /*current_kosan*/ ctx[1].jumlah_kamar);
			append_dev(table, t18);
			append_dev(table, tr4);
			append_dev(tr4, td12);
			append_dev(tr4, td13);
			append_dev(tr4, td14);
			append_dev(td14, input4);
			set_input_value(input4, /*current_kosan*/ ctx[1].fasilitas);
			append_dev(table, t21);
			append_dev(table, tr5);
			append_dev(tr5, td15);
			append_dev(tr5, td16);
			append_dev(tr5, td17);
			append_dev(td17, input5);
			set_input_value(input5, /*current_kosan*/ ctx[1].harga_sewa);
			append_dev(div11, t24);
			append_dev(div11, div10);
			append_dev(div10, div9);
			append_dev(div9, button);

			if (!mounted) {
				dispose = [
					listen_dev(input0, "input", /*input0_input_handler*/ ctx[5]),
					listen_dev(input1, "input", /*input1_input_handler*/ ctx[6]),
					listen_dev(input2, "input", /*input2_input_handler*/ ctx[7]),
					listen_dev(input3, "input", /*input3_input_handler*/ ctx[8]),
					listen_dev(input4, "input", /*input4_input_handler*/ ctx[9]),
					listen_dev(input5, "input", /*input5_input_handler*/ ctx[10]),
					listen_dev(button, "click", /*click_handler_2*/ ctx[11], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(div1, null);
				}
			}

			if (dirty & /*current_kosan*/ 2 && input0.value !== /*current_kosan*/ ctx[1].nama_kos) {
				set_input_value(input0, /*current_kosan*/ ctx[1].nama_kos);
			}

			if (dirty & /*current_kosan*/ 2 && input1.value !== /*current_kosan*/ ctx[1].alamat_kos) {
				set_input_value(input1, /*current_kosan*/ ctx[1].alamat_kos);
			}

			if (dirty & /*current_kosan*/ 2 && to_number(input2.value) !== /*current_kosan*/ ctx[1].luas_kamar) {
				set_input_value(input2, /*current_kosan*/ ctx[1].luas_kamar);
			}

			if (dirty & /*current_kosan*/ 2 && to_number(input3.value) !== /*current_kosan*/ ctx[1].jumlah_kamar) {
				set_input_value(input3, /*current_kosan*/ ctx[1].jumlah_kamar);
			}

			if (dirty & /*current_kosan*/ 2 && input4.value !== /*current_kosan*/ ctx[1].fasilitas) {
				set_input_value(input4, /*current_kosan*/ ctx[1].fasilitas);
			}

			if (dirty & /*current_kosan*/ 2 && to_number(input5.value) !== /*current_kosan*/ ctx[1].harga_sewa) {
				set_input_value(input5, /*current_kosan*/ ctx[1].harga_sewa);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div13);
			if_block.d();
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$g.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$g($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Components_edit", slots, []);
	let result;
	let data_kosan = [];

	let current_kosan = {
		id_kos: 0,
		id_pemilik: 0,
		nama_kos: "",
		alamat_kos: "",
		luas_kamar: 0,
		jarak_kos: 0,
		jumlah_kamar: 0,
		kamar_dipesan: 0,
		kamar_dihuni: 0,
		fasilitas: "",
		harga_sewa: 0
	};

	function getKosan() {
		try {
			axios$1.get("http://localhost:3002/owners/listkosan", {
				headers: {
					Authorization: localStorage.getItem("owner"),
					owner_id: localStorage.getItem("id_owner")
				}
			}).then(function (res) {
				// respon
				result = res.data;

				if (result.message == "Data ditemukan!") {
					$$invalidate(0, data_kosan = result.data);
				} else {
					alert(result.message);
				}
			}).catch(function (err) {
				// error handling
				console.log(err);
			});
		} catch(error) {
			alert(error);
		}
	}

	function currentKosan(id_kosan) {
		try {
			$$invalidate(1, current_kosan.id_kos = data_kosan[id_kosan].id_kos, current_kosan);
			$$invalidate(1, current_kosan.id_pemilik = data_kosan[id_kosan].id_pemilik, current_kosan);
			$$invalidate(1, current_kosan.nama_kos = data_kosan[id_kosan].nama_kos, current_kosan);
			$$invalidate(1, current_kosan.alamat_kos = data_kosan[id_kosan].alamat_kos, current_kosan);
			$$invalidate(1, current_kosan.luas_kamar = data_kosan[id_kosan].luas_kamar, current_kosan);
			$$invalidate(1, current_kosan.jarak_kos = data_kosan[id_kosan].jarak_kos, current_kosan);
			$$invalidate(1, current_kosan.jumlah_kamar = data_kosan[id_kosan].jumlah_kamar, current_kosan);
			$$invalidate(1, current_kosan.kamar_dipesan = data_kosan[id_kosan].kamar_dipesan, current_kosan);
			$$invalidate(1, current_kosan.kamar_dihuni = data_kosan[id_kosan].kamar_dihuni, current_kosan);
			$$invalidate(1, current_kosan.fasilitas = data_kosan[id_kosan].fasilitas, current_kosan);
			$$invalidate(1, current_kosan.harga_sewa = data_kosan[id_kosan].harga_sewa, current_kosan);
			console.log(current_kosan);
		} catch(error) {
			alert(error);
		}
	}

	getKosan();
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$5.warn(`<Components_edit> was created with unknown prop '${key}'`);
	});

	const click_handler = () => currentKosan(0);
	const click_handler_1 = i => currentKosan(i);

	function input0_input_handler() {
		current_kosan.nama_kos = this.value;
		$$invalidate(1, current_kosan);
	}

	function input1_input_handler() {
		current_kosan.alamat_kos = this.value;
		$$invalidate(1, current_kosan);
	}

	function input2_input_handler() {
		current_kosan.luas_kamar = to_number(this.value);
		$$invalidate(1, current_kosan);
	}

	function input3_input_handler() {
		current_kosan.jumlah_kamar = to_number(this.value);
		$$invalidate(1, current_kosan);
	}

	function input4_input_handler() {
		current_kosan.fasilitas = this.value;
		$$invalidate(1, current_kosan);
	}

	function input5_input_handler() {
		current_kosan.harga_sewa = to_number(this.value);
		$$invalidate(1, current_kosan);
	}

	const click_handler_2 = () => alert("Coming Soon :)");

	$$self.$capture_state = () => ({
		axios: axios$1,
		result,
		data_kosan,
		current_kosan,
		getKosan,
		currentKosan
	});

	$$self.$inject_state = $$props => {
		if ("result" in $$props) result = $$props.result;
		if ("data_kosan" in $$props) $$invalidate(0, data_kosan = $$props.data_kosan);
		if ("current_kosan" in $$props) $$invalidate(1, current_kosan = $$props.current_kosan);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		data_kosan,
		current_kosan,
		currentKosan,
		click_handler,
		click_handler_1,
		input0_input_handler,
		input1_input_handler,
		input2_input_handler,
		input3_input_handler,
		input4_input_handler,
		input5_input_handler,
		click_handler_2
	];
}

class Components_edit extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Components_edit",
			options,
			id: create_fragment$g.name
		});
	}
}

/* src\ownerkos\components\components.tambah.svelte generated by Svelte v3.29.4 */
const file$g = "src\\ownerkos\\components\\components.tambah.svelte";

function create_fragment$h(ctx) {
	let div21;
	let div0;
	let t1;
	let div20;
	let div19;
	let div7;
	let div2;
	let div1;
	let label0;
	let t3;
	let input0;
	let t4;
	let div4;
	let div3;
	let label1;
	let br0;
	let t6;
	let textarea;
	let t7;
	let div6;
	let div5;
	let label2;
	let br1;
	let t9;
	let input1;
	let t10;
	let div14;
	let div9;
	let div8;
	let label3;
	let br2;
	let t12;
	let input2;
	let t13;
	let div11;
	let div10;
	let label4;
	let br3;
	let t15;
	let table;
	let tr0;
	let td0;
	let label5;
	let input3;
	let t16;
	let t17;
	let td1;
	let label6;
	let input4;
	let t18;
	let t19;
	let tr1;
	let td2;
	let label7;
	let input5;
	let t20;
	let t21;
	let td3;
	let label8;
	let input6;
	let t22;
	let t23;
	let tr2;
	let td4;
	let label9;
	let input7;
	let t24;
	let t25;
	let td5;
	let label10;
	let input8;
	let t26;
	let t27;
	let tr3;
	let td6;
	let label11;
	let input9;
	let t28;
	let t29;
	let td7;
	let label12;
	let input10;
	let t30;
	let t31;
	let tr4;
	let td8;
	let label13;
	let input11;
	let t32;
	let t33;
	let td9;
	let label14;
	let input12;
	let t34;
	let t35;
	let div13;
	let div12;
	let label15;
	let br4;
	let t37;
	let input13;
	let t38;
	let div18;
	let div15;
	let t39;
	let div17;
	let div16;
	let button;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div21 = element("div");
			div0 = element("div");
			div0.textContent = "Registrasi Kosan Baru";
			t1 = space();
			div20 = element("div");
			div19 = element("div");
			div7 = element("div");
			div2 = element("div");
			div1 = element("div");
			label0 = element("label");
			label0.textContent = "NAMA KOS";
			t3 = space();
			input0 = element("input");
			t4 = space();
			div4 = element("div");
			div3 = element("div");
			label1 = element("label");
			label1.textContent = "ALAMAT KOS";
			br0 = element("br");
			t6 = space();
			textarea = element("textarea");
			t7 = space();
			div6 = element("div");
			div5 = element("div");
			label2 = element("label");
			label2.textContent = "LUAS KAMAR (dalam m²)";
			br1 = element("br");
			t9 = space();
			input1 = element("input");
			t10 = space();
			div14 = element("div");
			div9 = element("div");
			div8 = element("div");
			label3 = element("label");
			label3.textContent = "BANYAK KAMAR";
			br2 = element("br");
			t12 = space();
			input2 = element("input");
			t13 = space();
			div11 = element("div");
			div10 = element("div");
			label4 = element("label");
			label4.textContent = "FASILITAS";
			br3 = element("br");
			t15 = space();
			table = element("table");
			tr0 = element("tr");
			td0 = element("td");
			label5 = element("label");
			input3 = element("input");
			t16 = text("\r\n                    Tempat tidur");
			t17 = space();
			td1 = element("td");
			label6 = element("label");
			input4 = element("input");
			t18 = text("\r\n                    Dapur");
			t19 = space();
			tr1 = element("tr");
			td2 = element("td");
			label7 = element("label");
			input5 = element("input");
			t20 = text("\r\n                    Meja");
			t21 = space();
			td3 = element("td");
			label8 = element("label");
			input6 = element("input");
			t22 = text("\r\n                    Wi-Fi");
			t23 = space();
			tr2 = element("tr");
			td4 = element("td");
			label9 = element("label");
			input7 = element("input");
			t24 = text("\r\n                    Almari");
			t25 = space();
			td5 = element("td");
			label10 = element("label");
			input8 = element("input");
			t26 = text("\r\n                    AC");
			t27 = space();
			tr3 = element("tr");
			td6 = element("td");
			label11 = element("label");
			input9 = element("input");
			t28 = text("\r\n                    Kursi & meja belajar");
			t29 = space();
			td7 = element("td");
			label12 = element("label");
			input10 = element("input");
			t30 = text("\r\n                    TV");
			t31 = space();
			tr4 = element("tr");
			td8 = element("td");
			label13 = element("label");
			input11 = element("input");
			t32 = text("\r\n                    Kamar mandi dalam");
			t33 = space();
			td9 = element("td");
			label14 = element("label");
			input12 = element("input");
			t34 = text("\r\n                    Laundry");
			t35 = space();
			div13 = element("div");
			div12 = element("div");
			label15 = element("label");
			label15.textContent = "BIAYA PERBULAN";
			br4 = element("br");
			t37 = space();
			input13 = element("input");
			t38 = space();
			div18 = element("div");
			div15 = element("div");
			t39 = space();
			div17 = element("div");
			div16 = element("div");
			button = element("button");
			button.textContent = "SUBMIT";
			attr_dev(div0, "class", "card-header text-left svelte-b0dems");
			add_location(div0, file$g, 173, 2, 7086);
			attr_dev(label0, "for", "");
			add_location(label0, file$g, 181, 12, 7329);
			attr_dev(input0, "type", "text");
			attr_dev(input0, "class", "form-control");
			add_location(input0, file$g, 182, 12, 7373);
			attr_dev(div1, "class", "form-group text-center");
			add_location(div1, file$g, 180, 10, 7279);
			attr_dev(div2, "class", "col-4");
			add_location(div2, file$g, 179, 8, 7248);
			attr_dev(label1, "for", "txtalamat");
			add_location(label1, file$g, 187, 12, 7572);
			add_location(br0, file$g, 187, 53, 7613);
			attr_dev(textarea, "class", "form-control");
			attr_dev(textarea, "cols", "30");
			attr_dev(textarea, "rows", "5");
			textarea.required = true;
			add_location(textarea, file$g, 188, 12, 7633);
			attr_dev(div3, "class", "form-group text-center");
			add_location(div3, file$g, 186, 10, 7522);
			attr_dev(div4, "class", "col-4");
			add_location(div4, file$g, 185, 8, 7491);
			attr_dev(label2, "for", "txtluaskamar");
			add_location(label2, file$g, 198, 12, 7929);
			add_location(br1, file$g, 198, 71, 7988);
			attr_dev(input1, "type", "number");
			attr_dev(input1, "class", "form-control");
			attr_dev(input1, "id", "txtluaskamar");
			input1.required = true;
			add_location(input1, file$g, 199, 12, 8008);
			attr_dev(div5, "class", "form-group text-center");
			add_location(div5, file$g, 197, 10, 7879);
			attr_dev(div6, "class", "col-4");
			add_location(div6, file$g, 196, 8, 7848);
			attr_dev(div7, "class", "row");
			add_location(div7, file$g, 178, 6, 7221);
			attr_dev(label3, "for", "txtjumlahkamar");
			add_location(label3, file$g, 211, 12, 8358);
			add_location(br2, file$g, 211, 60, 8406);
			attr_dev(input2, "type", "number");
			attr_dev(input2, "class", "form-control");
			attr_dev(input2, "id", "txtjumlahkamar");
			attr_dev(input2, "min", "1");
			input2.required = true;
			add_location(input2, file$g, 212, 12, 8426);
			attr_dev(div8, "class", "form-group text-center");
			add_location(div8, file$g, 210, 10, 8308);
			attr_dev(div9, "class", "col-4");
			add_location(div9, file$g, 209, 8, 8277);
			attr_dev(label4, "for", "txtfasilitas");
			add_location(label4, file$g, 223, 12, 8759);
			add_location(br3, file$g, 223, 55, 8802);
			attr_dev(input3, "type", "checkbox");
			attr_dev(input3, "id", "fas0");
			input3.__value = "Tempat tidur";
			input3.value = input3.__value;
			/*$$binding_groups*/ ctx[7][0].push(input3);
			add_location(input3, file$g, 228, 25, 9015);
			add_location(label5, file$g, 228, 18, 9008);
			add_location(td0, file$g, 227, 16, 8984);
			attr_dev(input4, "type", "checkbox");
			attr_dev(input4, "id", "fas5");
			input4.__value = "dapur";
			input4.value = input4.__value;
			/*$$binding_groups*/ ctx[7][0].push(input4);
			add_location(input4, file$g, 236, 25, 9294);
			add_location(label6, file$g, 236, 18, 9287);
			add_location(td1, file$g, 235, 16, 9263);
			add_location(tr0, file$g, 226, 14, 8962);
			attr_dev(input5, "type", "checkbox");
			attr_dev(input5, "id", "fas1");
			input5.__value = "Meja";
			input5.value = input5.__value;
			/*$$binding_groups*/ ctx[7][0].push(input5);
			add_location(input5, file$g, 246, 25, 9600);
			add_location(label7, file$g, 246, 18, 9593);
			add_location(td2, file$g, 245, 16, 9569);
			attr_dev(input6, "type", "checkbox");
			attr_dev(input6, "id", "fas6");
			input6.__value = "Wi-Fi";
			input6.value = input6.__value;
			/*$$binding_groups*/ ctx[7][0].push(input6);
			add_location(input6, file$g, 254, 25, 9863);
			add_location(label8, file$g, 254, 18, 9856);
			add_location(td3, file$g, 253, 16, 9832);
			add_location(tr1, file$g, 244, 14, 9547);
			attr_dev(input7, "type", "checkbox");
			attr_dev(input7, "id", "fas2");
			input7.__value = "Almari";
			input7.value = input7.__value;
			/*$$binding_groups*/ ctx[7][0].push(input7);
			add_location(input7, file$g, 264, 25, 10169);
			add_location(label9, file$g, 264, 18, 10162);
			add_location(td4, file$g, 263, 16, 10138);
			attr_dev(input8, "type", "checkbox");
			attr_dev(input8, "id", "fas7");
			input8.__value = "AC";
			input8.value = input8.__value;
			/*$$binding_groups*/ ctx[7][0].push(input8);
			add_location(input8, file$g, 272, 25, 10436);
			add_location(label10, file$g, 272, 18, 10429);
			add_location(td5, file$g, 271, 16, 10405);
			add_location(tr2, file$g, 262, 14, 10116);
			attr_dev(input9, "type", "checkbox");
			attr_dev(input9, "id", "fas3");
			input9.__value = "Kursi & meja belajar";
			input9.value = input9.__value;
			/*$$binding_groups*/ ctx[7][0].push(input9);
			add_location(input9, file$g, 282, 25, 10736);
			add_location(label11, file$g, 282, 18, 10729);
			add_location(td6, file$g, 281, 16, 10705);
			attr_dev(input10, "type", "checkbox");
			attr_dev(input10, "id", "fas8");
			input10.__value = "TV";
			input10.value = input10.__value;
			/*$$binding_groups*/ ctx[7][0].push(input10);
			add_location(input10, file$g, 291, 25, 11051);
			add_location(label12, file$g, 291, 18, 11044);
			add_location(td7, file$g, 290, 16, 11020);
			add_location(tr3, file$g, 280, 14, 10683);
			attr_dev(input11, "type", "checkbox");
			attr_dev(input11, "id", "fas4");
			input11.__value = "Kamar mandi dalam";
			input11.value = input11.__value;
			/*$$binding_groups*/ ctx[7][0].push(input11);
			add_location(input11, file$g, 301, 25, 11351);
			add_location(label13, file$g, 301, 18, 11344);
			add_location(td8, file$g, 300, 16, 11320);
			attr_dev(input12, "type", "checkbox");
			attr_dev(input12, "id", "fas9");
			input12.__value = "Laundry";
			input12.value = input12.__value;
			/*$$binding_groups*/ ctx[7][0].push(input12);
			add_location(input12, file$g, 310, 25, 11660);
			add_location(label14, file$g, 310, 18, 11653);
			add_location(td9, file$g, 309, 16, 11629);
			add_location(tr4, file$g, 299, 14, 11298);
			attr_dev(table, "id", "fasilitas-container");
			add_location(table, file$g, 225, 12, 8914);
			attr_dev(div10, "class", "form-group text-center");
			add_location(div10, file$g, 222, 10, 8709);
			attr_dev(div11, "class", "col-4");
			add_location(div11, file$g, 221, 8, 8678);
			attr_dev(label15, "for", "txtbiaya");
			add_location(label15, file$g, 323, 12, 12048);
			add_location(br4, file$g, 323, 56, 12092);
			attr_dev(input13, "type", "number");
			attr_dev(input13, "class", "form-control");
			attr_dev(input13, "id", "txtbiaya");
			input13.required = true;
			add_location(input13, file$g, 324, 12, 12112);
			attr_dev(div12, "class", "form-group text-center");
			add_location(div12, file$g, 322, 10, 11998);
			attr_dev(div13, "class", "col-4");
			add_location(div13, file$g, 321, 8, 11967);
			attr_dev(div14, "class", "row mb-3");
			add_location(div14, file$g, 208, 6, 8245);
			attr_dev(div15, "class", "col-4");
			add_location(div15, file$g, 334, 8, 12372);
			attr_dev(button, "class", "btn btn-success m-2");
			add_location(button, file$g, 337, 12, 12482);
			attr_dev(div16, "class", "text-center mt-4");
			add_location(div16, file$g, 336, 10, 12438);
			attr_dev(div17, "class", "col-4");
			add_location(div17, file$g, 335, 8, 12407);
			attr_dev(div18, "class", "row");
			add_location(div18, file$g, 333, 6, 12345);
			attr_dev(div19, "class", "form-reg");
			add_location(div19, file$g, 177, 4, 7191);
			attr_dev(div20, "class", "card-body");
			add_location(div20, file$g, 176, 2, 7162);
			attr_dev(div21, "class", "card");
			attr_dev(div21, "disabled", "");
			add_location(div21, file$g, 172, 0, 7055);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div21, anchor);
			append_dev(div21, div0);
			append_dev(div21, t1);
			append_dev(div21, div20);
			append_dev(div20, div19);
			append_dev(div19, div7);
			append_dev(div7, div2);
			append_dev(div2, div1);
			append_dev(div1, label0);
			append_dev(div1, t3);
			append_dev(div1, input0);
			set_input_value(input0, /*data_kosan*/ ctx[1].nama_kos);
			append_dev(div7, t4);
			append_dev(div7, div4);
			append_dev(div4, div3);
			append_dev(div3, label1);
			append_dev(div3, br0);
			append_dev(div3, t6);
			append_dev(div3, textarea);
			set_input_value(textarea, /*data_kosan*/ ctx[1].alamat_kos);
			append_dev(div7, t7);
			append_dev(div7, div6);
			append_dev(div6, div5);
			append_dev(div5, label2);
			append_dev(div5, br1);
			append_dev(div5, t9);
			append_dev(div5, input1);
			set_input_value(input1, /*data_kosan*/ ctx[1].luas_kamar);
			append_dev(div19, t10);
			append_dev(div19, div14);
			append_dev(div14, div9);
			append_dev(div9, div8);
			append_dev(div8, label3);
			append_dev(div8, br2);
			append_dev(div8, t12);
			append_dev(div8, input2);
			set_input_value(input2, /*data_kosan*/ ctx[1].jumlah_kamar);
			append_dev(div14, t13);
			append_dev(div14, div11);
			append_dev(div11, div10);
			append_dev(div10, label4);
			append_dev(div10, br3);
			append_dev(div10, t15);
			append_dev(div10, table);
			append_dev(table, tr0);
			append_dev(tr0, td0);
			append_dev(td0, label5);
			append_dev(label5, input3);
			input3.checked = ~/*fas*/ ctx[0].indexOf(input3.__value);
			append_dev(label5, t16);
			append_dev(tr0, t17);
			append_dev(tr0, td1);
			append_dev(td1, label6);
			append_dev(label6, input4);
			input4.checked = ~/*fas*/ ctx[0].indexOf(input4.__value);
			append_dev(label6, t18);
			append_dev(table, t19);
			append_dev(table, tr1);
			append_dev(tr1, td2);
			append_dev(td2, label7);
			append_dev(label7, input5);
			input5.checked = ~/*fas*/ ctx[0].indexOf(input5.__value);
			append_dev(label7, t20);
			append_dev(tr1, t21);
			append_dev(tr1, td3);
			append_dev(td3, label8);
			append_dev(label8, input6);
			input6.checked = ~/*fas*/ ctx[0].indexOf(input6.__value);
			append_dev(label8, t22);
			append_dev(table, t23);
			append_dev(table, tr2);
			append_dev(tr2, td4);
			append_dev(td4, label9);
			append_dev(label9, input7);
			input7.checked = ~/*fas*/ ctx[0].indexOf(input7.__value);
			append_dev(label9, t24);
			append_dev(tr2, t25);
			append_dev(tr2, td5);
			append_dev(td5, label10);
			append_dev(label10, input8);
			input8.checked = ~/*fas*/ ctx[0].indexOf(input8.__value);
			append_dev(label10, t26);
			append_dev(table, t27);
			append_dev(table, tr3);
			append_dev(tr3, td6);
			append_dev(td6, label11);
			append_dev(label11, input9);
			input9.checked = ~/*fas*/ ctx[0].indexOf(input9.__value);
			append_dev(label11, t28);
			append_dev(tr3, t29);
			append_dev(tr3, td7);
			append_dev(td7, label12);
			append_dev(label12, input10);
			input10.checked = ~/*fas*/ ctx[0].indexOf(input10.__value);
			append_dev(label12, t30);
			append_dev(table, t31);
			append_dev(table, tr4);
			append_dev(tr4, td8);
			append_dev(td8, label13);
			append_dev(label13, input11);
			input11.checked = ~/*fas*/ ctx[0].indexOf(input11.__value);
			append_dev(label13, t32);
			append_dev(tr4, t33);
			append_dev(tr4, td9);
			append_dev(td9, label14);
			append_dev(label14, input12);
			input12.checked = ~/*fas*/ ctx[0].indexOf(input12.__value);
			append_dev(label14, t34);
			append_dev(div14, t35);
			append_dev(div14, div13);
			append_dev(div13, div12);
			append_dev(div12, label15);
			append_dev(div12, br4);
			append_dev(div12, t37);
			append_dev(div12, input13);
			set_input_value(input13, /*data_kosan*/ ctx[1].harga_sewa);
			append_dev(div19, t38);
			append_dev(div19, div18);
			append_dev(div18, div15);
			append_dev(div18, t39);
			append_dev(div18, div17);
			append_dev(div17, div16);
			append_dev(div16, button);

			if (!mounted) {
				dispose = [
					listen_dev(input0, "input", /*input0_input_handler*/ ctx[2]),
					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[3]),
					listen_dev(input1, "input", /*input1_input_handler*/ ctx[4]),
					listen_dev(input2, "input", /*input2_input_handler*/ ctx[5]),
					listen_dev(input3, "change", /*input3_change_handler*/ ctx[6]),
					listen_dev(input4, "change", /*input4_change_handler*/ ctx[8]),
					listen_dev(input5, "change", /*input5_change_handler*/ ctx[9]),
					listen_dev(input6, "change", /*input6_change_handler*/ ctx[10]),
					listen_dev(input7, "change", /*input7_change_handler*/ ctx[11]),
					listen_dev(input8, "change", /*input8_change_handler*/ ctx[12]),
					listen_dev(input9, "change", /*input9_change_handler*/ ctx[13]),
					listen_dev(input10, "change", /*input10_change_handler*/ ctx[14]),
					listen_dev(input11, "change", /*input11_change_handler*/ ctx[15]),
					listen_dev(input12, "change", /*input12_change_handler*/ ctx[16]),
					listen_dev(input13, "input", /*input13_input_handler*/ ctx[17]),
					listen_dev(button, "click", /*click_handler*/ ctx[18], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*data_kosan*/ 2 && input0.value !== /*data_kosan*/ ctx[1].nama_kos) {
				set_input_value(input0, /*data_kosan*/ ctx[1].nama_kos);
			}

			if (dirty & /*data_kosan*/ 2) {
				set_input_value(textarea, /*data_kosan*/ ctx[1].alamat_kos);
			}

			if (dirty & /*data_kosan*/ 2 && to_number(input1.value) !== /*data_kosan*/ ctx[1].luas_kamar) {
				set_input_value(input1, /*data_kosan*/ ctx[1].luas_kamar);
			}

			if (dirty & /*data_kosan*/ 2 && to_number(input2.value) !== /*data_kosan*/ ctx[1].jumlah_kamar) {
				set_input_value(input2, /*data_kosan*/ ctx[1].jumlah_kamar);
			}

			if (dirty & /*fas*/ 1) {
				input3.checked = ~/*fas*/ ctx[0].indexOf(input3.__value);
			}

			if (dirty & /*fas*/ 1) {
				input4.checked = ~/*fas*/ ctx[0].indexOf(input4.__value);
			}

			if (dirty & /*fas*/ 1) {
				input5.checked = ~/*fas*/ ctx[0].indexOf(input5.__value);
			}

			if (dirty & /*fas*/ 1) {
				input6.checked = ~/*fas*/ ctx[0].indexOf(input6.__value);
			}

			if (dirty & /*fas*/ 1) {
				input7.checked = ~/*fas*/ ctx[0].indexOf(input7.__value);
			}

			if (dirty & /*fas*/ 1) {
				input8.checked = ~/*fas*/ ctx[0].indexOf(input8.__value);
			}

			if (dirty & /*fas*/ 1) {
				input9.checked = ~/*fas*/ ctx[0].indexOf(input9.__value);
			}

			if (dirty & /*fas*/ 1) {
				input10.checked = ~/*fas*/ ctx[0].indexOf(input10.__value);
			}

			if (dirty & /*fas*/ 1) {
				input11.checked = ~/*fas*/ ctx[0].indexOf(input11.__value);
			}

			if (dirty & /*fas*/ 1) {
				input12.checked = ~/*fas*/ ctx[0].indexOf(input12.__value);
			}

			if (dirty & /*data_kosan*/ 2 && to_number(input13.value) !== /*data_kosan*/ ctx[1].harga_sewa) {
				set_input_value(input13, /*data_kosan*/ ctx[1].harga_sewa);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div21);
			/*$$binding_groups*/ ctx[7][0].splice(/*$$binding_groups*/ ctx[7][0].indexOf(input3), 1);
			/*$$binding_groups*/ ctx[7][0].splice(/*$$binding_groups*/ ctx[7][0].indexOf(input4), 1);
			/*$$binding_groups*/ ctx[7][0].splice(/*$$binding_groups*/ ctx[7][0].indexOf(input5), 1);
			/*$$binding_groups*/ ctx[7][0].splice(/*$$binding_groups*/ ctx[7][0].indexOf(input6), 1);
			/*$$binding_groups*/ ctx[7][0].splice(/*$$binding_groups*/ ctx[7][0].indexOf(input7), 1);
			/*$$binding_groups*/ ctx[7][0].splice(/*$$binding_groups*/ ctx[7][0].indexOf(input8), 1);
			/*$$binding_groups*/ ctx[7][0].splice(/*$$binding_groups*/ ctx[7][0].indexOf(input9), 1);
			/*$$binding_groups*/ ctx[7][0].splice(/*$$binding_groups*/ ctx[7][0].indexOf(input10), 1);
			/*$$binding_groups*/ ctx[7][0].splice(/*$$binding_groups*/ ctx[7][0].indexOf(input11), 1);
			/*$$binding_groups*/ ctx[7][0].splice(/*$$binding_groups*/ ctx[7][0].indexOf(input12), 1);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$h.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$h($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Components_tambah", slots, []);
	let fas = [];

	let data_kosan = {
		id_pemilik: localStorage.getItem("id_owner"),
		nama_kos: "",
		alamat_kos: "",
		luas_kamar: 0,
		jarak_kos: 0,
		jumlah_kamar: 0,
		fasilitas: fas,
		harga_sewa: 0,
		status_kosan: "after register",
		img: ""
	};

	// alert(localStorage.getItem('owner'));
	// alert(localStorage.getItem('id_owner'));
	class PemilikKos extends Owner {
		tambahKos() {
			try {
				if (!data_kosan.nama_kos) {
					alert("Mohon isi data dengan lengkap!");
					return;
				} else {
					axios$1({
						method: "post",
						url: "http://localhost:3002/owners/tambah-kos",
						headers: {
							"authorization": localStorage.getItem("owner")
						},
						data: {
							id_pemilik: localStorage.getItem("id_owner"),
							nama_kos: data_kosan.nama_kos,
							alamat_kos: data_kosan.alamat_kos,
							luas_kamar: data_kosan.luas_kamar,
							jarak_kos: data_kosan.jarak_kos,
							jumlah_kamar: data_kosan.jumlah_kamar,
							fasilitas: data_kosan.fasilitas,
							harga_sewa: data_kosan.harga_sewa,
							img: ""
						}
					}).then(function (response) {
						let respon = response.data;
						alert(respon.message);
					});
				}
			} catch(error) {
				alert(error);
			}
		}
	}

	function submit() {
		try {
			axios$1({
				method: "post",
				url: "http://localhost:3002/owners/tambah-kosan",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					"Authorization": localStorage.getItem("owner").toString()
				},
				data: {
					id_pemilik: localStorage.getItem("id_owner"),
					nama_kos: data_kosan.nama_kos,
					alamat_kos: data_kosan.alamat_kos,
					luas_kamar: data_kosan.luas_kamar,
					jarak_kos: data_kosan.jarak_kos,
					jumlah_kamar: data_kosan.jumlah_kamar,
					fasilitas: data_kosan.fasilitas,
					harga_sewa: data_kosan.harga_sewa,
					img: ""
				}
			}).then(function (response) {
				let respon = response.data;
				alert(respon.message);
			}).catch(function (error) {
				alert(error.message);
			});
		} catch(error) {
			alert(error); // axios.post('http://localhost:3002/owners/tambah-kosan', {
		}
	}

	function submit1() {
		const headers = new Headers();
		headers.append("Content-Type", "application/x-www-form-urlencoded");
		headers.append("Authorization", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF9vd25lciI6MSwibmFtYV9vd25lciI6IkFsdmlmIFNhbmRhbmEgTWFoYXJkaWthIiwiYWxhbWF0X293bmVyIjoiUm9nb2phbXBpIiwiVFRMIjoiQldJLCAyNCBBZ3VzdHVzIDIwMDAiLCJqayI6IkwiLCJub190ZWxwb24iOiIwODEzNDU2Nzg5MDAiLCJlbWFpbCI6ImFzbTI0MDgwMEBleGFtcGxlLmNvbSIsInVzZXJuYW1lIjoidGVzdCIsInBhc3N3b3JkIjoidGVzdDEyMzQ1IiwiY3JlYXRlZEF0IjoiMjAyMC0xMi0yNFQxODo1NDoxMC4wMDBaIiwidXBkYXRlZEF0IjoiMjAyMC0xMi0yNFQxODo1NDoxMC4wMDBaIiwiaWF0IjoxNjEwNTI4NTcyfQ._LGo7oMliFT76-WpCv0Ys2CY5u8897ugTnrqXeKIsvM");
		const body = `id_pemilik=${localStorage.getItem("id_owner")}&nama_kos=${data_kosan.nama_kos}&alamat_kos=${data_kosan.alamat_kos}&luas_kamar=${data_kosan.luas_kamar}&jarak_kos=${data_kosan.jarak_kos}&fasilitas=${data_kosan.fasilitas}&harga_sewa=${data_kosan.harga_sewa}&jumlah_kamar=${data_kosan.jumlah_kamar}`;
		const init = { method: "POST", headers, body };

		fetch("http://localhost:3002/owners/tambah-kosan", init).then(response => {
			let res = response.statusText;
			alert(res);
			return response.json(); // or .text() or .blob() ...
		}).catch(e => {
			// error in e.message
			alert(e);
		});
	}

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Components_tambah> was created with unknown prop '${key}'`);
	});

	const $$binding_groups = [[]];

	function input0_input_handler() {
		data_kosan.nama_kos = this.value;
		$$invalidate(1, data_kosan);
	}

	function textarea_input_handler() {
		data_kosan.alamat_kos = this.value;
		$$invalidate(1, data_kosan);
	}

	function input1_input_handler() {
		data_kosan.luas_kamar = to_number(this.value);
		$$invalidate(1, data_kosan);
	}

	function input2_input_handler() {
		data_kosan.jumlah_kamar = to_number(this.value);
		$$invalidate(1, data_kosan);
	}

	function input3_change_handler() {
		fas = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
		$$invalidate(0, fas);
	}

	function input4_change_handler() {
		fas = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
		$$invalidate(0, fas);
	}

	function input5_change_handler() {
		fas = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
		$$invalidate(0, fas);
	}

	function input6_change_handler() {
		fas = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
		$$invalidate(0, fas);
	}

	function input7_change_handler() {
		fas = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
		$$invalidate(0, fas);
	}

	function input8_change_handler() {
		fas = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
		$$invalidate(0, fas);
	}

	function input9_change_handler() {
		fas = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
		$$invalidate(0, fas);
	}

	function input10_change_handler() {
		fas = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
		$$invalidate(0, fas);
	}

	function input11_change_handler() {
		fas = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
		$$invalidate(0, fas);
	}

	function input12_change_handler() {
		fas = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
		$$invalidate(0, fas);
	}

	function input13_input_handler() {
		data_kosan.harga_sewa = to_number(this.value);
		$$invalidate(1, data_kosan);
	}

	const click_handler = () => alert("Coming Soon :)");

	$$self.$capture_state = () => ({
		axios: axios$1,
		Owner,
		fas,
		data_kosan,
		PemilikKos,
		submit,
		submit1
	});

	$$self.$inject_state = $$props => {
		if ("fas" in $$props) $$invalidate(0, fas = $$props.fas);
		if ("data_kosan" in $$props) $$invalidate(1, data_kosan = $$props.data_kosan);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		fas,
		data_kosan,
		input0_input_handler,
		textarea_input_handler,
		input1_input_handler,
		input2_input_handler,
		input3_change_handler,
		$$binding_groups,
		input4_change_handler,
		input5_change_handler,
		input6_change_handler,
		input7_change_handler,
		input8_change_handler,
		input9_change_handler,
		input10_change_handler,
		input11_change_handler,
		input12_change_handler,
		input13_input_handler,
		click_handler
	];
}

class Components_tambah extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Components_tambah",
			options,
			id: create_fragment$h.name
		});
	}
}

/* src\ownerkos\components\components.pemesanan.svelte generated by Svelte v3.29.4 */

const { console: console_1$6 } = globals;
const file$h = "src\\ownerkos\\components\\components.pemesanan.svelte";

function get_each_context$6(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[14] = list[i];
	child_ctx[16] = i;
	return child_ctx;
}

// (211:14) {#each data_pemesanan as data, i}
function create_each_block$6(ctx) {
	let div;
	let strong;
	let t0;
	let t1_value = /*data*/ ctx[14].id_pesanan + "";
	let t1;
	let t2;
	let div_id_value;
	let mounted;
	let dispose;

	function click_handler(...args) {
		return /*click_handler*/ ctx[3](/*data*/ ctx[14], ...args);
	}

	const block = {
		c: function create() {
			div = element("div");
			strong = element("strong");
			t0 = text("ID Pesanan: ");
			t1 = text(t1_value);
			t2 = space();
			add_location(strong, file$h, 217, 18, 7118);
			attr_dev(div, "class", "unconfirmed-pesanan svelte-1abhqpz");
			attr_dev(div, "id", div_id_value = /*data*/ ctx[14].id_pesanan);
			add_location(div, file$h, 211, 16, 6867);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, strong);
			append_dev(strong, t0);
			append_dev(strong, t1);
			append_dev(div, t2);

			if (!mounted) {
				dispose = listen_dev(div, "click", click_handler, false, false, false);
				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*data_pemesanan*/ 1 && t1_value !== (t1_value = /*data*/ ctx[14].id_pesanan + "")) set_data_dev(t1, t1_value);

			if (dirty & /*data_pemesanan*/ 1 && div_id_value !== (div_id_value = /*data*/ ctx[14].id_pesanan)) {
				attr_dev(div, "id", div_id_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$6.name,
		type: "each",
		source: "(211:14) {#each data_pemesanan as data, i}",
		ctx
	});

	return block;
}

function create_fragment$i(ctx) {
	let div13;
	let div0;
	let t0;
	let span;
	let t1_value = /*data_pemesanan*/ ctx[0].length + "";
	let t1;
	let t2;
	let div12;
	let div11;
	let div4;
	let div3;
	let div2;
	let h50;
	let t4;
	let div1;
	let t5;
	let div8;
	let div7;
	let div6;
	let h51;
	let t7;
	let div5;
	let t8;
	let div10;
	let div9;
	let button;
	let mounted;
	let dispose;
	let each_value = /*data_pemesanan*/ ctx[0];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div13 = element("div");
			div0 = element("div");
			t0 = text("Perlu Konfirmasi\r\n    ");
			span = element("span");
			t1 = text(t1_value);
			t2 = space();
			div12 = element("div");
			div11 = element("div");
			div4 = element("div");
			div3 = element("div");
			div2 = element("div");
			h50 = element("h5");
			h50.textContent = "List";
			t4 = space();
			div1 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t5 = space();
			div8 = element("div");
			div7 = element("div");
			div6 = element("div");
			h51 = element("h5");
			h51.textContent = "Keterangan";
			t7 = space();
			div5 = element("div");
			t8 = space();
			div10 = element("div");
			div9 = element("div");
			button = element("button");
			button.textContent = "KONFIRMASI";
			attr_dev(span, "class", "badge badge-primary");
			add_location(span, file$h, 201, 4, 6459);
			attr_dev(div0, "class", "card-header text-left svelte-1abhqpz");
			add_location(div0, file$h, 199, 2, 6396);
			attr_dev(h50, "class", "card-title text-left");
			add_location(h50, file$h, 208, 12, 6706);
			attr_dev(div1, "class", "list text-left svelte-1abhqpz");
			attr_dev(div1, "id", "list");
			add_location(div1, file$h, 209, 12, 6762);
			attr_dev(div2, "class", "card-body");
			add_location(div2, file$h, 207, 10, 6669);
			attr_dev(div3, "class", "card");
			add_location(div3, file$h, 206, 8, 6639);
			attr_dev(div4, "class", "col-4");
			add_location(div4, file$h, 205, 6, 6610);
			attr_dev(h51, "class", "card-title text-left");
			add_location(h51, file$h, 227, 12, 7383);
			attr_dev(div5, "class", "list svelte-1abhqpz");
			attr_dev(div5, "id", "ket");
			add_location(div5, file$h, 228, 12, 7445);
			attr_dev(div6, "class", "card-body");
			add_location(div6, file$h, 226, 10, 7346);
			attr_dev(div7, "class", "card");
			add_location(div7, file$h, 225, 8, 7316);
			attr_dev(div8, "class", "col-5");
			add_location(div8, file$h, 224, 6, 7287);
			attr_dev(button, "class", "btn btn-success p-2 svelte-1abhqpz");
			attr_dev(button, "id", "btnkonfirm");
			add_location(button, file$h, 234, 10, 7611);
			attr_dev(div9, "class", "d-flex flex-column-reverse");
			add_location(div9, file$h, 233, 8, 7559);
			attr_dev(div10, "class", "col-3");
			add_location(div10, file$h, 232, 6, 7530);
			attr_dev(div11, "class", "d-flex align-items-top");
			add_location(div11, file$h, 204, 4, 6566);
			attr_dev(div12, "class", "card-body");
			add_location(div12, file$h, 203, 2, 6537);
			attr_dev(div13, "class", "card");
			add_location(div13, file$h, 198, 0, 6374);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div13, anchor);
			append_dev(div13, div0);
			append_dev(div0, t0);
			append_dev(div0, span);
			append_dev(span, t1);
			append_dev(div13, t2);
			append_dev(div13, div12);
			append_dev(div12, div11);
			append_dev(div11, div4);
			append_dev(div4, div3);
			append_dev(div3, div2);
			append_dev(div2, h50);
			append_dev(div2, t4);
			append_dev(div2, div1);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div1, null);
			}

			append_dev(div11, t5);
			append_dev(div11, div8);
			append_dev(div8, div7);
			append_dev(div7, div6);
			append_dev(div6, h51);
			append_dev(div6, t7);
			append_dev(div6, div5);
			append_dev(div11, t8);
			append_dev(div11, div10);
			append_dev(div10, div9);
			append_dev(div9, button);

			if (!mounted) {
				dispose = listen_dev(button, "click", /*konfirmasiPemesanan*/ ctx[1], false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*data_pemesanan*/ 1 && t1_value !== (t1_value = /*data_pemesanan*/ ctx[0].length + "")) set_data_dev(t1, t1_value);

			if (dirty & /*data_pemesanan, getKeterangan*/ 5) {
				each_value = /*data_pemesanan*/ ctx[0];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$6(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$6(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div1, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div13);
			destroy_each(each_blocks, detaching);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$i.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$i($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Components_pemesanan", slots, []);
	let data_pemesanan = [];
	let data_kosan = [];
	let data_owner = [];
	let data_user = [];
	let i_u = 0;
	let i_k = 0;
	let i_o = 0;
	let i_p = 0;
	let id_psn = 0;

	class Adm extends Admin {
		constructor(id) {
			super(id);
		}

		konfirmasiPemesanan(id_pemesanan) {
			try {
				const headers = new Headers();
				headers.append("Content-Type", "application/x-www-form-urlencoded");
				headers.append("Authorization", localStorage.getItem("owner"));
				headers.append("id_pemesanan", id_pemesanan.toString());
				const body = `ketersediaan=tersedia`;
				const init = { method: "POST", headers, body };

				fetch("http://localhost:3002/owners/confirm-pesanan", init).then(response => {
					if (response.status == 200) {
						alert("Berhasil konfirmasi ketersediaan kamar!");
					}
				}).catch(e => {
					alert(e);
				});
			} catch(error) {
				alert(error);
			}
		}

		getUnconfirmedPesanan() {
			try {
				axios$1.get("http://localhost:3002/owners/unconfirmed-pesanan", {
					headers: {
						Authorization: localStorage.getItem("owner"),
						status_pesanan: "unconfirmed"
					}
				}).then(res => {
					// memasukkan response data
					let result = res.data;

					// memilah data sesuai kelompok
					$$invalidate(0, data_pemesanan = result.data);

					data_kosan = result.data_kosan;
					data_owner = result.data_owner;
					data_user = result.data_user;
					console.log(result);
				});
			} catch(error) {
				alert(error);
			}
		}
	}

	function getListUnconfirmed() {
		try {
			let adm = new Adm(parseInt(localStorage.getItem("id_owner")));
			adm.getUnconfirmedPesanan();
		} catch(error) {
			alert(error);
		}
	}

	function konfirmasiPemesanan() {
		try {
			let adm = new Adm(parseInt(localStorage.getItem("id_owner")));
			adm.konfirmasiPemesanan(i_p);
			adm.getUnconfirmedPesanan();
		} catch(error) {
			alert(error);
		}
	}

	function getKeterangan(id_pesanan, id_user, id_kosan) {
		let keterangan = ``;
		id_psn = id_pesanan;

		// search index
		for (let i = 0; i < data_kosan.length; i++) {
			if (data_kosan[i].id_kos == id_kosan) {
				i_k = i;

				for (let j = 0; j < data_user.length; j++) {
					if (data_user[j].id_user == id_user) {
						i_u = j;

						for (let k = 0; k < data_owner.length; k++) {
							if (data_owner[k].id_owner == data_kosan[i_k].id_pemilik) {
								i_o = k;

								for (let l = 1; l < data_pemesanan.length; l++) {
									if (data_pemesanan[l].id_pesanan == id_pesanan) {
										i_p = l;
									}
								}
							}
						}
					}
				}
			}
		}

		keterangan = `
    <strong>Info Pemesanan</strong>
    <table class="text-left">
      <tr style="line-height: 25px;">
        <td>Id Pemesanan</td><td>:</td><td>${data_pemesanan[i_p].id_pesanan}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Lama Sewa</td><td>:</td><td>${data_pemesanan[i_p].lama_tinggal} bulan</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Kamar dipesan</td><td>:</td><td>${data_pemesanan[i_p].n_kamar} unit</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Ketersediaan Kamar</td><td>:</td><td>${data_pemesanan[i_p].ketersediaan}</td>
      </tr>
    </table>
    <br/>
    <strong>Data Pemesan</strong>
    <table class='text-left'>
      <tr style="line-height: 25px;">
        <td>Nama User</td><td>:</td><td>${data_user[i_u].nama_user}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Alamat User</td><td>:</td><td>${data_user[i_u].alamat_user}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>No. Telepon</td><td>:</td><td>${data_user[i_u].telpon_user}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Email</td><td>:</td><td>${data_user[i_u].email_user}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>TTL</td><td>:</td><td>${data_user[i_u].tgllahir}</td>
      </tr>
    </table>
    <br/>
    <strong>Data Tempat Kos</strong>
    <table class='text-left'>
      <tr style="line-height: 25px;">
        <td>Nama Kosan</td><td>:</td><td>${data_kosan[i_k].nama_kos}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Alamat Kosan</td><td>:</td><td>${data_kosan[i_k].alamat_kos}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Luas Kamar</td><td>:</td><td>${data_kosan[i_k].luas_kamar}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Jumlah Kamar</td><td>:</td><td>${data_kosan[i_k].jumlah_kamar}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Jumlah Kamar</td><td>:</td><td>${data_kosan[i_k].fasilitas}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Kamar dipesan</td><td>:</td><td>${data_kosan[i_k].kamar_dipesan}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Kamar dihuni</td><td>:</td><td>${data_kosan[i_k].kamar_dihuni}</td>
      </tr>
      <tr style="line-height: 25px;">
        <td>Harga Sewa</td><td>:</td><td>${data_kosan[i_k].harga_sewa}</td>
      </tr>
    </table>
    <br/>
    `;

		document.getElementById("ket").innerHTML = keterangan;
	}

	getListUnconfirmed();
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$6.warn(`<Components_pemesanan> was created with unknown prop '${key}'`);
	});

	const click_handler = data => {
		getKeterangan(data.id_pesanan, data.id_user, data.id_kos);
	};

	$$self.$capture_state = () => ({
		axios: axios$1,
		Admin,
		data_pemesanan,
		data_kosan,
		data_owner,
		data_user,
		i_u,
		i_k,
		i_o,
		i_p,
		id_psn,
		Adm,
		getListUnconfirmed,
		konfirmasiPemesanan,
		getKeterangan
	});

	$$self.$inject_state = $$props => {
		if ("data_pemesanan" in $$props) $$invalidate(0, data_pemesanan = $$props.data_pemesanan);
		if ("data_kosan" in $$props) data_kosan = $$props.data_kosan;
		if ("data_owner" in $$props) data_owner = $$props.data_owner;
		if ("data_user" in $$props) data_user = $$props.data_user;
		if ("i_u" in $$props) i_u = $$props.i_u;
		if ("i_k" in $$props) i_k = $$props.i_k;
		if ("i_o" in $$props) i_o = $$props.i_o;
		if ("i_p" in $$props) i_p = $$props.i_p;
		if ("id_psn" in $$props) id_psn = $$props.id_psn;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [data_pemesanan, konfirmasiPemesanan, getKeterangan, click_handler];
}

class Components_pemesanan$1 extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Components_pemesanan",
			options,
			id: create_fragment$i.name
		});
	}
}

/* src\ownerkos\Dasbor.owner.svelte generated by Svelte v3.29.4 */
const file$i = "src\\ownerkos\\Dasbor.owner.svelte";

function create_fragment$j(ctx) {
	let div3;
	let div2;
	let div0;
	let ul;
	let li0;
	let a0;
	let t1;
	let li1;
	let a1;
	let t3;
	let li2;
	let a2;
	let t5;
	let div1;
	let switch_instance;
	let current;
	let mounted;
	let dispose;
	var switch_value = /*component*/ ctx[0];

	function switch_props(ctx) {
		return { $$inline: true };
	}

	if (switch_value) {
		switch_instance = new switch_value(switch_props());
	}

	const block = {
		c: function create() {
			div3 = element("div");
			div2 = element("div");
			div0 = element("div");
			ul = element("ul");
			li0 = element("li");
			a0 = element("a");
			a0.textContent = "Edit Data Kosan";
			t1 = space();
			li1 = element("li");
			a1 = element("a");
			a1.textContent = "Tambah";
			t3 = space();
			li2 = element("li");
			a2 = element("a");
			a2.textContent = "Pemesanan";
			t5 = space();
			div1 = element("div");
			if (switch_instance) create_component(switch_instance.$$.fragment);
			attr_dev(a0, "class", "nav-link active svelte-pmyzo8");
			attr_dev(a0, "href", "#edit");
			add_location(a0, file$i, 34, 10, 799);
			attr_dev(li0, "class", "nav-item");
			add_location(li0, file$i, 33, 8, 766);
			attr_dev(a1, "class", "nav-link svelte-pmyzo8");
			attr_dev(a1, "href", "#tambah");
			add_location(a1, file$i, 40, 10, 990);
			attr_dev(li1, "class", "nav-item");
			add_location(li1, file$i, 39, 8, 957);
			attr_dev(a2, "class", "nav-link svelte-pmyzo8");
			attr_dev(a2, "href", "#pemesanan");
			add_location(a2, file$i, 46, 10, 1167);
			attr_dev(li2, "class", "nav-item");
			add_location(li2, file$i, 45, 8, 1134);
			attr_dev(ul, "class", "nav nav-tabs card-header-tabs svelte-pmyzo8");
			attr_dev(ul, "id", "myTab");
			add_location(ul, file$i, 32, 6, 703);
			attr_dev(div0, "class", "card-header svelte-pmyzo8");
			add_location(div0, file$i, 31, 4, 670);
			attr_dev(div1, "class", "card-body");
			add_location(div1, file$i, 53, 4, 1338);
			attr_dev(div2, "class", "card text-center");
			add_location(div2, file$i, 30, 2, 634);
			attr_dev(div3, "class", "admin svelte-pmyzo8");
			add_location(div3, file$i, 29, 0, 611);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div3, anchor);
			append_dev(div3, div2);
			append_dev(div2, div0);
			append_dev(div0, ul);
			append_dev(ul, li0);
			append_dev(li0, a0);
			append_dev(ul, t1);
			append_dev(ul, li1);
			append_dev(li1, a1);
			append_dev(ul, t3);
			append_dev(ul, li2);
			append_dev(li2, a2);
			append_dev(div2, t5);
			append_dev(div2, div1);

			if (switch_instance) {
				mount_component(switch_instance, div1, null);
			}

			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(a0, "click", /*click_handler*/ ctx[2], false, false, false),
					listen_dev(a1, "click", /*click_handler_1*/ ctx[3], false, false, false),
					listen_dev(a2, "click", /*click_handler_2*/ ctx[4], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
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
					mount_component(switch_instance, div1, null);
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
			if (detaching) detach_dev(div3);
			if (switch_instance) destroy_component(switch_instance);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$j.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$j($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Dasbor_owner", slots, []);
	let component = Components_edit;

	function pilihComponent(n) {
		if (n == 1) {
			$$invalidate(0, component = Components_edit);
		} else if (n == 2) {
			$$invalidate(0, component = Components_tambah);
		} else {
			$$invalidate(0, component = Components_pemesanan$1);
		}
	}

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Dasbor_owner> was created with unknown prop '${key}'`);
	});

	const click_handler = () => pilihComponent(1);
	const click_handler_1 = () => pilihComponent(2);
	const click_handler_2 = () => pilihComponent(3);

	$$self.$capture_state = () => ({
		Edit: Components_edit,
		Tambah: Components_tambah,
		Pemesanan: Components_pemesanan$1,
		component,
		pilihComponent
	});

	$$self.$inject_state = $$props => {
		if ("component" in $$props) $$invalidate(0, component = $$props.component);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [component, pilihComponent, click_handler, click_handler_1, click_handler_2];
}

class Dasbor_owner extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$j, create_fragment$j, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Dasbor_owner",
			options,
			id: create_fragment$j.name
		});
	}
}

/* src\ownerkos\index.ownerkos.svelte generated by Svelte v3.29.4 */
const file$j = "src\\ownerkos\\index.ownerkos.svelte";

// (70:0) {:else}
function create_else_block$4(ctx) {
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
	let t10;
	let a;
	let mounted;
	let dispose;
	let if_block = /*login_state*/ ctx[1] == -1 && create_if_block_1$2(ctx);

	const block = {
		c: function create() {
			div5 = element("div");
			div4 = element("div");
			div3 = element("div");
			h3 = element("h3");
			h3.textContent = "Owner Login";
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
			t10 = text("\r\n          Belum punya akun?\r\n          ");
			a = element("a");
			a.textContent = "Signup disini";
			attr_dev(h3, "class", "card-title mb-5");
			add_location(h3, file$j, 73, 10, 2756);
			attr_dev(label0, "for", "txtusernamae");
			attr_dev(label0, "class", "form-label");
			add_location(label0, file$j, 78, 12, 2935);
			attr_dev(input0, "type", "text");
			attr_dev(input0, "class", "form-control");
			attr_dev(input0, "id", "txtusernamae");
			add_location(input0, file$j, 79, 12, 3010);
			attr_dev(div0, "class", "mb-3");
			add_location(div0, file$j, 77, 10, 2903);
			attr_dev(label1, "for", "txtpassword");
			attr_dev(label1, "class", "form-label");
			add_location(label1, file$j, 82, 12, 3149);
			attr_dev(input1, "type", "password");
			attr_dev(input1, "class", "form-control");
			attr_dev(input1, "id", "txtpassword");
			add_location(input1, file$j, 83, 12, 3223);
			attr_dev(div1, "class", "mb-3");
			add_location(div1, file$j, 81, 10, 3117);
			attr_dev(button, "type", "button");
			attr_dev(button, "class", "btn btn-success");
			add_location(button, file$j, 86, 12, 3364);
			attr_dev(div2, "class", "mb-3");
			add_location(div2, file$j, 85, 10, 3332);
			attr_dev(a, "href", "http://localhost:5000/owner/signup");
			add_location(a, file$j, 89, 10, 3502);
			attr_dev(div3, "class", "card-body");
			add_location(div3, file$j, 72, 8, 2721);
			attr_dev(div4, "class", "card shadow card-bg");
			set_style(div4, "width", "25rem");
			set_style(div4, "margin-top", "70px");
			add_location(div4, file$j, 71, 4, 2639);
			attr_dev(div5, "class", "d-flex justify-content-center mt-5");
			add_location(div5, file$j, 70, 2, 2585);
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
			set_input_value(input0, /*uname*/ ctx[2]);
			append_dev(div3, t5);
			append_dev(div3, div1);
			append_dev(div1, label1);
			append_dev(div1, t7);
			append_dev(div1, input1);
			set_input_value(input1, /*pass*/ ctx[3]);
			append_dev(div3, t8);
			append_dev(div3, div2);
			append_dev(div2, button);
			append_dev(div3, t10);
			append_dev(div3, a);

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
			if (/*login_state*/ ctx[1] == -1) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_1$2(ctx);
					if_block.c();
					if_block.m(div3, t2);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty & /*uname*/ 4 && input0.value !== /*uname*/ ctx[2]) {
				set_input_value(input0, /*uname*/ ctx[2]);
			}

			if (dirty & /*pass*/ 8 && input1.value !== /*pass*/ ctx[3]) {
				set_input_value(input1, /*pass*/ ctx[3]);
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
		id: create_else_block$4.name,
		type: "else",
		source: "(70:0) {:else}",
		ctx
	});

	return block;
}

// (68:0) {#if localStorage.getItem('login') == 'owner'}
function create_if_block$7(ctx) {
	let switch_instance;
	let switch_instance_anchor;
	let current;
	var switch_value = Dasbor_owner;

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
			if (switch_value !== (switch_value = Dasbor_owner)) {
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
		id: create_if_block$7.name,
		type: "if",
		source: "(68:0) {#if localStorage.getItem('login') == 'owner'}",
		ctx
	});

	return block;
}

// (75:10) {#if login_state == -1}
function create_if_block_1$2(ctx) {
	let html_tag;
	let raw_value = /*notif*/ ctx[4].showAlert() + "";
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
		id: create_if_block_1$2.name,
		type: "if",
		source: "(75:10) {#if login_state == -1}",
		ctx
	});

	return block;
}

function create_fragment$k(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block$7, create_else_block$4];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (localStorage.getItem("login") == "owner") return 0;
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
		id: create_fragment$k.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$k($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Ownerkos", slots, []);

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

	// class Owner extends Login{
	//   constructor(username:string){
	//     super(username);
	//   }
	// }
	let login_state;

	let uname;
	let pass;
	let result;
	let LOGIN_API_URL = "http://localhost:3002/owners/login";

	function doLogin() {
		return __awaiter(this, void 0, void 0, function* () {
			try {
				const response = yield axios$1.post(LOGIN_API_URL, { username: uname, password: pass });
				result = response.data;

				if (result.message == "Berhasil login") {
					window.open("http://localhost:5000/owner/dasbor", "_self");

					// set localStorage
					localStorage.setItem("owner", result.token);

					localStorage.setItem("id_owner", result.id_owner);
					localStorage.setItem("nama_owner", result.username);
					localStorage.setItem("login", "owner");
				} else {
					$$invalidate(1, login_state = 1);
				}
			} catch(error) {
				$$invalidate(1, login_state = 1);
			}
		});
	}

	let notif = new myAlert("Password salah! Mohon ulangi lagi.", "danger");
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Ownerkos> was created with unknown prop '${key}'`);
	});

	function input0_input_handler() {
		uname = this.value;
		$$invalidate(2, uname);
	}

	function input1_input_handler() {
		pass = this.value;
		$$invalidate(3, pass);
	}

	$$self.$capture_state = () => ({
		__awaiter,
		axios: axios$1,
		Dasbor: Dasbor_owner,
		myAlert,
		Login,
		login_state,
		uname,
		pass,
		result,
		LOGIN_API_URL,
		doLogin,
		notif
	});

	$$self.$inject_state = $$props => {
		if ("__awaiter" in $$props) __awaiter = $$props.__awaiter;
		if ("login_state" in $$props) $$invalidate(1, login_state = $$props.login_state);
		if ("uname" in $$props) $$invalidate(2, uname = $$props.uname);
		if ("pass" in $$props) $$invalidate(3, pass = $$props.pass);
		if ("result" in $$props) result = $$props.result;
		if ("LOGIN_API_URL" in $$props) LOGIN_API_URL = $$props.LOGIN_API_URL;
		if ("notif" in $$props) $$invalidate(4, notif = $$props.notif);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		doLogin,
		login_state,
		uname,
		pass,
		notif,
		input0_input_handler,
		input1_input_handler
	];
}

class Ownerkos extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$k, create_fragment$k, safe_not_equal, { doLogin: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Ownerkos",
			options,
			id: create_fragment$k.name
		});
	}

	get doLogin() {
		return this.$$.ctx[0];
	}

	set doLogin(value) {
		throw new Error("<Ownerkos>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src\ownerkos\SignUp.svelte generated by Svelte v3.29.4 */

const { console: console_1$7 } = globals;
const file$k = "src\\ownerkos\\SignUp.svelte";

function create_fragment$l(ctx) {
	let h1;
	let t1;
	let div40;
	let div39;
	let div6;
	let div1;
	let div0;
	let label0;
	let br0;
	let t3;
	let input0;
	let t4;
	let div3;
	let div2;
	let label1;
	let br1;
	let t6;
	let input1;
	let t7;
	let input2;
	let t8;
	let div5;
	let div4;
	let label2;
	let br2;
	let t10;
	let select;
	let option0;
	let option1;
	let option2;
	let t14;
	let div13;
	let div8;
	let div7;
	let label3;
	let br3;
	let t16;
	let input3;
	let t17;
	let div10;
	let div9;
	let label4;
	let br4;
	let t19;
	let textarea0;
	let t20;
	let div12;
	let div11;
	let label5;
	let br5;
	let t22;
	let input4;
	let t23;
	let div19;
	let div15;
	let div14;
	let label6;
	let t25;
	let input5;
	let t26;
	let div17;
	let div16;
	let label7;
	let t28;
	let input6;
	let t29;
	let div18;
	let t30;
	let div26;
	let div21;
	let div20;
	let label8;
	let t32;
	let input7;
	let t33;
	let div23;
	let div22;
	let label9;
	let br6;
	let t35;
	let textarea1;
	let t36;
	let div25;
	let div24;
	let label10;
	let br7;
	let t38;
	let input8;
	let t39;
	let div33;
	let div28;
	let div27;
	let label11;
	let br8;
	let t41;
	let input9;
	let t42;
	let div30;
	let div29;
	let label12;
	let br9;
	let t44;
	let table;
	let tr0;
	let td0;
	let label13;
	let input10;
	let t45;
	let t46;
	let td1;
	let label14;
	let input11;
	let t47;
	let t48;
	let tr1;
	let td2;
	let label15;
	let input12;
	let t49;
	let t50;
	let td3;
	let label16;
	let input13;
	let t51;
	let t52;
	let tr2;
	let td4;
	let label17;
	let input14;
	let t53;
	let t54;
	let td5;
	let label18;
	let input15;
	let t55;
	let t56;
	let tr3;
	let td6;
	let label19;
	let input16;
	let t57;
	let t58;
	let td7;
	let label20;
	let input17;
	let t59;
	let t60;
	let tr4;
	let td8;
	let label21;
	let input18;
	let t61;
	let t62;
	let td9;
	let label22;
	let input19;
	let t63;
	let t64;
	let div32;
	let div31;
	let label23;
	let br10;
	let t66;
	let input20;
	let t67;
	let div37;
	let div34;
	let t68;
	let div36;
	let div35;
	let button;
	let t70;
	let div38;
	let t71;
	let a;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			h1 = element("h1");
			h1.textContent = "FORMULIR PENDAFTARAN";
			t1 = space();
			div40 = element("div");
			div39 = element("div");
			div6 = element("div");
			div1 = element("div");
			div0 = element("div");
			label0 = element("label");
			label0.textContent = "NAMA PEMILIK KOS";
			br0 = element("br");
			t3 = space();
			input0 = element("input");
			t4 = space();
			div3 = element("div");
			div2 = element("div");
			label1 = element("label");
			label1.textContent = "TEMPAT/TANGGAL LAHIR";
			br1 = element("br");
			t6 = space();
			input1 = element("input");
			t7 = space();
			input2 = element("input");
			t8 = space();
			div5 = element("div");
			div4 = element("div");
			label2 = element("label");
			label2.textContent = "JENIS KELAMIN";
			br2 = element("br");
			t10 = space();
			select = element("select");
			option0 = element("option");
			option0.textContent = "Pilih..";
			option1 = element("option");
			option1.textContent = "Laki-laki";
			option2 = element("option");
			option2.textContent = "Perempuan";
			t14 = space();
			div13 = element("div");
			div8 = element("div");
			div7 = element("div");
			label3 = element("label");
			label3.textContent = "EMAIL";
			br3 = element("br");
			t16 = space();
			input3 = element("input");
			t17 = space();
			div10 = element("div");
			div9 = element("div");
			label4 = element("label");
			label4.textContent = "ALAMAT PEMILIK";
			br4 = element("br");
			t19 = space();
			textarea0 = element("textarea");
			t20 = space();
			div12 = element("div");
			div11 = element("div");
			label5 = element("label");
			label5.textContent = "NO TELEPON";
			br5 = element("br");
			t22 = space();
			input4 = element("input");
			t23 = space();
			div19 = element("div");
			div15 = element("div");
			div14 = element("div");
			label6 = element("label");
			label6.textContent = "USERNAME";
			t25 = space();
			input5 = element("input");
			t26 = space();
			div17 = element("div");
			div16 = element("div");
			label7 = element("label");
			label7.textContent = "PASSWORD";
			t28 = space();
			input6 = element("input");
			t29 = space();
			div18 = element("div");
			t30 = space();
			div26 = element("div");
			div21 = element("div");
			div20 = element("div");
			label8 = element("label");
			label8.textContent = "NAMA KOS";
			t32 = space();
			input7 = element("input");
			t33 = space();
			div23 = element("div");
			div22 = element("div");
			label9 = element("label");
			label9.textContent = "ALAMAT KOS";
			br6 = element("br");
			t35 = space();
			textarea1 = element("textarea");
			t36 = space();
			div25 = element("div");
			div24 = element("div");
			label10 = element("label");
			label10.textContent = "LUAS KAMAR (dalam m²)";
			br7 = element("br");
			t38 = space();
			input8 = element("input");
			t39 = space();
			div33 = element("div");
			div28 = element("div");
			div27 = element("div");
			label11 = element("label");
			label11.textContent = "BANYAK KAMAR";
			br8 = element("br");
			t41 = space();
			input9 = element("input");
			t42 = space();
			div30 = element("div");
			div29 = element("div");
			label12 = element("label");
			label12.textContent = "FASILITAS";
			br9 = element("br");
			t44 = space();
			table = element("table");
			tr0 = element("tr");
			td0 = element("td");
			label13 = element("label");
			input10 = element("input");
			t45 = text("\r\n                  Tempat tidur");
			t46 = space();
			td1 = element("td");
			label14 = element("label");
			input11 = element("input");
			t47 = text("\r\n                  Dapur");
			t48 = space();
			tr1 = element("tr");
			td2 = element("td");
			label15 = element("label");
			input12 = element("input");
			t49 = text("\r\n                  Meja");
			t50 = space();
			td3 = element("td");
			label16 = element("label");
			input13 = element("input");
			t51 = text("\r\n                  Wi-Fi");
			t52 = space();
			tr2 = element("tr");
			td4 = element("td");
			label17 = element("label");
			input14 = element("input");
			t53 = text("\r\n                  Almari");
			t54 = space();
			td5 = element("td");
			label18 = element("label");
			input15 = element("input");
			t55 = text("\r\n                  AC");
			t56 = space();
			tr3 = element("tr");
			td6 = element("td");
			label19 = element("label");
			input16 = element("input");
			t57 = text("\r\n                  Kursi & meja belajar");
			t58 = space();
			td7 = element("td");
			label20 = element("label");
			input17 = element("input");
			t59 = text("\r\n                  TV");
			t60 = space();
			tr4 = element("tr");
			td8 = element("td");
			label21 = element("label");
			input18 = element("input");
			t61 = text("\r\n                  Kamar mandi dalam");
			t62 = space();
			td9 = element("td");
			label22 = element("label");
			input19 = element("input");
			t63 = text("\r\n                  Laundry");
			t64 = space();
			div32 = element("div");
			div31 = element("div");
			label23 = element("label");
			label23.textContent = "BIAYA PERBULAN";
			br10 = element("br");
			t66 = space();
			input20 = element("input");
			t67 = space();
			div37 = element("div");
			div34 = element("div");
			t68 = space();
			div36 = element("div");
			div35 = element("div");
			button = element("button");
			button.textContent = "SUBMIT";
			t70 = space();
			div38 = element("div");
			t71 = text("Sudah punya akun?\r\n      ");
			a = element("a");
			a.textContent = "Login disini";
			attr_dev(h1, "class", "h1 text-center svelte-ap78qx");
			attr_dev(h1, "id", "judul");
			add_location(h1, file$k, 75, 0, 1744);
			attr_dev(label0, "for", "txtnamaowner");
			add_location(label0, file$k, 81, 10, 1987);
			add_location(br0, file$k, 81, 60, 2037);
			attr_dev(input0, "type", "text");
			attr_dev(input0, "class", "form-control");
			attr_dev(input0, "id", "txtnamaowner");
			input0.required = true;
			add_location(input0, file$k, 82, 10, 2055);
			attr_dev(div0, "class", "form-group text-center");
			add_location(div0, file$k, 80, 8, 1939);
			attr_dev(div1, "class", "col-4");
			add_location(div1, file$k, 79, 6, 1910);
			attr_dev(label1, "for", "txtTTL");
			add_location(label1, file$k, 92, 10, 2339);
			add_location(br1, file$k, 92, 58, 2387);
			attr_dev(input1, "type", "text");
			attr_dev(input1, "class", "form-control mb-1");
			attr_dev(input1, "id", "txtTTL");
			attr_dev(input1, "placeholder", "Kota Lahir");
			input1.required = true;
			add_location(input1, file$k, 93, 10, 2405);
			attr_dev(input2, "type", "date");
			attr_dev(input2, "class", "form-control");
			attr_dev(input2, "placeholder", "Tanggal Lahir");
			input2.required = true;
			add_location(input2, file$k, 100, 10, 2603);
			attr_dev(div2, "class", "form-group text-center");
			add_location(div2, file$k, 91, 8, 2291);
			attr_dev(div3, "class", "col-4");
			add_location(div3, file$k, 90, 6, 2262);
			attr_dev(label2, "for", "txtJK");
			add_location(label2, file$k, 111, 10, 2880);
			add_location(br2, file$k, 111, 50, 2920);
			option0.__value = "";
			option0.value = option0.__value;
			add_location(option0, file$k, 113, 12, 3019);
			option1.__value = "L";
			option1.value = option1.__value;
			add_location(option1, file$k, 114, 12, 3066);
			option2.__value = "P";
			option2.value = option2.__value;
			add_location(option2, file$k, 115, 12, 3116);
			attr_dev(select, "class", "form-control");
			attr_dev(select, "id", "txtJK");
			if (/*data_owner*/ ctx[3].jk === void 0) add_render_callback(() => /*select_change_handler*/ ctx[9].call(select));
			add_location(select, file$k, 112, 10, 2938);
			attr_dev(div4, "class", "form-group text-center");
			add_location(div4, file$k, 110, 8, 2832);
			attr_dev(div5, "class", "col-4");
			add_location(div5, file$k, 109, 6, 2803);
			attr_dev(div6, "class", "row text-center");
			add_location(div6, file$k, 78, 4, 1873);
			attr_dev(label3, "for", "txtemail");
			add_location(label3, file$k, 123, 10, 3323);
			add_location(br3, file$k, 123, 45, 3358);
			attr_dev(input3, "type", "email");
			attr_dev(input3, "class", "form-control");
			attr_dev(input3, "id", "txtemail");
			input3.required = true;
			add_location(input3, file$k, 124, 10, 3376);
			attr_dev(div7, "class", "form-group text-center");
			add_location(div7, file$k, 122, 8, 3275);
			attr_dev(div8, "class", "col-4");
			add_location(div8, file$k, 121, 6, 3246);
			attr_dev(label4, "for", "txtalamat");
			add_location(label4, file$k, 134, 10, 3652);
			add_location(br4, file$k, 134, 55, 3697);
			attr_dev(textarea0, "class", "form-control");
			attr_dev(textarea0, "cols", "30");
			attr_dev(textarea0, "rows", "5");
			textarea0.required = true;
			add_location(textarea0, file$k, 135, 10, 3715);
			attr_dev(div9, "class", "form-group text-center");
			add_location(div9, file$k, 133, 8, 3604);
			attr_dev(div10, "class", "col-4");
			add_location(div10, file$k, 132, 6, 3575);
			attr_dev(label5, "for", "txttelpon");
			add_location(label5, file$k, 145, 10, 3993);
			add_location(br5, file$k, 145, 51, 4034);
			attr_dev(input4, "type", "text");
			attr_dev(input4, "class", "form-control");
			attr_dev(input4, "id", "txttelpon");
			input4.required = true;
			add_location(input4, file$k, 146, 10, 4052);
			attr_dev(div11, "class", "form-group text-center");
			add_location(div11, file$k, 144, 8, 3945);
			attr_dev(div12, "class", "col-4");
			add_location(div12, file$k, 143, 6, 3916);
			attr_dev(div13, "class", "row");
			add_location(div13, file$k, 120, 4, 3221);
			attr_dev(label6, "for", "");
			add_location(label6, file$k, 158, 10, 4367);
			attr_dev(input5, "type", "text");
			attr_dev(input5, "class", "form-control");
			add_location(input5, file$k, 159, 10, 4409);
			attr_dev(div14, "class", "form-group text-center");
			add_location(div14, file$k, 157, 8, 4319);
			attr_dev(div15, "class", "col-4");
			add_location(div15, file$k, 156, 6, 4290);
			attr_dev(label7, "for", "");
			add_location(label7, file$k, 164, 10, 4598);
			attr_dev(input6, "type", "text");
			attr_dev(input6, "class", "form-control");
			add_location(input6, file$k, 165, 10, 4640);
			attr_dev(div16, "class", "form-group text-center");
			add_location(div16, file$k, 163, 8, 4550);
			attr_dev(div17, "class", "col-4");
			add_location(div17, file$k, 162, 6, 4521);
			attr_dev(div18, "class", "col-4");
			add_location(div18, file$k, 168, 6, 4752);
			attr_dev(div19, "class", "row");
			add_location(div19, file$k, 155, 4, 4265);
			attr_dev(label8, "for", "");
			add_location(label8, file$k, 178, 10, 5055);
			attr_dev(input7, "type", "text");
			attr_dev(input7, "class", "form-control");
			add_location(input7, file$k, 179, 10, 5097);
			attr_dev(div20, "class", "form-group text-center");
			add_location(div20, file$k, 177, 8, 5007);
			attr_dev(div21, "class", "col-4");
			add_location(div21, file$k, 176, 6, 4978);
			attr_dev(label9, "for", "txtalamat");
			add_location(label9, file$k, 184, 10, 5254);
			add_location(br6, file$k, 184, 51, 5295);
			attr_dev(textarea1, "class", "form-control");
			attr_dev(textarea1, "cols", "30");
			attr_dev(textarea1, "rows", "5");
			textarea1.required = true;
			add_location(textarea1, file$k, 185, 10, 5313);
			attr_dev(div22, "class", "form-group text-center");
			add_location(div22, file$k, 183, 8, 5206);
			attr_dev(div23, "class", "col-4");
			add_location(div23, file$k, 182, 6, 5177);
			attr_dev(label10, "for", "txtluaskamar");
			add_location(label10, file$k, 195, 10, 5589);
			add_location(br7, file$k, 195, 69, 5648);
			attr_dev(input8, "type", "text");
			attr_dev(input8, "class", "form-control");
			attr_dev(input8, "id", "txtluaskamar");
			input8.required = true;
			add_location(input8, file$k, 196, 10, 5666);
			attr_dev(div24, "class", "form-group text-center");
			add_location(div24, file$k, 194, 8, 5541);
			attr_dev(div25, "class", "col-4");
			add_location(div25, file$k, 193, 6, 5512);
			attr_dev(div26, "class", "row");
			add_location(div26, file$k, 175, 4, 4953);
			attr_dev(label11, "for", "txtjumlahkamar");
			add_location(label11, file$k, 208, 10, 5988);
			add_location(br8, file$k, 208, 58, 6036);
			attr_dev(input9, "type", "number");
			attr_dev(input9, "class", "form-control");
			attr_dev(input9, "id", "txtjumlahkamar");
			attr_dev(input9, "min", "1");
			input9.required = true;
			add_location(input9, file$k, 209, 10, 6054);
			attr_dev(div27, "class", "form-group text-center");
			add_location(div27, file$k, 207, 8, 5940);
			attr_dev(div28, "class", "col-4");
			add_location(div28, file$k, 206, 6, 5911);
			attr_dev(label12, "for", "txtfasilitas");
			add_location(label12, file$k, 220, 10, 6365);
			add_location(br9, file$k, 220, 53, 6408);
			attr_dev(input10, "type", "checkbox");
			attr_dev(input10, "id", "fas0");
			input10.__value = "Tempat tidur";
			input10.value = input10.__value;
			/*$$binding_groups*/ ctx[19][0].push(input10);
			add_location(input10, file$k, 225, 23, 6611);
			add_location(label13, file$k, 225, 16, 6604);
			add_location(td0, file$k, 224, 14, 6582);
			attr_dev(input11, "type", "checkbox");
			attr_dev(input11, "id", "fas5");
			input11.__value = "dapur";
			input11.value = input11.__value;
			/*$$binding_groups*/ ctx[19][0].push(input11);
			add_location(input11, file$k, 233, 23, 6874);
			add_location(label14, file$k, 233, 16, 6867);
			add_location(td1, file$k, 232, 14, 6845);
			add_location(tr0, file$k, 223, 12, 6562);
			attr_dev(input12, "type", "checkbox");
			attr_dev(input12, "id", "fas1");
			input12.__value = "Meja";
			input12.value = input12.__value;
			/*$$binding_groups*/ ctx[19][0].push(input12);
			add_location(input12, file$k, 243, 23, 7160);
			add_location(label15, file$k, 243, 16, 7153);
			add_location(td2, file$k, 242, 14, 7131);
			attr_dev(input13, "type", "checkbox");
			attr_dev(input13, "id", "fas6");
			input13.__value = "Wi-Fi";
			input13.value = input13.__value;
			/*$$binding_groups*/ ctx[19][0].push(input13);
			add_location(input13, file$k, 251, 23, 7407);
			add_location(label16, file$k, 251, 16, 7400);
			add_location(td3, file$k, 250, 14, 7378);
			add_location(tr1, file$k, 241, 12, 7111);
			attr_dev(input14, "type", "checkbox");
			attr_dev(input14, "id", "fas2");
			input14.__value = "Almari";
			input14.value = input14.__value;
			/*$$binding_groups*/ ctx[19][0].push(input14);
			add_location(input14, file$k, 261, 23, 7693);
			add_location(label17, file$k, 261, 16, 7686);
			add_location(td4, file$k, 260, 14, 7664);
			attr_dev(input15, "type", "checkbox");
			attr_dev(input15, "id", "fas7");
			input15.__value = "AC";
			input15.value = input15.__value;
			/*$$binding_groups*/ ctx[19][0].push(input15);
			add_location(input15, file$k, 269, 23, 7944);
			add_location(label18, file$k, 269, 16, 7937);
			add_location(td5, file$k, 268, 14, 7915);
			add_location(tr2, file$k, 259, 12, 7644);
			attr_dev(input16, "type", "checkbox");
			attr_dev(input16, "id", "fas3");
			input16.__value = "Kursi & meja belajar";
			input16.value = input16.__value;
			/*$$binding_groups*/ ctx[19][0].push(input16);
			add_location(input16, file$k, 279, 23, 8224);
			add_location(label19, file$k, 279, 16, 8217);
			add_location(td6, file$k, 278, 14, 8195);
			attr_dev(input17, "type", "checkbox");
			attr_dev(input17, "id", "fas8");
			input17.__value = "TV";
			input17.value = input17.__value;
			/*$$binding_groups*/ ctx[19][0].push(input17);
			add_location(input17, file$k, 288, 23, 8521);
			add_location(label20, file$k, 288, 16, 8514);
			add_location(td7, file$k, 287, 14, 8492);
			add_location(tr3, file$k, 277, 12, 8175);
			attr_dev(input18, "type", "checkbox");
			attr_dev(input18, "id", "fas4");
			input18.__value = "Kamar mandi dalam";
			input18.value = input18.__value;
			/*$$binding_groups*/ ctx[19][0].push(input18);
			add_location(input18, file$k, 298, 23, 8801);
			add_location(label21, file$k, 298, 16, 8794);
			add_location(td8, file$k, 297, 14, 8772);
			attr_dev(input19, "type", "checkbox");
			attr_dev(input19, "id", "fas9");
			input19.__value = "Laundry";
			input19.value = input19.__value;
			/*$$binding_groups*/ ctx[19][0].push(input19);
			add_location(input19, file$k, 307, 23, 9092);
			add_location(label22, file$k, 307, 16, 9085);
			add_location(td9, file$k, 306, 14, 9063);
			add_location(tr4, file$k, 296, 12, 8752);
			attr_dev(table, "id", "fasilitas-container");
			add_location(table, file$k, 222, 10, 6516);
			attr_dev(div29, "class", "form-group text-center");
			add_location(div29, file$k, 219, 8, 6317);
			attr_dev(div30, "class", "col-4");
			add_location(div30, file$k, 218, 6, 6288);
			attr_dev(label23, "for", "txtbiaya");
			add_location(label23, file$k, 320, 10, 9454);
			add_location(br10, file$k, 320, 54, 9498);
			attr_dev(input20, "type", "text");
			attr_dev(input20, "class", "form-control");
			attr_dev(input20, "id", "txtbiaya");
			input20.required = true;
			add_location(input20, file$k, 321, 10, 9516);
			attr_dev(div31, "class", "form-group text-center");
			add_location(div31, file$k, 319, 8, 9406);
			attr_dev(div32, "class", "col-4");
			add_location(div32, file$k, 318, 6, 9377);
			attr_dev(div33, "class", "row mb-3");
			add_location(div33, file$k, 205, 4, 5881);
			attr_dev(div34, "class", "col-4 align-items-center");
			add_location(div34, file$k, 331, 6, 9754);
			attr_dev(button, "class", "btn btn-success m-2");
			add_location(button, file$k, 344, 10, 10209);
			attr_dev(div35, "class", "text-center mt-4");
			add_location(div35, file$k, 343, 8, 10167);
			attr_dev(div36, "class", "col-4");
			add_location(div36, file$k, 342, 6, 10138);
			attr_dev(div37, "class", "row");
			add_location(div37, file$k, 330, 4, 9729);
			attr_dev(a, "href", "http://localhost:5000/owner/login");
			add_location(a, file$k, 350, 6, 10383);
			attr_dev(div38, "class", "text-right");
			add_location(div38, file$k, 348, 4, 10326);
			attr_dev(div39, "class", "card-body");
			add_location(div39, file$k, 77, 2, 1844);
			attr_dev(div40, "class", "card mb-2 card-bg");
			add_location(div40, file$k, 76, 0, 1809);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, h1, anchor);
			insert_dev(target, t1, anchor);
			insert_dev(target, div40, anchor);
			append_dev(div40, div39);
			append_dev(div39, div6);
			append_dev(div6, div1);
			append_dev(div1, div0);
			append_dev(div0, label0);
			append_dev(div0, br0);
			append_dev(div0, t3);
			append_dev(div0, input0);
			set_input_value(input0, /*data_owner*/ ctx[3].nama_owner);
			append_dev(div6, t4);
			append_dev(div6, div3);
			append_dev(div3, div2);
			append_dev(div2, label1);
			append_dev(div2, br1);
			append_dev(div2, t6);
			append_dev(div2, input1);
			set_input_value(input1, /*T*/ ctx[1]);
			append_dev(div2, t7);
			append_dev(div2, input2);
			set_input_value(input2, /*TL*/ ctx[2]);
			append_dev(div6, t8);
			append_dev(div6, div5);
			append_dev(div5, div4);
			append_dev(div4, label2);
			append_dev(div4, br2);
			append_dev(div4, t10);
			append_dev(div4, select);
			append_dev(select, option0);
			append_dev(select, option1);
			append_dev(select, option2);
			select_option(select, /*data_owner*/ ctx[3].jk);
			append_dev(div39, t14);
			append_dev(div39, div13);
			append_dev(div13, div8);
			append_dev(div8, div7);
			append_dev(div7, label3);
			append_dev(div7, br3);
			append_dev(div7, t16);
			append_dev(div7, input3);
			set_input_value(input3, /*data_owner*/ ctx[3].email);
			append_dev(div13, t17);
			append_dev(div13, div10);
			append_dev(div10, div9);
			append_dev(div9, label4);
			append_dev(div9, br4);
			append_dev(div9, t19);
			append_dev(div9, textarea0);
			set_input_value(textarea0, /*data_owner*/ ctx[3].alamat_owner);
			append_dev(div13, t20);
			append_dev(div13, div12);
			append_dev(div12, div11);
			append_dev(div11, label5);
			append_dev(div11, br5);
			append_dev(div11, t22);
			append_dev(div11, input4);
			set_input_value(input4, /*data_owner*/ ctx[3].no_telpon);
			append_dev(div39, t23);
			append_dev(div39, div19);
			append_dev(div19, div15);
			append_dev(div15, div14);
			append_dev(div14, label6);
			append_dev(div14, t25);
			append_dev(div14, input5);
			set_input_value(input5, /*data_owner*/ ctx[3].username);
			append_dev(div19, t26);
			append_dev(div19, div17);
			append_dev(div17, div16);
			append_dev(div16, label7);
			append_dev(div16, t28);
			append_dev(div16, input6);
			set_input_value(input6, /*data_owner*/ ctx[3].password);
			append_dev(div19, t29);
			append_dev(div19, div18);
			append_dev(div39, t30);
			append_dev(div39, div26);
			append_dev(div26, div21);
			append_dev(div21, div20);
			append_dev(div20, label8);
			append_dev(div20, t32);
			append_dev(div20, input7);
			append_dev(div26, t33);
			append_dev(div26, div23);
			append_dev(div23, div22);
			append_dev(div22, label9);
			append_dev(div22, br6);
			append_dev(div22, t35);
			append_dev(div22, textarea1);
			set_input_value(textarea1, /*data_kosan*/ ctx[4].alamat_kos);
			append_dev(div26, t36);
			append_dev(div26, div25);
			append_dev(div25, div24);
			append_dev(div24, label10);
			append_dev(div24, br7);
			append_dev(div24, t38);
			append_dev(div24, input8);
			set_input_value(input8, /*data_kosan*/ ctx[4].luas_kos);
			append_dev(div39, t39);
			append_dev(div39, div33);
			append_dev(div33, div28);
			append_dev(div28, div27);
			append_dev(div27, label11);
			append_dev(div27, br8);
			append_dev(div27, t41);
			append_dev(div27, input9);
			set_input_value(input9, /*data_kosan*/ ctx[4].jumlah_kamar);
			append_dev(div33, t42);
			append_dev(div33, div30);
			append_dev(div30, div29);
			append_dev(div29, label12);
			append_dev(div29, br9);
			append_dev(div29, t44);
			append_dev(div29, table);
			append_dev(table, tr0);
			append_dev(tr0, td0);
			append_dev(td0, label13);
			append_dev(label13, input10);
			input10.checked = ~/*fas*/ ctx[0].indexOf(input10.__value);
			append_dev(label13, t45);
			append_dev(tr0, t46);
			append_dev(tr0, td1);
			append_dev(td1, label14);
			append_dev(label14, input11);
			input11.checked = ~/*fas*/ ctx[0].indexOf(input11.__value);
			append_dev(label14, t47);
			append_dev(table, t48);
			append_dev(table, tr1);
			append_dev(tr1, td2);
			append_dev(td2, label15);
			append_dev(label15, input12);
			input12.checked = ~/*fas*/ ctx[0].indexOf(input12.__value);
			append_dev(label15, t49);
			append_dev(tr1, t50);
			append_dev(tr1, td3);
			append_dev(td3, label16);
			append_dev(label16, input13);
			input13.checked = ~/*fas*/ ctx[0].indexOf(input13.__value);
			append_dev(label16, t51);
			append_dev(table, t52);
			append_dev(table, tr2);
			append_dev(tr2, td4);
			append_dev(td4, label17);
			append_dev(label17, input14);
			input14.checked = ~/*fas*/ ctx[0].indexOf(input14.__value);
			append_dev(label17, t53);
			append_dev(tr2, t54);
			append_dev(tr2, td5);
			append_dev(td5, label18);
			append_dev(label18, input15);
			input15.checked = ~/*fas*/ ctx[0].indexOf(input15.__value);
			append_dev(label18, t55);
			append_dev(table, t56);
			append_dev(table, tr3);
			append_dev(tr3, td6);
			append_dev(td6, label19);
			append_dev(label19, input16);
			input16.checked = ~/*fas*/ ctx[0].indexOf(input16.__value);
			append_dev(label19, t57);
			append_dev(tr3, t58);
			append_dev(tr3, td7);
			append_dev(td7, label20);
			append_dev(label20, input17);
			input17.checked = ~/*fas*/ ctx[0].indexOf(input17.__value);
			append_dev(label20, t59);
			append_dev(table, t60);
			append_dev(table, tr4);
			append_dev(tr4, td8);
			append_dev(td8, label21);
			append_dev(label21, input18);
			input18.checked = ~/*fas*/ ctx[0].indexOf(input18.__value);
			append_dev(label21, t61);
			append_dev(tr4, t62);
			append_dev(tr4, td9);
			append_dev(td9, label22);
			append_dev(label22, input19);
			input19.checked = ~/*fas*/ ctx[0].indexOf(input19.__value);
			append_dev(label22, t63);
			append_dev(div33, t64);
			append_dev(div33, div32);
			append_dev(div32, div31);
			append_dev(div31, label23);
			append_dev(div31, br10);
			append_dev(div31, t66);
			append_dev(div31, input20);
			set_input_value(input20, /*data_kosan*/ ctx[4].harga_sewa);
			append_dev(div39, t67);
			append_dev(div39, div37);
			append_dev(div37, div34);
			append_dev(div37, t68);
			append_dev(div37, div36);
			append_dev(div36, div35);
			append_dev(div35, button);
			append_dev(div39, t70);
			append_dev(div39, div38);
			append_dev(div38, t71);
			append_dev(div38, a);

			if (!mounted) {
				dispose = [
					listen_dev(input0, "input", /*input0_input_handler*/ ctx[6]),
					listen_dev(input1, "input", /*input1_input_handler*/ ctx[7]),
					listen_dev(input2, "input", /*input2_input_handler*/ ctx[8]),
					listen_dev(select, "change", /*select_change_handler*/ ctx[9]),
					listen_dev(input3, "input", /*input3_input_handler*/ ctx[10]),
					listen_dev(textarea0, "input", /*textarea0_input_handler*/ ctx[11]),
					listen_dev(input4, "input", /*input4_input_handler*/ ctx[12]),
					listen_dev(input5, "input", /*input5_input_handler*/ ctx[13]),
					listen_dev(input6, "input", /*input6_input_handler*/ ctx[14]),
					listen_dev(textarea1, "input", /*textarea1_input_handler*/ ctx[15]),
					listen_dev(input8, "input", /*input8_input_handler*/ ctx[16]),
					listen_dev(input9, "input", /*input9_input_handler*/ ctx[17]),
					listen_dev(input10, "change", /*input10_change_handler*/ ctx[18]),
					listen_dev(input11, "change", /*input11_change_handler*/ ctx[20]),
					listen_dev(input12, "change", /*input12_change_handler*/ ctx[21]),
					listen_dev(input13, "change", /*input13_change_handler*/ ctx[22]),
					listen_dev(input14, "change", /*input14_change_handler*/ ctx[23]),
					listen_dev(input15, "change", /*input15_change_handler*/ ctx[24]),
					listen_dev(input16, "change", /*input16_change_handler*/ ctx[25]),
					listen_dev(input17, "change", /*input17_change_handler*/ ctx[26]),
					listen_dev(input18, "change", /*input18_change_handler*/ ctx[27]),
					listen_dev(input19, "change", /*input19_change_handler*/ ctx[28]),
					listen_dev(input20, "input", /*input20_input_handler*/ ctx[29]),
					listen_dev(button, "click", /*daftar*/ ctx[5], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*data_owner*/ 8 && input0.value !== /*data_owner*/ ctx[3].nama_owner) {
				set_input_value(input0, /*data_owner*/ ctx[3].nama_owner);
			}

			if (dirty & /*T*/ 2 && input1.value !== /*T*/ ctx[1]) {
				set_input_value(input1, /*T*/ ctx[1]);
			}

			if (dirty & /*TL*/ 4) {
				set_input_value(input2, /*TL*/ ctx[2]);
			}

			if (dirty & /*data_owner*/ 8) {
				select_option(select, /*data_owner*/ ctx[3].jk);
			}

			if (dirty & /*data_owner*/ 8 && input3.value !== /*data_owner*/ ctx[3].email) {
				set_input_value(input3, /*data_owner*/ ctx[3].email);
			}

			if (dirty & /*data_owner*/ 8) {
				set_input_value(textarea0, /*data_owner*/ ctx[3].alamat_owner);
			}

			if (dirty & /*data_owner*/ 8 && input4.value !== /*data_owner*/ ctx[3].no_telpon) {
				set_input_value(input4, /*data_owner*/ ctx[3].no_telpon);
			}

			if (dirty & /*data_owner*/ 8 && input5.value !== /*data_owner*/ ctx[3].username) {
				set_input_value(input5, /*data_owner*/ ctx[3].username);
			}

			if (dirty & /*data_owner*/ 8 && input6.value !== /*data_owner*/ ctx[3].password) {
				set_input_value(input6, /*data_owner*/ ctx[3].password);
			}

			if (dirty & /*data_kosan*/ 16) {
				set_input_value(textarea1, /*data_kosan*/ ctx[4].alamat_kos);
			}

			if (dirty & /*data_kosan*/ 16 && input8.value !== /*data_kosan*/ ctx[4].luas_kos) {
				set_input_value(input8, /*data_kosan*/ ctx[4].luas_kos);
			}

			if (dirty & /*data_kosan*/ 16 && to_number(input9.value) !== /*data_kosan*/ ctx[4].jumlah_kamar) {
				set_input_value(input9, /*data_kosan*/ ctx[4].jumlah_kamar);
			}

			if (dirty & /*fas*/ 1) {
				input10.checked = ~/*fas*/ ctx[0].indexOf(input10.__value);
			}

			if (dirty & /*fas*/ 1) {
				input11.checked = ~/*fas*/ ctx[0].indexOf(input11.__value);
			}

			if (dirty & /*fas*/ 1) {
				input12.checked = ~/*fas*/ ctx[0].indexOf(input12.__value);
			}

			if (dirty & /*fas*/ 1) {
				input13.checked = ~/*fas*/ ctx[0].indexOf(input13.__value);
			}

			if (dirty & /*fas*/ 1) {
				input14.checked = ~/*fas*/ ctx[0].indexOf(input14.__value);
			}

			if (dirty & /*fas*/ 1) {
				input15.checked = ~/*fas*/ ctx[0].indexOf(input15.__value);
			}

			if (dirty & /*fas*/ 1) {
				input16.checked = ~/*fas*/ ctx[0].indexOf(input16.__value);
			}

			if (dirty & /*fas*/ 1) {
				input17.checked = ~/*fas*/ ctx[0].indexOf(input17.__value);
			}

			if (dirty & /*fas*/ 1) {
				input18.checked = ~/*fas*/ ctx[0].indexOf(input18.__value);
			}

			if (dirty & /*fas*/ 1) {
				input19.checked = ~/*fas*/ ctx[0].indexOf(input19.__value);
			}

			if (dirty & /*data_kosan*/ 16 && input20.value !== /*data_kosan*/ ctx[4].harga_sewa) {
				set_input_value(input20, /*data_kosan*/ ctx[4].harga_sewa);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(h1);
			if (detaching) detach_dev(t1);
			if (detaching) detach_dev(div40);
			/*$$binding_groups*/ ctx[19][0].splice(/*$$binding_groups*/ ctx[19][0].indexOf(input10), 1);
			/*$$binding_groups*/ ctx[19][0].splice(/*$$binding_groups*/ ctx[19][0].indexOf(input11), 1);
			/*$$binding_groups*/ ctx[19][0].splice(/*$$binding_groups*/ ctx[19][0].indexOf(input12), 1);
			/*$$binding_groups*/ ctx[19][0].splice(/*$$binding_groups*/ ctx[19][0].indexOf(input13), 1);
			/*$$binding_groups*/ ctx[19][0].splice(/*$$binding_groups*/ ctx[19][0].indexOf(input14), 1);
			/*$$binding_groups*/ ctx[19][0].splice(/*$$binding_groups*/ ctx[19][0].indexOf(input15), 1);
			/*$$binding_groups*/ ctx[19][0].splice(/*$$binding_groups*/ ctx[19][0].indexOf(input16), 1);
			/*$$binding_groups*/ ctx[19][0].splice(/*$$binding_groups*/ ctx[19][0].indexOf(input17), 1);
			/*$$binding_groups*/ ctx[19][0].splice(/*$$binding_groups*/ ctx[19][0].indexOf(input18), 1);
			/*$$binding_groups*/ ctx[19][0].splice(/*$$binding_groups*/ ctx[19][0].indexOf(input19), 1);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$l.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$l($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("SignUp", slots, []);
	let fas = [];
	let T = "";
	let TL = "";

	let data_owner = {
		nama_owner: "",
		alamat_owner: "",
		TTL: "",
		jk: "",
		no_telpon: "",
		email: "",
		username: "",
		password: ""
	};

	let data_kosan = {
		id_pemilik: 0,
		nama_kos: "",
		alamat_kos: "",
		luas_kos: "",
		jarak_kos: "",
		jumlah_kamar: 0,
		fasilitas: [],
		harga_sewa: "",
		status_kosan: "after register",
		img: ""
	};

	class PemilikKos extends Owner {
		signup() {
			try {
				axios$1({
					method: "post",
					url: "http://localhost:3002/owners/signup",
					data: {
						nama: data_owner.nama_owner,
						alamat: data_owner.alamat_owner,
						ttl: T + ", " + TL,
						jk: data_owner.jk,
						no_telpon: data_owner.no_telpon,
						email: data_owner.email,
						username: data_owner.username,
						password: data_owner.password,
						createdAt: Date(),
						updatedAt: Date()
					}
				});

				alert("Berhasil signup!");
				window.open("http://localhost:5000/owner/login", "_self");
			} catch(error) {
				alert(error);
			}
		}
	}

	function daftar() {
		let Pemilik = new PemilikKos();

		try {
			Pemilik.signup();
		} catch(error) {
			console.log(error);
		}
	}

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$7.warn(`<SignUp> was created with unknown prop '${key}'`);
	});

	const $$binding_groups = [[]];

	function input0_input_handler() {
		data_owner.nama_owner = this.value;
		$$invalidate(3, data_owner);
	}

	function input1_input_handler() {
		T = this.value;
		$$invalidate(1, T);
	}

	function input2_input_handler() {
		TL = this.value;
		$$invalidate(2, TL);
	}

	function select_change_handler() {
		data_owner.jk = select_value(this);
		$$invalidate(3, data_owner);
	}

	function input3_input_handler() {
		data_owner.email = this.value;
		$$invalidate(3, data_owner);
	}

	function textarea0_input_handler() {
		data_owner.alamat_owner = this.value;
		$$invalidate(3, data_owner);
	}

	function input4_input_handler() {
		data_owner.no_telpon = this.value;
		$$invalidate(3, data_owner);
	}

	function input5_input_handler() {
		data_owner.username = this.value;
		$$invalidate(3, data_owner);
	}

	function input6_input_handler() {
		data_owner.password = this.value;
		$$invalidate(3, data_owner);
	}

	function textarea1_input_handler() {
		data_kosan.alamat_kos = this.value;
		$$invalidate(4, data_kosan);
	}

	function input8_input_handler() {
		data_kosan.luas_kos = this.value;
		$$invalidate(4, data_kosan);
	}

	function input9_input_handler() {
		data_kosan.jumlah_kamar = to_number(this.value);
		$$invalidate(4, data_kosan);
	}

	function input10_change_handler() {
		fas = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
		$$invalidate(0, fas);
	}

	function input11_change_handler() {
		fas = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
		$$invalidate(0, fas);
	}

	function input12_change_handler() {
		fas = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
		$$invalidate(0, fas);
	}

	function input13_change_handler() {
		fas = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
		$$invalidate(0, fas);
	}

	function input14_change_handler() {
		fas = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
		$$invalidate(0, fas);
	}

	function input15_change_handler() {
		fas = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
		$$invalidate(0, fas);
	}

	function input16_change_handler() {
		fas = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
		$$invalidate(0, fas);
	}

	function input17_change_handler() {
		fas = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
		$$invalidate(0, fas);
	}

	function input18_change_handler() {
		fas = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
		$$invalidate(0, fas);
	}

	function input19_change_handler() {
		fas = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
		$$invalidate(0, fas);
	}

	function input20_input_handler() {
		data_kosan.harga_sewa = this.value;
		$$invalidate(4, data_kosan);
	}

	$$self.$capture_state = () => ({
		axios: axios$1,
		Pengguna,
		Owner,
		fas,
		T,
		TL,
		data_owner,
		data_kosan,
		PemilikKos,
		daftar
	});

	$$self.$inject_state = $$props => {
		if ("fas" in $$props) $$invalidate(0, fas = $$props.fas);
		if ("T" in $$props) $$invalidate(1, T = $$props.T);
		if ("TL" in $$props) $$invalidate(2, TL = $$props.TL);
		if ("data_owner" in $$props) $$invalidate(3, data_owner = $$props.data_owner);
		if ("data_kosan" in $$props) $$invalidate(4, data_kosan = $$props.data_kosan);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		fas,
		T,
		TL,
		data_owner,
		data_kosan,
		daftar,
		input0_input_handler,
		input1_input_handler,
		input2_input_handler,
		select_change_handler,
		input3_input_handler,
		textarea0_input_handler,
		input4_input_handler,
		input5_input_handler,
		input6_input_handler,
		textarea1_input_handler,
		input8_input_handler,
		input9_input_handler,
		input10_change_handler,
		$$binding_groups,
		input11_change_handler,
		input12_change_handler,
		input13_change_handler,
		input14_change_handler,
		input15_change_handler,
		input16_change_handler,
		input17_change_handler,
		input18_change_handler,
		input19_change_handler,
		input20_input_handler
	];
}

class SignUp extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$l, create_fragment$l, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "SignUp",
			options,
			id: create_fragment$l.name
		});
	}
}

/* src\user\SignUp.svelte generated by Svelte v3.29.4 */

const { console: console_1$8 } = globals;
const file$l = "src\\user\\SignUp.svelte";

function create_fragment$m(ctx) {
	let div15;
	let div14;
	let div13;
	let h3;
	let t1;
	let div2;
	let div0;
	let label0;
	let t3;
	let input0;
	let t4;
	let div1;
	let label1;
	let t6;
	let input1;
	let t7;
	let div5;
	let div3;
	let label2;
	let t9;
	let input2;
	let t10;
	let div4;
	let label3;
	let t12;
	let input3;
	let t13;
	let div8;
	let div6;
	let label4;
	let t15;
	let input4;
	let t16;
	let div7;
	let label5;
	let t18;
	let input5;
	let t19;
	let div11;
	let div9;
	let label6;
	let t21;
	let input6;
	let t22;
	let div10;
	let label7;
	let t24;
	let input7;
	let t25;
	let p0;
	let t27;
	let div12;
	let button;
	let t29;
	let p1;
	let t30;
	let a;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div15 = element("div");
			div14 = element("div");
			div13 = element("div");
			h3 = element("h3");
			h3.textContent = "User Signup";
			t1 = space();
			div2 = element("div");
			div0 = element("div");
			label0 = element("label");
			label0.textContent = "Nama";
			t3 = space();
			input0 = element("input");
			t4 = space();
			div1 = element("div");
			label1 = element("label");
			label1.textContent = "Email";
			t6 = space();
			input1 = element("input");
			t7 = space();
			div5 = element("div");
			div3 = element("div");
			label2 = element("label");
			label2.textContent = "TTL";
			t9 = space();
			input2 = element("input");
			t10 = space();
			div4 = element("div");
			label3 = element("label");
			label3.textContent = "No. Telpon";
			t12 = space();
			input3 = element("input");
			t13 = space();
			div8 = element("div");
			div6 = element("div");
			label4 = element("label");
			label4.textContent = "Alamat";
			t15 = space();
			input4 = element("input");
			t16 = space();
			div7 = element("div");
			label5 = element("label");
			label5.textContent = "Username";
			t18 = space();
			input5 = element("input");
			t19 = space();
			div11 = element("div");
			div9 = element("div");
			label6 = element("label");
			label6.textContent = "Jenis Kelamin";
			t21 = space();
			input6 = element("input");
			t22 = space();
			div10 = element("div");
			label7 = element("label");
			label7.textContent = "Password";
			t24 = space();
			input7 = element("input");
			t25 = space();
			p0 = element("p");
			p0.textContent = `${/*pass*/ ctx[1]}`;
			t27 = space();
			div12 = element("div");
			button = element("button");
			button.textContent = "Signup";
			t29 = space();
			p1 = element("p");
			t30 = text("Sudah punya akun?\r\n          ");
			a = element("a");
			a.textContent = "Login disini";
			attr_dev(h3, "class", "card-title text-center mb-4");
			add_location(h3, file$l, 108, 6, 3945);
			attr_dev(label0, "for", "");
			attr_dev(label0, "class", "forn-label");
			add_location(label0, file$l, 111, 10, 4077);
			attr_dev(input0, "type", "text");
			attr_dev(input0, "class", "form-control");
			attr_dev(input0, "id", "txtnama");
			add_location(input0, file$l, 112, 10, 4134);
			attr_dev(div0, "class", "col-6");
			add_location(div0, file$l, 110, 8, 4046);
			attr_dev(label1, "for", "");
			attr_dev(label1, "class", "form-label");
			add_location(label1, file$l, 115, 10, 4273);
			attr_dev(input1, "type", "email");
			attr_dev(input1, "class", "form-control");
			attr_dev(input1, "id", "txtemail");
			add_location(input1, file$l, 116, 10, 4331);
			attr_dev(div1, "class", "col-6");
			add_location(div1, file$l, 114, 8, 4242);
			attr_dev(div2, "class", "row text-left");
			add_location(div2, file$l, 109, 6, 4009);
			attr_dev(label2, "for", "");
			attr_dev(label2, "class", "forn-label");
			add_location(label2, file$l, 121, 10, 4522);
			attr_dev(input2, "type", "text");
			attr_dev(input2, "class", "form-control");
			attr_dev(input2, "id", "txtTTL");
			add_location(input2, file$l, 122, 10, 4578);
			attr_dev(div3, "class", "col-6");
			add_location(div3, file$l, 120, 8, 4491);
			attr_dev(label3, "for", "");
			attr_dev(label3, "class", "form-label");
			add_location(label3, file$l, 125, 10, 4720);
			attr_dev(input3, "type", "text");
			attr_dev(input3, "class", "form-control");
			attr_dev(input3, "id", "txtnotelp");
			add_location(input3, file$l, 126, 10, 4783);
			attr_dev(div4, "class", "col-6");
			add_location(div4, file$l, 124, 8, 4689);
			attr_dev(div5, "class", "row text-left");
			add_location(div5, file$l, 119, 6, 4454);
			attr_dev(label4, "for", "");
			attr_dev(label4, "class", "forn-label");
			add_location(label4, file$l, 131, 10, 4975);
			attr_dev(input4, "type", "text");
			attr_dev(input4, "class", "form-control");
			attr_dev(input4, "id", "txtalamat");
			add_location(input4, file$l, 132, 10, 5034);
			attr_dev(div6, "class", "col-6");
			add_location(div6, file$l, 130, 8, 4944);
			attr_dev(label5, "for", "");
			attr_dev(label5, "class", "form-label");
			add_location(label5, file$l, 135, 10, 5177);
			attr_dev(input5, "type", "text");
			attr_dev(input5, "class", "form-control");
			attr_dev(input5, "id", "txtusername");
			add_location(input5, file$l, 136, 10, 5238);
			attr_dev(div7, "class", "col-6");
			add_location(div7, file$l, 134, 8, 5146);
			attr_dev(div8, "class", "row text-left");
			add_location(div8, file$l, 129, 6, 4907);
			attr_dev(label6, "for", "");
			attr_dev(label6, "class", "forn-label");
			add_location(label6, file$l, 141, 10, 5439);
			attr_dev(input6, "type", "text");
			attr_dev(input6, "class", "form-control");
			attr_dev(input6, "id", "txtJK");
			add_location(input6, file$l, 142, 10, 5505);
			attr_dev(div9, "class", "col-6");
			add_location(div9, file$l, 140, 8, 5408);
			attr_dev(label7, "for", "");
			attr_dev(label7, "class", "form-label");
			add_location(label7, file$l, 145, 10, 5613);
			attr_dev(input7, "type", "password");
			attr_dev(input7, "class", "form-control");
			attr_dev(input7, "id", "txtpassword");
			add_location(input7, file$l, 146, 10, 5674);
			add_location(p0, file$l, 147, 8, 5778);
			attr_dev(div10, "class", "col-6");
			add_location(div10, file$l, 144, 8, 5582);
			attr_dev(div11, "class", "row text-left mb-3");
			add_location(div11, file$l, 139, 6, 5366);
			attr_dev(button, "type", "button");
			attr_dev(button, "class", "btn btn-success mb-1");
			add_location(button, file$l, 151, 8, 5857);
			attr_dev(a, "href", "http://localhost:5000/user/login");
			add_location(a, file$l, 157, 10, 6028);
			add_location(p1, file$l, 155, 8, 5984);
			attr_dev(div12, "class", "mb-3");
			add_location(div12, file$l, 150, 6, 5829);
			attr_dev(div13, "class", "card-body");
			add_location(div13, file$l, 107, 4, 3914);
			attr_dev(div14, "class", "card shadow card-bg mb-2");
			set_style(div14, "width", "45rem");
			set_style(div14, "margin-top", "70px");
			add_location(div14, file$l, 106, 2, 3831);
			attr_dev(div15, "class", "d-flex justify-content-center mt-4");
			add_location(div15, file$l, 105, 0, 3779);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div15, anchor);
			append_dev(div15, div14);
			append_dev(div14, div13);
			append_dev(div13, h3);
			append_dev(div13, t1);
			append_dev(div13, div2);
			append_dev(div2, div0);
			append_dev(div0, label0);
			append_dev(div0, t3);
			append_dev(div0, input0);
			set_input_value(input0, /*signup_obj*/ ctx[0].nama);
			append_dev(div2, t4);
			append_dev(div2, div1);
			append_dev(div1, label1);
			append_dev(div1, t6);
			append_dev(div1, input1);
			set_input_value(input1, /*signup_obj*/ ctx[0].email);
			append_dev(div13, t7);
			append_dev(div13, div5);
			append_dev(div5, div3);
			append_dev(div3, label2);
			append_dev(div3, t9);
			append_dev(div3, input2);
			set_input_value(input2, /*signup_obj*/ ctx[0].tgllahir);
			append_dev(div5, t10);
			append_dev(div5, div4);
			append_dev(div4, label3);
			append_dev(div4, t12);
			append_dev(div4, input3);
			set_input_value(input3, /*signup_obj*/ ctx[0].telpon);
			append_dev(div13, t13);
			append_dev(div13, div8);
			append_dev(div8, div6);
			append_dev(div6, label4);
			append_dev(div6, t15);
			append_dev(div6, input4);
			set_input_value(input4, /*signup_obj*/ ctx[0].alamat);
			append_dev(div8, t16);
			append_dev(div8, div7);
			append_dev(div7, label5);
			append_dev(div7, t18);
			append_dev(div7, input5);
			set_input_value(input5, /*signup_obj*/ ctx[0].username);
			append_dev(div13, t19);
			append_dev(div13, div11);
			append_dev(div11, div9);
			append_dev(div9, label6);
			append_dev(div9, t21);
			append_dev(div9, input6);
			append_dev(div11, t22);
			append_dev(div11, div10);
			append_dev(div10, label7);
			append_dev(div10, t24);
			append_dev(div10, input7);
			set_input_value(input7, /*signup_obj*/ ctx[0].password);
			append_dev(div10, t25);
			append_dev(div10, p0);
			append_dev(div13, t27);
			append_dev(div13, div12);
			append_dev(div12, button);
			append_dev(div12, t29);
			append_dev(div12, p1);
			append_dev(p1, t30);
			append_dev(p1, a);

			if (!mounted) {
				dispose = [
					listen_dev(input0, "input", /*input0_input_handler*/ ctx[3]),
					listen_dev(input1, "input", /*input1_input_handler*/ ctx[4]),
					listen_dev(input2, "input", /*input2_input_handler*/ ctx[5]),
					listen_dev(input3, "input", /*input3_input_handler*/ ctx[6]),
					listen_dev(input4, "input", /*input4_input_handler*/ ctx[7]),
					listen_dev(input5, "input", /*input5_input_handler*/ ctx[8]),
					listen_dev(input7, "input", /*input7_input_handler*/ ctx[9]),
					listen_dev(button, "click", /*signup*/ ctx[2], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*signup_obj*/ 1 && input0.value !== /*signup_obj*/ ctx[0].nama) {
				set_input_value(input0, /*signup_obj*/ ctx[0].nama);
			}

			if (dirty & /*signup_obj*/ 1 && input1.value !== /*signup_obj*/ ctx[0].email) {
				set_input_value(input1, /*signup_obj*/ ctx[0].email);
			}

			if (dirty & /*signup_obj*/ 1 && input2.value !== /*signup_obj*/ ctx[0].tgllahir) {
				set_input_value(input2, /*signup_obj*/ ctx[0].tgllahir);
			}

			if (dirty & /*signup_obj*/ 1 && input3.value !== /*signup_obj*/ ctx[0].telpon) {
				set_input_value(input3, /*signup_obj*/ ctx[0].telpon);
			}

			if (dirty & /*signup_obj*/ 1 && input4.value !== /*signup_obj*/ ctx[0].alamat) {
				set_input_value(input4, /*signup_obj*/ ctx[0].alamat);
			}

			if (dirty & /*signup_obj*/ 1 && input5.value !== /*signup_obj*/ ctx[0].username) {
				set_input_value(input5, /*signup_obj*/ ctx[0].username);
			}

			if (dirty & /*signup_obj*/ 1 && input7.value !== /*signup_obj*/ ctx[0].password) {
				set_input_value(input7, /*signup_obj*/ ctx[0].password);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div15);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$m.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$m($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("SignUp", slots, []);

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

	class CustomToast extends myToast {
		// Konstruktor
		constructor(judul = "", teks = "", tipe = "") {
			super(judul, teks, tipe);

			// properti
			this.toast = sweetalert2_all.mixin({
				toast: true,
				position: "top-end",
				showConfirmButton: false,
				timer: 3000,
				timerProgressBar: true,
				didOpen: toast => {
					toast.addEventListener("mouseenter", sweetalert2_all.stopTimer);
					toast.addEventListener("mouseleave", sweetalert2_all.resumeTimer);
				}
			});
		}

		// method show toast
		show() {
			this.toast.fire({
				icon: this.tipe != "success" ? "error" : "success",
				title: this.judul
			});
		}
	}

	// instansiasi objek toast
	let toast_success = new CustomToast("Berhasil signup!!", "", "success");

	let toast_failed = new CustomToast("Gagal signup :(", "", "error");

	// deklarasi objek signup
	let signup_obj = {
		nama: "",
		alamat: "",
		telpon: "",
		email: "",
		username: "",
		password: "",
		tgllahir: ""
	};

	let pass;

	function signup() {
		return __awaiter(this, void 0, void 0, function* () {
			try {
				let txtpass = "";

				// txtpass = encryptPW(signup_obj.password);
				const response = yield axios$1.post("http://localhost:3002/users/signup", {
					nama: signup_obj.nama,
					alamat: signup_obj.alamat,
					telpon: signup_obj.telpon,
					email: signup_obj.email,
					username: signup_obj.username,
					password: signup_obj.password,
					tgllahir: signup_obj.tgllahir
				});

				let res = response.data;
				console.log(res);

				if (res.message == "Berhasil menambahkan user baru :)") {
					toast_success.show();

					setTimeout(
						function () {
							window.open("http://localhost:5000/user/login", "_self");
						},
						4000
					);
				}
			} catch(error) {
				toast_failed.judul = error;
				toast_failed.show();
			}
		});
	}

	function sha256(plain) {
		return __awaiter(this, void 0, void 0, function* () {
			// encode as UTF-8
			const plainBuffer = new TextEncoder().encode(plain);

			// hash plaintext
			const hashBuffer = yield crypto.subtle.digest("SHA-256", plainBuffer);

			// convert ArrayBuffer to Array
			const hashArray = Array.from(new Uint8Array(hashBuffer));

			// convert bytes to hex string
			const hashHex = hashArray.map(b => ("00" + b.toString(16)).slice(-2)).join("");

			return hashHex;
		});
	}

	function encryptPW(plaintext) {
		try {
			let pass = "";
			sha256(plaintext).then(hash => pass = hash);
			return pass;
		} catch(error) {
			console.log(error);
		}
	}

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$8.warn(`<SignUp> was created with unknown prop '${key}'`);
	});

	function input0_input_handler() {
		signup_obj.nama = this.value;
		$$invalidate(0, signup_obj);
	}

	function input1_input_handler() {
		signup_obj.email = this.value;
		$$invalidate(0, signup_obj);
	}

	function input2_input_handler() {
		signup_obj.tgllahir = this.value;
		$$invalidate(0, signup_obj);
	}

	function input3_input_handler() {
		signup_obj.telpon = this.value;
		$$invalidate(0, signup_obj);
	}

	function input4_input_handler() {
		signup_obj.alamat = this.value;
		$$invalidate(0, signup_obj);
	}

	function input5_input_handler() {
		signup_obj.username = this.value;
		$$invalidate(0, signup_obj);
	}

	function input7_input_handler() {
		signup_obj.password = this.value;
		$$invalidate(0, signup_obj);
	}

	$$self.$capture_state = () => ({
		__awaiter,
		axios: axios$1,
		Swal: sweetalert2_all,
		myToast,
		CustomToast,
		toast_success,
		toast_failed,
		signup_obj,
		pass,
		signup,
		sha256,
		encryptPW
	});

	$$self.$inject_state = $$props => {
		if ("__awaiter" in $$props) __awaiter = $$props.__awaiter;
		if ("toast_success" in $$props) toast_success = $$props.toast_success;
		if ("toast_failed" in $$props) toast_failed = $$props.toast_failed;
		if ("signup_obj" in $$props) $$invalidate(0, signup_obj = $$props.signup_obj);
		if ("pass" in $$props) $$invalidate(1, pass = $$props.pass);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		signup_obj,
		pass,
		signup,
		input0_input_handler,
		input1_input_handler,
		input2_input_handler,
		input3_input_handler,
		input4_input_handler,
		input5_input_handler,
		input7_input_handler
	];
}

class SignUp$1 extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$m, create_fragment$m, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "SignUp",
			options,
			id: create_fragment$m.name
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

/* src\routes\Cari.svelte generated by Svelte v3.29.4 */
const file$m = "src\\routes\\Cari.svelte";

function create_fragment$n(ctx) {
	let br0;
	let br1;
	let br2;
	let t0;
	let div0;
	let img;
	let img_src_value;
	let t1;
	let div1;
	let p_1;
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
	let table0;
	let tr0;
	let td0;
	let t10;
	let td1;
	let input1;
	let t11;
	let tr1;
	let td2;
	let t13;
	let td3;
	let input2;
	let t14;
	let tr2;
	let td4;
	let t16;
	let td5;
	let input3;
	let t17;
	let div9;
	let div8;
	let label2;
	let t19;
	let table1;
	let tr3;
	let td6;
	let label3;
	let input4;
	let t20;
	let t21;
	let td7;
	let label4;
	let input5;
	let t22;
	let t23;
	let tr4;
	let td8;
	let label5;
	let input6;
	let t24;
	let t25;
	let td9;
	let label6;
	let input7;
	let t26;
	let t27;
	let tr5;
	let td10;
	let label7;
	let input8;
	let t28;
	let t29;
	let td11;
	let label8;
	let input9;
	let t30;
	let t31;
	let tr6;
	let td12;
	let label9;
	let input10;
	let t32;
	let t33;
	let td13;
	let label10;
	let input11;
	let t34;
	let t35;
	let tr7;
	let td14;
	let label11;
	let input12;
	let t36;
	let t37;
	let td15;
	let label12;
	let input13;
	let t38;
	let t39;
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
			p_1 = element("p");
			p_1.textContent = "Kami di sini siap membantu";
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
			table0 = element("table");
			tr0 = element("tr");
			td0 = element("td");
			td0.textContent = "Panjang (m)";
			t10 = space();
			td1 = element("td");
			input1 = element("input");
			t11 = space();
			tr1 = element("tr");
			td2 = element("td");
			td2.textContent = "Lebar (m)";
			t13 = space();
			td3 = element("td");
			input2 = element("input");
			t14 = space();
			tr2 = element("tr");
			td4 = element("td");
			td4.textContent = "Luas";
			t16 = space();
			td5 = element("td");
			input3 = element("input");
			t17 = space();
			div9 = element("div");
			div8 = element("div");
			label2 = element("label");
			label2.textContent = "FASILITAS";
			t19 = space();
			table1 = element("table");
			tr3 = element("tr");
			td6 = element("td");
			label3 = element("label");
			input4 = element("input");
			t20 = text(" Tempat tidur");
			t21 = space();
			td7 = element("td");
			label4 = element("label");
			input5 = element("input");
			t22 = text(" Dapur");
			t23 = space();
			tr4 = element("tr");
			td8 = element("td");
			label5 = element("label");
			input6 = element("input");
			t24 = text(" Meja");
			t25 = space();
			td9 = element("td");
			label6 = element("label");
			input7 = element("input");
			t26 = text(" Wi-Fi");
			t27 = space();
			tr5 = element("tr");
			td10 = element("td");
			label7 = element("label");
			input8 = element("input");
			t28 = text(" Almari");
			t29 = space();
			td11 = element("td");
			label8 = element("label");
			input9 = element("input");
			t30 = text(" AC");
			t31 = space();
			tr6 = element("tr");
			td12 = element("td");
			label9 = element("label");
			input10 = element("input");
			t32 = text(" Kursi & meja belajar");
			t33 = space();
			td13 = element("td");
			label10 = element("label");
			input11 = element("input");
			t34 = text(" TV");
			t35 = space();
			tr7 = element("tr");
			td14 = element("td");
			label11 = element("label");
			input12 = element("input");
			t36 = text(" Kamar mandi dalam");
			t37 = space();
			td15 = element("td");
			label12 = element("label");
			input13 = element("input");
			t38 = text(" Laundry");
			t39 = space();
			div11 = element("div");
			button = element("button");
			button.textContent = "Cek Harga";
			add_location(br0, file$m, 78, 0, 2085);
			add_location(br1, file$m, 78, 6, 2091);
			add_location(br2, file$m, 78, 12, 2097);
			if (img.src !== (img_src_value = "assets/logo.png")) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", "cekkosmu");
			attr_dev(img, "id", "logo");
			add_location(img, file$m, 80, 2, 2132);
			attr_dev(div0, "class", "text-center");
			add_location(div0, file$m, 79, 0, 2104);
			attr_dev(p_1, "id", "moto");
			add_location(p_1, file$m, 85, 2, 2262);
			attr_dev(div1, "class", "text-center pt-3");
			add_location(div1, file$m, 84, 0, 2229);
			attr_dev(label0, "for", "");
			add_location(label0, file$m, 92, 12, 2432);
			attr_dev(div2, "class", "");
			add_location(div2, file$m, 91, 8, 2405);
			attr_dev(input0, "type", "number");
			attr_dev(input0, "id", "txtjarak");
			add_location(input0, file$m, 95, 12, 2536);
			attr_dev(div3, "class", "ml-auto mr-auto");
			add_location(div3, file$m, 94, 8, 2494);
			attr_dev(div4, "class", "col-4 input");
			add_location(div4, file$m, 90, 4, 2371);
			attr_dev(label1, "for", "");
			add_location(label1, file$m, 100, 12, 2683);
			attr_dev(div5, "class", "");
			add_location(div5, file$m, 99, 8, 2656);
			add_location(td0, file$m, 105, 20, 2819);
			attr_dev(input1, "type", "number");
			attr_dev(input1, "id", "txtp");
			attr_dev(input1, "min", "2");
			attr_dev(input1, "data-toggle", "tooltip");
			attr_dev(input1, "title", "Panjang Kamar");
			add_location(input1, file$m, 106, 24, 2864);
			add_location(td1, file$m, 106, 20, 2860);
			add_location(tr0, file$m, 104, 16, 2794);
			add_location(td2, file$m, 109, 20, 3046);
			attr_dev(input2, "type", "number");
			attr_dev(input2, "id", "txtl");
			attr_dev(input2, "min", "1");
			attr_dev(input2, "data-toggle", "tooltip");
			attr_dev(input2, "title", "Lebar Kamar");
			add_location(input2, file$m, 110, 24, 3089);
			add_location(td3, file$m, 110, 20, 3085);
			add_location(tr1, file$m, 108, 16, 3021);
			add_location(td4, file$m, 113, 20, 3269);
			attr_dev(input3, "type", "number");
			attr_dev(input3, "id", "txtluas");
			attr_dev(input3, "data-toggle", "tooltip");
			attr_dev(input3, "title", "Luas Kamar");
			input3.readOnly = true;
			add_location(input3, file$m, 114, 24, 3308);
			add_location(td5, file$m, 114, 20, 3304);
			add_location(tr2, file$m, 112, 16, 3244);
			add_location(table0, file$m, 103, 12, 2770);
			attr_dev(div6, "class", "");
			add_location(div6, file$m, 102, 8, 2743);
			attr_dev(div7, "class", "col-4 input ");
			add_location(div7, file$m, 98, 4, 2621);
			attr_dev(label2, "for", "");
			add_location(label2, file$m, 121, 12, 3552);
			attr_dev(div8, "class", "");
			add_location(div8, file$m, 120, 8, 3525);
			attr_dev(input4, "type", "checkbox");
			attr_dev(input4, "id", "fas0");
			input4.__value = "10";
			input4.value = input4.__value;
			/*$$binding_groups*/ ctx[13][0].push(input4);
			add_location(input4, file$m, 125, 27, 3684);
			add_location(label3, file$m, 125, 20, 3677);
			add_location(td6, file$m, 125, 16, 3673);
			attr_dev(input5, "type", "checkbox");
			attr_dev(input5, "id", "fas5");
			input5.__value = "11";
			input5.value = input5.__value;
			/*$$binding_groups*/ ctx[13][0].push(input5);
			add_location(input5, file$m, 126, 27, 3799);
			add_location(label4, file$m, 126, 20, 3792);
			add_location(td7, file$m, 126, 16, 3788);
			add_location(tr3, file$m, 124, 12, 3652);
			attr_dev(input6, "type", "checkbox");
			attr_dev(input6, "id", "fas1");
			input6.__value = "6";
			input6.value = input6.__value;
			/*$$binding_groups*/ ctx[13][0].push(input6);
			add_location(input6, file$m, 129, 27, 3942);
			add_location(label5, file$m, 129, 20, 3935);
			add_location(td8, file$m, 129, 16, 3931);
			attr_dev(input7, "type", "checkbox");
			attr_dev(input7, "id", "fas6");
			input7.__value = "14";
			input7.value = input7.__value;
			/*$$binding_groups*/ ctx[13][0].push(input7);
			add_location(input7, file$m, 130, 27, 4048);
			add_location(label6, file$m, 130, 20, 4041);
			add_location(td9, file$m, 130, 16, 4037);
			add_location(tr4, file$m, 128, 12, 3910);
			attr_dev(input8, "type", "checkbox");
			attr_dev(input8, "id", "fas2");
			input8.__value = "7";
			input8.value = input8.__value;
			/*$$binding_groups*/ ctx[13][0].push(input8);
			add_location(input8, file$m, 133, 27, 4191);
			add_location(label7, file$m, 133, 20, 4184);
			add_location(td10, file$m, 133, 16, 4180);
			attr_dev(input9, "type", "checkbox");
			attr_dev(input9, "id", "fas7");
			input9.__value = "15";
			input9.value = input9.__value;
			/*$$binding_groups*/ ctx[13][0].push(input9);
			add_location(input9, file$m, 134, 27, 4299);
			add_location(label8, file$m, 134, 20, 4292);
			add_location(td11, file$m, 134, 16, 4288);
			add_location(tr5, file$m, 132, 12, 4159);
			attr_dev(input10, "type", "checkbox");
			attr_dev(input10, "id", "fas3");
			input10.__value = "8";
			input10.value = input10.__value;
			/*$$binding_groups*/ ctx[13][0].push(input10);
			add_location(input10, file$m, 137, 27, 4439);
			add_location(label9, file$m, 137, 20, 4432);
			add_location(td12, file$m, 137, 16, 4428);
			attr_dev(input11, "type", "checkbox");
			attr_dev(input11, "id", "fas8");
			input11.__value = "13";
			input11.value = input11.__value;
			/*$$binding_groups*/ ctx[13][0].push(input11);
			add_location(input11, file$m, 138, 27, 4562);
			add_location(label10, file$m, 138, 20, 4555);
			add_location(td13, file$m, 138, 16, 4551);
			add_location(tr6, file$m, 136, 12, 4407);
			attr_dev(input12, "type", "checkbox");
			attr_dev(input12, "id", "fas4");
			input12.__value = "9";
			input12.value = input12.__value;
			/*$$binding_groups*/ ctx[13][0].push(input12);
			add_location(input12, file$m, 141, 27, 4702);
			add_location(label11, file$m, 141, 20, 4695);
			add_location(td14, file$m, 141, 16, 4691);
			attr_dev(input13, "type", "checkbox");
			attr_dev(input13, "id", "fas9");
			input13.__value = "12";
			input13.value = input13.__value;
			/*$$binding_groups*/ ctx[13][0].push(input13);
			add_location(input13, file$m, 142, 27, 4822);
			add_location(label12, file$m, 142, 20, 4815);
			add_location(td15, file$m, 142, 16, 4811);
			add_location(tr7, file$m, 140, 12, 4670);
			attr_dev(table1, "id", "fasilitas-container");
			add_location(table1, file$m, 123, 8, 3607);
			attr_dev(div9, "class", "col-4 input");
			add_location(div9, file$m, 119, 4, 3491);
			attr_dev(div10, "class", "row");
			add_location(div10, file$m, 89, 0, 2349);
			attr_dev(button, "class", "btn bg-logo svelte-1xp7dci");
			add_location(button, file$m, 150, 4, 5030);
			attr_dev(div11, "class", "text-center mt-2");
			add_location(div11, file$m, 149, 0, 4995);
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
			append_dev(div1, p_1);
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
			append_dev(div6, table0);
			append_dev(table0, tr0);
			append_dev(tr0, td0);
			append_dev(tr0, t10);
			append_dev(tr0, td1);
			append_dev(td1, input1);
			set_input_value(input1, /*p*/ ctx[1]);
			append_dev(table0, t11);
			append_dev(table0, tr1);
			append_dev(tr1, td2);
			append_dev(tr1, t13);
			append_dev(tr1, td3);
			append_dev(td3, input2);
			set_input_value(input2, /*l*/ ctx[2]);
			append_dev(table0, t14);
			append_dev(table0, tr2);
			append_dev(tr2, td4);
			append_dev(tr2, t16);
			append_dev(tr2, td5);
			append_dev(td5, input3);
			set_input_value(input3, /*ukuran*/ ctx[3]);
			append_dev(div10, t17);
			append_dev(div10, div9);
			append_dev(div9, div8);
			append_dev(div8, label2);
			append_dev(div9, t19);
			append_dev(div9, table1);
			append_dev(table1, tr3);
			append_dev(tr3, td6);
			append_dev(td6, label3);
			append_dev(label3, input4);
			input4.checked = ~/*fas*/ ctx[4].indexOf(input4.__value);
			append_dev(label3, t20);
			append_dev(tr3, t21);
			append_dev(tr3, td7);
			append_dev(td7, label4);
			append_dev(label4, input5);
			input5.checked = ~/*fas*/ ctx[4].indexOf(input5.__value);
			append_dev(label4, t22);
			append_dev(table1, t23);
			append_dev(table1, tr4);
			append_dev(tr4, td8);
			append_dev(td8, label5);
			append_dev(label5, input6);
			input6.checked = ~/*fas*/ ctx[4].indexOf(input6.__value);
			append_dev(label5, t24);
			append_dev(tr4, t25);
			append_dev(tr4, td9);
			append_dev(td9, label6);
			append_dev(label6, input7);
			input7.checked = ~/*fas*/ ctx[4].indexOf(input7.__value);
			append_dev(label6, t26);
			append_dev(table1, t27);
			append_dev(table1, tr5);
			append_dev(tr5, td10);
			append_dev(td10, label7);
			append_dev(label7, input8);
			input8.checked = ~/*fas*/ ctx[4].indexOf(input8.__value);
			append_dev(label7, t28);
			append_dev(tr5, t29);
			append_dev(tr5, td11);
			append_dev(td11, label8);
			append_dev(label8, input9);
			input9.checked = ~/*fas*/ ctx[4].indexOf(input9.__value);
			append_dev(label8, t30);
			append_dev(table1, t31);
			append_dev(table1, tr6);
			append_dev(tr6, td12);
			append_dev(td12, label9);
			append_dev(label9, input10);
			input10.checked = ~/*fas*/ ctx[4].indexOf(input10.__value);
			append_dev(label9, t32);
			append_dev(tr6, t33);
			append_dev(tr6, td13);
			append_dev(td13, label10);
			append_dev(label10, input11);
			input11.checked = ~/*fas*/ ctx[4].indexOf(input11.__value);
			append_dev(label10, t34);
			append_dev(table1, t35);
			append_dev(table1, tr7);
			append_dev(tr7, td14);
			append_dev(td14, label11);
			append_dev(label11, input12);
			input12.checked = ~/*fas*/ ctx[4].indexOf(input12.__value);
			append_dev(label11, t36);
			append_dev(tr7, t37);
			append_dev(tr7, td15);
			append_dev(td15, label12);
			append_dev(label12, input13);
			input13.checked = ~/*fas*/ ctx[4].indexOf(input13.__value);
			append_dev(label12, t38);
			insert_dev(target, t39, anchor);
			insert_dev(target, div11, anchor);
			append_dev(div11, button);

			if (!mounted) {
				dispose = [
					listen_dev(input0, "input", /*input0_input_handler*/ ctx[8]),
					listen_dev(input1, "input", /*input1_input_handler*/ ctx[9]),
					listen_dev(input1, "change", /*luas*/ ctx[5], false, false, false),
					listen_dev(input2, "input", /*input2_input_handler*/ ctx[10]),
					listen_dev(input2, "change", /*luas*/ ctx[5], false, false, false),
					listen_dev(input3, "input", /*input3_input_handler*/ ctx[11]),
					listen_dev(input4, "change", /*input4_change_handler*/ ctx[12]),
					listen_dev(input5, "change", /*input5_change_handler*/ ctx[14]),
					listen_dev(input6, "change", /*input6_change_handler*/ ctx[15]),
					listen_dev(input7, "change", /*input7_change_handler*/ ctx[16]),
					listen_dev(input8, "change", /*input8_change_handler*/ ctx[17]),
					listen_dev(input9, "change", /*input9_change_handler*/ ctx[18]),
					listen_dev(input10, "change", /*input10_change_handler*/ ctx[19]),
					listen_dev(input11, "change", /*input11_change_handler*/ ctx[20]),
					listen_dev(input12, "change", /*input12_change_handler*/ ctx[21]),
					listen_dev(input13, "change", /*input13_change_handler*/ ctx[22]),
					listen_dev(button, "click", /*check*/ ctx[6], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*jarak*/ 1 && to_number(input0.value) !== /*jarak*/ ctx[0]) {
				set_input_value(input0, /*jarak*/ ctx[0]);
			}

			if (dirty & /*p*/ 2 && to_number(input1.value) !== /*p*/ ctx[1]) {
				set_input_value(input1, /*p*/ ctx[1]);
			}

			if (dirty & /*l*/ 4 && to_number(input2.value) !== /*l*/ ctx[2]) {
				set_input_value(input2, /*l*/ ctx[2]);
			}

			if (dirty & /*ukuran*/ 8 && to_number(input3.value) !== /*ukuran*/ ctx[3]) {
				set_input_value(input3, /*ukuran*/ ctx[3]);
			}

			if (dirty & /*fas*/ 16) {
				input4.checked = ~/*fas*/ ctx[4].indexOf(input4.__value);
			}

			if (dirty & /*fas*/ 16) {
				input5.checked = ~/*fas*/ ctx[4].indexOf(input5.__value);
			}

			if (dirty & /*fas*/ 16) {
				input6.checked = ~/*fas*/ ctx[4].indexOf(input6.__value);
			}

			if (dirty & /*fas*/ 16) {
				input7.checked = ~/*fas*/ ctx[4].indexOf(input7.__value);
			}

			if (dirty & /*fas*/ 16) {
				input8.checked = ~/*fas*/ ctx[4].indexOf(input8.__value);
			}

			if (dirty & /*fas*/ 16) {
				input9.checked = ~/*fas*/ ctx[4].indexOf(input9.__value);
			}

			if (dirty & /*fas*/ 16) {
				input10.checked = ~/*fas*/ ctx[4].indexOf(input10.__value);
			}

			if (dirty & /*fas*/ 16) {
				input11.checked = ~/*fas*/ ctx[4].indexOf(input11.__value);
			}

			if (dirty & /*fas*/ 16) {
				input12.checked = ~/*fas*/ ctx[4].indexOf(input12.__value);
			}

			if (dirty & /*fas*/ 16) {
				input13.checked = ~/*fas*/ ctx[4].indexOf(input13.__value);
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
			/*$$binding_groups*/ ctx[13][0].splice(/*$$binding_groups*/ ctx[13][0].indexOf(input4), 1);
			/*$$binding_groups*/ ctx[13][0].splice(/*$$binding_groups*/ ctx[13][0].indexOf(input5), 1);
			/*$$binding_groups*/ ctx[13][0].splice(/*$$binding_groups*/ ctx[13][0].indexOf(input6), 1);
			/*$$binding_groups*/ ctx[13][0].splice(/*$$binding_groups*/ ctx[13][0].indexOf(input7), 1);
			/*$$binding_groups*/ ctx[13][0].splice(/*$$binding_groups*/ ctx[13][0].indexOf(input8), 1);
			/*$$binding_groups*/ ctx[13][0].splice(/*$$binding_groups*/ ctx[13][0].indexOf(input9), 1);
			/*$$binding_groups*/ ctx[13][0].splice(/*$$binding_groups*/ ctx[13][0].indexOf(input10), 1);
			/*$$binding_groups*/ ctx[13][0].splice(/*$$binding_groups*/ ctx[13][0].indexOf(input11), 1);
			/*$$binding_groups*/ ctx[13][0].splice(/*$$binding_groups*/ ctx[13][0].indexOf(input12), 1);
			/*$$binding_groups*/ ctx[13][0].splice(/*$$binding_groups*/ ctx[13][0].indexOf(input13), 1);
			if (detaching) detach_dev(t39);
			if (detaching) detach_dev(div11);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$n.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$n($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Cari", slots, []);

	class Fuzzy extends Tsukamoto {
		constructor(j, u, f) {
			super(j, u, f);
		}
	}

	class Toast extends myToast {
		// Konstruktor
		constructor(judul, teks, tipe) {
			super(judul, teks, tipe);

			// Properti
			this.toast = sweetalert2_all.mixin({
				toast: false,
				position: "center",
				showConfirmButton: true,
				timer: 3000,
				timerProgressBar: true,
				didOpen: toast => {
					toast.addEventListener("mouseenter", sweetalert2_all.stopTimer);
					toast.addEventListener("mouseleave", sweetalert2_all.resumeTimer);
				}
			});
		}

		// method untuk menampilkan toast
		show() {
			this.toast.fire({
				icon: this.tipe != "success" ? "error" : "success",
				title: this.judul
			});
		}
	}

	// inisialisasi variabel
	let jarak = 0;

	let p = 0;
	let l = 0;
	let ukuran = 0;
	let fas = [];
	let sigma_fas = 0;
	let harga = 0;
	let error_toast = new Toast("Mohon isi dengan lengkap!", "", "error");
	let success_toast;

	function luas() {
		$$invalidate(3, ukuran = p * l);
	}

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
			success_toast = new Toast(`Prediksi harga sewa kos:\nRp ${harga}.000,00`, "", "success");

			success_toast.show();
		} else {
			error_toast.show(); // alert(`Prediksi harga sewa kos:\nRp ${harga}.000,00`)
		}
	}

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Cari> was created with unknown prop '${key}'`);
	});

	const $$binding_groups = [[]];

	function input0_input_handler() {
		jarak = to_number(this.value);
		$$invalidate(0, jarak);
	}

	function input1_input_handler() {
		p = to_number(this.value);
		$$invalidate(1, p);
	}

	function input2_input_handler() {
		l = to_number(this.value);
		$$invalidate(2, l);
	}

	function input3_input_handler() {
		ukuran = to_number(this.value);
		$$invalidate(3, ukuran);
	}

	function input4_change_handler() {
		fas = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
		$$invalidate(4, fas);
	}

	function input5_change_handler() {
		fas = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
		$$invalidate(4, fas);
	}

	function input6_change_handler() {
		fas = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
		$$invalidate(4, fas);
	}

	function input7_change_handler() {
		fas = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
		$$invalidate(4, fas);
	}

	function input8_change_handler() {
		fas = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
		$$invalidate(4, fas);
	}

	function input9_change_handler() {
		fas = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
		$$invalidate(4, fas);
	}

	function input10_change_handler() {
		fas = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
		$$invalidate(4, fas);
	}

	function input11_change_handler() {
		fas = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
		$$invalidate(4, fas);
	}

	function input12_change_handler() {
		fas = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
		$$invalidate(4, fas);
	}

	function input13_change_handler() {
		fas = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
		$$invalidate(4, fas);
	}

	$$self.$capture_state = () => ({
		Tsukamoto,
		myToast,
		Swal: sweetalert2_all,
		Fuzzy,
		Toast,
		jarak,
		p,
		l,
		ukuran,
		fas,
		sigma_fas,
		harga,
		error_toast,
		success_toast,
		luas,
		check
	});

	$$self.$inject_state = $$props => {
		if ("jarak" in $$props) $$invalidate(0, jarak = $$props.jarak);
		if ("p" in $$props) $$invalidate(1, p = $$props.p);
		if ("l" in $$props) $$invalidate(2, l = $$props.l);
		if ("ukuran" in $$props) $$invalidate(3, ukuran = $$props.ukuran);
		if ("fas" in $$props) $$invalidate(4, fas = $$props.fas);
		if ("sigma_fas" in $$props) sigma_fas = $$props.sigma_fas;
		if ("harga" in $$props) harga = $$props.harga;
		if ("error_toast" in $$props) error_toast = $$props.error_toast;
		if ("success_toast" in $$props) success_toast = $$props.success_toast;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		jarak,
		p,
		l,
		ukuran,
		fas,
		luas,
		check,
		Toast,
		input0_input_handler,
		input1_input_handler,
		input2_input_handler,
		input3_input_handler,
		input4_change_handler,
		$$binding_groups,
		input5_change_handler,
		input6_change_handler,
		input7_change_handler,
		input8_change_handler,
		input9_change_handler,
		input10_change_handler,
		input11_change_handler,
		input12_change_handler,
		input13_change_handler
	];
}

class Cari extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$n, create_fragment$n, safe_not_equal, { Toast: 7 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Cari",
			options,
			id: create_fragment$n.name
		});
	}

	get Toast() {
		return this.$$.ctx[7];
	}

	set Toast(value) {
		throw new Error("<Cari>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src\App.svelte generated by Svelte v3.29.4 */
const file$n = "src\\App.svelte";

function create_fragment$o(ctx) {
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
			add_location(div, file$n, 36, 0, 1421);
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
		id: create_fragment$o.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$o($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("App", slots, []);
	let current;
	page("/", () => $$invalidate(0, current = Home));
	page("/listkos", () => $$invalidate(0, current = Kosan));
	page("/about", () => $$invalidate(0, current = About));
	page("/contact", () => $$invalidate(0, current = Contact));
	page("/user/login", () => $$invalidate(0, current = User));
	page("/admin/login", () => $$invalidate(0, current = Admin$1));
	page("/owner/login", () => $$invalidate(0, current = Ownerkos));
	page("/admin/dasbor", () => $$invalidate(0, current = Admin$1));
	page("/owner/dasbor", () => $$invalidate(0, current = Ownerkos));
	page("/user/dasbor", () => $$invalidate(0, current = User));
	page("/owner/signup", () => $$invalidate(0, current = SignUp));
	page("/user/signup", () => $$invalidate(0, current = SignUp$1));
	page("/carikos", () => $$invalidate(0, current = Cari));
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
		ULogin: User,
		ALogin: Admin$1,
		OLogin: Ownerkos,
		ADasbor: Admin$1,
		ODasbor: Ownerkos,
		UDasbor: User,
		SUOwner: SignUp,
		SUser: SignUp$1,
		Cari,
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
		init(this, options, instance$o, create_fragment$o, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "App",
			options,
			id: create_fragment$o.name
		});
	}
}

const app = new App({
    target: document.body,
    props: {
        name: 'world'
    }
});

export default app;
//# sourceMappingURL=bundle.js.map
