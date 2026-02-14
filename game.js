import { PLAYERS, PROPERTIES, EVENT_CARDS, COLOR_GROUPS, GAME_RULES } from './gameData.js';

// Game State
let gameState = {
    players: [],
    properties: {},
    selectedPlayers: [],
    currentCommand: null,
    transactionLog: []
};

// Initialize game state
function initializeGame() {
    PROPERTIES.forEach(prop => {
        gameState.properties[prop.id] = {
            ...prop,
            owner: null,
            rentLevel: 1
        };
    });
}

// Start game - show player setup
window.startGame = function() {
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('playerSetup').style.display = 'block';
};

// Select player count
window.selectPlayerCount = function(count) {
    document.querySelectorAll('.player-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.classList.add('selected');
    
    showPlayerSelection(count);
};

function showPlayerSelection(count) {
    const container = document.getElementById('playerCards');
    container.innerHTML = '';
    
    PLAYERS.forEach((player, index) => {
        const card = document.createElement('div');
        card.className = 'player-card';
        card.innerHTML = `
            <div class="player-emoji">${player.emoji}</div>
            <div>${player.name}</div>
        `;
        card.onclick = () => togglePlayer(player, card, count);
        container.appendChild(card);
    });
    
    document.getElementById('playerSelection').classList.remove('hidden');
}

function togglePlayer(player, card, maxCount) {
    const index = gameState.selectedPlayers.findIndex(p => p.id === player.id);
    
    if (index > -1) {
        gameState.selectedPlayers.splice(index, 1);
        card.classList.remove('selected');
    } else {
        if (gameState.selectedPlayers.length < maxCount) {
            gameState.selectedPlayers.push(player);
            card.classList.add('selected');
        } else {
            alert(`You can only select ${maxCount} players`);
        }
    }
}

// Confirm players and start game
window.confirmPlayers = function() {
    if (gameState.selectedPlayers.length < 2) {
        alert('Please select at least 2 players');
        return;
    }
    
    // Initialize players with starting balance
    gameState.players = gameState.selectedPlayers.map(p => ({
        ...p,
        balance: GAME_RULES.startingBalance
    }));
    
    initializeGame();
    showGameScreen();
};

function showGameScreen() {
    document.getElementById('playerSetup').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'block';
    updatePlayerBalances();
}

function updatePlayerBalances() {
    const container = document.getElementById('playerBalances');
    container.innerHTML = '';
    
    gameState.players.forEach(player => {
        const balanceCard = document.createElement('div');
        balanceCard.className = 'player-balance';
        balanceCard.style.borderLeftColor = player.color;
        balanceCard.innerHTML = `
            <h3>${player.emoji} ${player.name}</h3>
            <div class="balance-amount">₹${player.balance.toLocaleString()}</div>
        `;
        container.appendChild(balanceCard);
    });
}

// Command handlers
window.openCommand = function(commandNum) {
    gameState.currentCommand = commandNum;
    
    switch(commandNum) {
        case 1: checkBalance(); break;
        case 2: buyProperty(); break;
        case 3: payRent(); break;
        case 4: sellProperty(); break;
        case 5: passGO(); break;
        case 6: showProperties(); break;
        case 7: swapProperties(); break;
        case 8: adjustRentLevel(); break;
        case 9: resetGame(); break;
        case 10: otherTransaction(); break;
    }
};

// 1. Check Balance
function checkBalance() {
    showModal('Check Balance', 'Select a player to check balance');
    showPlayerScanner((player) => {
        alert(`${player.name} ${player.emoji}\nBalance: ₹${player.balance.toLocaleString()}`);
        closeModal();
    });
}

// 2. Buy Property
function buyProperty() {
    showModal('Buy Property', 'Select property to buy');
    showPropertyScanner((property) => {
        if (property.owner !== null) {
            alert('This property is already owned!');
            return;
        }
        
        showModal('Buy Property', 'Select player who is buying');
        showPlayerScanner((player) => {
            if (player.balance < property.price) {
                alert('Insufficient funds!');
                return;
            }
            
            // Deduct price
            const playerIndex = gameState.players.findIndex(p => p.id === player.id);
            gameState.players[playerIndex].balance -= property.price;
            
            // Assign ownership
            gameState.properties[property.id].owner = player.id;
            
            logTransaction(`${player.name} bought ${property.name} for ₹${property.price}`);
            updatePlayerBalances();
            closeModal();
        });
    });
}

// 3. Pay Rent
function payRent() {
    showModal('Pay Rent', 'Select property to pay rent for');
    showPropertyScanner((property) => {
        if (property.owner === null) {
            alert('This property has no owner!');
            return;
        }
        
        showModal('Pay Rent', 'Select player who is paying rent');
        showPlayerScanner((payer) => {
            const currentRent = property.rents[property.rentLevel - 1];
            const owner = gameState.players.find(p => p.id === property.owner);
            
            if (payer.id === property.owner) {
                // Landed on own property - increase rent level
                if (property.rentLevel < 5) {
                    gameState.properties[property.id].rentLevel++;
                    logTransaction(`${payer.name} landed on own property ${property.name}. Rent level increased to ${property.rentLevel}`);
                }
            } else {
                // Pay rent to owner
                if (payer.balance < currentRent) {
                    alert('Insufficient funds! Player is bankrupt.');
                    // Handle bankruptcy
                    handleBankruptcy(payer.id);
                    return;
                }
                
                const payerIndex = gameState.players.findIndex(p => p.id === payer.id);
                const ownerIndex = gameState.players.findIndex(p => p.id === owner.id);
                
                gameState.players[payerIndex].balance -= currentRent;
                gameState.players[ownerIndex].balance += currentRent;
                
                // Increase rent level after payment
                if (property.rentLevel < 5) {
                    gameState.properties[property.id].rentLevel++;
                }
                
                logTransaction(`${payer.name} paid ₹${currentRent} rent to ${owner.name} for ${property.name}. Rent level increased to ${property.rentLevel}`);
            }
            
            updatePlayerBalances();
            closeModal();
        });
    });
}

// 4. Sell Property
function sellProperty() {
    showModal('Sell Property', 'Select property to sell');
    showPropertyScanner((property) => {
        if (property.owner === null) {
            alert('This property has no owner!');
            return;
        }
        
        const sellPrice = Math.floor(property.price * GAME_RULES.sellMultiplier);
        const owner = gameState.players.find(p => p.id === property.owner);
        
        if (confirm(`Sell ${property.name} for ₹${sellPrice}?`)) {
            const ownerIndex = gameState.players.findIndex(p => p.id === property.owner);
            gameState.players[ownerIndex].balance += sellPrice;
            gameState.properties[property.id].owner = null;
            gameState.properties[property.id].rentLevel = 1;
            
            logTransaction(`${owner.name} sold ${property.name} for ₹${sellPrice}`);
            updatePlayerBalances();
            closeModal();
        }
    });
}

// 5. Pass GO
function passGO() {
    showModal('Pass GO', 'Select player who passed GO');
    showPlayerScanner((player) => {
        const playerIndex = gameState.players.findIndex(p => p.id === player.id);
        gameState.players[playerIndex].balance += GAME_RULES.passGoBonus;
        
        logTransaction(`${player.name} passed GO and collected ₹${GAME_RULES.passGoBonus}`);
        updatePlayerBalances();
        closeModal();
    });
}

// 6. Show Properties
function showProperties() {
    showModal('All Properties', '');
    
    let html = '<div class="property-grid">';
    
    PROPERTIES.forEach(prop => {
        const state = gameState.properties[prop.id];
        const owner = state.owner ? gameState.players.find(p => p.id === state.owner) : null;
        const currentRent = prop.rents[state.rentLevel - 1];
        
        html += `
            <div class="property-item" style="border-left-color: ${getColorCode(prop.color)}">
                <strong>#${prop.number} ${prop.name}</strong><br>
                <small>Price: ₹${prop.price}</small><br>
                <small>Current Rent: ₹${currentRent} (Level ${state.rentLevel})</small><br>
                ${owner ? `<small>Owner: ${owner.emoji} ${owner.name}</small>` : '<small style="color: #888">Unowned</small>'}
            </div>
        `;
    });
    
    html += '</div>';
    document.getElementById('modalBody').innerHTML += html;
}

// 7. Swap Properties
function swapProperties() {
    alert('Swap Properties: Select two properties to swap ownership');
    // This would need a more complex UI - simplified here
    showModal('Swap Properties', 'Feature coming soon - use manual adjustment for now');
}

// 8. Adjust Rent Level
function adjustRentLevel() {
    showModal('Adjust Rent Level', 'Select property to adjust');
    showPropertyScanner((property) => {
        const newLevel = prompt(`Current rent level: ${property.rentLevel}\nEnter new level (1-5):`, property.rentLevel);
        
        if (newLevel && newLevel >= 1 && newLevel <= 5) {
            gameState.properties[property.id].rentLevel = parseInt(newLevel);
            logTransaction(`Rent level for ${property.name} adjusted to ${newLevel}`);
            closeModal();
        }
    });
}

// 9. Reset Game
function resetGame() {
    if (confirm('Are you sure you want to reset the game? All progress will be lost.')) {
        location.reload();
    }
}

// 10. Other Transaction
function otherTransaction() {
    showModal('Other Transaction', `
        <div class="input-group">
            <label>Transaction Type:</label>
            <select id="transactionType">
                <option value="player_to_player">Player to Player</option>
                <option value="bank_to_player">Bank to Player (Credit)</option>
                <option value="player_to_bank">Player to Bank (Debit)</option>
            </select>
        </div>
        <div class="input-group">
            <label>Amount:</label>
            <input type="number" id="transactionAmount" placeholder="Enter amount">
        </div>
        <button class="btn" onclick="executeTransaction()">Execute</button>
    `);
}

window.executeTransaction = function() {
    const type = document.getElementById('transactionType').value;
    const amount = parseInt(document.getElementById('transactionAmount').value);
    
    if (!amount || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    
    if (type === 'player_to_player') {
        showModal('Select Sender', '');
        showPlayerScanner((sender) => {
            showModal('Select Receiver', '');
            showPlayerScanner((receiver) => {
                if (sender.balance < amount) {
                    alert('Insufficient funds!');
                    return;
                }
                
                const senderIndex = gameState.players.findIndex(p => p.id === sender.id);
                const receiverIndex = gameState.players.findIndex(p => p.id === receiver.id);
                
                gameState.players[senderIndex].balance -= amount;
                gameState.players[receiverIndex].balance += amount;
                
                logTransaction(`${sender.name} paid ₹${amount} to ${receiver.name}`);
                updatePlayerBalances();
                closeModal();
            });
        });
    } else if (type === 'bank_to_player') {
        showModal('Select Player', '');
        showPlayerScanner((player) => {
            const playerIndex = gameState.players.findIndex(p => p.id === player.id);
            gameState.players[playerIndex].balance += amount;
            
            logTransaction(`${player.name} received ₹${amount} from Bank`);
            updatePlayerBalances();
            closeModal();
        });
    } else if (type === 'player_to_bank') {
        showModal('Select Player', '');
        showPlayerScanner((player) => {
            if (player.balance < amount) {
                alert('Insufficient funds!');
                return;
            }
            
            const playerIndex = gameState.players.findIndex(p => p.id === player.id);
            gameState.players[playerIndex].balance -= amount;
            
            logTransaction(`${player.name} paid ₹${amount} to Bank`);
            updatePlayerBalances();
            closeModal();
        });
    }
};

// Helper functions
function showModal(title, content) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = content;
    document.getElementById('scanModal').style.display = 'block';
}

window.closeModal = function() {
    document.getElementById('scanModal').style.display = 'none';
};

function showPlayerScanner(callback) {
    let html = '<h3>Tap a player card:</h3><div class="card-grid">';
    
    gameState.players.forEach(player => {
        html += `
            <div class="scan-card" onclick='selectScannedPlayer(${JSON.stringify(player)})'>
                <div style="font-size: 3rem">${player.emoji}</div>
                <div>${player.name}</div>
                <div style="font-size: 0.9rem; color: #aaa">₹${player.balance.toLocaleString()}</div>
            </div>
        `;
    });
    
    html += '</div>';
    document.getElementById('modalBody').innerHTML = html;
    
    window.selectScannedPlayer = (player) => callback(player);
}

function showPropertyScanner(callback) {
    let html = '<h3>Tap a property card:</h3><div class="card-grid">';
    
    PROPERTIES.forEach(prop => {
        const state = gameState.properties[prop.id];
        const owner = state.owner ? gameState.players.find(p => p.id === state.owner) : null;
        
        html += `
            <div class="scan-card property" style="border-left-color: ${getColorCode(prop.color)}" onclick='selectScannedProperty(${JSON.stringify(state)})'>
                <div class="property-number">#${prop.number}</div>
                <div class="property-name">${prop.name}</div>
                <div class="property-rent">Level ${state.rentLevel}: ₹${prop.rents[state.rentLevel - 1]}</div>
                ${owner ? `<div style="font-size: 0.8rem; margin-top: 5px;">${owner.emoji} ${owner.name}</div>` : ''}
            </div>
        `;
    });
    
    html += '</div>';
    document.getElementById('modalBody').innerHTML = html;
    
    window.selectScannedProperty = (property) => callback(property);
}

function getColorCode(color) {
    const colors = {
        brown: '#8B4513',
        lightblue: '#87CEEB',
        pink: '#FF1493',
        orange: '#FF8C00',
        red: '#DC143C',
        yellow: '#FFD700',
        green: '#228B22',
        blue: '#0000CD'
    };
    return colors[color] || '#667eea';
}

function logTransaction(message) {
    const timestamp = new Date().toLocaleTimeString();
    gameState.transactionLog.unshift({ time: timestamp, message });
    
    // Keep only last 20 transactions
    if (gameState.transactionLog.length > 20) {
        gameState.transactionLog.pop();
    }
    
    updateTransactionLog();
}

function updateTransactionLog() {
    const container = document.getElementById('transactionLog');
    container.innerHTML = '';
    
    gameState.transactionLog.forEach(log => {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.innerHTML = `<small>${log.time}</small><br>${log.message}`;
        container.appendChild(entry);
    });
}

function handleBankruptcy(playerId) {
    const player = gameState.players.find(p => p.id === playerId);
    
    // Return all properties to unowned state
    Object.keys(gameState.properties).forEach(propId => {
        if (gameState.properties[propId].owner === playerId) {
            gameState.properties[propId].owner = null;
            gameState.properties[propId].rentLevel = 1;
        }
    });
    
    // Remove player
    gameState.players = gameState.players.filter(p => p.id !== playerId);
    
    logTransaction(`${player.name} went bankrupt! All properties returned to bank.`);
    updatePlayerBalances();
    
    // Check if only one player left
    if (gameState.players.length === 1) {
        alert(`🎉 ${gameState.players[0].name} WINS! 🎉`);
    }
}
