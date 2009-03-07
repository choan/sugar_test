CLEAN.include('jshoulda/assets')

desc "Prepara la demo para descarga"
task :demo => [ :dist ] do
  mkdir_p 'sample/assets'
  cp 'dist/sugar_test.js', 'sample/assets/sugar_test.js'
  cp 'test/assets/jsunittest.js', 'sample/assets/jsunittest.js'
  cp 'test/assets/unittest.css', 'sample/assets/unittest.css'
end