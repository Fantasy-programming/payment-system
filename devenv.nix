{ pkgs, ... }:

let
  pythonWithPackages = pkgs.python3.withPackages (ps: [
    pkgs.httpie
    (ps.buildPythonPackage rec {
      pname = "httpie-websockets";
      version = "0.6.1";
      format = "wheel";
      
      src = pkgs.fetchurl {
        url = "https://files.pythonhosted.org/packages/d4/d1/9b57585b3af0dd256c2c21c556c9e5d72578ad483810c644688338354031/httpie_websockets-0.6.1-py3-none-any.whl";
        sha256 = "1npasvp340vc75ym6p54jbqfd5y2x64a3g3d7zvwlrhjh0kyqing"; 
      };
      
      propagatedBuildInputs = [ ps.websocket-client ];      
      doCheck = false;
    })
  ]);
in
{
  packages = [ 
    pkgs.git
    pythonWithPackages
    pkgs.httpie
  ];

  languages.javascript = {
    enable = true;
    package = pkgs.nodejs-slim_22;
    bun.enable = true;
    npm.enable = true;
  };

  languages.typescript.enable = true;

  services = {
    redis.enable = true;
    mongodb.enable = true;
  };

  processes = {
    ros.exec = "docker run -p 2222:22 -p 8291:8291 -p 8728:8728 -p 8729:8729 -p 5900:5900 --privileged --rm -ti --name routerOS evilfreelancer/docker-routeros";
  };
}
