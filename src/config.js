export const stationsPerRound = 4;
export const bonusStationsMultiplier = 5; // After given days finished the generated stations number is increased by 1!
export const areaWidth = 80;
export const areaHeight = 80;
export const cut = 15; 
export const pace = 12; //12
export const roundStartDelay = 4; //4
export const STARTING_HEAT_TIMER = 60;

export const TRAIN_LIMIT_PER_LINE_SECTION = 10; //10

export const placeIndicators = [
    "Square", "Park", "Churchyard", "Street", "Riverside",
    "Alley", "Gardens", "Way", "Canal", "Beach", "Point", 
    "Station", "Centre", "Wall", "P+R", "Statue", "Bank",
    "Mall", "Plaza", "Cementry", "Lane", "Tower", "Church",
    "City Centre", "School", "University", "Stadium", "Market",
    "New Estate", "International Airport", "Bathhouse", "Pool"
];

export const placeHolderNames = [
    "Blue", "Black", "Red", "Rose", "Gold", "Charlotte", "Anne", "Peter", "Maria", "Kovach", "Andreas",
    "La Fayette", "Gilbert", "Motier", "Elizabeth", "Mary", "Jane", "Magdalene", "Blaha", 
];

export const trainColor = {
    yellow: "#FAFA00",
}

export const trainDeleteColor = {
    yellow: "#FAFA3C",
}


//DEFAULT VALUES OF PASSENGER MARGINS
export const lPassengerMarginOnTrain = [
    {
        left: 0.5,
        top: 0.25,
    },
    {
        left: 0.5,
        top: 5.75,
    },
    {
        left: 5.5,
        top: 0.25,
    },
    {
        left: 5.5,
        top: 5.75,
    },
    {
        left: 10.5,
        top: 0.25,
    },
    {
        left: 10.5,
        top: 5.75,
    },
    {
        left: 15.5,
        top: 0.25,
    },
    {
        left: 15.5,
        top: 5.75,
    }
];
export const lImpatientPassengerMargin = [
    {
        top: -2,
    },
    {
        top: -1.75,
    },
    {
        top: -1.5,
    },
    {
        top: -1.25,
    },
    {
        top: -1.5,
    },
    {
        top: -1.25,
    },
    {
        top: -1,
    },
    {
        top: -0.75,
    },
    {
        top: -0.5,
    },
    {
        top: -0.25,
    },
    {
        top: 0,
    }
]