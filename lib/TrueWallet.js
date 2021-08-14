const axios = require('axios');

class TrueWallet {
    constructor(phoneNumber) {
        if (phoneNumber == undefined || phoneNumber.length != 10) {
            throw new Error('Please provide a phone number 10 digits');
        }

        this.phoneNumber = phoneNumber;
    };

    async redeem(code) {


        if (code.startsWith('https://gift.truemoney.com/campaign/?v=')) {
            code = code.replace('https://gift.truemoney.com/campaign/?v=', '');
        }

        try {
            let response = await axios({
                method: 'post',
                url: 'https://gift.truemoney.com/campaign/vouchers/' + code + '/redeem',
                headers: {
                    accept: 'application/json',
                    'accept-encoding': 'gzip, deflate, br',
                    'accept-language': 'en-US,en;q=0.9',
                    'content-length': '59',
                    'content-type': 'application/json',
                    origin: 'https://gift.truemoney.com',
                    referer: 'https://gift.truemoney.com/campaign/?v=' + code,
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-origin',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36 Edg/87.0.664.66',
                },
                data : {
                    mobile: this.phoneNumber,
                    voucher_hash: code
                }
            });
            return response.data
        } catch (err) {
            throw err.response;
        }
        
    }
}

module.exports = TrueWallet;