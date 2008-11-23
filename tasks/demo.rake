CLEAN.include('jshoulda/assets')

desc "Prepara la demo para descarga"
task :demo => [ :dist ] do
  mkdir_p 'jshoulda/assets'
  cp 'dist/jshoulda.js', 'jshoulda/assets/jshoulda.js'
  cp 'test/assets/jsunittest.js', 'jshoulda/assets/jsunittest.js'
  cp 'test/assets/unittest.css', 'jshoulda/assets/unittest.css'
end