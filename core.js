// QBIT Supreme Monolith v27.0 - Enhanced Security Core System
const express = require('express');
const crypto = require('crypto'); // Xavfsiz shifrlash uchun
const app = express();
const PORT = process.env.PORT || 3000;

class Block {
    constructor(index, timestamp, transactions, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0; // Mining xavfsizligi uchun
    }

    // SHA-256 kriptografik xavfsizlik xeshi
    calculateHash() {
        return crypto
            .createHash('sha256')
            .update(this.index + this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce)
            .digest('hex');
    }

    // Blokni xavfsiz zanjirga biriktirish (Proof of Work)
    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
    }
}

class AdvancedBlockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2; // Tizim hujumlaridan himoya darajasi
        this.pendingTransactions = [];
    }

    createGenesisBlock() {
        return new Block(0, Date.now(), "QBIT Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // Tranzaksiyani xavfsiz tekshiruvdan o'tkazib qo'shish
    addTransaction(transaction) {
        if (!transaction.from || !transaction.to || transaction.amount <= 0) {
            throw new Error('Xavfsizlik Xatoligi: Tranzaksiya ma\'lumotlari noto\'g\'ri!');
        }
        this.pendingTransactions.push(transaction);
    }

    minePendingTransactions() {
        const block = new Block(this.chain.length, Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);
        
        console.log(`Blok muvaffaqiyatli xavfsiz mined qilindi: ${block.hash}`);
        this.chain.push(block);
        this.pendingTransactions = [];
    }

    // Tizim butunligini tekshirish (Anti-Hack Tekshiruvi)
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false; // Kod buzilgan bo'lsa
            }
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false; // Zanjir uzilgan bo'lsa
            }
        }
        return true;
    }
}

// Tizimni ishga tushirish
const qbitNetwork = new AdvancedBlockchain();

// 2000 BTC test integratsiyasi (Xavfsiz blokda)
qbitNetwork.addTransaction({
    from: "Quantum_Master_Source",
    to: "QBIT_Master_Wallet_V27",
    amount: 2000,
    asset: "BTC"
});
qbitNetwork.minePendingTransactions();

app.use(express.json());

app.get('/', (req, res) => {
    const status = qbitNetwork.isChainValid() ? "Xavfsiz va Aktiv" : "Xavf Ostida! Bloklar buzilgan!";
    res.send(`<h1>QBIT Supreme Monolith v27.0</h1><p>Tizim Holati: <b>${status}</b></p>`);
});

app.get('/api/blockchain', (req, res) => {
    res.json({
        validity: qbitNetwork.isChainValid(),
        chain: qbitNetwork.chain
    });
});

app.listen(PORT, () => {
    console.log(`QBIT Secure System running on port ${PORT}`);
});
