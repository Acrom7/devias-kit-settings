import hamburgerInit from '../../components/hamburger-button/hamburger-button'
import initProfileBasicForm from '../../components/profile-basic/profile-basic'
import initProfileNotifications from '../../components/profile-notifications/profile-notifications'

window.onload = () => {
	hamburgerInit('offcanvas')
	initProfileBasicForm()
	initProfileNotifications()
}
