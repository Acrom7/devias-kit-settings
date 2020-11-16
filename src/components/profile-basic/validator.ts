import {HTMLInputElementWithInitialValue} from './initialValue'

const errorClassList = 'text-field_error'

function removeError(element: HTMLInputElement) {
	element.classList.remove(errorClassList)
}

function addError(element: HTMLInputElement) {
	element.classList.add(errorClassList)
}

function setElementValidity(element: HTMLInputElement, validity: boolean) {
	if (validity) {
		removeError(element)
	} else {
		addError(element)
	}
}

function validateFormElements(elements: HTMLInputElement[]): boolean {
	return elements.every(input => !input.classList.contains(errorClassList))
}

function checkFormValidity(elements: HTMLInputElementWithInitialValue[], submitButton: HTMLInputElement) {
	const someElementChange = elements.some(input => input.initialValue !== input.value)
	submitButton.disabled = !(validateFormElements(elements) && someElementChange)
}

function initValidator(elements: HTMLInputElementWithInitialValue[], submitButton: HTMLInputElement) {
	return (element: HTMLInputElement, regex: RegExp) => {
		element.addEventListener('blur', () => {
			setElementValidity(element, regex.test(element.value))
			checkFormValidity(elements, submitButton)
		})
		element.addEventListener('focus', () => {
			removeError(element)
		})
	}
}

export {initValidator}
