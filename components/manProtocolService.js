const Cc = Components.classes;
const Ci = Components.interfaces;
const Cr = Components.results;

const nsIProtocolHandler = Ci.nsIProtocolHandler;

Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");

function ManpagesProtocol() {
}

ManpagesProtocol.prototype = {
  scheme: "t",
  protocolFlags: nsIProtocolHandler.URI_NORELATIVE |
                 nsIProtocolHandler.URI_NOAUTH |
                 nsIProtocolHandler.URI_LOADABLE_BY_ANYONE,

  newURI: function(aSpec, aOriginCharset, aBaseURI)
  {
    var uri = Cc["@mozilla.org/network/simple-uri;1"].createInstance(Ci.nsIURI);
    uri.spec = aSpec;
    return uri;
  },

  newChannel: function(aURI)
  {
    var ios = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
    /* Get twitterName from URL */
    var twitterName = aURI.spec.split(":")[1];
    var channel = ios.newChannel(aURI, "text/html", null);
    /* Have the URL bar change to the new URL */
    //channel.setRequestHeader("X-Moz-Is-Feed", "1", false);
    return channel;
  },
  classDescription: "Manpages Protocol Handler",
  contractID: "@mozilla.org/network/protocol;1?name=" + "t",
  classID: Components.ID('{bbad1420-35f8-11e2-81c1-0800200c9a66}'),
  QueryInterface: XPCOMUtils.generateQI([Ci.nsIProtocolHandler])
}

if (XPCOMUtils.generateNSGetFactory)
  var NSGetFactory = XPCOMUtils.generateNSGetFactory([ManpagesProtocol]);
else
  var NSGetModule = XPCOMUtils.generateNSGetModule([ManpagesProtocol]);
