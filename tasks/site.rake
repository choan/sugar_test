require "erubis"
require "ostruct"
require "rdiscount"
require "cgi"

CLEAN.include ['site/output']

desc("Builds the distribution, then the site")
task :site => [ :dist, :'site:default' ]

desc("Builds the site and uploads it")
task :upload => [ :site, :'site:upload' ]


namespace :site do
  
  CONTENT_DIR = 'site/content'
  OUTPUT_DIR = 'site/output'
  CSS_DIR = 'site/css'
  CSS_OUTPUT_DIR = 'site/output/css'
  JS_OUTPUT_DIR = 'site/output/js'
  LAYOUTS_DIR = 'site/layouts'

  desc "Compiles the nanoc site and adds the needed JS, examples and CSS files"
  task :default => [ :html, :js, :css ]
  
  task :downloads => [ :'bundle:zip', :demo_download ]

  desc "Compiles the html pages"
  task :html

  desc "Copies the JS files needed for the site"
  task :js => [ :dist, JS_OUTPUT_DIR ] do
    cp 'dist/sugar_test.js', JS_OUTPUT_DIR
    cp 'test/assets/jsunittest.js', JS_OUTPUT_DIR
    # cp 'js/editable.js', 'output/js'
  end

  desc "Copies the CSS files needed for the site"
  task :css

  directory OUTPUT_DIR
  directory CSS_OUTPUT_DIR
  directory JS_OUTPUT_DIR
  
    
  FileList[File.join(CSS_DIR, '*.css')].each do |f|
    out_file = File.join(CSS_OUTPUT_DIR, File.basename(f))
    file out_file => [CSS_OUTPUT_DIR, f] do
      cp f, out_file
    end
    task :css => out_file
  end

  FileList[File.join(CONTENT_DIR, '*.mdown')].each do |f|
    out_file = File.join(OUTPUT_DIR, File.basename(f, '.mdown') + '.html')
    file out_file => [ OUTPUT_DIR, f ] do
      tpl = Erubis::Eruby.new File.read(File.join(LAYOUTS_DIR, 'default.erb'))
      attrs = {}
      source = File.read f
      yaml_done = false
      stream = ''
      source.each_line do |line|
        if line =~ /^-{3,}\s*$/ && !yaml_done
          attrs = YAML.load(stream)
          yaml_done = true
          stream = ''
        else
          stream << line
        end
      end
      mdown = stream
      page = OpenStruct.new(attrs)
      data = { :page =>page, :version => APP_VERSION, :analytics => analytics }
      mdown = Erubis::Eruby.new(mdown).evaluate(data)
      page.content = RDiscount.new(mdown).to_html
      File.open(out_file, 'w+') { |o| o.puts tpl.evaluate(data) }
    end
    task :html => out_file
  end

  desc "Uploads the site"
  task :upload => :default do
    file = 'config/site.yaml'
    if File.exists? file
      require 'yaml'
      config = YAML.load(File.read(file))
      %x(rsync -azv site/output/ #{config['user']}@#{config['server']}:#{config['path']})
    else
      puts "You should create a #{file} file to be able to upload the site"
    end
  end

  task :demo_download => :demo do
    mkdir_p "site/output/dl"
    system "zip -r site/output/dl/#{APP_FILE_BASE_NAME}-#{APP_VERSION}.zip sample"
  end
  
  def analytics
    %[
<script type="text/javascript">
var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
</script>
<script type="text/javascript">
try {
var pageTracker = _gat._getTracker("UA-306448-12");
pageTracker._trackPageview();
} catch(err) {}</script>
]
  end

end