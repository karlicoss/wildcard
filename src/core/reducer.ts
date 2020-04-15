import { Record, AttrSpec, QueryState, Table} from './types'
import includes from 'lodash/includes'
import pick from 'lodash/pick'
import { combineReducers } from 'redux'

const appTable = (state = { attributes: [], records: [] }, action):Table => {
  switch(action.type) {
    case "LOAD_RECORDS":
      return {
        ...state,
        records: action.records
      }

    case "SET_APP_ATTRIBUTES":
      return {
        ...state,
        attributes: action.appAttributes
      }

    default:
      return state;
  }
}


const initialUserTable = {
  attributes: [],
  records: []
}
const userTable = (state = initialUserTable, action):Table => {
  switch(action.type) {
    case "ADD_USER_ATTRIBUTE":
      const newAttribute : AttrSpec = {
        name: "user" + (state.attributes.length + 1),
        type: "text",
        editable: true
      }

      return {
        ...state,
        attributes: [...state.attributes, newAttribute]
      }

    // todo: this seems too specific... instead, generalize to the
    // idea of edits on arbitrary tables?
    case "EDIT_RECORD":
      // filter the update to only attributes in this table
      // (todo: need to use attr IDs and not names here, to avoid
      // issues with attribute name overlaps)
      const updates = pick(action.updates, state.attributes.map(a => a.name))

      let newRecords : Array<Record>;

      // todo: this does two passes, inefficient
      const existingRecord = state.records.find(r => r.id === action.id)
      if (existingRecord) {
        newRecords = state.records.map(r => {
          if (r.id === action.id) {
            return {
              id: r.id,
              attributes: { ...r.attributes, ...updates }
            }
          }
          else { return r; }
        })
      } else {
        newRecords = [...state.records,
          { id: action.id, attributes: updates }
        ]
      }

      return { ...state, records: newRecords }

    default:
      return state;
  }
}

const query = (state = { sortConfig: null }, action):QueryState => {
  switch(action.type) {
    case "SORT_RECORDS":
      return {
        ...state,
        sortConfig: action.sortConfig
      }

    default:
      return state;
  }
}

const rootReducer = combineReducers({
  appTable,
  userTable,
  query
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer;
