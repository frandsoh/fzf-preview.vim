import { VimValue } from "neovim/lib/types/VimValue"

import { vimVariableAssociation } from "@/association/vim-variable"
import { vimVariableModule } from "@/module/vim-variable"
import { pluginGetVar } from "@/plugin"
import { dispatch } from "@/store"
import type { VimVariableName } from "@/type"
import { objectKeys } from "@/util/object"

const getGlobalVariable = async (variableName: VimVariableName): Promise<VimValue | null> => {
  try {
    return await pluginGetVar(variableName)
  } catch (_error) {
    return new Promise((resolve) => {
      resolve(null)
    })
  }
}

export const syncVimVariable = async (): Promise<void> => {
  const variableNames = objectKeys(vimVariableAssociation)
  const vimVariableActions = vimVariableModule.actions

  await Promise.all(
    variableNames.map(async (variableName) => {
      const value = await getGlobalVariable(vimVariableAssociation[variableName])
      if (value == null) {
        return
      }

      dispatch(
        vimVariableActions.setGlobalVariable({
          name: variableName,
          value,
        })
      )
    })
  )
}
