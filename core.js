// QBIT Supreme Monolith v27.0 - Core System
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.pendingTransactions = [];
    }

    createGenesisBlock() {
        return { index: 0, timestamp: Date.now(), data: "QBIT Genesis Block", previousHash: "0" };
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addTransaction(tx) {
        this.pendingTransactions.push(tx);
    }

    minePendingTransactions() {
        const block = {
            index: this.chain.length,
            timestamp: Date.now(),
            transactions: this.pendingTransactions,
            previousHash: this.getLatestBlock().hash || "0000"
        };
        this.chain.push(block);
        this.pendingTransactions = [];
    }
}

const qbitNetwork = new Blockchain();

qbitNetwork.addTransaction({
    from: "Quantum_Master_Source",
    to: "QBIT_Master_Wallet_V27",
    amount: 2000,
    asset: "BTC",
    type: "Test_Integration_Transaction"
});
qbitNetwork.minePendingTransactions();

app.get('/', (req, res) => {
    res.send('<h1>QBIT Supreme Monolith v27.0 - Quantum Network Active</h1>');
});

app.get('/api/blockchain', (req, res) => {
    res.json(qbitNetwork.chain);
});

app.listen(PORT, () => {
    console.log(`QBIT System running on port ${PORT}`);
});
