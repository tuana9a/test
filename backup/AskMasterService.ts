import axios from 'axios';
import { CONFIG } from '../app/AppConfig';
import { appRuntime } from '../app/AppRuntime';

class AskMasterService {
    async askWorkerAddress() {
        let data = {
            from: {
                name: CONFIG.worker.name,
                address: CONFIG.server.address
            },
            asks: CONFIG.worker.ask
        };
        let headers = {
            'Content-Type': 'application/json; charset=utf-8'
        };
        let url = `${CONFIG.master.address}/api/worker/ask/worker-address`;
        return axios
            .post(url, data, { headers })
            .then(function (response) {
                let masterResponse = response.data;
                if (masterResponse.code == 1) {
                    let data = masterResponse.data;
                    CONFIG.worker.ask.forEach(function (name) {
                        appRuntime.setWorkerAddress(name, data[name]);
                    });
                }
            })
            .catch(function (err) {
                console.error(new Date().toTimeString() + ' ask master failed');
            });
    }
    async repeatAskMaster() {
        await askMasterService.askWorkerAddress();
        setTimeout(askMasterService.repeatAskMaster, CONFIG.timing.repeat.ask_master);
    }
}

export const askMasterService = new AskMasterService();
