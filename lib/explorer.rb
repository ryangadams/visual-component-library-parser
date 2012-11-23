module LibraryExplorer
	def render_html(components)
		json = '{"components" : ['
		components.each do |comp|
			json = json + comp.to_json + ","
		end                              
		json.chomp!
		json = json + "]}"


		File.open("index.html","w") { |f| 
			f.write('<!DOCTYPE html><html><head><meta charset="UTF-8">')
			f.write('<script src="explorer.js"></script>')
			f.write('<link rel="stylesheet" href="explorer.css" />')
			f.write('<script>var components = ' + json + ';</script></head>')
			f.write('<body><p id="built-on">Built on: ' + Time.now.localtime.strftime("%Y-%m-%d %H:%M") + '</body></html>')
		}
	end  
	
	def copy_to_dropbox
		# assume dropbox directory is at ~/Dropbox
		dropbox_folder = File.join(Dir.home, "Dropbox", "Public", "visual_component_library")
		Dir.mkdir(dropbox_folder) unless File.directory?(dropbox_folder)
		
		FileUtils.cp("index.html", dropbox_folder)
		FileUtils.cp("explorer.css", dropbox_folder)
		FileUtils.cp("explorer.js", dropbox_folder)
		
	end
	
	module_function :render_html, :copy_to_dropbox
end