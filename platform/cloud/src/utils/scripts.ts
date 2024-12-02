import { catchError } from "./promise"

interface ScriptConfig {
  serverUrl: string
  sn: string
  token: string
}

const INFO_SCRIPTS = {
  "active-users": "./src/scripts/active-users.txt",
  "system-resources": ".src/scripts/system-resources.txt",
}

const INIT_SCRIPTS = {
  router: "./src/scripts/init-router.txt",
  chr: "./src/scripts/init-chr.txt",
}

type InfoType = keyof typeof INFO_SCRIPTS

export class MikrotikScriptGenerator {
  private readonly config: ScriptConfig

  constructor(config: ScriptConfig) {
    this.config = config
  }

  private wrapWithErrorHandling(script: string): string {
    return `:do {\n${script}\n} on-error={/log warning "Alert: Script execution failed!";};`
  }

  private generateUrl() {
    return `${this.config.serverUrl}/api/v2/tower/results/?sn=$serial&token=$token`
  }

  private dedent(str: string): string {
    return str.replace(/^\s+/gm, "")
  }

  //TODO: Add error Handling
  //TODO: Add tests (pre + post compilation)
  //TODO: Add assertion and fail on failure
  //NOTE: How to crash well (with recovery + logging)
  //NOTE: This service may need to run in a cluster

  async generateInfoScript(type: InfoType) {
    if (!(type in INFO_SCRIPTS)) {
      throw new Error(`Invalid action type: ${type}`)
    }

    const file = Bun.file(INFO_SCRIPTS[type])
    const [error, text] = await catchError(file.text())

    if (error) {
      console.error(error)
      throw new Error(`Failed to read script content for action type: ${type}`)
    }

    const script = this.dedent(`
    :local serial "${this.config.sn}";   
    :local token "${this.config.token}";
    ${text}
    :local url ("${this.generateUrl()}");
    /tool fetch url=$url http-method=post http-header-field="Content-Type: application/json" http-data=$jsonStr output=none;
    `)

    const finalScript = this.wrapWithErrorHandling(script)

    if (typeof finalScript !== "string") {
      throw new Error("The final script is not a string")
    }

    return finalScript
  }

  //TODO: More work here
  async generateInitScript(type: "router" | "chr") {
    if (!(type in INIT_SCRIPTS)) {
      throw new Error(`Invalid init type: ${type}`)
    }

    const file = Bun.file(INIT_SCRIPTS[type])
    const [error, text] = await catchError(file.text())

    if (error) {
      console.error(error)
      throw new Error(`Failed to read script content for init type: ${type}`)
    }

    const script = this.dedent(`
    :local serial "${this.config.sn}";   
    :local token "${this.config.token}";
    ${text}
    `)

    const finalScript = this.wrapWithErrorHandling(script)

    if (typeof finalScript !== "string") {
      throw new Error("The final script is not a string")
    }

    return finalScript
  }
}
