/*
 * Copyright 2018-2019 TON DEV SOLUTIONS LTD.
 *
 * Licensed under the SOFTWARE EVALUATION License (the "License"); you may not use
 * this file except in compliance with the License.  You may obtain a copy of the
 * License at:
 *
 * http://www.ton.dev/licenses
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific TON DEV software governing permissions and
 * limitations under the License.
 */

// @flow
import { TONClient } from '../index';

import { WalletContractPackage } from './contracts/WalletContract';
import type { TONContractPackage } from "ton-client-js/src/modules/TONContractsModule";

import init from './init';

beforeAll(init);
afterAll(() => {
    TONClient.shared.close();
    console.log('>>>', 'done');
});

const richAddress = '0000000000000000000000000000000000000000000000000000000000000000';

const walletKeys = {
    public: 'fb98b2541ba805648f25eb469dd4766fcdde03a2cfe6fb41d8c1571c29407ca3',
    secret: '7bfe77bbd3ad57ada9ed323da83504723e3af7cd3ba68b02d3c8335f75e0a24e',
};

const walletAddress = '6a1dff029f9a5f3d19bdb6de52d372d56c3b45949c16e6b626816fb139f5f052';

test('load', async () => {
    const rich = await TONClient.shared.contracts.load({
        address: richAddress,
        includeImage: false,
    });
    expect(rich.id).toEqual(richAddress);

    const contract = await TONClient.shared.contracts.load({
        address: '0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF',
        includeImage: false,
    });
    expect(contract.id).toBeNull();
    expect(contract.balanceGrams).toBeNull();

    const w = await TONClient.shared.contracts.load({
        address: walletAddress,
        includeImage: false,
    });
    expect(w.id).toEqual(walletAddress);
    expect(Number.parseInt(w.balanceGrams)).toBeGreaterThan(0);
});

test('deploy', async () => {
    const { contracts } = TONClient.shared;
    const deployed = await contracts.deploy({
        package: WalletContractPackage,
        constructorParams: {},
        keyPair: walletKeys,
    });
    expect(deployed.address).toEqual(walletAddress);
});

test('deploy_new', async () => {
    const ton = TONClient.shared;
    const keys = await ton.crypto.ed25519Keypair();
    const deployed = await ton.contracts.deploy({
        package: WalletContractPackage,
        constructorParams: {},
        keyPair: keys,
    });
});

test('test', async () => {
    const ton = TONClient.shared;
    await ton.contracts.send_grams({
        fromAccount: richAddress,
        toAccount: walletAddress,
        amount: 100,
    });
});

test('run', async () => {
    const { contracts } = TONClient.shared;
    const result = await contracts.run({
        address: walletAddress,
        functionName: 'getVersion',
        abi: WalletContractPackage.abi,
        input: {},
        keyPair: walletKeys,
    });
    console.log('[Contracts] Get version response:', result);
});

test('decode_unkown_input', async () => {
    const { contracts } = TONClient.shared;
    const body = 'te6ccoEBAgEAcwARcwEbACfvUIcBgJTr3AOCAGABAMDr2GubWXYR6wuk6WFn4btjW3w+DbidhSrKArHbqCaunLGN9LwAbQFT9kyOpN6DR6DJbuKkvC94KwJgan7xeTUHS89H/vKbWZbzZEHu4euhqvQE2I9aW+PNdn2BKZJXlA4=';

    const result = await contracts.decode_unknown_run_input({
        abi: WalletContractPackage.abi,
        bodyBase64: body
    });

    expect(result.function).toEqual('createLimit');
    expect(result.output).toEqual({ type : "0x1", value: "0x3b9aca00", meta: "x01" });
});

const foo_package: TONContractPackage = {
    abi: {
        "ABI version": 0,
        "functions": [{
            "name": "requestPayment_external",
            "inputs": [{"name": "cardId", "type": "uint256"}, {"name": "paymentId", "type": "uint256"}],
            "outputs": []
        }, {
            "name": "constructor",
            "inputs": [],
            "outputs": []
        }, {
            "name": "grantAccess_external",
            "inputs": [{"name": "srvAddress", "type": "uint256"}],
            "outputs": []
        }, {
            "name": "checkAccess_external",
            "inputs": [{"name": "confidant", "type": "uint256"}],
            "outputs": []
        }, {
            "name": "revokeAccess_external",
            "inputs": [{"name": "confidant", "type": "uint256"}],
            "outputs": []
        }, {
            "name": "storeCard_external",
            "inputs": [{"name": "card", "type": "uint64[]"}, {"name": "desc", "type": "uint64[]"}],
            "outputs": []
        }, {
            "name": "storeTokenizedCard_external",
            "inputs": [{"name": "token", "type": "uint64[]"}, {"name": "desc", "type": "uint64[]"}],
            "outputs": []
        }, {
            "name": "getCardInfo_external",
            "inputs": [{"name": "cardId", "type": "uint256"}],
            "outputs": []
        }, {
            "name": "getCard_external",
            "inputs": [{"name": "cardId", "type": "uint256"}, {"name": "seqNo", "type": "uint32"}],
            "outputs": []
        }, {
            "name": "deleteCard_external",
            "inputs": [{"name": "cardId", "type": "uint256"}],
            "outputs": []
        }, {
            "name": "getPayment_external",
            "inputs": [{"name": "paymentId", "type": "uint256"}],
            "outputs": []
        }, {
            "name": "updatePaymentState_external",
            "inputs": [{"name": "paymentId", "type": "uint256"}, {"name": "state", "type": "uint8"}, {"name": "data", "type": "uint256"}],
            "outputs": []
        }]
    },
    imageBase64: "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"
};

test('deploy_foo_contract', async () => {
    const ton = TONClient.shared;
    const keys = await ton.crypto.ed25519Keypair();
    const deployed = await ton.contracts.deploy({
        package: foo_package,
        constructorParams: {},
        keyPair: keys,
    });
});
