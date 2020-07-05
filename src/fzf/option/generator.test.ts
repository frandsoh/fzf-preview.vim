import { generateOptions } from "@/fzf/option/generator"
import { openFileProcesses as defaultProcesses } from "@/fzf/process/open-file"
import { globalVariableSelector } from "@/module/selector/vim-variable"
import { pluginGetVar } from "@/plugin"
import type { ConvertedLines, FzfOptions, Processes } from "@/type"

jest.mock("@/plugin")
jest.mock("@/module/selector/vim-variable")

describe("generateOptions", () => {
  let fzfCommandDefaultOptions: FzfOptions = {}

  beforeEach(() => {
    ;(globalVariableSelector as jest.Mock).mockImplementation((_) => {})

    fzfCommandDefaultOptions = {
      "--ansi": true,
      "--bind": [
        {
          key: "ctrl-d",
          action: "preview-page-down",
        },
        {
          key: "ctrl-u",
          action: "preview-page-up",
        },
        {
          key: "?",
          action: "toggle-preview",
        },
      ],
      "--expect": ["ctrl-x", "ctrl-v", "ctrl-t", "ctrl-o", "ctrl-q"],
    }
  })

  const otherDefaultProcesses: Processes = [
    {
      name: "",
      key: "enter",
      execute: (_: ConvertedLines) => {},
    },
    {
      name: "",
      key: "ctrl-a",
      execute: (_: ConvertedLines) => {},
    },
    {
      name: "",
      key: "ctrl-b",
      execute: (_: ConvertedLines) => {},
    },
    {
      name: "",
      key: "ctrl-c",
      execute: (_: ConvertedLines) => {},
    },
  ]

  describe("empty user processes", () => {
    it("open file process", async () => {
      expect(
        await generateOptions({
          fzfCommandDefaultOptions,
          defaultProcesses,
          userOptions: [],
        })
      ).toEqual(fzfCommandDefaultOptions)
    })

    it("other default processes", async () => {
      fzfCommandDefaultOptions["--expect"] = ["ctrl-a", "ctrl-b", "ctrl-c"]
      expect(
        await generateOptions({
          fzfCommandDefaultOptions,
          defaultProcesses: otherDefaultProcesses,
          userOptions: [],
        })
      ).toEqual(fzfCommandDefaultOptions)
    })
  })

  describe("set user processes from global variable", () => {
    it("open file processes", async () => {
      ;(pluginGetVar as jest.Mock).mockReturnValue(
        new Promise<Record<string, unknown>>((resolve) => {
          resolve({
            enter: null,
            "ctrl-d": null,
            "ctrl-e": null,
            "ctrl-f": null,
          })
        })
      )

      fzfCommandDefaultOptions["--expect"] = ["ctrl-d", "ctrl-e", "ctrl-f"]

      expect(
        await generateOptions({
          fzfCommandDefaultOptions,
          defaultProcesses,
          userProcesses: { type: "global_variable", value: "foo" },
          userOptions: [],
        })
      ).toEqual(fzfCommandDefaultOptions)
    })

    it("other processes (not open file processes)", async () => {
      ;(pluginGetVar as jest.Mock).mockReturnValue(
        new Promise<Record<string, unknown>>((resolve) => {
          resolve({
            enter: null,
            "ctrl-d": null,
            "ctrl-e": null,
            "ctrl-f": null,
          })
        })
      )

      fzfCommandDefaultOptions["--expect"] = ["ctrl-d", "ctrl-e", "ctrl-f"]

      expect(
        await generateOptions({
          fzfCommandDefaultOptions,
          defaultProcesses: otherDefaultProcesses,
          userProcesses: { type: "global_variable", value: "foo" },
          userOptions: [],
        })
      ).toEqual(fzfCommandDefaultOptions)
    })
  })

  describe("set user processes from custom processes variable", () => {
    beforeEach(() => {
      ;(globalVariableSelector as jest.Mock).mockImplementation((variableName) =>
        variableName === "fzfPreviewCustomProcesses"
          ? {
              "open-file": {
                "ctrl-h": "",
                "ctrl-i": "",
                "ctrl-j": "",
              },
              register: {
                "ctrl-k": "",
                "ctrl-l": "",
                "ctrl-m": "",
              },
            }
          : undefined
      )
    })

    it("open file processes", async () => {
      const customOpenProcessesExpectOptions = { "--expect": ["ctrl-h", "ctrl-i", "ctrl-j"] }

      expect(
        await generateOptions({
          fzfCommandDefaultOptions,
          defaultProcesses,
          userProcesses: { type: "custom_processes_variable", value: "open-file" },
          userOptions: [],
        })
      ).toEqual({ ...fzfCommandDefaultOptions, ...customOpenProcessesExpectOptions })
    })

    it("other processes (not open file processes)", async () => {
      const customOtherProcessesExpectOptions = { "--expect": ["ctrl-k", "ctrl-l", "ctrl-m"] }

      expect(
        await generateOptions({
          fzfCommandDefaultOptions,
          defaultProcesses,
          userProcesses: { type: "custom_processes_variable", value: "register" },
          userOptions: [],
        })
      ).toEqual({ ...fzfCommandDefaultOptions, ...customOtherProcessesExpectOptions })
    })
  })

  it("set user not dictionary processes", async () => {
    ;(pluginGetVar as jest.Mock).mockImplementation(() => {
      throw new Error("foo")
    })

    await expect(
      generateOptions({
        fzfCommandDefaultOptions,
        defaultProcesses,
        userProcesses: { type: "global_variable", value: "foo" },
        userOptions: [],
      })
    ).rejects.toThrow("foo")
  })

  it("set --preview-window options", async () => {
    ;(globalVariableSelector as jest.Mock).mockImplementation((variableName) =>
      variableName === "fzfPreviewFzfPreviewWindowOption" ? "foo" : undefined
    )

    expect(
      await generateOptions({
        fzfCommandDefaultOptions,
        defaultProcesses,
        userOptions: [],
      })
    ).toEqual({ ...fzfCommandDefaultOptions, ...{ "--preview-window": '"foo"' } })
  })

  it("set --color options", async () => {
    ;(globalVariableSelector as jest.Mock).mockImplementation((variableName) =>
      variableName === "fzfPreviewFzfColorOption" ? "foo" : undefined
    )

    expect(
      await generateOptions({
        fzfCommandDefaultOptions,
        defaultProcesses,
        userOptions: [],
      })
    ).toEqual({ ...fzfCommandDefaultOptions, ...{ "--color": '"foo"' } })
  })

  it("empty user options", async () => {
    expect(
      await generateOptions({
        fzfCommandDefaultOptions,
        defaultProcesses,
        userOptions: [],
      })
    ).toEqual(fzfCommandDefaultOptions)
  })

  it("added user options", async () => {
    const userOptions = [{ optionName: "foo" }, { optionName: "bar", value: "bar" }]
    const convertedUserOptions = {
      bar: "bar",
    }

    const generatedOptions = await generateOptions({
      fzfCommandDefaultOptions,
      defaultProcesses,
      userOptions,
    })
    expect(generatedOptions).toEqual(expect.objectContaining(fzfCommandDefaultOptions))
    expect(generatedOptions).toEqual({ ...fzfCommandDefaultOptions, ...convertedUserOptions })
  })

  describe("resume option", () => {
    it("resume query is undefined", async () => {
      const generatedOptions = await generateOptions({
        fzfCommandDefaultOptions,
        defaultProcesses,
        userOptions: [],
        resumeQuery: undefined,
      })

      expect(generatedOptions).toEqual(expect.objectContaining(fzfCommandDefaultOptions))
      expect(generatedOptions).toEqual(fzfCommandDefaultOptions)
    })

    it("resume query is exists", async () => {
      const generatedOptions = await generateOptions({
        fzfCommandDefaultOptions,
        defaultProcesses,
        userOptions: [],
        resumeQuery: "foo",
      })

      const queryOption = { "--query": '"foo"' }

      expect(generatedOptions).toEqual(expect.objectContaining(fzfCommandDefaultOptions))
      expect(generatedOptions).toEqual({ ...fzfCommandDefaultOptions, ...queryOption })
    })
  })
})
