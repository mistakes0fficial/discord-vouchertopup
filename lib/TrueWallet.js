const axios = require('axios');
const tls = require('tls');
tls.DEFAULT_MIN_VERSION = 'TLSv1.3';

class TrueWallet {
  constructor(phoneNumber) {
    if (phoneNumber == undefined || phoneNumber.length != 10) {
      throw new Error('Please provide a phone number 10 digits');
    }

    this.phoneNumber = phoneNumber;
  }

  async redeem(code) {
    if (code.startsWith('https://gift.truemoney.com/campaign/?v=')) {
      let regex = /(^https:\/\/gift\.truemoney\.com\/campaign\/)\?v=([A-Za-z0-9]{18})/;
      code = new RegExp(regex).exec(code);
      code = code[2];
      if (code.length != 18) {
        throw new Error('Please provide a valid link');
      }
    } else {
      throw new Error('Please provide a valid link');
    }

    try {
      let response = await axios({
        method: 'post',
        url: 'https://gift.truemoney.com/campaign/vouchers/' + code + '/redeem',
        data: {
          mobile: this.phoneNumber,
          voucher_hash: code,
        },
      });
      return response.data;
    } catch (err) {
      throw err.response;
    }
  }
}

module.exports = TrueWallet;
