interface HTMLInputElementWithInitialValue extends HTMLInputElement {
	initialValue: string
}

function setInitialValue(array: HTMLInputElementWithInitialValue[]) {
	array.forEach(el => el.initialValue = el.value)
}

export {HTMLInputElementWithInitialValue, setInitialValue}
