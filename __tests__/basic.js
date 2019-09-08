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

import { TONClient } from '../index.js';

import init from './init';

beforeAll(init);

test('basic', async () => {
	const ton = TONClient.shared;
	expect(await ton.config.getVersion()).toEqual('0.10.1');

	try {
        await ton.crypto.hdkeyXPrvDerivePath("???", "");
    } catch (error) {
	    expect(error.source).toEqual('sdk');
	    expect(error.code).toEqual(2018);
    }
});

