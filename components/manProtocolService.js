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

  parseURI: function(spec) {
  	var ret;
  	if(ret = spec.match(/^man:\/\/([0-9]+)\/(\w+)$/))
		return({
			section: parseInt(ret[1]),
			page: ret[2]
		});
	if(ret = spec.match(/^man:\/\/(\w+)$/))
		return({
			section: 0,
			page: ret[1]
		});
	return(undefined);
  },

  newChannel: function(aURI)
  {
    // An entry function called when visiting a page
    log("ManpagesProtocol.newChannel aURI = " + aURI.spec);
    var ios = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
    var htmlText = '<h1>tst</h1>';
    var data = this.parseURI(aURI.spec);
    // Convert the HTML text into an input stream.
    var converter = Cc["@mozilla.org/intl/scriptableunicodeconverter"].
                    createInstance(Ci.nsIScriptableUnicodeConverter);
    converter.charset = "UTF-8";
    var stream = converter.convertToInputStream(htmlText);

    // Set up a channel to load the input stream.
    var channel = Cc["@mozilla.org/network/input-stream-channel;1"].
                  createInstance(Ci.nsIInputStreamChannel);
    channel.setURI(aURI);
    channel.contentStream = stream;
    log("~ManpagesProtocol.newChannel");
    return channel;
  },
  classDescription: "Manpages Protocol Handler",
  contractID: "@mozilla.org/network/protocol;1?name=" + "t",
  classID: Components.ID('{bbad1420-35f8-11e2-81c1-0800200c9a66}'),
  QueryInterface: XPCOMUtils.generateQI([Ci.nsIProtocolHandler])
}

function log(data) {
	var file = Components.classes["@mozilla.org/file/local;1"]
		.createInstance(Components.interfaces.nsILocalFile);
	file.initWithPath( "/tmp/manreader.log" );
	var stream = Components.classes["@mozilla.org/network/file-output-stream;1"]
		.createInstance(Components.interfaces.nsIFileOutputStream);
	stream.init(file, 0x04 | 0x08 | 0x10, 0664, 0); // readwrite | create | append
	var seekstream = stream.QueryInterface(Components.interfaces.nsISeekableStream);
	data += "\n";
	stream.write(data, data.length);
	stream.close();
}

if (XPCOMUtils.generateNSGetFactory)
  var NSGetFactory = XPCOMUtils.generateNSGetFactory([ManpagesProtocol]);
else
  var NSGetModule = XPCOMUtils.generateNSGetModule([ManpagesProtocol]);
