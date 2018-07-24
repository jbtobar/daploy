я поменял сервер с амстердама на франукфурт и она стала доступна
итак, актуальные на 2 июля ноды эфира
Тестнет ropsten
арендованные quiknode на parity
http provider: https://adequately-pleased-tomcat.quiknode.io/94191967-5a1e-4db4-9b69-8adc5e1dca68/js1NSE0uOWzdjTI1Zu9_Bg==/
status page: https://quiknode.io/node/94191967-5a1e-4db4-9b69-8adc5e1dca68/bYdYBrfrvsfuFfo3jp8qvg==
наша собственная тоже parity
http://35.204.21.51:8545

мейннет (parity)
http provider: https://especially-witty-ewe.quiknode.io/21de3921-7f0f-4ede-a349-7ae546af1962/i1kzrQhBm_8ja7abT-Iz-A==/
status page: https://quiknode.io/node/21de3921-7f0f-4ede-a349-7ae546af1962/EZp1lB1j5CPJaE-8Xove-Q==

url = 'https://adequately-pleased-tomcat.quiknode.io/94191967-5a1e-4db4-9b69-8adc5e1dca68/js1NSE0uOWzdjTI1Zu9_Bg==/'

var url = 'https://ropsten.infura.io/gvaDaupFKbFfrBVZ9cyE'
var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(url))
web3.eth.personal.unlockAccount("0xc6e74d537e2b8de41cf4a682ab7d9a1f8b91f8e1","Qwerty123")
