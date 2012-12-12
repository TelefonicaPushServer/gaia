<clientConfig version="1.1">
  <emailProvider id="tid.es">
    <domain>tid.es</domain>
    <displayName>Telefonica Digital Mail</displayName>
    <displayShortName>PDI</displayShortName>
    <incomingServer type="imap">
      <hostname>correo.tid.es</hostname>
      <port>993</port>
      <socketType>SSL</socketType>
      <username>HI\%EMAILLOCALPART%</username>
      <authentication>password-cleartext</authentication>
    </incomingServer>
    <outgoingServer type="smtp">
      <hostname>correo.tid.es</hostname>
      <port>25</port>
      <socketType></socketType>
      <username>HI\%EMAILLOCALPART%</username>
      <authentication>password-cleartext</authentication>
    </outgoingServer>
  </emailProvider>
</clientConfig>
