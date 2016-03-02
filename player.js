exports = module.exports = {

    VERSION: 'Superstar poker player',

    isCouple: function(a, b) {
        return a === b;
    },

    isAssoKappa : function(a, b) {
        return ( (a === 'A') && (b === 'K') ) || ( (a === 'K') && (b === 'A') )
    },

    cardToNumber: function(cardRank) {
        if( parseInt(cardRank).toString() != "NaN" ) {
            return cardRank;
        }

        if(cardRank === 'J') return '11';
        if(cardRank === 'Q') return '12';
        if(cardRank === 'K') return '13';
        if(cardRank === 'A') return '14';
    },

    betterThanOrEqual : function(card, value) {
        return parseInt(card) >= parseInt(value);
    },

    isConnected : function(a, b) {

        var cardA = parseInt(a);
        var cardB = parseInt(b);

        return (cardA+1 === cardB) || cardB+1 === cardA;
    },

    max : function(a, b) {
        var cardA = parseInt(a);
        var cardB = parseInt(b);

        return (cardA >= cardB) ? cardA : cardB;
    },

    isPreFlop : function() {
        return true;
    },

    isFlop : function() {
        return this.globals.commonCards.length === 3;
    },

    isTurn : function() {
        return this.globals.commonCards.lenght === 4;
    },

    isRiver : function() {
        return this.globals.commonCards.lenght === 5;
    },

    isSuited: function(suitA, suitB) {
        return suitA === suitB;
    },


    globals : {
        allInAmount : Infinity,
        me : "",
        myCards : "",
        firstCard : "",
        firstSuit : "",
        secondCard : "",
        secondSuit : "",
        pot : "",
        commonCards : "",
        call : ""
    },

    initGlobals : function(gamestate) {
        this.globals.me = gamestate.me;
        this.globals.myCards = gamestate.players[this.globals.me].cards;
        this.globals.firstCard = this.globals.myCards.myCards[0].rank;
        this.globals.firstSuit = this.globals.myCards.myCards[0].type;
        this.globals.secondCard = this.globals.myCards.myCards[1].rank;
        this.globals.secondSuit = this.globals.myCards.myCards[1].type;
        this.globals.pot = gamestate.pot;
        this.globals.call = gamestate.callAmount;
        this.globals.commonCards = gamestate.commonCards;
        this.globals.allInAmount = Infinity;
    },

    bet: function (gamestate, bet) {

        this.initGlobals(gamestate);

        if(this.isPreFlop()) {
            return bet(this.preflopBet());
        }


    },

    preflopBet : function() {
        // Vado allin con una coppia >= Q, altra coppia bet * 3
        if(this.isCouple(this.globals.firstCard, this.globals.secondCard)) {
            if(this.betterThanOrEqual(this.cardToNumber(this.globals.firstCard), '12'))
                return return this.globals.allInAmount;

            return this.globals.call * 3;
        }

        // Vado allin con AssoKappa
        if(this.isAssoKappa(this.globals.firstCard, this.globals.secondCard)) {
            return this.globals.call * 3;
        }

        // Bet * 3 con connector-suited > JQ
        // Call con connector-suited inferiori
        if(this.isConnected(this.cardToNumber(this.globals.firstCard), this.cardToNumber(this.globals.secondCard)) && this.isSuited(this.globals.firstSuit, this.globals.secondSuit)) {
            if(this.betterThanOrEqual(this.max(this.globals.firstCard, this.globals.secondCard), '12'))
                return this.globals.call * 3;
        }

        // CheckOrFold tutto il resto
        return 0;
    }

};


