import {messageStatus} from './types'

function createNewMessage(message: string, status: messageStatus) {
	const newMessage = document.createElement('div')
	newMessage.className = `notification__message notification__message_${status}`
	newMessage.innerText = message

	newMessage.addEventListener('click', () => {
		removeMessage(newMessage, 0)
	})

	return newMessage
}

function removeMessage(element: HTMLDivElement, timeout: number) {
	setTimeout(() => {
		element.style.opacity = '0'
	}, timeout)
	setTimeout(() => {
		element.parentNode.removeChild(element)
	}, timeout + 500)
}

export default function notification(message: string, status: messageStatus, timeout: number) {
	let container = document.querySelector('body > .notification')
	if (container === null) {
		container = document.createElement('div')
		container.className = 'notification'
		document.body.appendChild(container)
	}
	const newMessage = createNewMessage(message, status)
	container.appendChild(newMessage)
	removeMessage(newMessage, timeout)
}
