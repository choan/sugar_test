class Hash
  require 'cgi'
  def to_html_attrs
    o = ''
    self.each do |k, v|
      # FIXME escape attribute values
      o << %[ #{k}="#{CGI.escapeHTML v}"]
    end
    o
  end
end