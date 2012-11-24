PKG=manreader.xpi
all:
	rm -f $(PKG)
	zip $(PKG) components/*
	zip $(PKG) chrome.manifest
	zip $(PKG) install.rdf
