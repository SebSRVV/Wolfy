import { PriorityUpgrade, RankRoles } from "../enums";

const RankPrecedence = {
	Master: 3, // Highest
	Trainer: 2,
	Novice: 1 // Lowest
} as const;

export function rankHigher(rank1: keyof typeof RankPrecedence, rank2: keyof typeof RankPrecedence): PriorityUpgrade {
	const rank1Precedence = RankPrecedence[rank1];
	const rank2Precedence = RankPrecedence[rank2];

	if (rank1Precedence > rank2Precedence) {
		return PriorityUpgrade.Upgrade; // rank1 es superior a rank2
	} else if (rank1Precedence < rank2Precedence) {
		return PriorityUpgrade.Downgrade; // rank1 es inferior a rank2
	}

	return PriorityUpgrade.Neutral; // son iguales
}
