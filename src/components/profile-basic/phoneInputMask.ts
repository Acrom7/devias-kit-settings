function setPhoneInputMask(element: HTMLInputElement) {
	element.addEventListener('input', () => {
		const input = element.value.replace(/\D/g, '')
		element.value = (element.value[0] === '+' || input.length !== 0 ? '+' : '') + input.slice(0, 15)
	})
}

export {setPhoneInputMask}
