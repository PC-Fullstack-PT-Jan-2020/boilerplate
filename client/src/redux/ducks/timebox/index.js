// 1. imports
import axios from 'axios'
import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

// 2. action definitions
const ADD_BOX = 'timebox/ADD_BOX'
const EDIT_BOX = 'timebox/EDIT_BOX'
const UNDO_EDIT_BOX = 'timebox/UNDO_EDIT_BOX'
const SAVE_BOX = 'timebox/SAVE_BOX'
const START_BOX = 'timebox/START_BOX'
const STOP_BOX = 'timebox/STOP_BOX'
const DESCRIPTION_BOX = 'timebox/DESCRIPTION_BOX'
const COUNTDOWN_BOX = 'timebox/COUNTDOWN_BOX'
const OVERTIME_BOX = 'timebox/OVERTIME_BOX'
const TOGGLE_BOX_TYPE = 'timebox/TOGGLE_BOX_TYPE'
const TRY_SWITCH_TIME = 'timebox/TRY_SWITCH_TIME'

let id = 1
class Timebox {
    constructor(description = '', duration = 1, type = 'soft') {
        this.id = id++
        this.description = description
        this.time = duration * 1000 * 60 // convert to milliseconds
        this.time_remaining = this.time // convert to milliseconds
        this.time_elapsed = 0
        this.time_over = 0
        this.type = type
        this.editable = false
        this.playing = false
        this.saved = false
    }
}

const minToMs = (time) => ({value: time * 1000 * 60, label: time})
const timeList = [minToMs(1), minToMs(10), minToMs(30), minToMs(60)]

// 3. initial state
const initialState = {
  timeboxes: [
      {...new Timebox('timebox one', 1), editable: false, saved: true}
  ],
  times: timeList,
  boxCache: {},
}

// 4. reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_BOX:
        if (state.timeboxes.find(item => !item.saved)) {
            return {...state}
        }
        return {
            ...state,
            timeboxes: [...state.timeboxes, {...new Timebox(), editable: true}]
        }
    case TOGGLE_BOX_TYPE:
        return {
            ...state,
            timeboxes: state.timeboxes.map(item => item.id === action.payload ? {...item, type: item.type == 'soft' ? 'hard' : 'soft'} : item)
        }
    case TRY_SWITCH_TIME:
        const {id, time} = action.payload
        return {
            ...state,
            timeboxes: state.timeboxes.map(item => item.id === id ? {...item, time, time_remaining: time} : item)
        }
    case SAVE_BOX:
        const copiedCacheSave = {...state.boxCache}
        delete copiedCacheSave[action.payload]
        return {
            ...state,
            boxCache: copiedCacheSave,
            timeboxes: state.timeboxes.map(item => item.id === action.payload ? {...item, editable: false, saved: true} : item)
        }
    case START_BOX:
        return {
            ...state,
            timeboxes: state.timeboxes.map(item => item.id === action.payload ? {...item, playing: true} : item)
        }
    case STOP_BOX:
        return {
            ...state,
            timeboxes: state.timeboxes.map(item => item.id === action.payload ? {...item, playing: false} : item)
        }
    case EDIT_BOX:
        return {
            ...state,
            boxCache: {...state.boxCache, [action.payload]: state.timeboxes.find(item => item.id === action.payload)},
            timeboxes: state.timeboxes.map(item => item.id === action.payload ? {...item, editable: true} : item)
        }
    case UNDO_EDIT_BOX:
        const copiedCache = {...state.boxCache}
        const revertedBox = {...copiedCache[action.payload], editable: true}
        const newBoxes = state.timeboxes.map(item => item.id === action.payload ? revertedBox : item)
        if (!revertedBox.id) {
            return {...state}
        }
        return {
            ...state,
            timeboxes: newBoxes
        }
    case DESCRIPTION_BOX:
        return {
            ...state,
            timeboxes: state.timeboxes.map(item => item.id === action.payload.id ? {...item, description: action.payload.description} : item)
        }
    case COUNTDOWN_BOX:
        const {delta} = action.payload
        return {
            ...state,
            timeboxes: state.timeboxes.map(item => (
                item.id === action.payload.id ? 
                {...item, time_remaining: item.time_remaining - delta, time_elapsed: item.time_elapsed + delta}
                : item
                )
            )
        }
    case OVERTIME_BOX:
        return {
            ...state,
            timeboxes: state.timeboxes.map(item => (
                item.id === action.payload.id ? 
                {...item, time_over: item.time_over + action.payload.delta, time_elapsed: item.time_elapsed + action.payload.delta}
                : item
                )
            )
        }
    default:
      return state
  }
}

// 5. action creators

function addBox() {
    return {
        type: ADD_BOX,
    }
}

function toggleBoxType(id) {
    return {
        type: TOGGLE_BOX_TYPE,
        payload: id
    }
}

function trySwitchTime(id, time) {
    return {
        type: TRY_SWITCH_TIME,
        payload: {id, time}
    }
}

function saveBox(id) {
    return {
        type: SAVE_BOX,
        payload: id,
    }
}

function startBox(id) {
    return {
        type: START_BOX,
        payload: id,
    }
}

function stopBox(id) {
    return {
        type: STOP_BOX,
        payload: id,
    }
}

function editBox(id) {
    return {
        type: EDIT_BOX,
        payload: id,
    }
}

function undoBoxEdit(id) {
    return {
        type: UNDO_EDIT_BOX,
        payload: id,
    }
}

function countDown(idAndDelta) {
    return {
        type: COUNTDOWN_BOX,
        payload: idAndDelta,
    }
}

function handleOvertime(idAndDelta) {
    return {
        type: OVERTIME_BOX,
        payload: idAndDelta,
    }
}

function handleDescription(id, description) {
    return {
        type: DESCRIPTION_BOX,
        payload: {id, description},
    }
}


// 6. custom hook
export function useTimebox() {
  const dispatch = useDispatch()
  const timeboxes = useSelector(appState => appState.timeboxState.timeboxes)
  const times = useSelector(appState => appState.timeboxState.times)
  const addTimeBox = () => dispatch(addBox())
  const toggleType = (id) => dispatch(toggleBoxType(id))
  const switchTime = (id, time) => dispatch(trySwitchTime(id, time))
  const saveTimeBox = (id) => dispatch(saveBox(id))
  const editTimeBox = (id) => dispatch(editBox(id))
  const undoEditTimeBox = (id) => dispatch(undoBoxEdit(id))
  const stopTimeBox = (id) => dispatch(stopBox(id))
  const startTimeBox = (id) => dispatch(startBox(id))
  const beginCountDown = (idAndDelta) => dispatch(countDown(idAndDelta))
  const overtime = (idAndDelta) => dispatch(handleOvertime(idAndDelta))
  const changeDescription = (id, description) => dispatch(handleDescription(id, description))
  return { 
      timeboxes,
      times,
      addTimeBox,
      toggleType,
      switchTime,
      saveTimeBox,
      editTimeBox,
      undoEditTimeBox,
      stopTimeBox,
      startTimeBox,
      beginCountDown,
      overtime,
      changeDescription
    }
}
