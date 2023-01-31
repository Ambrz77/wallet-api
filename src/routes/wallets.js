import express from 'express';

const router = express.Router();

let wallets = []

//////-------------Part 1-------------//////

router.get('/', (req, res) => {
    //console.log(wallets);

    let response = { size: Object.keys(wallets).length, wallets, code: 200, message: "All wallets received successfully!" };

    res.send(response);
});

router.post('/', (req, res) => {
    //console.log('This post request is working!');
    const walletName = req.body.name;
    //var date = moment(now).format('YYYY-MM-DD HH:MM:SS');

    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();

    const wallet = wallets.find((wallet) => wallet.name == walletName);

    if (!wallet) {
        let myWallet = { name: walletName, balance: 0.0, coin: [], last_updated: year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds };
        wallets.push(myWallet);
        let postResponse = {...myWallet, code: 200, message: "Wallet added successfully!"};
        res.send(postResponse);
    } else
        res.status(400).json({ message: `A wallet with this name already exists!` });

});

router.put('/:wname', (req, res) => {
    const { wname } = req.params;

    const { name } = req.body;

    const wallet = wallets.find((wallet) => wallet.name == wname);

    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();

    if (!wallet)
        res.status(400).json({ message: `No wallet with this name!` });
    else {
        wallet.name = name;
        wallet.last_updated = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
        let newWallet = { ...wallet, code: 200, message: "Wallet name changed successfully!" };
        res.send(newWallet);
    }
    //res.send(`User with this name ${name} has been updated!` );
});

router.delete('/:wname', (req, res) => {
    const { wname } = req.params;

    const wallet = wallets.find((wallet) => wallet.name == wname);

    if (!wallet)
        res.status(400).json({ message: `No wallet with this name!` });
    else {
        let result = { ...wallet, code: 200, message: "Wallet deleted (logged out) successfully!" };
        wallets = wallets.filter((wallet) => wallet.name != wname);
        res.send(result);
    }
});

//////-------------Part 2-------------//////

router.get('/:wname', (req, res) => {
    const { wname } = req.params;

    const wallet = wallets.find((wallet) => wallet.name == wname);

    if (!wallet)
        res.status(400).json({ message: `No wallet with this name!` });
    else {
        let result = { ...wallet, code: 200, message: "All coins received successfully!" };
        res.send(result);
    }
});

router.post('/:wname/coins', (req, res) => {
    const { wname } = req.params;

    const coinName = req.body.name;
    const coinSymbol = req.body.symbol;
    const coinAmount = req.body.amount;
    const coinRate = req.body.rate;

    const myBalance = req.body

    const wallet = wallets.find((wallet) => wallet.name == wname);

    if (!wallet)
        res.status(400).json({ message: `Wallet with this name not found!` });

    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();

    const coinNm = wallet.coin.find((coin) => coin.name == coinName);
    const coinSym = wallet.coin.find((coin) => coin.symbol == coinSymbol);

    if (wallet && !coinNm && !coinSym) {
        let coinDetails = { name: coinName, symbol: coinSymbol, amount: coinAmount, rate: coinRate };
        let coinResponse = { ...coinDetails, code: 200, message: "Coin added successfully!" }
        wallet.coin.push(coinDetails);
        wallet.last_updated = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
        const temp = wallet.balance;
        wallet.balance = temp + (coinRate * coinAmount);
        res.send(coinResponse);
    } else if (coinNm)
        res.status(400).json({ message: `Coin with this name already exists!` });
    else if (coinSym)
        res.status(400).json({ message: `Coin with this symbol already exists!` });
});

router.put('/:wname/:symbol', (req, res) => {
    const { wname } = req.params;
    const { symbol } = req.params;

    const coinName = req.body.name;
    const coinSymbol = req.body.symbol;
    const coinAmount = req.body.amount;
    const coinRate = req.body.rate;

    const wallet = wallets.find((wallet) => wallet.name == wname);

    if (!wallet)
        res.status(400).json({ message: `Wallet with this name not found!` });

    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();

    const myCoin = wallet.coin.find((coin) => coin.symbol == symbol);

    if (!myCoin)
        res.status(400).json({ message: `No coin with this symbol!` });
    else {
        let temp = wallet.balance;
        wallet.balance = temp - (myCoin.rate*myCoin.amount);
        temp = wallet.balance;

        myCoin.name = coinName;
        myCoin.symbol = coinSymbol;
        myCoin.amount = coinAmount;
        myCoin.rate = coinRate;
        wallet.last_updated = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
        
        wallet.balance = temp + (coinRate*coinAmount);

        let updatedCoin = { ...myCoin, code: 200, message: "Coin updated successfully!" };
        res.send(updatedCoin);
    }
});

router.delete('/:wname/:symbol', (req, res) => {
    const { wname } = req.params;
    const { symbol } = req.params;

    const wallet = wallets.find((wallet) => wallet.name == wname);

    if (!wallet)
        res.status(400).json({ message: `Wallet with this name not found!` });

    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();

    const myCoin = wallet.coin.find((coin) => coin.symbol == symbol);

    if (!myCoin)
        res.status(400).json({ message: `No coin with this symbol!` });
    else {
        const coinRate = myCoin.rate;
        const coinAmount = myCoin.amount;

        let updatedCoin = { ...myCoin, code: 200, message: "Coin deleted successfully!" };
        wallet.coin = wallet.coin.filter((coin) => coin.symbol != symbol);
        wallet.last_updated = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
        const temp = wallet.balance;
        wallet.balance = temp - (coinRate * coinAmount);
        res.send(updatedCoin);
    }
});

export default router;