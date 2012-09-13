require 'pathname'
$:.unshift File.join(File.dirname(Pathname.new($0).realpath.to_s), '../lib')
require 'nokogiri'
require 'open-uri' 
require 'BBCFileFetcher.rb'                            
require 'visualcomponent.rb'
      
base_url = "https://confluence.dev.bbc.co.uk"
source_url = "https://confluence.dev.bbc.co.uk/display/unifiedplace/test"
links = ".wiki-content li li a"
                                                                      
                                                                        
source = BBCFileFetcher.fetch(source_url)


doc = Nokogiri::HTML(source)


library_directory = File.join(Dir.home, "kandlcurriculum-visual-component-library")
Dir.mkdir(library_directory) unless File.directory?(library_directory)


doc.css(links).each do |link|                                           
	begin
		component = VisualComponent.new(base_url + link["href"], link.content)
		puts "Generating #{link.content}" unless $silent
		component_file = File.join(library_directory, component.component_code) + '.json'
		puts "writing #{component_file}" unless $silent
		File.open("#{component_file}", "w") { |f| f.write(component.to_json) }
	rescue                                                                  
		puts $!
	end
end
                                                                        