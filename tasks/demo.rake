CLEAN.include('jshoulda/assets')

desc "Prepara la demo para descarga"
task :demo => [ :dist ] do
  mkdir_p 'sugar_test/assets'
  cp 'dist/sugar_test.js', 'sugar_test/assets/sugar_test.js'
  cp 'test/assets/jsunittest.js', 'sugar_test/assets/jsunittest.js'
  cp 'test/assets/unittest.css', 'sugar_test/assets/unittest.css'
end