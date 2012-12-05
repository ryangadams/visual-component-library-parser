require "rubygems"
require "bundler/setup"

require 'pathname'
$:.unshift File.join(File.dirname(Pathname.new($0).realpath.to_s), '../lib')
require 'nokogiri'
require 'open-uri'
require 'BBCFileFetcher.rb'
require 'visualcomponent.rb'
require 'explorer.rb'

$debug = false
$red = "\033[31m"
$endred = "\033[0m"
# the page to start parsing from
source_url = "https://confluence.dev.bbc.co.uk/display/unifiedplace/test"
# css to target links to parse
links = ".wiki-content li li a"

source = BBCFileFetcher.fetch(source_url)
doc = Nokogiri::HTML(source)

# create destination directory for parsed files (in home folder)
library_directory = File.join(Dir.home, "kandlcurriculum-visual-component-library")
Dir.mkdir(library_directory) unless File.directory?(library_directory)

components = Array.new
doc.css(links).each do |link|
	begin
		component = VisualComponent.new(link["href"], link.content)
		puts "Generating #{link.content}" unless $silent
		component_file = File.join(library_directory, component.component_code) + '.json'
		puts "writing #{component_file}" unless $silent
		File.open("#{component_file}", "w") { |f| f.write(component.to_json) }
		components.push component
	rescue
		puts $red + $!.message + $endred  # in red
	end
end                                     

LibraryExplorer.render_html(components) 
LibraryExplorer.copy_to_dropbox
