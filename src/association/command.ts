import { parseDictionaryFilesArgs, parseEmptySourceFuncArgs, parseGrepArgs } from "@/args"
import { parseResources } from "@/args/files-from-resources-parser"
import {
  convertBlamePr,
  convertGrepToFileAndText,
  convertIdentity,
  convertLineToFileAndText,
  convertTags,
} from "@/fzf/converter"
import {
  allBuffers,
  allBuffersDefaultOptions,
  blamePr,
  blamePrDefaultOptions,
  bookmarks,
  bookmarksDefaultOptions,
  bufferLines,
  bufferLinesDefaultOptions,
  buffers,
  buffersDefaultOptions,
  bufferTags,
  bufferTagsDefaultOptions,
  changes,
  changesDefaultOptions,
  ctags,
  ctagsDefaultOptions,
  directoryFiles,
  directoryFilesDefaultOptions,
  dispatchDefaultQueryForCommandGrep,
  dropBufferPrefix,
  dropGitStatusPrefix,
  dropYankroundLineNumber,
  extractBufnrAndAddPrefix,
  filesFromResources,
  filesFromResourcesDefaultOptions,
  gitFiles,
  gitFilesDefaultOptions,
  gitStatus,
  gitStatusDefaultOptions,
  jumps,
  jumpsDefaultOptions,
  lines,
  linesDefaultOptions,
  locationList,
  locationListDefaultOptions,
  marks,
  marksDefaultOptions,
  mruFiles,
  mruFilesDefaultOptions,
  mrwFiles,
  mrwFilesDefaultOptions,
  oldFiles,
  oldFilesDefaultOptions,
  projectCommandGrep,
  projectCommandGrepDefaultOptions,
  projectFiles,
  projectFilesDefaultOptions,
  projectGrep,
  projectGrepDefaultOptions,
  projectMruFiles,
  projectMruFilesDefaultOptions,
  projectMrwFiles,
  projectMrwFilesDefaultOptions,
  projectOldFiles,
  projectOldFilesDefaultOptions,
  quickFix,
  quickFixDefaultOptions,
  yankround,
  yankroundDefaultOptions,
} from "@/fzf/resource"
import type { RemoteFzfCommand } from "@/type"

export const vimCommandOptions = {
  nargs: "?",
  sync: true,
} as const

export const commandDefinition: ReadonlyArray<RemoteFzfCommand> = [
  {
    commandName: "FzfPreviewProjectFiles",
    sourceFunc: projectFiles,
    convertLine: convertIdentity,
    sourceFuncArgsParser: parseEmptySourceFuncArgs,
    vimCommandOptions,
    defaultFzfOptionFunc: projectFilesDefaultOptions,
    defaultProcessesName: "open-file",
    enableConvertForFzf: true,
    enableDevIcons: true,
    enablePostProcessCommand: true,
  },
  {
    commandName: "FzfPreviewGitFiles",
    sourceFunc: gitFiles,
    convertLine: convertIdentity,
    sourceFuncArgsParser: parseEmptySourceFuncArgs,
    vimCommandOptions,
    defaultFzfOptionFunc: gitFilesDefaultOptions,
    defaultProcessesName: "open-file",
    enableConvertForFzf: true,
    enableDevIcons: true,
    enablePostProcessCommand: true,
  },
  {
    commandName: "FzfPreviewDirectoryFiles",
    sourceFunc: directoryFiles,
    convertLine: convertIdentity,
    sourceFuncArgsParser: parseDictionaryFilesArgs,
    vimCommandOptions,
    defaultFzfOptionFunc: directoryFilesDefaultOptions,
    defaultProcessesName: "open-file",
    enableConvertForFzf: true,
    enableDevIcons: true,
    enablePostProcessCommand: true,
  },
  {
    commandName: "FzfPreviewGitStatus",
    sourceFunc: gitStatus,
    convertLine: dropGitStatusPrefix,
    sourceFuncArgsParser: parseEmptySourceFuncArgs,
    vimCommandOptions,
    defaultFzfOptionFunc: gitStatusDefaultOptions,
    defaultProcessesName: "open-file",
    enableConvertForFzf: false,
    enableDevIcons: false,
    enablePostProcessCommand: false,
  },
  {
    commandName: "FzfPreviewBuffers",
    sourceFunc: buffers,
    convertLine: dropBufferPrefix,
    sourceFuncArgsParser: parseEmptySourceFuncArgs,
    vimCommandOptions,
    defaultFzfOptionFunc: buffersDefaultOptions,
    defaultProcessesName: "open-file",
    enableConvertForFzf: true,
    enableDevIcons: true,
    enablePostProcessCommand: true,
  },
  {
    commandName: "FzfPreviewAllBuffers",
    sourceFunc: allBuffers,
    convertLine: extractBufnrAndAddPrefix,
    sourceFuncArgsParser: parseEmptySourceFuncArgs,
    vimCommandOptions,
    defaultFzfOptionFunc: allBuffersDefaultOptions,
    defaultProcessesName: "open-bufnr",
    enableConvertForFzf: false,
    enableDevIcons: false,
    enablePostProcessCommand: false,
  },
  {
    commandName: "FzfPreviewProjectOldFiles",
    sourceFunc: projectOldFiles,
    convertLine: convertIdentity,
    sourceFuncArgsParser: parseEmptySourceFuncArgs,
    vimCommandOptions,
    defaultFzfOptionFunc: projectOldFilesDefaultOptions,
    defaultProcessesName: "open-file",
    enableConvertForFzf: true,
    enableDevIcons: true,
    enablePostProcessCommand: true,
  },
  {
    commandName: "FzfPreviewProjectMruFiles",
    sourceFunc: projectMruFiles,
    convertLine: convertIdentity,
    sourceFuncArgsParser: parseEmptySourceFuncArgs,
    vimCommandOptions,
    defaultFzfOptionFunc: projectMruFilesDefaultOptions,
    defaultProcessesName: "open-file",
    enableConvertForFzf: true,
    enableDevIcons: true,
    enablePostProcessCommand: true,
  },
  {
    commandName: "FzfPreviewProjectMrwFiles",
    sourceFunc: projectMrwFiles,
    convertLine: convertIdentity,
    sourceFuncArgsParser: parseEmptySourceFuncArgs,
    vimCommandOptions,
    defaultFzfOptionFunc: projectMrwFilesDefaultOptions,
    defaultProcessesName: "open-file",
    enableConvertForFzf: true,
    enableDevIcons: true,
    enablePostProcessCommand: true,
  },
  {
    commandName: "FzfPreviewLines",
    sourceFunc: lines,
    convertLine: convertLineToFileAndText,
    sourceFuncArgsParser: parseEmptySourceFuncArgs,
    vimCommandOptions,
    defaultFzfOptionFunc: linesDefaultOptions,
    defaultProcessesName: "open-file",
    enableConvertForFzf: false,
    enableDevIcons: false,
    enablePostProcessCommand: false,
  },
  {
    commandName: "FzfPreviewBufferLines",
    sourceFunc: bufferLines,
    convertLine: convertIdentity,
    sourceFuncArgsParser: parseEmptySourceFuncArgs,
    vimCommandOptions,
    defaultFzfOptionFunc: bufferLinesDefaultOptions,
    defaultProcessesName: "open-file",
    enableConvertForFzf: true,
    enableDevIcons: true,
    enablePostProcessCommand: false,
  },
  {
    commandName: "FzfPreviewCtags",
    sourceFunc: ctags,
    convertLine: convertTags,
    sourceFuncArgsParser: parseEmptySourceFuncArgs,
    vimCommandOptions,
    defaultFzfOptionFunc: ctagsDefaultOptions,
    defaultProcessesName: "open-file",
    enableConvertForFzf: false,
    enableDevIcons: false,
    enablePostProcessCommand: false,
  },
  {
    commandName: "FzfPreviewBufferTags",
    sourceFunc: bufferTags,
    convertLine: convertLineToFileAndText,
    sourceFuncArgsParser: parseEmptySourceFuncArgs,
    vimCommandOptions,
    defaultFzfOptionFunc: bufferTagsDefaultOptions,
    defaultProcessesName: "open-file",
    enableConvertForFzf: false,
    enableDevIcons: false,
    enablePostProcessCommand: false,
  },
  {
    commandName: "FzfPreviewOldFiles",
    sourceFunc: oldFiles,
    convertLine: convertIdentity,
    sourceFuncArgsParser: parseEmptySourceFuncArgs,
    vimCommandOptions,
    defaultFzfOptionFunc: oldFilesDefaultOptions,
    defaultProcessesName: "open-file",
    enableConvertForFzf: true,
    enableDevIcons: true,
    enablePostProcessCommand: true,
  },
  {
    commandName: "FzfPreviewMruFiles",
    sourceFunc: mruFiles,
    convertLine: convertIdentity,
    sourceFuncArgsParser: parseEmptySourceFuncArgs,
    vimCommandOptions,
    defaultFzfOptionFunc: mruFilesDefaultOptions,
    defaultProcessesName: "open-file",
    enableConvertForFzf: true,
    enableDevIcons: true,
    enablePostProcessCommand: true,
  },
  {
    commandName: "FzfPreviewMrwFiles",
    sourceFunc: mrwFiles,
    convertLine: convertIdentity,
    sourceFuncArgsParser: parseEmptySourceFuncArgs,
    vimCommandOptions,
    defaultFzfOptionFunc: mrwFilesDefaultOptions,
    defaultProcessesName: "open-file",
    enableConvertForFzf: true,
    enableDevIcons: true,
    enablePostProcessCommand: true,
  },
  {
    commandName: "FzfPreviewQuickFix",
    sourceFunc: quickFix,
    convertLine: convertGrepToFileAndText,
    sourceFuncArgsParser: parseEmptySourceFuncArgs,
    vimCommandOptions,
    defaultFzfOptionFunc: quickFixDefaultOptions,
    defaultProcessesName: "open-file",
    enableConvertForFzf: true,
    enableDevIcons: true,
    enablePostProcessCommand: false,
  },
  {
    commandName: "FzfPreviewLocationList",
    sourceFunc: locationList,
    convertLine: convertGrepToFileAndText,
    sourceFuncArgsParser: parseEmptySourceFuncArgs,
    vimCommandOptions,
    defaultFzfOptionFunc: locationListDefaultOptions,
    defaultProcessesName: "open-file",
    enableConvertForFzf: true,
    enableDevIcons: true,
    enablePostProcessCommand: false,
  },
  {
    commandName: "FzfPreviewJumps",
    sourceFunc: jumps,
    convertLine: convertGrepToFileAndText,
    sourceFuncArgsParser: parseEmptySourceFuncArgs,
    vimCommandOptions,
    defaultFzfOptionFunc: jumpsDefaultOptions,
    defaultProcessesName: "open-file",
    enableConvertForFzf: true,
    enableDevIcons: true,
    enablePostProcessCommand: false,
  },
  {
    commandName: "FzfPreviewChanges",
    sourceFunc: changes,
    convertLine: convertLineToFileAndText,
    sourceFuncArgsParser: parseEmptySourceFuncArgs,
    vimCommandOptions,
    defaultFzfOptionFunc: changesDefaultOptions,
    defaultProcessesName: "open-file",
    enableConvertForFzf: false,
    enableDevIcons: false,
    enablePostProcessCommand: false,
  },
  {
    commandName: "FzfPreviewMarks",
    sourceFunc: marks,
    convertLine: convertGrepToFileAndText,
    sourceFuncArgsParser: parseEmptySourceFuncArgs,
    vimCommandOptions,
    defaultFzfOptionFunc: marksDefaultOptions,
    defaultProcessesName: "open-file",
    enableConvertForFzf: true,
    enableDevIcons: true,
    enablePostProcessCommand: false,
  },
  {
    commandName: "FzfPreviewProjectGrep",
    sourceFunc: projectGrep,
    convertLine: convertGrepToFileAndText,
    sourceFuncArgsParser: parseGrepArgs,
    vimCommandOptions,
    defaultFzfOptionFunc: projectGrepDefaultOptions,
    defaultProcessesName: "open-file",
    enableConvertForFzf: true,
    enableDevIcons: true,
    enablePostProcessCommand: false,
  },
  {
    commandName: "FzfPreviewProjectCommandGrep",
    sourceFunc: projectCommandGrep,
    convertLine: convertGrepToFileAndText,
    sourceFuncArgsParser: parseGrepArgs,
    vimCommandOptions,
    defaultFzfOptionFunc: projectCommandGrepDefaultOptions,
    defaultProcessesName: "open-file",
    enableConvertForFzf: false,
    enableDevIcons: false,
    enablePostProcessCommand: false,
    beforeCommandHook: dispatchDefaultQueryForCommandGrep,
  },
  {
    commandName: "FzfPreviewFromResources",
    sourceFunc: filesFromResources,
    convertLine: convertIdentity,
    sourceFuncArgsParser: parseResources,
    vimCommandOptions,
    defaultFzfOptionFunc: filesFromResourcesDefaultOptions,
    defaultProcessesName: "open-file",
    enableConvertForFzf: true,
    enableDevIcons: true,
    enablePostProcessCommand: true,
  },
  {
    commandName: "FzfPreviewBookmarks",
    sourceFunc: bookmarks,
    convertLine: convertGrepToFileAndText,
    sourceFuncArgsParser: parseEmptySourceFuncArgs,
    vimCommandOptions,
    defaultFzfOptionFunc: bookmarksDefaultOptions,
    defaultProcessesName: "open-file",
    enableConvertForFzf: true,
    enableDevIcons: true,
    enablePostProcessCommand: false,
  },
  {
    commandName: "FzfPreviewYankround",
    sourceFunc: yankround,
    convertLine: dropYankroundLineNumber,
    sourceFuncArgsParser: parseEmptySourceFuncArgs,
    vimCommandOptions,
    defaultFzfOptionFunc: yankroundDefaultOptions,
    defaultProcessesName: "register",
    enableConvertForFzf: false,
    enableDevIcons: false,
    enablePostProcessCommand: false,
  },
  {
    commandName: "FzfPreviewBlamePR",
    sourceFunc: blamePr,
    convertLine: convertBlamePr,
    sourceFuncArgsParser: parseEmptySourceFuncArgs,
    vimCommandOptions,
    defaultFzfOptionFunc: blamePrDefaultOptions,
    defaultProcessesName: "open-pr",
    enableConvertForFzf: false,
    enableDevIcons: false,
    enablePostProcessCommand: false,
  },
] as const
