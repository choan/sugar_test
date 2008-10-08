def highlight(code, lang, attrs = {}, wrap = true)
  require 'uv'
  theme = 'blackboard'
  parsed = Uv.parse(code, 'xhtml', lang, false, theme)
  parsed = parsed.sub(/^<pre[^>]*>/, '').sub(/\n*<\/pre>$/, '')
  attrs[:class] ||= ''
  attrs[:class] << ' ' << theme
  attrs[:class].sub!(/^ /, '')
  if wrap
    prefix = %[<pre#{attrs.to_html_attrs}><code class="#{lang}">]
    postfix = '</code></pre>'
    prefix + parsed + postfix
  else
    parsed
  end
end