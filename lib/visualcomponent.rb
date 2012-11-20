require 'BBCFileFetcher.rb'
require 'nokogiri' 
require 'json'

# parsing class for Wiki Pages I'm targetting
# Visual Component Library
class VisualComponent     
	include BBCFileFetcher
	                           
	# css rule to target the contents of the page                                     
	@@wiki_content = '.wiki-content'                              
	# url of your confluence space for url generation
	@@confluence = 'https://confluence.dev.bbc.co.uk'
	
	attr_accessor :component_name, :component_url, :component_html
	
	def initialize(url, name)
		@component_url = @@confluence + url
		@component_name = name
		@component_html = Nokogiri::HTML(fetch(@component_url)).css(@@wiki_content)
		if component_code == ""
       raise "Can't create a component from '#{url}'"
		end
	end                           
	
	def component_code
		get_element_after "h1[text()*='Module reference number']"
	end                      
	def overview
		get_element_after "h1[text()*='Overview']"
	end 

	def child_components
	  els  = @component_html.search "h1[text()*='List of components']"
    return "" if els.length == 0
		el   = els.first
		el = el.next_element if el
		# el is an <ol>
    components = Array.new
    links = el.children
    link = links.first
    while link.next_element
      components.push link.content
  		link = link.next_element
	  end
	  components
	end             
	
	def user_story
		get_element_after "h1[text()*='User Story']"
	end  
	def cucumber_link
		get_element_after "h1[text()*='Acceptance Criteria']"
	end
	def jira
		searchString = "[text()*='Jira Links']"
		els = @component_html.search searchString
		el = els.first       
		el = get_parent_if_necessary(el, "b")
		el.next_element.at_css("a.external-link")["href"] if el.next_element.at_css("a.external-link")
	end 
	
	def design_grab
		searchString = "[text()*='Design Screen-grab']"
		els = @component_html.search searchString
		el = els.first       
		el = get_parent_if_necessary(el, "b")
		design = Array.new
		while el.next_element && el.next_element.node_name != "h1"
			el = el.next_element
			design.push @@confluence + el.at_css("img")["src"] if el.at_css("img")
	  end                                                       
		design
	end          
	
	def status             
		searchString = ".infoMacro td b[text()*='Status']"
		els = @component_html.search searchString
		el = els.first
		el = el.next_sibling
		el = el.next_sibling if el.node_name == "br"
		el.inner_text.strip
	end

	def to_json
		{     
			"status" => status,
			"url" => @component_url,
			"jira" => jira,
			"code" => component_code,
			"name" => @component_name,
			"overview" => overview,
			"user_story" => user_story,
			"cucumber" => cucumber_link,
			"design" => design_grab,
			"child_components" => child_components
		}.to_json
	end
	
	private            
	# takes a css or xpath string to get the header
	# and returns the contents of the next element
	# i.e. 
	# h1 HEADER
	# p content
	def get_element_after(searchString)
		els  = @component_html.search searchString
		el   = els.first       
		return "" unless el
		el.next_element.inner_text.strip
	end
	
	def get_parent_if_necessary(element, sought_node_name)
	  puts "looking for '#{sought_node_name}' in #{element}" if $debug
	  element = element.parent if element.node_name = sought_node_name
	  element
  end
end