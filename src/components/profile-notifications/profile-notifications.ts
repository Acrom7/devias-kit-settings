import notification from '../notification/notification'

interface FormElements extends HTMLFormControlsCollection {
	notifications: HTMLFieldSetElement,
	messages: HTMLFieldSetElement
}

function collectionToArray(collection: HTMLFormControlsCollection): HTMLInputElement[] {
	return (Array.from(collection) as HTMLInputElement[])
}

function initProfileNotifications() {
	const form = document.forms.namedItem('profile-notifications-form')
	const elements = form.elements as FormElements
	const arrayOfElements = collectionToArray(elements)
	const submitButton = arrayOfElements.find(el => el.type === 'submit')

	const checkboxes = arrayOfElements.filter(el => el.type === 'checkbox')
	checkboxes.forEach(input => {
		input.addEventListener('click', () => {
			submitButton.disabled = false
		})
	})

	const getFieldsetNameOfCheckbox = (checkbox: HTMLInputElement): string => {
		return checkbox.parentElement.parentElement.getAttribute('name')
	}

	form.addEventListener('submit', event => {
		event.preventDefault()
		submitButton.disabled = true
		const XHR = new XMLHttpRequest()

		const newNotifications: { [key: string]: boolean } = {}
		const newMessages: { [key: string]: boolean } = {}
		checkboxes.forEach(checkbox => {
			const fieldsetName = getFieldsetNameOfCheckbox(checkbox)
			if (fieldsetName === 'notifications') {
				newNotifications[checkbox.name] = checkbox.checked
			} else if (fieldsetName === 'messages') {
				newMessages[checkbox.name] = checkbox.checked
			}
		})
		const data = {notifications: newNotifications, messages: newMessages}

		XHR.addEventListener('load', (e) => {
			notification('Saved', 'success', 5000)
			submitButton.disabled = true
		})

		XHR.addEventListener('error', (e) => {
			notification('Error. Try again', 'error', 5000)
			submitButton.disabled = false
			console.error(e)
		})

		XHR.open('POST', 'https://httpbin.org/post')
		XHR.setRequestHeader('Content-Type', 'application/json')

		XHR.send(JSON.stringify(data))
	})
}

export default initProfileNotifications
