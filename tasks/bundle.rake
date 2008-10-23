namespace :bundle do
  desc "Updates the bundle submodule and creates a zip file from it"
  task :zip => :update do
    mkdir_p "site/output/dl"
    system "zip -r site/output/dl/jshoulda-tmbundle jshoulda.tmbundle/"
  end
  
  desc "Updates the bundle submodule"
  task :update do
    system "git submodule update jshoulda.tmbundle"
  end
end