function initHamburger(offcanvasId: string): void {
	const button: HTMLElement = document.getElementById('hamburger-button')
	const offcanvas: HTMLElement = document.getElementById(offcanvasId)

	button.setAttribute('data-uk-toggle', `target: #${offcanvasId}`)

	button.addEventListener('click', () => {
		button.classList.toggle('opened')
	})
	offcanvas.addEventListener('beforehide', () => {
		button.classList.remove('opened')
	})
}

export default initHamburger
