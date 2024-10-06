import { expect, describe, it } from "bun:test"
import { RouterOSApi as Ros } from "../src"

const api = new Ros("192.168.100.2", 8728)

//TODO: We need a test routerOS instance

describe("When trying to log in", () => {
  it("Returns an error if we provide wrong credential", () => {})

  it("Log us in when we provide good credential", () => {})
})

describe("When logged in", () => {
  it("Allows us to send simple commands", () => {})

  it("Returns values from the router ", () => {})

  it("Handles arguments well with queries", () => {})
})
