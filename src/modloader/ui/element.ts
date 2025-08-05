export function createElement<T extends keyof HTMLElementTagNameMap>(
	tag: T,
	id?: string,
	classes?: string[],
	innerText?: string
): HTMLElementTagNameMap[T] {
	const element = document.createElement(tag)
	if (id) element.id = id
	if (classes) element.classList.add(...classes)
	if (innerText) element.innerText = innerText
	return element
}
