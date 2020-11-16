import notification from '../notification/notification'
import {HTMLInputElementWithInitialValue, setInitialValue} from './initialValue'
import {initValidator} from './validator'

interface SettingsFormElements extends HTMLFormControlsCollection {
	firstname: HTMLInputElement,
	lastname: HTMLInputElement,
	email: HTMLInputElement,
	phone: HTMLInputElement,
	country: HTMLInputElement,
	city: HTMLInputElement
}

export default function initProfileBasicForm(): void {
	const formName = 'profile-basic-form'
	const form = document.forms.namedItem(formName)
	const elements: SettingsFormElements = form.elements as SettingsFormElements
	const arrayOfElements: HTMLInputElementWithInitialValue[] = Array.from(elements) as HTMLInputElementWithInitialValue[]
	setInitialValue(arrayOfElements)
	const submitButton = arrayOfElements.find(el => el.type === 'submit')

	const setElementValidator = initValidator(arrayOfElements, submitButton)

	// Email validation
	const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
	setElementValidator(elements.email, emailRegex)

	// First name validation
	const firstnameRegex = /^[a-zа-я ,.'-]+$/i
	setElementValidator(elements.firstname, firstnameRegex)

	// Last name validation
	const lastnameRegex = firstnameRegex
	setElementValidator(elements.lastname, lastnameRegex)

	// Phone validation
	const phoneRegex = /^\d*$/
	setElementValidator(elements.phone, phoneRegex)

	// Country and city
	const countryRegex = /.*/
	setElementValidator(elements.country, countryRegex)
	setElementValidator(elements.city, countryRegex)

	form.addEventListener('submit', async event => {
		event.preventDefault()
		submitButton.disabled = true
		const XHR = new XMLHttpRequest()
		const data = new FormData(form)

		XHR.addEventListener('load', (e) => {
			notification('Saved', 'success', 5000)
			setInitialValue(arrayOfElements)
			submitButton.disabled = true
		})

		XHR.addEventListener('error', (e) => {
			notification('Error. Try again', 'error', 5000)
			submitButton.disabled = false
			console.error(e)
		})

		XHR.open('POST', 'https://httpbin.org/post')
		XHR.setRequestHeader('Content-Type', 'multipart/form-data')

		XHR.send(data)
	})
}
