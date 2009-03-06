require 'rubygems'
begin
  require 'rake'
rescue LoadError
  puts 'This script should only be accessed via the "rake" command.'
  puts 'Installation: gem install rake -y'
  exit
end
require 'rake'
require 'rake/clean'
require 'rake/packagetask'

$:.unshift File.dirname(__FILE__) + "/lib"

APP_VERSION  = '0.1'
APP_NAME     = 'SugarTest'
RUBYFORGE_PROJECT = APP_NAME
APP_FILE_BASE_NAME = 'sugar_test'
APP_TEMPLATE = "#{APP_FILE_BASE_NAME}.js.erb"
APP_FILE_NAME= "#{APP_FILE_BASE_NAME}.js"

APP_ROOT     = File.expand_path(File.dirname(__FILE__))
APP_SRC_DIR  = File.join(APP_ROOT, 'src')
APP_DIST_DIR = File.join(APP_ROOT, 'dist')
APP_PKG_DIR  = File.join(APP_ROOT, 'pkg')


unless ENV['rakefile_just_config']
  
  
CLEAN.include [ "#{APP_DIST_DIR}/#{APP_FILE_BASE_NAME}.js", "#{APP_DIST_DIR}/#{APP_FILE_BASE_NAME}-#{APP_VERSION}.js" ]

task :default => [:dist, :package, :clean_package_source]

desc "Builds the distribution"
task :dist do
  $:.unshift File.join(APP_ROOT, 'lib')
  require 'protodoc'
  require 'fileutils'
  FileUtils.mkdir_p APP_DIST_DIR

  Dir.chdir(APP_SRC_DIR) do
    File.open(File.join(APP_DIST_DIR, APP_FILE_NAME), 'w+') do |dist|
      dist << Protodoc::Preprocessor.new(APP_TEMPLATE)
    end
  end
  Dir.chdir(APP_DIST_DIR) do
    FileUtils.copy_file APP_FILE_NAME, "#{APP_FILE_BASE_NAME}-#{APP_VERSION}.js"
  end
end

Rake::PackageTask.new(APP_FILE_BASE_NAME, APP_VERSION) do |package|
  package.need_tar_gz = true
  package.package_dir = APP_PKG_DIR
  package.package_files.include(
    '[A-Z]*',
    'config/*.sample',
    "dist/#{APP_FILE_NAME}",
    'lib/**',
    'src/**',
    'script/**',
    'tasks/**',
    'test/**',
    'website/**'
  )
end

desc "Builds the distribution, runs the JavaScript unit + functional tests and collects their results."
task :test => [:dist, :test_units, :test_functionals]

require 'jstest'
desc "Runs all the JavaScript unit tests and collects the results"
JavaScriptTestTask.new(:test_units, 4711) do |t|
  testcases        = ENV['TESTCASES']
  tests_to_run     = ENV['TESTS']    && ENV['TESTS'].split(',')
  browsers_to_test = ENV['BROWSERS'] && ENV['BROWSERS'].split(',')

  t.mount("/dist")
  t.mount("/src")
  t.mount("/test")

  Dir["test/unit/*_test.html"].sort.each do |test_file|
    tests = testcases ? { :url => "/#{test_file}", :testcases => testcases } : "/#{test_file}"
    test_filename = test_file[/.*\/(.+?)\.html/, 1]
    t.run(tests) unless tests_to_run && !tests_to_run.include?(test_filename)
  end

  %w( safari firefox ie konqueror opera ).each do |browser|
    t.browser(browser.to_sym) unless browsers_to_test && !browsers_to_test.include?(browser)
  end
end

desc "Runs all the JavaScript functional tests and collects the results"
JavaScriptTestTask.new(:test_functionals, 4712) do |t|
  testcases        = ENV['TESTCASES']
  tests_to_run     = ENV['TESTS']    && ENV['TESTS'].split(',')
  browsers_to_test = ENV['BROWSERS'] && ENV['BROWSERS'].split(',')

  t.mount("/dist")
  t.mount("/src")
  t.mount("/test")

  Dir["test/functional/*_test.html"].sort.each do |test_file|
    tests = testcases ? { :url => "/#{test_file}", :testcases => testcases } : "/#{test_file}"
    test_filename = test_file[/.*\/(.+?)\.html/, 1]
    t.run(tests) unless tests_to_run && !tests_to_run.include?(test_filename)
  end

  %w( safari firefox ie konqueror opera ).each do |browser|
    t.browser(browser.to_sym) unless browsers_to_test && !browsers_to_test.include?(browser)
  end
end


task :clean_package_source do
  rm_rf File.join(APP_PKG_DIR, "#{APP_NAME}-#{APP_VERSION}")
end

Dir['tasks/**/*.rake'].each { |rake| load rake }

end