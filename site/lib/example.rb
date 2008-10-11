def example(file, link = true)
  code = File.read("example/#{file}")
  language = File.basename(file).match(/\.([a-z]+)$/)[1]
  h = ''
  if link
    url = "/example/#{file}"
    h << %[<p>Check this example at <a href="#{url}">#{url}</a></p>]
  end
  h << highlight(code, language, {}, true)
end