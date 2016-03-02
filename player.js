
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

  isSuited: function(suitA, suitB) {
    return suitA === suitB;
  },

  initGlobals: function(gamestate) {
    // TODO
  },

  bet: function (gamestate, bet) {

    this.initGlobals(gamestate);

    var allInAmount = 10000000;
    var me = gamestate.me;

    var myCards = gamestate.players[me].cards;
    var firstCard = myCards[0].rank;
    var firstSuit = myCards[0].type;
    var secondCard = myCards[1].rank;
    var secondSuit = myCards[1].type;
    var pot = gamestate.pot;
    var call = gamestate.callAmount;

    // Vado allin con una coppia >= Q, altra coppia bet * 3
    if(this.isCouple(firstCard, secondCard)) {
      if(this.betterThanOrEqual(this.cardToNumber(firstCard), '12'))
        return bet(allInAmount);

      return bet(call * 3);
    }

    // Vado allin con AssoKappa
    if(this.isAssoKappa(firstCard, secondCard)) {
      return bet(allInAmount);
    }

    // Bet * 3 con connector-suited > JQ
    // Call con connector-suited inferiori
    if(this.isConnected(this.cardToNumber(firstCard), this.cardToNumber(secondCard)) && this.isSuited(firstSuit, secondSuit)) {
      if(this.betterThanOrEqual(this.max(firstCard, secondCard), '12'))
        return bet(call * 3);

      return bet(call);
    }

    // CheckOrFold tutto il resto
    return bet(0);
  }

};


