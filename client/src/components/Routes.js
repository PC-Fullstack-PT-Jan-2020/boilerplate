import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import TimeboxList from './TimeboxList'

export default () => {
    return (
        <Router>
            <Route path="/" exact component={TimeboxList} />
        </Router>
    )
}