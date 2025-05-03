import { Type } from "@google/genai";

export const schema = {
	type: Type.OBJECT,
	required: ["recipes", "ingredients"],
	properties: {
		recipes: {
			type: Type.ARRAY,
			items: {
				type: Type.OBJECT,
				required: ["name", "ingredients", "instructions", "region"],
				properties: {
					name: {
						type: Type.STRING,
					},
					ingredients: {
						type: Type.ARRAY,
						items: {
							type: Type.OBJECT,
							required: ["name", "measurement"],
							properties: {
								name: {
									type: Type.STRING,
								},
								measurement: {
									type: Type.STRING,
								},
							},
						},
					},
					instructions: {
						type: Type.ARRAY,
						items: {
							type: Type.STRING,
						},
					},
					region: {
						type: Type.STRING,
					},
				},
			},
		},
		ingredients: {
			type: Type.ARRAY,
			items: {
				type: Type.STRING,
			},
		},
	},
};
