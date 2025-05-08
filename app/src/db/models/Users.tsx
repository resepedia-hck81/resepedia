import { Model, IMongoloquentSchema, IMongoloquentTimestamps } from "mongoloquent";
import CustomError from "../exeptions/customError";

interface IUser extends IMongoloquentSchema, IMongoloquentTimestamps {
	email: string;
	username: string;
	password: string;
	isPremium: boolean;
	tokenCount: number;
}

export default class User extends Model<IUser> {
	/**
	 * The attributes of the model.
	 *
	 * @var IUser
	 */
	static $schema: IUser;

	/**
	 * The collection associated with the model.
	 *
	 * @var string
	 */
	static $collection: string = "users";

	async payToken() {
		if (this.isPremium) return;
		if (this.tokenCount === 0) throw new CustomError("No tokens left", 400);
		this.tokenCount--;
		await this.save();
	}
}
