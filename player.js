exports = module.exports = {

    VERSION: 'Superstar poker player',

    isCouple: function(a, b) {
        return a === b;
    },

    commonCardsOccurency : function(a) {
        var occurencyCount = 0;

        for(var i = 0; i < this.globals.commonCards.length; i++) {
            if(a === this.globals.commonCards[i].rank) {
                occurencyCount ++;
            }
        }

        return occurencyCount;
    },

    haveCouple : function() {

    },

    isTris: function() {
        if( this.isCouple(this.globals.firstCard, this.globals.secondCard) && this.commonCardsOccurency(this.globals.firstCard) >= 1) {
            return true;
        }

        if(this.commonCardsOccurency(this.globals.firstCard >= 2)) {
            return true;
        }

        if(this.commonCardsOccurency(this.globals.secondCard >= 2)) {
            return true;
        }

        return false;
    },

    isPoker: function() {
        if( this.isCouple(this.globals.firstCard, this.globals.secondCard) && this.commonCardsOccurency(this.globals.firstCard) >= 2) {
            return true;
        }

        if(this.commonCardsOccurency(this.globals.firstCard >= 3)) {
            return true;
        }

        if(this.commonCardsOccurency(this.globals.secondCard >= 3)) {
            return true;
        }

        return false;
    },

    suitOccurrencyCount : function(a) {
        var occurencyCount = 0;

        for(var i = 0; i < this.globals.commonCards.length; i++) {
            if(a === this.globals.commonCards[i].type) {
                occurencyCount ++;
            }
        }

        return occurencyCount;
    },

    isFlush : function() {
        var isFlush = false;

        if(this.isSuited(this.globals.firstSuit, this.globals.secondSuit) && this.suitOccurrencyCount(this.globals.firstSuit) >= 2) {
            return true;
        }

        if(this.suitOccurrencyCount(this.globals.secondSuit) >= 3) {
            return true;
        }

        if(this.suitOccurrencyCount(this.globals.firstSuit) >= 3) {
            return true;
        }

        return isFlush;
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
        return this.globals.commonCards.length < 3;
    },

    isFlop : function() {
        return this.globals.commonCards.length >= 3;
    },

    isTurn : function() {
        return this.globals.commonCards.length === 4;
    },

    isRiver : function() {
        return this.globals.commonCards.length === 5;
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
        call : "",
        sb : ""
    },

    initGlobals : function(gamestate) {
        this.globals.sb = gamestate.sb;
        this.globals.me = gamestate.me;
        this.globals.myCards = gamestate.players[this.globals.me].cards;
        this.globals.firstCard = this.globals.myCards.myCards[0].rank;
        this.globals.firstSuit = this.globals.myCards.myCards[0].type;
        this.globals.secondCard = this.globals.myCards.myCards[1].rank;
        this.globals.secondSuit = this.globals.myCards.myCards[1].type;
        this.globals.pot = gamestate.pot;
        this.globals.callAmount = gamestate.callAmount;
        this.globals.betAmount = (this.globals.callAmount != 0) ? this.globals.callAmount : (this.globals.sb * 2);
        this.globals.commonCards = gamestate.commonCards;
        this.globals.allInAmount = Infinity;
    },

    bet: function (gamestate, bet) {

        this.initGlobals(gamestate);

        if(this.isPreFlop()) {
            return bet(this.preflopBet());
        }

        if(this.isFlop()) {
            return bet(this.flopBet());
        }
    },

    preflopBet : function() {
        // Vado allin con una coppia >= Q, altra coppia bet * 3
        if(this.isCouple(this.globals.firstCard, this.globals.secondCard)) {
            if(this.betterThanOrEqual(this.cardToNumber(this.globals.firstCard), '12'))
                return return this.globals.allInAmount;

            return this.globals.betAmount * 3;
        }

        // Vado allin con AssoKappa suit, *3 con assokappa semplice
        if(this.isAssoKappa(this.globals.firstCard, this.globals.secondCard)) {
            if(this.isSuited(this.globals.firstSuit, this.globals.secondSuit)) {
                return this.globals.allInAmount;
            }

            return this.globals.betAmount * 3;
        }

        // Bet * 3 con connector-suited > JQ
        // Call con connector-suited inferiori
        if(this.isConnected(this.cardToNumber(this.globals.firstCard), this.cardToNumber(this.globals.secondCard)) && this.isSuited(this.globals.firstSuit, this.globals.secondSuit)) {
            if(this.betterThanOrEqual(this.max(this.globals.firstCard, this.globals.secondCard), '12'))
                return this.globals.betAmount * 3;
        }

        if(this.isSuited(this.globals.firstSuit, this.globals.secondSuit)) {
            return this.globals.callAmount;
        }

        // CheckOrFold tutto il resto
        return 0;
    },

    flopBet : function() {
        //poker all in;
        if(this.isPoker()) {
            return this.globals.allInAmount;
        }
        //full all in;
        //colore all in
        if(this.isFlush()) {
            return this.globals.allInAmount;
        }

        // tris * 3
        if(this.isTris()) {
            return this.globals.betAmount * 3;
        }

        return this.globals.callAmount;
    }

};


