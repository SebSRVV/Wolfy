import { PetAnimal, PetRoles } from "@/src/enums";
import { Schema, model } from "mongoose";
import { MemberRanks } from "./Member";

export enum PetStatus {
	Happy = "happy",
	Hungry = "hungry",
	Tired = "tired",
	Sick = "sick",
	Excited = "excited",
	Sad = "sad",
	Curious = "curious",
	Protective = "protective",
	Scared = "scared",
	Playful = "playful",
	Lost = "lost",
	Death = "death",
	Alive = "alive"
}

export enum PetOwners {
	Seb = "268439328307281920"
}

export enum PetAccesories {
	Lentes = "lentes",
	Capa = "capa",
	Sombrero = "sombrero",
	None = "ninguno"
}

export enum PetRanks {
	Celestial = "Celestial Guardian",
	Ancient = "Ancient Soul",
	Howling = "Howling Heart",
	Star = "Starshine"
}

export interface IPet {
	nombre: string;
	status: PetStatus;
	animal: PetAnimal;
	alias?: string;
	custom: PetAccesories;
	discord: {
		members: {
			id: string;
			percentage: number;
			date: Date;
			active: boolean;
		}[];
		channel: string;
		message: string;
	};
	photos?: {
		start: string | null;
		before: string | null;
		after: string | null;
	};
	initialRank: PetRanks;
	finalRank: PetRanks;
	starving?: {
		active: boolean;
		startedAt: Date | null;
		endedAt: Date | null;
	};
	mascot: {
		puuid?: string;
		alias?: string;
		animal?: PetAnimal;  // Cambiado a PetAnimal
		mmr: {
			match_id: string;
			win: boolean;
			points: number;
			date: Date;
		}[];
		user?: string;
		password?: string;
	};
	owner: PetOwners;
	stars: number;  // stars
	food: number;  // cinamon
	Animals: PetAnimal[];
	alive: boolean;  // Se mantiene como boolean
	createdAt: Date;
	updatedAt: Date;
}

const modelo: Schema<IPet> = new Schema(
	{
		nombre: {
			type: String,
			required: true
		},
		status: {
			type: String,
			enum: Object.values(PetStatus),
			required: true
		},
		alias: {
			type: String
		},
		custom: {
			type: String,
			enum: Object.values(PetAccesories),
			default: PetAccesories.None
		},
		discord: {
			members: {
				type: [
					{
						id: {
							type: String
						},
						percentage: {
							type: Number
						},
						date: {
							type: Date
						},
						active: {
							type: Boolean
						}
					}
				]
			},
			channel: {
				type: String,
				required: true
			},
			message: {
				type: String,
				required: true
			}
		},
		photos: {
			start: {
				type: String,
				required: false
			},
			before: {
				type: String,
				required: false
			},
			after: {
				type: String,
				required: false
			}
		},
		initialRank: {
			type: String,
			enum: Object.values(PetRanks),
			required: true
		},
		finalRank: {
			type: String,
			enum: Object.values(PetRanks),
			required: false
		},
		alive: {
			type: Boolean,  // Cambiado a booleano para que coincida con la interfaz
			required: true
		},
		mascot: {
			puuid: {
				type: String,
				required: false
			},
			animal: {
				type: String,
				enum: Object.values(PetAnimal),  // Cambiado a PetAnimal
				required: true
			},
			mmr: {
				type: [
					{
						match_id: {
							type: String
						},
						win: {
							type: Boolean
						},
						points: {
							type: Number
						},
						date: {
							type: Date
						}
					}
				],
				required: false
			},
			user: {
				type: String,
				required: false
			},
			password: {
				type: String,
				required: false
			}
		},
		owner: {
			type: String,
			enum: Object.values(PetOwners),
			required: true
		},
		stars: {
			type: Number,
			required: true
		},
		food: {
			type: Number,
			required: true
		},
		Animals: {
			type: [
				{
					type: String,
					enum: Object.values(PetAnimal)
				}
			],
			required: true
		},
		createdAt: {
			type: Date,
			default: Date.now
		},
		updatedAt: {
			type: Date,
			default: Date.now
		}
	}
);

export default model("pets", modelo);
