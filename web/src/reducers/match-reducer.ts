import type { CreateMatchOutput } from '@/validation/create-match-form-schema'

export type CreateMatchFormProps = {
  name: FormField<CreateMatchOutput['name']>
  guildId: FormField<CreateMatchOutput['guildId']>
  participants: FormField<CreateMatchOutput['participants']>
  selectPaticipants: boolean
}

export type MatchReducerActions = {
  type: 'SET_NAME'
  field: Partial<FormField<CreateMatchOutput['name']>>
} | {
  type: 'SET_GUILD_ID'
  field: Partial<FormField<CreateMatchOutput['guildId']>>
} | {
  type: 'SUBMIT_FORM'
  function: (state: MatchReducerActions) => void
} | {
  type: 'SET_PARTICIPANTS'
  field: Partial<FormField<CreateMatchOutput['participants']>>
} | {
  type: 'TOGGLE_SELECT_PARTICIPANTS'
}

export function formReducer(state: CreateMatchFormProps, action: MatchReducerActions): CreateMatchFormProps {
  switch (action.type) {
    case 'SET_NAME': {
      return {
        ...state,
        name: {
          value: action.field.value ?? state.name.value,
          errors: action.field.errors ?? [],
        },
      }
    }
    case 'SET_GUILD_ID': {
      return {
        ...state,
        guildId: {
          value: action.field.value ?? state.guildId.value,
          errors: action.field.errors ?? [],

        },
      }
    }
    case 'SET_PARTICIPANTS': {
      return {
        ...state,
        participants: {
          value: action.field.value ?? state.participants.value,
          errors: action.field.errors ?? [],
        },
      }
    }
    case 'TOGGLE_SELECT_PARTICIPANTS': {
      return {
        ...state,
        selectPaticipants: !state.selectPaticipants,
      }
    }
    default: {
      return state
    }
  }
}
