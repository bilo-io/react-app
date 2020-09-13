// #region Modules
import React, { Component, Suspense } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
// #endregion

// #region Components
// import AppMenu from './components/app-menu'
// import Navbar from './components/navbar/index'
// import { Toaster } from './components/toaster'
// import VideoModal from './components/modal/video'
// #endregion

// #region Pages
import NotFound from './screens/not-found'
// #endregion

// #region Misc
// import {
//     addToast,
//     setVideoModal
// } from 'data/redux/session/actions'
// import './styles/index.scss'
// import './assets/favicon.ico'
import pkg from '../package.json'
console.log(`${pkg.name}: v${pkg.version}`)
// #endregion

// #region Routers
const TodosRouter = React.lazy(() => import(/* webpackChunkName: "slides" */ './screens/router'))
// #endregion

// #region Redux
const mapStateToProps = state => ({
    currentUser: state.session.currentUser,
    todos: state.session.todos
})

const mapActionsToProps = dispatch => bindActionCreators({
    // addToast,
    // setVideoModal
}, dispatch)
// #endregion

export class App extends Component {
    // #region Component Class Functions
    state = {
        isAppMenuOpen: false
    }

    toggleAppMenu = () => this.setState({ isAppMenuOpen: !this.state.isAppMenuOpen })

    setVideoModal = (value) => this.props.setVideoModal(value)
    // #endregion

    render () {
        const { isAppMenuOpen } = this.state
        const { isVideoModalOpen, toasts, toast } = this.props

        return <Router>
            <div className='fullscreen'>
                <div className='layout'>
                    {/* <Navbar
                        onToggle={ this.toggleAppMenu }
                        openVideoModal={ () => this.setVideoModal(true) }
                    />
                    <AppMenu
                        appName={'studio.vis-ion'}
                        appVersion={ pkg.version }
                        isOpen={ isAppMenuOpen }
                        theme={ 'dark' }
                        onToggle={ this.toggleAppMenu }
                        socialAccount={{
                            instagram: 'http://www.instagram.com/bilo_lwabona',
                            github: 'http://www.github.com/bilo-io'
                        }}
                    /> */}
                    <Switch>
                        <React.Suspense fallback={<div className='page'>
                            <div className='loader' style={{ marginTop: 'calc(50vh - 2rem)' }} />
                        </div>
                        }>
                            <Route
                                exact
                                path={'/'}
                                render={ () => <Redirect to={'/app/studio'} /> }
                            />
                            <Route path={'/app/todos'} component={ TodosRouter } />
                        </React.Suspense>
                    </Switch>
                </div>
                {/* <VideoModal
                    isOpen={ isVideoModalOpen }
                    onClose={ () => this.setVideoModal(false) }
                />
                <Toaster toast={toast} /> */}
            </div>
        </Router>
    }
}

export default connect(mapStateToProps, mapActionsToProps)(App)
