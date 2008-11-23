CLEAN.include ['site/output']

desc("Builds the distribution, then the site")
task :site => [ :dist, :'site:default' ]

desc("Builds the site and uploads it")
task :upload => [ :site, :'site:upload' ]


namespace :site do

  desc "Compiles the nanoc site and adds the needed JS, examples and CSS files"
  task :default => [ :html, :js, :css, :example, :downloads ]
  
  task :downloads => [ :'bundle:zip', :demo_download ]

  desc "Compiles the nanoc site"
  task :html do
    chdir 'site' do
      sh 'nanoc', 'co'
    end
  end

  desc "Copies the JS files needed for the site"
  task :js do
    chdir 'site' do
      mkdir_p 'output/js'
      cp '../dist/jshoulda.js', 'output/js'
      cp '../test/assets/jsunittest.js', 'output/js'
      cp 'js/editable.js', 'output/js'
    end
  end

  desc "Copies the CSS files needed for the site"
  task :css => [ 'site/output/css/unittest.css', 'site/output/css/blackboard.css',  'site/output/css/jshoulda_site.css' ]

  desc "Copies the example files for the site"
  task :example do
    cp_r 'site/example', 'site/output'
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
    system "zip -r site/output/dl/jshoulda jshoulda/"
  end

  file 'site/output/css/unittest.css' => 'site/css/unittest.css' do
    mkdir_p "site/output/css"
    cp "site/css/unittest.css", "site/output/css"  
  end

  file 'site/output/css/blackboard.css' => 'site/css/blackboard.css' do
    mkdir_p "site/output/css"
    cp "site/css/blackboard.css", "site/output/css"  
  end

  file 'site/output/css/jshoulda_site.css' => 'site/css/jshoulda_site.css' do
    mkdir_p "site/output/css"
    cp "site/css/jshoulda_site.css", "site/output/css"  
  end

end