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
			f.write('<body></body></html>')
		}
	end
	
	module_function :render_html
end