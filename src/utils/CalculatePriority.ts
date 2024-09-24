import { PriorityUpgrade, RankRoles } from "../enums";

const RankPrecedence = {
	Master: 3, // Highest
	Trainer: 2, // Lowest
	Novice: 1 //default
} as any;

export function rankHigher(rank1: any, rank2: any): PriorityUpgrade {
	const rank1Precedence = RankPrecedence[rank1];
	const rank2Precedence = RankPrecedence[rank2];

	if (rank2 === "Novice") {
		return PriorityUpgrade.Neutral;
	} else if (rank1Precedence > rank2Precedence) {
		return PriorityUpgrade.Upgrade;
	} else if (rank1Precedence < rank2Precedence) {
		return PriorityUpgrade.Downgrade;
	}

	return PriorityUpgrade.Downgrade;
}
