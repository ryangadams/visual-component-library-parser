Visual Component Library Builder
==========

Parses links from a given wiki page (a list of visual components) and outputs the relevant details in a developer friendly json format.

Usage
-----
    cd ~/visual-component-library # or wherever you checked this out to
    ruby bin/build.rb

Then in ~/kandlcurriculum-visual-component-library/ you'll find a json file for each component from the library.

The downloaded confluence pages are cached in ~/.cachedbbcpages. The default lifetime is 1hr, cached files are not deleted.

And in visual-component-library you'll find an index.html file

Make sure you use a passwordless pem format for your certificate or you'll be prompted for a password for every page you try to load (about 80 at present).