export default class CustomError extends Error {
	public status: number | string;

	constructor(message: string, status: number | string = 500) {
		super(message);
		this.status = status;
	}
}
