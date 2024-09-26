{ pkgs, ... }:

{
  # Packages 
  packages = [ pkgs.git ];

  # Languages
  languages.javascript = {
    enable = true;
    package = pkgs.nodejs-slim_22;
    bun.enable = true;
    npm.enable = true;
  };

  languages.typescript.enable = true;

  # Pre-commit hooks
}
