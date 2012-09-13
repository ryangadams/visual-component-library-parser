module BBCFileFetcher 
	# utility method which grabs the contents of bbc certificate protected pages
	# saves to a .cachedbbcpages directory in your home folder
	def fetch(url)             
		cache_lifetime = 60*60 # 1hr  
		cache_directory = File.join(Dir.home, ".cachedbbcpages")
		Dir.mkdir(cache_directory) unless File.directory?(cache_directory)
		cached_file = File.join(cache_directory, url.tr(":/.+", ""))
		if File.exists?("#{cached_file}.html") && (Time.now - File.mtime("#{cached_file}.html") < cache_lifetime)
			puts "Reading Cached File (#{(Time.now - File.mtime("#{cached_file}.html")).to_i} seconds old)" unless $silent
			source = File.read("#{cached_file}.html")
		else
			source = %x[curl -s -S --cert ~/certstore/ryan_adams_pwless.pem #{url}]
			File.open("#{cached_file}.html", "w") { |f| f.write(source) }
		end
		source
	end                                                                
	module_function :fetch
end                   


