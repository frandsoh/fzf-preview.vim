import { filePreviewCommand } from "@/fzf/util"
import { globalVariableSelector } from "@/module/selector/vim-variable"
import { execSyncCommand } from "@/system/command"
import { isGitDirectory } from "@/system/project"
import type { FzfCommandDefinitionDefaultOption, Resource, SourceFuncArgs } from "@/type"

// eslint-disable-next-line @typescript-eslint/require-await
export const projectFiles = async (_args: SourceFuncArgs): Promise<Resource> => {
  if (!isGitDirectory()) {
    throw new Error("The current directory is not a git project")
  }

  const filelistCommand = globalVariableSelector("fzfPreviewFilelistCommand")

  if (typeof filelistCommand !== "string") {
    return { lines: [] }
  }

  const { stdout, stderr, status } = execSyncCommand(filelistCommand)

  if (stderr !== "" || status !== 0) {
    throw new Error(`Failed to get the file list. command: "${filelistCommand}"`)
  }

  return { lines: stdout.split("\n").filter((file) => file !== "" && !file.includes(" ")) }
}

export const projectFilesDefaultOptions = (): FzfCommandDefinitionDefaultOption => ({
  "--prompt": '"ProjectFiles> "',
  "--multi": true,
  "--preview": filePreviewCommand(),
})
