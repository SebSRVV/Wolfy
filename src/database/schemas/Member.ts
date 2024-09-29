import { PetRoles } from "@/src/enums";
import { Schema, model } from "mongoose";

export enum MemberRanks {
	Novice = "novice",
	Train = "trainer",
	Master = "master"
}

export interface IMember {
	discord: {
		id: string;
		username: string;
	};
	money: {
		economy: {
			amount: number; 
			reason: string;
			date: Date;// stars
		}[];
		food: {
			amount: number; // Cinammons
			reason: string;
			date: Date;
		}[];
	};
	logs: {
		reason: string;
		date: Date;
		by: string;
	}[];
	rank: MemberRanks;
	hide: boolean;
	createdAt: Date;
	updatedAt: Date;
}

const modelo: Schema<IMember> = new Schema(
	{
		discord: {
			id: { type: String, required: true },
			username: { type: String, required: true },
		},
		money: {
			available: [
				{
					amount: { type: Number, required: true },
					reason: { type: String, required: true },
					order: { type: String, required: false },
					tip: { type: Boolean, required: false },
					date: { type: Date, required: true }
				}
			],
			hold: [
				{
					amount: { type: Number, required: true },
					reason: { type: String, required: true },
					order: { type: String, required: false },
					tip: { type: Boolean, required: false },
					date: { type: Date, required: true }
				}
			]
		},
		rank: { type: String, enum: Object.values(MemberRanks), required: true, default: MemberRanks.Novice },
		hide: { type: Boolean, required: true, default: false }
	},
	{
		timestamps: true,
		versionKey: false
	}
);

export default model("members", modelo);
