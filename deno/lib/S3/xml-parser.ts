// deno-lint-ignore-file
interface Document {
  declaration: {
    attributes: {};
  };
  root: {
    name: string;
    attributes: {};
    children: any[];
  } | undefined;
}

interface Xml {
  name: string;
  attributes: any;
  content?: string;
  children: Xml[];
}

/**
 * Parse the given string of `xml`.
 *
 * @param {String} xml
 * @return {Object}
 * @api public
 */

export default function parse(xml: string): Document {
  xml = xml.trim();

  // strip comments
  xml = xml.replace(/<!--[\s\S]*?-->/g, "");

  return document();

  /**
   * XML document.
   */

  function document(): Document {
    return {
      declaration: declaration(),
      root: tag()
    };
  }

  /**
   * Declaration.
   */

  function declaration() {
    var m = match(/^<\?xml\s*/);
    if (!m) return;

    // tag
    var node: any = {
      attributes: {}
    };

    // attributes
    while (!(eos() || is("?>"))) {
      var attr = attribute();
      if (!attr) return node;
      node.attributes[attr.name] = attr.value;
    }

    match(/\?>\s*/);

    return node;
  }

  /**
   * Tag.
   */

  function tag() {
    var m = match(/^<([\w-:.]+)\s*/);
    if (!m) return;

    // name
    var node: Xml = {
      name: m[1],
      attributes: {},
      children: []
    };

    // attributes
    while (!(eos() || is(">") || is("?>") || is("/>"))) {
      var attr = attribute();
      if (!attr) return node;
      node.attributes[attr.name] = attr.value;
    }

    // self closing tag
    if (match(/^\s*\/>\s*/)) {
      return node;
    }

    match(/\??>\s*/);

    // content
    node.content = content();

    // children
    var child;
    while ((child = tag())) {
      node.children.push(child);
    }

    // closing
    match(/^<\/[\w-:.]+>\s*/);

    return node;
  }

  /**
   * Text content.
   */

  function content() {
    var m = match(/^([^<]*)/);
    if (m) return m[1];
    return "";
  }

  /**
   * Attribute.
   */

  function attribute() {
    var m = match(/([\w:-]+)\s*=\s*("[^"]*"|'[^']*'|\w+)\s*/);
    if (!m) return;
    return { name: m[1], value: strip(m[2]) };
  }

  /**
   * Strip quotes from `val`.
   */

  function strip(val: string) {
    return val.replace(/^['"]|['"]$/g, "");
  }

  /**
   * Match `re` and advance the string.
   */

  function match(re: RegExp) {
    var m = xml.match(re);
    if (!m) return;
    xml = xml.slice(m[0].length);
    return m;
  }

  /**
   * End-of-source.
   */

  function eos() {
    return 0 == xml.length;
  }

  /**
   * Check for `prefix`.
   */

  function is(prefix: string) {
    return 0 == xml.indexOf(prefix);
  }
}
