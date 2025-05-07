export const toPascalCase = (str: string): string => {
	return str
		.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
			return index === 0 ? word.toUpperCase() : word.toUpperCase();
		})
		.replace(/\s+/g, "");
};
