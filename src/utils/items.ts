export const shopItems = [
    // Cascos
    {
        id: 1,
        name: "Casco de Hierro",
        description: "Un casco resistente hecho de hierro.",
        effect: "Aumenta +20 de vida y +10 de escudo.",
        rarity: "common",
        stats: {
            health: 20,
            shield: 10,
        },
        type: "helmet",
        price: 200,
    },
    {
        id: 2,
        name: "Casco de Dragón",
        description: "Un casco forjado con las escamas de un dragón.",
        effect: "Aumenta +50 de vida y +20 de escudo.",
        rarity: "epic",
        stats: {
            health: 50,
            shield: 20,
        },
        type: "helmet",
        price: 1000,
    },

    // Capas
    {
        id: 3,
        name: "Capa de Aventurero",
        description: "Una capa ligera para exploradores.",
        effect: "Aumenta +5 de agilidad.",
        rarity: "common",
        stats: {
            agility: 5,
        },
        type: "cape",
        price: 150,
    },
    {
        id: 4,
        name: "Capa de Luz",
        description: "Una capa brillante que aumenta la velocidad.",
        effect: "Aumenta +20 de agilidad.",
        rarity: "rare",
        stats: {
            agility: 20,
        },
        type: "cape",
        price: 600,
    },

    // Pecheras
    {
        id: 5,
        name: "Pechera de Cuero",
        description: "Una pechera básica de cuero.",
        effect: "Aumenta +10 de vida y +5 de defensa.",
        rarity: "common",
        stats: {
            health: 10,
            shield: 5,
        },
        type: "chestplate",
        price: 300,
    },
    {
        id: 6,
        name: "Pechera de Dragón",
        description: "Una pechera impenetrable hecha de escamas de dragón.",
        effect: "Aumenta +50 de vida y +30 de defensa.",
        rarity: "epic",
        stats: {
            health: 50,
            shield: 30,
        },
        type: "chestplate",
        price: 1500,
    },

    // Botas
    {
        id: 7,
        name: "Botas de Explorador",
        description: "Botas cómodas para largas caminatas.",
        effect: "Aumenta +10 de agilidad.",
        rarity: "common",
        stats: {
            agility: 10,
        },
        type: "boots",
        price: 200,
    },
    {
        id: 8,
        name: "Botas Celestiales",
        description: "Botas mágicas que aumentan la velocidad y precisión.",
        effect: "Aumenta +25 de agilidad y +10% probabilidad crítica.",
        rarity: "legendary",
        stats: {
            agility: 25,
            critChance: 10,
        },
        type: "boots",
        price: 1800,
    },

    // Armas
    {
        id: 9,
        name: "Espada de Hierro",
        description: "Una espada básica pero efectiva.",
        effect: "Aumenta +15 de ataque.",
        rarity: "common",
        stats: {
            attack: 15,
        },
        type: "weapon",
        price: 300,
    },
    {
        id: 10,
        name: "Espada de Fuego",
        description: "Una espada ardiente que inflige gran daño.",
        effect: "Aumenta +30 de ataque y +10% daño crítico.",
        rarity: "legendary",
        stats: {
            attack: 30,
            critDamage: 10,
        },
        type: "weapon",
        price: 2000,
    },
    {
        id: 11,
        name: "Arco de Cazador",
        description: "Un arco diseñado para precisión letal.",
        effect: "Aumenta +20 de ataque y +5% probabilidad crítica.",
        rarity: "rare",
        stats: {
            attack: 20,
            critChance: 5,
        },
        type: "weapon",
        price: 1200,
    },
    {
        id: 12,
        name: "Guadaña del Destino",
        description: "Un arma mística con gran poder destructivo.",
        effect: "Aumenta +50 de ataque y +15% daño crítico.",
        rarity: "epic",
        stats: {
            attack: 50,
            critDamage: 15,
        },
        type: "weapon",
        price: 2500,
    },
];
