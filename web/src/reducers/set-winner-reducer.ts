import type { SetMatchWinnerMatchOutput } from '@/validation/set-match-winner-form-schema'

export type SetWinnerFormProps = {

  winnerId: FormField<SetMatchWinnerMatchOutput['winnerId']>

}

export type MatchReducerActions = {
  type: 'SET_WINNER_ID'
  field: Partial<FormField<SetMatchWinnerMatchOutput['winnerId']>>
} | {
  type: 'SUBMIT_FORM'
  function: (state: MatchReducerActions) => void
}

export function formReducer(state: SetWinnerFormProps, action: MatchReducerActions): SetWinnerFormProps {
  switch (action.type) {
    case 'SET_WINNER_ID': {
      return {
        ...state,
        winnerId: {
          value: action.field.value ?? state.winnerId.value,
          errors: action.field.errors ?? [],
        },
      }
    }
    default: {
      return state
    }
  }
}
