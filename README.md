Visual Component Library Builder
==========

Parses links from a given wiki page (a list of visual components) and outputs the relevant details in a developer friendly json format.

Usage
-----
    cd ~/visual-component-library # or wherever you checked this out to
	bundle install
    ruby bin/build.rb

Then in ~/kandlcurriculum-visual-component-library/ you'll find a json file for each component from the library.

It also attempts to put a copy of the compiled html, css and javascript in a folder called "visual_component_library" in your Dropbox Public folder. It assumes that you have Dropbox installed at ~/Dropbox.                    

The downloaded confluence pages are cached in ~/.cachedbbcpages. The default lifetime is 1hr, cached files are not deleted.

And in visual-component-library you'll find an index.html file

Make sure you use a passwordless pem format for your certificate or you'll be prompted for a password for every page you try to load (about 80 at present). The pem file is currently set to be "~/certstore/ryan\_adams\_pwless.pem" in BBCFileFetcher.rb. You'll need to change that.