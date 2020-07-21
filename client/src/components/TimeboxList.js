import React, { useEffect } from 'react';
import { List, ListItem, ListItemText, TextField, Button, ButtonGroup, FormControlLabel, Switch } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done'
import EditIcon from '@material-ui/icons/Edit'
import AddIcon from '@material-ui/icons/Add'
import UndoIcon from '@material-ui/icons/Undo';
import Playback from './Playback'
import { useTimebox } from '../hooks'
import '../styles/Example.css'

export default () => {
  const {
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
  } = useTimebox()
  return (
    <div>
      <List component="nav" aria-label="main mailbox folders">
        {timeboxes.map(box => {
          return (
            <ListItem key={'box-' + box.id}>
              {
              box.editable ?
                <>
                  <TextField
                    label="Description"
                    onChange={(e) => changeDescription(box.id, e.target.value)}
                    value={box.description}
                  />
                  <ButtonGroup color="primary" aria-label="outlined primary button group" style={{marginRight: '20px', marginLeft: '20px'}}>
                    {times.map((item, index) => (
                      <Button
                      key={'time-' + index} 
                      color="primary"
                      onClick={() => switchTime(box.id, item.value)}
                      variant={item.value == box.time ? "contained" : null}>
                        {item.label}
                      </Button>
                    )
                    )}
                    <TextField 
                      label="x mins"
                      size="small"
                      style={{width: '80px', borderColor: 'red'}}
                      variant="outlined"
                      value={(box.time / 60 / 1000) || ''}
                      onChange={(e) => switchTime(box.id, e.target.value * 60 * 1000)} 
                    />
                  </ButtonGroup>
                  <FormControlLabel
                    control={<Switch color="primary" checked={box.type == 'hard'} onChange={() => toggleType(box.id)} />}
                    label={box.type}
                  />
                  <UndoIcon type="primary" onClick={() => undoEditTimeBox(box.id)} />
                  <DoneIcon type="primary" onClick={() => saveTimeBox(box.id)} />
                </>
              : 
                <>
                  <ListItemText primary={box.description} />
                  <EditIcon type="primary" onClick={() => editTimeBox(box.id)} />
                  <Playback
                    id={box.id}
                    playing={box.playing}
                    timeRemaining={box.time_remaining}
                    timeElapsed={box.time_elapsed}
                    timeOver={box.time_over}
                    mode={box.type}
                    beginCountDown={beginCountDown}
                    overtime={overtime}
                    startTimeBox={startTimeBox}
                    stopTimeBox={stopTimeBox} />
                </>
              }
              
            </ListItem>
          )
        })}
      </List>
      <Button onClick={addTimeBox}>
        <AddIcon></AddIcon>
      </Button>
    </div>
  )
}