// Monopoly Ultimate Banking - Complete Game Data

const PLAYERS = [
  { id: 1, name: "Red Car", emoji: "🚗", color: "#e63946" },
  { id: 2, name: "Blue Boat", emoji: "⛵", color: "#1d3557" },
  { id: 3, name: "White Jet", emoji: "✈️", color: "#f1faee" },
  { id: 4, name: "Green Helicopter", emoji: "🚁", color: "#2a9d8f" }
];

const PROPERTIES = [
  { id: 1, name: "Shillong", number: 1, color: "brown", rents: [70, 130, 220, 370, 750], price: 375 },
  { id: 2, name: "Bhubaneswar", number: 2, color: "brown", rents: [70, 130, 220, 370, 750], price: 375 },
  { id: 3, name: "Ranchi", number: 3, color: "lightblue", rents: [80, 140, 240, 410, 800], price: 400 },
  { id: 4, name: "Srinagar", number: 4, color: "lightblue", rents: [80, 140, 240, 410, 800], price: 400 },
  { id: 5, name: "Shimla", number: 5, color: "lightblue", rents: [100, 160, 260, 440, 860], price: 430 },
  { id: 6, name: "Patna", number: 6, color: "pink", rents: [110, 180, 290, 460, 900], price: 450 },
  { id: 7, name: "Panaji", number: 7, color: "pink", rents: [110, 180, 290, 460, 900], price: 450 },
  { id: 8, name: "Haridwar", number: 8, color: "pink", rents: [130, 200, 310, 490, 980], price: 490 },
  { id: 9, name: "Guwahati", number: 9, color: "orange", rents: [140, 210, 330, 520, 1000], price: 500 },
  { id: 10, name: "Jaipur", number: 10, color: "orange", rents: [140, 210, 330, 520, 1000], price: 500 },
  { id: 11, name: "Bhopal", number: 11, color: "orange", rents: [160, 230, 350, 550, 1100], price: 550 },
  { id: 12, name: "Chandigarh", number: 12, color: "red", rents: [170, 250, 380, 580, 1160], price: 580 },
  { id: 13, name: "Kochi", number: 13, color: "red", rents: [170, 250, 380, 580, 1160], price: 580 },
  { id: 14, name: "Ahmedabad", number: 14, color: "red", rents: [190, 270, 400, 610, 1200], price: 600 },
  { id: 15, name: "Lucknow", number: 15, color: "yellow", rents: [200, 280, 420, 640, 1300], price: 650 },
  { id: 16, name: "Gurugram", number: 16, color: "yellow", rents: [200, 280, 420, 640, 1300], price: 650 },
  { id: 17, name: "Hyderabad", number: 17, color: "yellow", rents: [220, 300, 440, 670, 1340], price: 670 },
  { id: 18, name: "Kolkata", number: 18, color: "green", rents: [230, 320, 460, 700, 1400], price: 700 },
  { id: 19, name: "Chennai", number: 19, color: "green", rents: [230, 320, 460, 700, 1400], price: 700 },
  { id: 20, name: "Delhi", number: 20, color: "green", rents: [250, 340, 480, 730, 1440], price: 720 },
  { id: 21, name: "Bengaluru", number: 21, color: "blue", rents: [270, 360, 510, 740, 1500], price: 750 },
  { id: 22, name: "Mumbai", number: 22, color: "blue", rents: [300, 400, 560, 810, 1600], price: 800 }
];

const EVENT_CARDS = [
  {
    id: 1,
    name: "Highway Tax",
    description: "Your roads need repairs!",
    action: "pay_per_property",
    amount: 50,
    instruction: "Tap this card then your Bank card to pay ₹50 per property you own."
  },
  {
    id: 2,
    name: "Traffic Jam",
    description: "Faulty traffic lights get the street in a jam!",
    action: "move_to_free_parking",
    instruction: "Tap this card and all players move directly to Free Parking. Do not pass GO! If you are in Jail, stay there!"
  },
  {
    id: 3,
    name: "Neighbour Trouble",
    description: "Your pet dog poops at your neighbour's doorstep!",
    action: "reset_rent_to_1",
    instruction: "Tap this card then any property card. (Rent level resets to 1)"
  },
  {
    id: 4,
    name: "Love is in the Air",
    description: "Meet someone special right up your street!",
    action: "both_collect_200",
    instruction: "Pick another player. Tap this card then both your Bank cards to collect ₹200."
  },
  {
    id: 5,
    name: "Grand Designs",
    description: "One of your properties gets a TV makeover!",
    action: "jump_to_level_5",
    instruction: "Tap this card then one of your property cards. (Rent level jumps to 5)"
  },
  {
    id: 6,
    name: "Cyclone Alert",
    description: "Hey, where did the roof go?",
    action: "reset_rent_to_1",
    instruction: "Tap this card then any property card. (Rent level resets to 1)"
  },
  {
    id: 7,
    name: "Demolished",
    description: "Your builders get the wrong address!",
    action: "reset_rent_to_1",
    instruction: "Tap this card then any property card. (Rent level resets to 1)"
  },
  {
    id: 8,
    name: "On the Map",
    description: "The new railway station gets the go-ahead!",
    action: "increase_rent_1",
    instruction: "Tap this card then one of your property cards. (Colour rent level jumps +1)"
  },
  {
    id: 9,
    name: "Deal of the Week",
    description: "Word on the street says the market is booming!",
    action: "buy_or_increase",
    instruction: "Move to any property space. Tap this card then the property card to buy it, auction it or raise rent level +1."
  },
  {
    id: 10,
    name: "Rain and Storm",
    description: "Heavy rain shuts down the roads!",
    action: "level_1_rent_only",
    instruction: "Tap this card. (Players pay level 1 rent only for the next two rent payments)"
  },
  {
    id: 11,
    name: "What a Ride!",
    description: "Your local theme park builds the world's craziest roller-coaster!",
    action: "side_increase_1",
    instruction: "Tap this card then one of your property cards. (Rent level jumps +1 for that side of the board)"
  },
  {
    id: 12,
    name: "Crime Down",
    description: "Police arrest local newspaper thief!",
    action: "color_increase_1",
    instruction: "Tap this card then one of your property cards. (Colour set rent level jumps +1)"
  },
  {
    id: 13,
    name: "'Tis the Season",
    description: "You've caught that nasty cough going around!",
    action: "color_decrease_1",
    instruction: "Tap this card then one of your property cards. (Colour set rent level drops -1)"
  },
  {
    id: 14,
    name: "Haunted House",
    description: "Something strange is going on! Swap another player's property with one of yours.",
    action: "swap_properties",
    instruction: "Pick another player. Tap this card then you each tap one of your property cards to swap. Exchange cards too!"
  },
  {
    id: 15,
    name: "Squeaky Clean",
    description: "Organise a local cleanliness initiative",
    action: "both_collect_200",
    instruction: "Pick another player. Tap this card then both your Bank cards to collect ₹200."
  },
  {
    id: 16,
    name: "Stargazing",
    description: "The hottest A-list celebrity moves in next door!",
    action: "color_increase_1",
    instruction: "Tap this card then one of your property cards. (Colour rent level jumps +1)"
  },
  {
    id: 17,
    name: "Stop the Presses",
    description: "Get the lowdown on a hot property!",
    action: "buy_or_increase",
    instruction: "Move to any property space. Tap this card then the property card to buy it, auction it or raise rent level +1."
  },
  {
    id: 18,
    name: "House Party",
    description: "The good times go on till late!",
    action: "you_up_neighbors_down",
    instruction: "Tap this card then one of your property cards. (Rent level jumps to +1 for you; drops -1 for your neighbours)"
  },
  {
    id: 19,
    name: "Pick Your Own",
    description: "Catch someone stealing your prize tomatoes!",
    action: "send_to_jail",
    instruction: "Tap this card and send another player to Jail."
  },
  {
    id: 20,
    name: "Ew! It Stinks!",
    description: "The local drainage springs a leak!",
    action: "side_decrease_1",
    instruction: "Tap this card then one of your property cards. (Rent level drops -1 for that side of the board)"
  },
  {
    id: 21,
    name: "It's a Boy!",
    description: "Your new arrival wakes up the whole street!",
    action: "you_up_neighbors_down",
    instruction: "Tap this card then one of your property cards. (Rent level jumps to +1 for you; drops -1 for your neighbours)"
  },
  {
    id: 22,
    name: "In the Money",
    description: "Spend your lottery millions! Swap another player's property with one of yours.",
    action: "swap_properties",
    instruction: "Pick another player. Tap this card then you each tap one of your property cards to swap. Exchange cards too!"
  },
  {
    id: 23,
    name: "Boom Town",
    description: "Property prices bounce back!",
    action: "buy_or_increase",
    instruction: "Move to any property space. Tap this card then the property card to buy it, auction it or raise rent level +1."
  }
];

const COLOR_GROUPS = {
  brown: { name: "Brown", properties: [1, 2] },
  lightblue: { name: "Light Blue", properties: [3, 4, 5] },
  pink: { name: "Pink", properties: [6, 7, 8] },
  orange: { name: "Orange", properties: [9, 10, 11] },
  red: { name: "Red", properties: [12, 13, 14] },
  yellow: { name: "Yellow", properties: [15, 16, 17] },
  green: { name: "Green", properties: [18, 19, 20] },
  blue: { name: "Blue", properties: [21, 22] }
};

const GAME_RULES = {
  startingBalance: 1500,
  passGoBonus: 200,
  sellMultiplier: 0.5
};

export { PLAYERS, PROPERTIES, EVENT_CARDS, COLOR_GROUPS, GAME_RULES };
