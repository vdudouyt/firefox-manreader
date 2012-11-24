PKG=manreader.xpi
all:
	rm -f $(PKG)
	zip $(PKG) chrome.manifest
	zip $(PKG) install.rdf
